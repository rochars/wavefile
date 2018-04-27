/*
 * WaveFileReaderWriter
 * Class to read and write wav files to and from buffers.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/** @private */
const WAVE_ERRORS = require("../src/wave-errors");
/** @private */
const WaveFileHeader = require("../src/wavefile-header");
/** @private */
const byteData_ = require("byte-data");
/** @private */
let uInt8_ = byteData_.uInt8;
/** @private */
let uInt16_ = byteData_.uInt16;
/** @private */
let uInt32_ = byteData_.uInt32;
/** @private */
const chr_ = byteData_.chr;

/**
 * Class to read and write wav files to and from buffers.
 * @extends WaveFileHeader
 */
class WaveFileReaderWriter extends WaveFileHeader {

    constructor() {
        super();
        /**
         * @type {Array<number>}
         */
        this.samples = [];
        /**
         * Header formats.
         * Formats not listed here will be 65534.
         * @enum {number}
         * @private
         */
        this.headerFormats_ = {
            "4": 17,
            "8": 1,
            "8a": 6,
            "8m": 7,
            "16": 1,
            "24": 1,
            "32": 1,
            "32f": 3,
            "64": 3
        };
        /**
         * @type {number} 
         * @private
         */
        this.head_ = 0;
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes A wav buffer.
     * @throws {Error} If no "RIFF" chunk is found.
     * @private
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData_.unpackArray(bytes.slice(0, 4), chr_);
        if (this.chunkId != "RIFF" && this.chunkId != "RIFX") {
            throw Error(WAVE_ERRORS.format);
        }
        this.LEorBE_();
        this.chunkSize = byteData_.unpack(bytes.slice(4, 8), uInt32_);
        this.format = byteData_.unpackArray(bytes.slice(8, 12), chr_);
        if (this.format != "WAVE") {
            throw Error(WAVE_ERRORS.wave);
        }
    }

