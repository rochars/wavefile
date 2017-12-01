/*
 * WaveFileReaderWriter
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = require("byte-data");
let WaveFileHeader = require("../src/wavefile-header");
const uInt8 = byteData.uInt8;
const uInt16 = byteData.uInt16;
const uInt32 = byteData.uInt32;
const char = byteData.char;

/**
 * Read and write wave files.
 */
class WaveFileReaderWriter extends WaveFileHeader {

    constructor() {
        super();
        /**
         * Error messages.
         * @enum {string}
         */
        this.WaveErrors = {
            "format": "Not a supported format.",
            "wave": "Could not find the 'WAVE' format identifier",
            "fmt ": "Could not find the 'fmt ' chunk",
            "data": "Could not find the 'data' chunk",
            "fact": "Could not find the 'fact' chunk",
            "bitDepth": "Invalid bit depth.",
            "numChannels": "Invalid number of channels.",
            "sampleRate": "Invalid sample rate."
        };
        /**
         * Header formats.
         * @enum {number}
         */
        this.headerFormats_ = {
            "4": 17,
            "8": 1,
            "16": 1,
            "24": 1,
            "32": 1,
            "32f": 3,
            "64": 3
        };
        /** @type {!Array<number>} */
        this.samples_ = [];
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "RIFF" chunk is found.
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData.unpackSequence(bytes.slice(0, 4), char);
        if (this.chunkId != "RIFF" && this.chunkId != "RIFX") {
            throw Error(this.WaveErrors.format);
        }
        let bigEndian = this.LEorBE();
        this.chunkSize = byteData.fromBytes(
            bytes.slice(4, 8),
            32,
            {"be": bigEndian, "single": true});
        this.format = byteData.unpackSequence(bytes.slice(8, 12), char);
        if (this.format != "WAVE") {
            throw Error(this.WaveErrors.wave);
        }
    }

