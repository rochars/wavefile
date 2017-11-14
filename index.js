/*!
 * Wavefile
 * Handle wave files with 4, 8, 16, 24, 32 PCM, 32 IEEE & 64-bit data.
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = require("byte-data");
const wavefileheader = require("./src/wavefileheader");

/**
 * A wave file.
 */
class WaveFile extends wavefileheader.WaveFileHeader {

    /**
     * @param {Uint8Array} bytes The file bytes.
     * @param {boolean} enforceFact True if it should throw a error
     *      if no "fact" chunk is found.
     * @param {boolean} enforceBext True if it should throw a error
     *      if no "bext" chunk is found.
     */
    constructor(bytes, enforceFact=false, enforceBext=false) {
        super();
        /** @type {boolean} */
        this.enforceFact = enforceFact;
        /** @type {boolean} */
        this.enforceBext = enforceBext;        
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
        /**
         * Error messages.
         * @enum {string}
         */
        this.WaveErrors = {
            'format': "Not a supported format.",
            'wave': "Could not find the 'WAVE' chunk",
            'fmt ': "Could not find the 'fmt ' chunk",
            'data': "Could not find the 'data' chunk",
            'fact': "Could not find the 'fact' chunk",
            'bext': "Could not find the 'bext' chunk"
        };
        if(bytes) {
            this.fromBytes(bytes);
        }
    }

    /**
     * Read a wave file from an array of bytes.
     * @param {Uint8Array} bytes The wave file as an array of bytes.
     */    
    fromBytes(bytes) {
        this.readRIFFChunk_(bytes);
        this.readWAVEChunk_(bytes);
        this.readFmtChunk_(bytes);
        try {
            this.readFactChunk_(bytes);
        }catch(err) {
            if (this.enforceFact) {
                throw err;
            }
        }
        try {
            this.readBextChunk_(bytes);
        }catch(err) {
            if (this.enforceBext) {
                throw err;
            }
        }
        this.readDataChunk_(bytes);
    }

    /**
     * Turn the wave file represented by an object of this class into
     * a array of bytes.
     * @return {Uint8Array}
     */
    toBytes() {
        this.checkWriteInput_(this.numChannels, this.sampleRate, this.bitDepth_);
        this.samplesToBytes_();
        let header = this.createWaveHeader_();
        let file = this.createWaveFile_(header);
        return new Uint8Array(file);
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "RIFF" chunk is found.
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData.stringFromBytes(bytes.slice(0, 4));
        if (this.chunkId != "RIFF") {
            throw Error(this.WaveErrors.format);
        }
        this.chunkSize = byteData.intFrom4Bytes(
            bytes.slice(4, 8))[0];
    }