    /**
     * Set up to work wih big-endian or little-endian files.
     * The types used are changed from LE or BE. If the
     * the file is big-endian (RIFX), true is returned.
     * @private
     */
    LEorBE_() {
        let bigEndian = this.chunkId == "RIFX";
        uInt8_.be = bigEndian;
        uInt16_.be = bigEndian;
        uInt32_.be = bigEndian;
        return bigEndian;
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Object} chunks The wav file chunks.
     * @throws {Error} If no "fmt " chunk is found.
     * @private
     */
    readFmtChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "fmt ");
        if (chunk) {
            this.fmtChunkId = "fmt ";
            this.fmtChunkSize = chunk.chunkSize;
            this.audioFormat = byteData_.unpack(
                chunk.chunkData.slice(0, 2), uInt16_);
            this.numChannels = byteData_.unpack(
                chunk.chunkData.slice(2, 4), uInt16_);
            this.sampleRate = byteData_.unpack(
                chunk.chunkData.slice(4, 8), uInt32_);
            this.byteRate = byteData_.unpack(
                chunk.chunkData.slice(8, 12), uInt32_);
            this.blockAlign = byteData_.unpack(
                chunk.chunkData.slice(12, 14), uInt16_);
            this.bitsPerSample = byteData_.unpack(
                    chunk.chunkData.slice(14, 16), uInt16_);
            this.readFmtExtension_(chunk);
        } else {
            throw Error(WAVE_ERRORS["fmt "]);
        }
    }

    /**
     * Read the "fmt " chunk extension.
     * @param {Object} chunk The "fmt " chunk.
     * @private
     */
    readFmtExtension_(chunk) {
        if (this.fmtChunkSize > 16) {
            this.cbSize = byteData_.unpack(
                chunk.chunkData.slice(16, 18), uInt16_);
            if (this.fmtChunkSize > 18) {
                this.validBitsPerSample = byteData_.unpack(
                    chunk.chunkData.slice(18, 20), uInt16_);
                if (this.fmtChunkSize > 20) {
                    this.dwChannelMask = byteData_.unpack(
                        chunk.chunkData.slice(20, 24), uInt32_);
                    // 128-bit GUID read as 4 32-bit unsigned integer
                    this.subformat1 = byteData_.unpack(
                        chunk.chunkData.slice(24, 28), uInt32_);
                    this.subformat2 = byteData_.unpack(
                        chunk.chunkData.slice(28, 32), uInt32_);
                    this.subformat3 = byteData_.unpack(
                        chunk.chunkData.slice(32, 36), uInt32_);
                    this.subformat4 = byteData_.unpack(
                        chunk.chunkData.slice(36, 40), uInt32_);
                }
            }
        }
    }

    /**
     * Read the "fact" chunk of a wav file.
     * @param {Object} chunks The wav file chunks.
     * @throws {Error} If no "fact" chunk is found.
     * @private
     */
    readFactChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "fact");
        if (chunk) {
            this.factChunkId = "fact";
            this.factChunkSize = chunk.chunkSize;
            this.dwSampleLength = byteData_.unpack(
                chunk.chunkData.slice(0, 4), uInt32_);
        } else if (this.enforceFact) {
            throw Error(WAVE_ERRORS["fact"]);
        }
    }

    /**
     * Read the "bext" chunk of a wav file.
     * @param {Object} chunks The wav file chunks.
     * @throws {Error} If no "bext" chunk is found.
     * @private
     */
    readBextChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "bext");
        if (chunk) {
            this.bextChunkId = "bext";
            this.bextChunkSize = chunk.chunkSize;
            this.bextChunkData = chunk.chunkData;
            this.readBextChunkFields_();
        }
    }

    /**
     * Read the fields of the "bext" chunk.
     * @private
     */
    readBextChunkFields_() {
        this.head_ = 0;
        this.bextChunkFields =  {
            "description": this.readVariableSizeString_(
                this.bextChunkData, 256),
            "originator": this.readVariableSizeString_(
                this.bextChunkData, 32),
            "originatorReference": this.readVariableSizeString_(
                this.bextChunkData, 32),
            "originationDate": this.readVariableSizeString_(
                this.bextChunkData, 10),
            "originationTime": this.readVariableSizeString_(
                this.bextChunkData, 8),
            // timeReference is a 64-bit value
            "timeReference": this.readBytes_(
                this.bextChunkData, 8), 
            "version": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "UMID": this.readVariableSizeString_(
                this.bextChunkData, 64), 
            "loudnessValue": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "loudnessRange": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "maxTruePeakLevel": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "maxMomentaryLoudness": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "maxShortTermLoudness": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "reserved": this.readVariableSizeString_(
                this.bextChunkData, 180),
            "codingHistory": this.readVariableSizeString_(
                this.bextChunkData, this.bextChunkData.length - 602),
        }
    }

    /**
     * Return a slice of the byte array while moving the reading head.
     * @param {Array<number>|Uint8Array} bytes The bytes.
     * @param {number} size the number of bytes to read.
     * @private
     */
    readBytes_(bytes, size) {
        let v = this.head_;
        this.head_ += size;
        return bytes.slice(v, this.head_);
    }

    /**
     * Read bytes as a string from a RIFF chunk.
     * @param {Array<number>|Uint8Array} bytes The bytes.
     * @param {number} maxSize the max size of the string.
     * @private
     */
    readVariableSizeString_(bytes, maxSize) {
        let str = "";
        for (let i=0; i<maxSize; i++) {
            str += byteData_.unpack([bytes[this.head_]], chr_);
            this.head_++;
        }
        return str;
    }

    /**
     * Read a number from a chunk.
     * @param {Array<number>|Uint8Array} bytes The chunk bytes.
     * @param {Object} bdType The byte-data corresponding type.
     * @private
     */
    readFromChunk_(bytes, bdType) {
        let size = bdType.bits / 8;
        let value = byteData_.unpack(
            bytes.slice(this.head_, this.head_ + size), bdType);
        this.head_ += size;
        return value;
    }

    /**
     * Write a variable size string as bytes.
     * If the string is smaller than the max size it 
     * is filled with 0s.
     * @param {string} str The string to be written as bytes.
     * @param {number} maxSize the max size of the string.
     * @private
     */
    writeVariableSizeString_(str, maxSize) {
        let bytes = byteData_.packArray(str, chr_);
        for (let i=bytes.length; i<maxSize; i++) {
            bytes.push(0);
        }
        return bytes;
    }

    /**
     * Read the "cue " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "cue" chunk is found.
     * @private
     */
    readCueChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "cue ");
        if (chunk) {
            this.cueChunkId = "cue ";
            this.cueChunkSize = chunk.chunkSize;
            this.cueChunkData = chunk.chunkData;
        }
    }

    /**
     * Read the "data" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @param {Object} options Type options.
     * @throws {Error} If no "data" chunk is found.
     * @private
     */
    readDataChunk_(chunks, options) {
        let chunk = this.findChunk_(chunks, "data");
        if (chunk) {
            this.dataChunkId = "data";
            this.dataChunkSize = chunk.chunkSize;
            this.samplesFromBytes_(chunk.chunkData, options);
        } else {
            throw Error(WAVE_ERRORS["data"]);
        }
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Array<number>|Uint8Array} bytes A wav file buffer.
     * @param {Object} options Type options.
     * @private
     */
    samplesFromBytes_(bytes, options) {
        options.bits = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        options.signed = options.bits == 8 ? false : true;
        options.float = (this.audioFormat == 3 || 
            this.bitsPerSample == 64) ? true : false;
        options.single = false;
        this.samples = byteData_.unpackArray(
            bytes, new byteData_.Type(options));
    }

    /**
     * Find a chunk by its FourCC in a array of RIFF chunks.
     * @param {Object} chunks The wav file chunks.
     * @param {string} fourCC The chunk fourCC.
     * @return {Object|null}
     * @private
     */
    findChunk_(chunks, fourCC) {
        for (let i = 0; i<chunks.length; i++) {
            if (chunks[i].chunkId == fourCC) {
                return chunks[i];
            }
        }
        return null;
    }

    /**
     * Turn samples to bytes.
     * @param {Object} options Type options.
     * @private
     */
    samplesToBytes_(options) {
        options.bits = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        options.signed = options.bits == 8 ? false : true;
        options.float = (this.audioFormat == 3  ||
                this.bitsPerSample == 64) ? true : false;
        let bytes = byteData_.packArray(
            this.samples, new byteData_.Type(options));
        if (bytes.length % 2) {
            bytes.push(0);
        }
        return bytes;
    }

    /**
     * Get the bytes of the "bext" chunk.
     * @return {Array<number>} The "bext" chunk bytes.
     * @private
     */
    getBextBytes_() {
        if (this.bextChunkId) {
            let bextBytes = [].concat(this.writeVariableSizeString_(
                this.bextChunkFields["description"], 256));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originator"], 32));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originatorReference"], 32));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originationDate"], 10));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originationTime"], 8));
            // 64-bit value rw as bytes
            bextBytes = bextBytes.concat(
                this.bextChunkFields["timeReference"]);
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["version"], uInt16_));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["UMID"], 64));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["loudnessValue"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["loudnessRange"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["maxTruePeakLevel"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["maxMomentaryLoudness"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["maxShortTermLoudness"], uInt16_));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["reserved"], 180));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["codingHistory"],
                this.bextChunkData.length - 602));
            return [].concat(
                    byteData_.packArray(this.bextChunkId, chr_),
                    byteData_.pack(bextBytes.length, uInt32_),
                    bextBytes
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "cue " chunk.
     * @return {Array<number>} The "cue " chunk bytes.
     * @private
     */
    getCueBytes_() {
        if (this.cueChunkId) {
            return [].concat(
                    byteData_.packArray(this.cueChunkId, chr_),
                    byteData_.pack(this.cueChunkSize, uInt32_),
                    this.cueChunkData
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "fact" chunk.
     * @return {Array<number>} The "fact" chunk bytes.
     * @private
     */
    getFactBytes_() {
        if (this.factChunkId) {
            return [].concat(
                    byteData_.packArray(this.factChunkId, chr_),
                    byteData_.pack(this.factChunkSize, uInt32_),
                    byteData_.pack(this.dwSampleLength, uInt32_)
                );
        }
        return [];
    }

    /**
     * Get the bytes of the cbSize field.
     * @return {Array<number>} The cbSize bytes.
     * @private
     */
    getCbSizeBytes_() {
        if (this.fmtChunkSize > 16) {
            return byteData_.pack(this.cbSize, uInt16_);
        }
        return [];
    }

    /**
     * Get the bytes of the validBitsPerSample field.
     * @return {Array<number>} The validBitsPerSample bytes.
     * @private
     */
    getValidBitsPerSampleBytes_() {
        if (this.fmtChunkSize > 18) {
            return byteData_.pack(this.validBitsPerSample, uInt16_);
        }
        return [];
    }

    /**
     * Get the bytes of the validBitsPerSample field.
     * @return {Array<number>} The validBitsPerSample bytes.
     * @private
     */
    getFmtExtensionBytes_() {
        if (this.fmtChunkSize > 20) {
            return byteData_.pack(this.dwChannelMask, uInt32_).concat(
                    byteData_.pack(this.subformat1, uInt32_),
                    byteData_.pack(this.subformat2, uInt32_),
                    byteData_.pack(this.subformat3, uInt32_),
                    byteData_.pack(this.subformat4, uInt32_)
                );

        }
        return [];
    }
    
    /**
     * Turn a WaveFile object into a file.
     * @return {Array<number>} The wav file bytes.
     * @private
     */
    createWaveFile_() {
        let options = {"be": this.LEorBE_()};
        return byteData_.packArray(this.chunkId, chr_).concat(
                byteData_.pack(this.chunkSize, uInt32_),
                byteData_.packArray(this.format, chr_),
                this.getBextBytes_(),
                byteData_.packArray(this.fmtChunkId, chr_),
                byteData_.pack(this.fmtChunkSize, uInt32_),
                byteData_.pack(this.audioFormat, uInt16_),
                byteData_.pack(this.numChannels, uInt16_),
                byteData_.pack(this.sampleRate, uInt32_),
                byteData_.pack(this.byteRate, uInt32_),
                byteData_.pack(this.blockAlign, uInt16_),
                byteData_.pack(this.bitsPerSample, uInt16_),
                this.getCbSizeBytes_(),
                this.getValidBitsPerSampleBytes_(),
                this.getFmtExtensionBytes_(),
                this.getFactBytes_(),
                byteData_.packArray(this.dataChunkId, chr_),
                byteData_.pack(this.dataChunkSize, uInt32_),
                this.samplesToBytes_(options),
                this.getCueBytes_()
            );
    }
}

module.exports = WaveFileReaderWriter;