    LEorBE() {
        let bigEndian = this.chunkId == "RIFX";
        uInt8.be = bigEndian;
        uInt16.be = bigEndian;
        uInt32.be = bigEndian;
        return bigEndian;
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "fmt " chunk is found.
     */
    readFmtChunk_(chunks) {
        let chunk = this.findChunk(chunks, "fmt ");
        if (chunk) {
            this.fmtChunkId = "fmt ";
            this.fmtChunkSize = chunk.chunkSize;
            this.audioFormat = byteData.unpack(
                chunk.chunkData.slice(0, 2), uInt16);
            this.numChannels = byteData.unpack(
                chunk.chunkData.slice(2, 4), uInt16);
            this.sampleRate = byteData.unpack(
                chunk.chunkData.slice(4, 8), uInt32);
            this.byteRate = byteData.unpack(
                chunk.chunkData.slice(8, 12), uInt32);
            this.blockAlign = byteData.unpack(
                chunk.chunkData.slice(12, 14), uInt16);
            this.bitsPerSample = byteData.unpack(
                    chunk.chunkData.slice(14, 16), uInt16);
            this.readFmtExtension(chunk);
        } else {
            throw Error(this.WaveErrors["fmt "]);
        }
    }

    /**
     * Read the "fmt " chunk extension.
     * @param {Object} chunk The "fmt " chunk.
     */
    readFmtExtension(chunk) {
        if (this.fmtChunkSize > 16) {
            this.cbSize = byteData.unpack(
                chunk.chunkData.slice(16, 18), uInt16);
            if (this.fmtChunkSize > 18) {
                this.validBitsPerSample = byteData.unpack(
                    chunk.chunkData.slice(18, 20), uInt16);
            }
        }
    }

    /**
     * Read the "fact" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "fact" chunk is found.
     */
    readFactChunk_(chunks) {
        let chunk = this.findChunk(chunks, "fact");
        if (chunk) {
            this.factChunkId = "fact";
            this.factChunkSize = chunk.chunkSize;
            this.dwSampleLength = byteData.unpack(
                chunk.chunkData.slice(0, 4), uInt32);
        } else if (this.enforceFact) {
            throw Error(this.WaveErrors["fact"]);
        }
    }

    /**
     * Read the "bext" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "bext" chunk is found.
     */
    readBextChunk_(chunks) {
        let chunk = this.findChunk(chunks, "bext");
        if (chunk) {
            this.bextChunkId = "bext";
            this.bextChunkSize = chunk.chunkSize;
            this.bextChunkData = chunk.chunkData;
        }
    }

    /**
     * Read the "cue " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "cue" chunk is found.
     */
    readCueChunk_(chunks) {
        let chunk = this.findChunk(chunks, "cue ");
        if (chunk) {
            this.cueChunkId = "cue ";
            this.cueChunkSize = chunk.chunkSize;
            this.cueChunkData = chunk.chunkData;
        }
    }

    /**
     * Read the "data" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "data" chunk is found.
     */
    readDataChunk_(chunks, options) {
        let chunk = this.findChunk(chunks, "data");
        if (chunk) {
            this.dataChunkId = "data";
            this.dataChunkSize = chunk.chunkSize;
            this.samplesFromBytes_(chunk.chunkData, options);
        } else {
            throw Error(this.WaveErrors["data"]);
        }
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Uint8Array} bytes Array of bytes representing the wave file.
     */
    samplesFromBytes_(bytes, options) {
        options.signed = this.bitsPerSample == 8 ? false : true
        if (this.bitsPerSample == 32 && this.audioFormat == 3) {
            options.float = true;
        }
        options.single = false;
        if (this.bitsPerSample == 4) {
            this.samples_ = byteData.pack(bytes, uInt8);
        } else {
            this.samples_ = byteData.fromBytes(
                bytes, this.bitsPerSample, options);
        }
    }

    /**
     * Find a chunk by its FourCC in a array of RIFF chunks.
     * @return {Object|null}
     */
    findChunk(chunks, fourCC) {
        for (let i = 0; i<chunks.length; i++) {
            if (chunks[i].chunkId == fourCC) {
                return chunks[i];
            }
        }
        return null;
    }

    /**
     * Split each sample into bytes.
     */
    samplesToBytes_(options) {
        if (this.bitsPerSample == 32 && this.audioFormat == 3) {
            options.float = true;
        }
        let bitDepth = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        let bytes = byteData.toBytes(this.samples_, bitDepth, options);
        if (bytes.length % 2) {
            bytes.push(0);
        }
        return bytes;
    }

    /**
     * Get the bytes of the "bext" chunk.
     * @return {!Array<number>} The "bext" chunk bytes.
     */
    getBextBytes_() {
        if (this.bextChunkId) {
            return [].concat(
                    byteData.packSequence(this.bextChunkId, char),
                    byteData.pack(this.bextChunkSize, uInt32),
                    this.bextChunkData
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "cue " chunk.
     * @return {!Array<number>} The "cue " chunk bytes.
     */
    getCueBytes_() {
        if (this.cueChunkId) {
            return [].concat(
                    byteData.packSequence(this.cueChunkId, char),
                    byteData.pack(this.cueChunkSize, uInt32),
                    this.cueChunkData
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "fact" chunk.
     * @return {!Array<number>} The "fact" chunk bytes.
     */
    getFactBytes_() {
        if (this.factChunkId) {
            return [].concat(
                    byteData.packSequence(this.factChunkId, char),
                    byteData.pack(this.factChunkSize, uInt32),
                    byteData.pack(this.dwSampleLength, uInt32)
                );
        }
        return [];
    }

    /**
     * Get the bytes of the cbSize field.
     * @return {!Array<number>} The cbSize bytes.
     */
    getCbSizeBytes_() {
        if (this.fmtChunkSize > 16) {
            return byteData.pack(this.cbSize, uInt16);
        }
        return [];
    }

    /**
     * Get the bytes of the validBitsPerSample field.
     * @param options The options to write the bytes.
     * @return {!Array<number>} The validBitsPerSample bytes.
     */
    getValidBitsPerSampleBytes_() {
        if (this.fmtChunkSize > 18) {
            return byteData.pack(this.validBitsPerSample, uInt16);
        }
        return [];
    }

    /**
     * Turn a WaveFile object into a file.
     * @return {Uint8Array} The wav file bytes.
     */
    createWaveFile_() {
        let options = {"be": this.chunkId == "RIFX"};
        return byteData.packSequence(this.chunkId, char).concat(
                byteData.pack(this.chunkSize, uInt32),
                byteData.packSequence(this.format, char),
                this.getBextBytes_(),
                byteData.packSequence(this.fmtChunkId, char),
                byteData.pack(this.fmtChunkSize, uInt32),
                byteData.pack(this.audioFormat, uInt16),
                byteData.pack(this.numChannels, uInt16),
                byteData.pack(this.sampleRate, uInt32),
                byteData.pack(this.byteRate, uInt32),
                byteData.pack(this.blockAlign, uInt16),
                byteData.pack(this.bitsPerSample, uInt16),
                this.getCbSizeBytes_(),
                this.getValidBitsPerSampleBytes_(),
                this.getFactBytes_(),
                byteData.packSequence(this.dataChunkId, char),
                byteData.pack(this.dataChunkSize, uInt32),
                this.samplesToBytes_(options),
                this.getCueBytes_()
            );
    }
}

module.exports = WaveFileReaderWriter;