    /**
     * Read the WAVE chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "WAVE" chunk is found.
     */
    readWAVEChunk_(bytes) {
        let start = byteData.findString(bytes, "WAVE");
        if (start === -1) {
            throw Error(this.WaveErrors.wave);
        }
        this.subChunk1Id = byteData.stringFromBytes(
                bytes.slice(start, start + 4));
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "fmt " chunk is found.
     */
    readFmtChunk_(bytes) {
        let start = byteData.findString(bytes, "fmt ");
        if (start === -1) {
            throw Error(this.WaveErrors['fmt ']);
        }
        this.format = byteData.stringFromBytes(
            bytes.slice(start, start + 4));
        this.subChunk1Size = byteData.uIntFrom4Bytes(
            bytes.slice(start + 4, start + 8))[0];
        this.audioFormat = byteData.uIntFrom2Bytes(
            bytes.slice(start + 8, start + 10))[0];
        this.numChannels = byteData.uIntFrom2Bytes(
            bytes.slice(start + 10, start + 12))[0];
        this.sampleRate = byteData.uIntFrom4Bytes(
            bytes.slice(start + 12, start + 16))[0];
        this.byteRate = byteData.uIntFrom4Bytes(
            bytes.slice(start + 16, start + 20))[0];
        this.blockAlign = byteData.uIntFrom2Bytes(
            bytes.slice(start + 20, start + 22))[0];
        this.bitsPerSample = byteData.uIntFrom2Bytes(
            bytes.slice(start + 22, start + 24))[0];
        // The bitDepth_ is used internally to determine
        // wich function use to read the samples
        if (this.audioFormat == 3 && this.bitsPerSample == 32) {
            this.bitDepth_ = "32f";
        }else {
            this.bitDepth_ = this.bitsPerSample.toString();
        }
    }

    /**
     * Read the "fact" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "fact" chunk is found.
     */
    readFactChunk_(bytes) {
        let start = byteData.findString(bytes, "fact");
        if (start === -1) {
            throw Error(this.WaveErrors.fact);
        }else {
            this.factChunkId = byteData.stringFromBytes(
                bytes.slice(start, start + 4));
            this.factChunkSize = byteData.uIntFrom4Bytes(
                bytes.slice(start + 4, start + 8)); // minimum 4
            this.dwSampleLength = byteData.uIntFrom4Bytes(
                bytes.slice(start + 8, start + 16));
        }
    }

    /**
     * Read the "bext" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "bext" chunk is found.
     */
    readBextChunk_(bytes) {
        let start = byteData.findString(bytes, "bext");
        if (start === -1) {
            throw Error(this.WaveErrors.bext);
        }else {
            this.bextChunkId = byteData.stringFromBytes(
                bytes.slice(start, start + 4));
        }
    }

    /**
     * Read the "data" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "data" chunk is found.
     */
    readDataChunk_(bytes) {
        let start = byteData.findString(bytes, "data");
        if (start === -1) {
            throw Error(this.WaveErrors.data);
        }
        this.subChunk2Id = byteData.stringFromBytes(
            bytes.slice(start, start + 4));
        this.subChunk2Size = byteData.intFrom4Bytes(
            bytes.slice(start + 4, start + 8))[0];
        this.samplesFromBytes_(bytes, start);
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Uint8Array} bytes Array of bytes representing the wave file.
     * @param {number} start The offset to start reading.
     */
    samplesFromBytes_(bytes, start) {
        let readingFunctions = {
            "4": byteData.intFrom1Byte,
            "8": byteData.uIntFrom1Byte,
            "16": byteData.intFrom2Bytes,
            "24": byteData.intFrom3Bytes,
            "32": byteData.intFrom4Bytes,
            "32f": byteData.floatFrom4Bytes,
            "64" : byteData.floatFrom8Bytes
        };
        let samples = bytes.slice(start + 8, start + 8 + this.subChunk2Size);
        this.samples_ = readingFunctions[this.bitDepth_](samples);
    }

    /**
     * Validate the input for wav writing.
     * @param {number} numChannels The number of channels
     *     Should be a int greater than zero smaller than the
     *     channel limit according to the bit depth.
     * @param {number} sampleRate The sample rate.
     *     Should be a int greater than zero smaller than the
     *     channel limit according to the bit depth and number of channels.
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
     * @throws {Error} If any argument does not meet the criteria.
     */
    checkWriteInput_(numChannels, sampleRate, bitDepth) {
        if (typeof bitDepth !== "string" ||
            !(bitDepth in this.headerFormats_)) {
            throw new Error("Invalid bit depth.");
        }
        this.validateNumChannels_(numChannels, bitDepth);
        this.validateSampleRate_(numChannels, sampleRate, bitDepth);
    }

    /**
     * Validate the sample rate value.
     * @param {number} numChannels The number of channels
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
     * @throws {Error} If any argument does not meet the criteria.
     */
    validateNumChannels_(numChannels, bitDepth) {
        let errorText = "Invalid number of channels.";
        let validChannnelNumber = false;
        let blockAlign = numChannels * (parseInt(bitDepth, 10) / 8);
        if (blockAlign <= 65535) {
            validChannnelNumber = true;
        }
        if (numChannels < 1 || !validChannnelNumber ||
            !(typeof numChannels==="number" && (numChannels%1)===0)) {
            throw new Error(errorText);
        }
        return true;
    }

    /**
     * Validate the sample rate value.
     * @param {number} numChannels The number of channels
     *     Should be a int greater than zero smaller than the
     *     channel limit according to the bit depth.
     * @param {number} sampleRate The sample rate.
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
     * @throws {Error} If any argument does not meet the criteria.
     */
    validateSampleRate_(numChannels, sampleRate, bitDepth) {
        let errorText = "Invalid sample rate.";
        let validSampleRateValue = false;
        let byteRate = numChannels * (parseInt(bitDepth, 10) / 8) * sampleRate;
        if (byteRate <= 4294967295) {
            validSampleRateValue = true;
        }
        if (sampleRate < 1 || !validSampleRateValue ||
            !(typeof sampleRate==="number" && (sampleRate%1)===0)) {
            throw new Error(errorText);
        }
        return true;
    }

    /**
     * Return a object representing the wave file header data.
     * @return {Object} The wav file header.
     */
    createWaveHeader_() {
        let bytes = parseInt(this.bitDepth_, 10) / 8;
        let chunkSizeBase;
        let subChunk1SizeVal;
        let byteRateVal;
        let blockAlignVal;
        let subChunk2SizeVal;
        let factVal;
        if (this.bitDepth_ == "4") {
            chunkSizeBase = 40;
            subChunk1SizeVal = 20;
            byteRateVal = this.byteRate;
            blockAlignVal = this.blockAlign;
            subChunk2SizeVal = this.samples_.length;
            factVal = byteData.stringToBytes("fact");
        } else {
            chunkSizeBase = 36;
            subChunk1SizeVal = 16;
            byteRateVal = (this.numChannels * bytes) * this.sampleRate;
            blockAlignVal = this.numChannels * bytes;
            subChunk2SizeVal = this.samples_.length * bytes;
            factVal = [];
        }
        return {
            chunkId      : byteData.stringToBytes("RIFF"),
            chunkSize    : chunkSizeBase + this.samples_.length * bytes,
            format       : byteData.stringToBytes("WAVE"),
            subChunk1Id  : byteData.stringToBytes("fmt "),
            subChunk1Size: subChunk1SizeVal,
            audioFormat  : this.headerFormats_[this.bitDepth_],
            numChannels  : this.numChannels,
            sampleRate   : this.sampleRate,
            byteRate     : byteRateVal,
            blockAlign   : blockAlignVal,
            bitsPerSample: parseInt(this.bitDepth_, 10),
            fact         : factVal,
            subChunk2Id  : byteData.stringToBytes("data"),
            subChunk2Size: subChunk2SizeVal
        };
    }

    /**
     * Split each sample into bytes.
     */
    samplesToBytes_() {
        let writingFunctions = {
            "4": byteData.intTo1Byte,
            "8": byteData.intTo1Byte,
            "16": byteData.intTo2Bytes,
            "24": byteData.intTo3Bytes,
            "32": byteData.intTo4Bytes,
            "32f": byteData.floatTo4Bytes,
            "64" : byteData.floatTo8Bytes
        };
        // FIXME byte-data should not modify the original array
        let s = [];
        for (let l=0; l<this.samples_.length; l++) {
            s[l] = this.samples_[l];
        }
        this.bytes_ = writingFunctions[this.bitDepth_](s);
        if (this.bytes_.length % 2) {
            this.bytes_.push(0);
        }
    }

    /**
     * Join the wav header and the samples.
     * @param {Object} header The header byte array.
     * @return {Uint8Array} The wav file bytes.
     */
    createWaveFile_(header) {
        return header.chunkId.concat(
            byteData.intTo4Bytes([header.chunkSize]),
            header.format, 
            header.subChunk1Id,
            byteData.intTo4Bytes([header.subChunk1Size]),
            byteData.intTo2Bytes([header.audioFormat]),
            byteData.intTo2Bytes([header.numChannels]),
            byteData.intTo4Bytes([header.sampleRate]),
            byteData.intTo4Bytes([header.byteRate]),
            byteData.intTo2Bytes([header.blockAlign]),
            byteData.intTo2Bytes([header.bitsPerSample]),
            header.fact,
            header.subChunk2Id,
            byteData.intTo4Bytes([header.subChunk2Size]),
            this.bytes_);
    }
}

module.exports.WaveFile = WaveFile;
