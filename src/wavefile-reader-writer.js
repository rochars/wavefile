/*
 * WaveFileReaderWriter
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = require("byte-data");
const waveFileHeader = require("../src/wavefile-header");
const riff = require("riff-chunks");

/**
 * Read and write wave files.
 */
class WaveFileReaderWriter extends waveFileHeader.WaveFileHeader {

    constructor() {
        super();
        /** @type {boolean} */
        // TODO fact must be enforced in some cases
        this.enforceFact_ = false;
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
     * Read a wave file from a byte buffer.
     * @param {Uint8Array} bytes The buffer.
     */
    fromBuffer(bytes) {
        this.readRIFFChunk_(bytes);
        let bigEndian = this.chunkId == "RIFX";
        let chunk = riff.getChunks(bytes, bigEndian);
        let options = {"be": bigEndian, "single": true};
        this.readFmtChunk_(chunk.subChunks, options);
        this.readFactChunk_(chunk.subChunks, options);
        this.readBextChunk_(chunk.subChunks, options);
        this.readCueChunk_(chunk.subChunks, options);
        this.readDataChunk_(chunk.subChunks, options);
        if (this.audioFormat == 3 && this.bitsPerSample == 32) {
            this.bitDepth_ = "32f";
        }else {
            this.bitDepth_ = this.bitsPerSample.toString();
        }
    }

    /**
     * Turn the WaveFile object into a byte buffer.
     * @return {Uint8Array}
     */
    toBuffer() {
        this.checkWriteInput_();
        return new Uint8Array(this.createWaveFile_());
    }
    
    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "RIFF" chunk is found.
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData.fromBytes(bytes.slice(0, 4),
            8, {"char": true});
        if (this.chunkId != "RIFF" && this.chunkId != "RIFX") {
            throw Error(this.WaveErrors.format);
        }
        this.chunkSize = byteData.fromBytes(
            bytes.slice(4, 8),
            32,
            {"be": this.chunkId == "RIFX", "single": true});
        this.format = byteData.fromBytes(
            bytes.slice(8, 12), 8, byteData.str);
        if (this.format != "WAVE") {
            throw Error(this.WaveErrors.wave);
        }
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @param {Object} options The options to read the bytes.
     * @throws {Error} If no "fmt " chunk is found.
     */
    readFmtChunk_(chunks, options) {
        let chunk = this.findChunk(chunks, "fmt ");
        if (chunk) {
            this.fmtChunkId = "fmt ";
            this.fmtChunkSize = chunk.subChunkSize;
            this.audioFormat = byteData.fromBytes(
                chunk.subChunkData.slice(0, 2), 16, options);
            this.numChannels = byteData.fromBytes(
                chunk.subChunkData.slice(2, 4), 16, options);
            this.sampleRate = byteData.fromBytes(
                chunk.subChunkData.slice(4, 8), 32, options);
            this.byteRate = byteData.fromBytes(
                chunk.subChunkData.slice(8, 12), 32, options);
            this.blockAlign = byteData.fromBytes(
                chunk.subChunkData.slice(12, 14), 16, options);
            this.bitsPerSample = byteData.fromBytes(
                    chunk.subChunkData.slice(14, 16), 16, options);
            if (this.fmtChunkSize > 16) {
                this.cbSize = byteData.fromBytes(
                    chunk.subChunkData.slice(16, 18), 16);
                if (this.fmtChunkSize > 18) {
                    this.validBitsPerSample = byteData.fromBytes(
                        chunk.subChunkData.slice(18, 20), 16);
                }
            }    
        } else {
            throw Error(this.WaveErrors["fmt "]);
        }
    }
    
    /**
     * Read the "fact" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @param {Object} options The options to read the bytes.
     * @throws {Error} If no "fact" chunk is found.
     */
    readFactChunk_(chunks, options) {
        let chunk = this.findChunk(chunks, "fact");
        if (chunk) {
            this.factChunkId = "fact";
            this.factChunkSize = chunk.subChunkSize;
            this.dwSampleLength = byteData.fromBytes(
                chunk.subChunkData.slice(0, 4), 32, options);
        } else if (this.enforceFact) {
            throw Error(this.WaveErrors["fact"]);
        }
    }

    /**
     * Read the "bext" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @param {Object} options The options to read the bytes.
     * @throws {Error} If no "bext" chunk is found.
     */
    readBextChunk_(chunks, options) {
        let chunk = this.findChunk(chunks, "bext");
        if (chunk) {
            this.bextChunkId = "bext";
            this.bextChunkSize = chunk.subChunkSize;
            this.bextChunkData = byteData.fromBytes(chunk.subChunkData, 8);
        }
    }

    /**
     * Read the "cue " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @param {Object} options The options to read the bytes.
     * @throws {Error} If no "cue" chunk is found.
     */
    readCueChunk_(chunks, options) {
        let chunk = this.findChunk(chunks, "cue ");
        if (chunk) {
            this.cueChunkId = "cue ";
            this.cueChunkSize = chunk.subChunkSize;
            this.cueChunkData = byteData.fromBytes(chunk.subChunkData, 8);
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
            this.dataChunkSize = chunk.subChunkSize;
            this.samplesFromBytes_(chunk.subChunkData, options);
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
            this.samples_ = byteData.fromBytes(bytes, 8, options);
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
            if (chunks[i].subChunkId == fourCC) {
                return chunks[i];
            }
        }
        return null;
    }

    /**
     * Validate the input for wav writing.
     * @throws {Error} If any argument does not meet the criteria.
     */
    checkWriteInput_() {
        this.validateBitDepth_();
        this.validateNumChannels_();
        this.validateSampleRate_();
    }

    /**
     * Validate the bit depth.
     * @throws {Error} If any argument does not meet the criteria.
     */
    validateBitDepth_() {
        if (!this.headerFormats_[this.bitDepth_]) {
            throw new Error(this.WaveErrors.bitDepth);
        }
        return true;
    }

    /**
     * Validate the sample rate value.
     * @throws {Error} If any argument does not meet the criteria.
     */
    validateNumChannels_() {
        let blockAlign = this.numChannels * this.bitsPerSample / 8;
        if (this.numChannels < 1 || blockAlign > 65535) {
            throw new Error(this.WaveErrors.numChannels);
        }
        return true;
    }

    /**
     * Validate the sample rate value.
     * @throws {Error} If any argument does not meet the criteria.
     */
    validateSampleRate_() {
        let byteRate = this.numChannels *
            (this.bitsPerSample / 8) * this.sampleRate;
        if (this.sampleRate < 1 || byteRate > 4294967295) {
            throw new Error(this.WaveErrors.sampleRate);
        }
        return true;
    }

    /**
     * Split each sample into bytes.
     */
    samplesToBytes_(options) {
        let bytes = [];
        if (this.bitsPerSample == 32 && this.audioFormat == 3) {
            options.float = true;
        }
        let bitDepth = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        bytes = byteData.toBytes(this.samples_, bitDepth, options);
        if (bytes.length % 2) {
            bytes.push(0);
        }
        return bytes;
    }

    getBextBytes(options) {
        let bext = [];
        if (this.bextChunkId) {
            bext = bext.concat(
                    byteData.toBytes(this.bextChunkId, 8, {"char": true}),
                    byteData.toBytes(this.bextChunkSize, 32, options),
                    byteData.toBytes(this.bextChunkData, 8)
                );
        }
        return bext;
    }

    getCueBytes(options) {
        let cue = [];
        if (this.cueChunkId) {
            cue = cue.concat(
                    byteData.toBytes(this.cueChunkId, 8, {"char": true}),
                    byteData.toBytes(this.cueChunkSize, 32, options),
                    byteData.toBytes(this.cueChunkData, 8)
                );
        }
        return cue;
    }

    getFactBytes(options) {
        let fact = []
        if (this.factChunkId) {
            fact = fact.concat(
                    byteData.toBytes(this.factChunkId, 8, {"char": true}),
                    byteData.toBytes(this.factChunkSize, 32, options),
                    byteData.toBytes(this.dwSampleLength, 32, options)
                );
        }
        return fact;
    }

    /**
     * Turn a WaveFile object into a file.
     * @return {Uint8Array} The wav file bytes.
     */
    createWaveFile_() {
        let options = {"be": this.chunkId == "RIFX"};
        let cbSize = [];
        let validBitsPerSample = []
        if (this.fmtChunkSize > 16) {
            cbSize = byteData.toBytes(this.cbSize, 16, options);
            if (this.fmtChunkSize > 18) {
                validBitsPerSample = byteData.toBytes(
                    this.validBitsPerSample, 16, options);
            }
        }
        return byteData.toBytes(this.chunkId, 8, {"char": true}).concat(
                byteData.toBytes(this.chunkSize, 32, options),
                byteData.toBytes(this.format, 8, {"char": true}), 
                this.getBextBytes(options),
                byteData.toBytes(this.fmtChunkId, 8, {"char": true}),
                byteData.toBytes(this.fmtChunkSize, 32, options),
                byteData.toBytes(this.audioFormat, 16, options),
                byteData.toBytes(this.numChannels, 16, options),
                byteData.toBytes(this.sampleRate, 32, options),
                byteData.toBytes(this.byteRate, 32, options),
                byteData.toBytes(this.blockAlign, 16, options),
                byteData.toBytes(this.bitsPerSample, 16, options),
                cbSize,
                validBitsPerSample,
                this.getFactBytes(options),
                byteData.toBytes(this.dataChunkId, 8, {"char": true}),
                byteData.toBytes(this.dataChunkSize, 32, options),
                this.samplesToBytes_(options),
                this.getCueBytes(options)
            );
    }
}

module.exports.WaveFileReaderWriter = WaveFileReaderWriter;
