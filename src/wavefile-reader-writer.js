/*!
 * WaveFile
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = require("byte-data");
const waveFileHeader = require("../src/wavefile-header");

/**
 * A wave file.
 */
class WaveFileReaderWriter extends waveFileHeader.WaveFileHeader {

    /**
     * @param {Uint8Array} bytes The file bytes.
     * @param {boolean} enforceFact True if it should throw a error
     *      if no "fact" chunk is found.
     * @param {boolean} enforceBext True if it should throw a error
     *      if no "bext" chunk is found.
     */
    constructor(enforceFact=false, enforceBext=false) {
        super();
        /** @type {boolean} */
        this.isFromScratch_ = false;
        /** @type {boolean} */
        this.enforceFact = enforceFact;
        /** @type {boolean} */
        this.enforceBext = enforceBext;
        /**
         * Error messages.
         * @enum {string}
         */
        this.WaveErrors = {
            "format": "Not a supported format.",
            "wave": "Could not find the 'WAVE' chunk",
            "fmt ": "Could not find the 'fmt ' chunk",
            "data": "Could not find the 'data' chunk",
            "fact": "Could not find the 'fact' chunk",
            "bext": "Could not find the 'bext' chunk",
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
        this.samples_ = [];
        this.bytes_ = [];
    }

    /**
     * Create a WaveFile object based on the arguments passed.
     * @param {number} numChannels The number of channels
     *     (Ints like 1 for mono, 2 stereo and so on).
     * @param {number} sampleRate The sample rate.
     *     Integer numbers like 8000, 44100, 48000, 96000, 192000.
     * @param {string} bitDepth The audio bit depth.
     *     One of "8", "16", "24", "32", "32f", "64".
     * @param {!Array<number>} samples Array of samples to be written.
     *     Samples must be in the correct range according to the bit depth.
     *     Samples of multi-channel data .
     */
    fromScratch(numChannels, sampleRate, bitDepth, samples, options={}) {
        if (!options.container) {
            options.container = "RIFF";
        }
        this.isFromScratch_ = true;
        let bytes = parseInt(bitDepth, 10) / 8;
        this.chunkSize = 36 + samples.length * bytes;
        this.subChunk1Size = 16;
        this.byteRate = (numChannels * bytes) * sampleRate;
        this.blockAlign = numChannels * bytes;
        this.chunkId = options.container;
        this.format = "WAVE";
        this.subChunk1Id = "fmt ";
        this.audioFormat = this.headerFormats_[bitDepth];
        this.numChannels = numChannels;
        this.sampleRate = sampleRate;
        this.bitsPerSample = parseInt(bitDepth, 10);
        this.subChunk2Id = "data";
        this.subChunk2Size = samples.length * bytes;
        this.samples_ = samples;
        this.bitDepth_ = bitDepth;
    }

    /**
     * Read a wave file from a byte buffer.
     * @param {Uint8Array} bytes The buffer.
     */
    fromBuffer(bytes) {
        this.isFromScratch_ = false;
        this.readRIFFChunk_(bytes);
        this.readWAVEChunk_(bytes);
        this.readFmtChunk_(bytes);
        this.readFactChunk_(bytes);
        this.readBextChunk_(bytes);
        this.readDataChunk_(bytes);
    }

    /**
     * Turn the WaveFile object into a byte buffer.
     * @return {Uint8Array}
     */
    toBuffer() {
        this.checkWriteInput_(this.numChannels, this.sampleRate, this.bitDepth_);
        this.samplesToBytes_();
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
            bytes.slice(4, 8), 32, {"be": this.chunkId == "RIFX"})[0];
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
        this.format = "WAVE";
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "fmt " chunk is found.
     */
    readFmtChunk_(bytes) {
        let start = byteData.findString(bytes, "fmt ");
        if (start === -1) {
            throw Error(this.WaveErrors["fmt "]);
        }
        let options = {"be": this.chunkId == "RIFX"};
        this.subChunk1Id = "fmt ";
        this.subChunk1Size = byteData.fromBytes(
            bytes.slice(start + 4, start + 8), 32, options)[0];
        this.audioFormat = byteData.fromBytes(
            bytes.slice(start + 8, start + 10), 16, options)[0];
        this.numChannels = byteData.fromBytes(
            bytes.slice(start + 10, start + 12), 16, options)[0];
        this.sampleRate = byteData.fromBytes(
            bytes.slice(start + 12, start + 16), 32, options)[0];
        this.byteRate = byteData.fromBytes(
            bytes.slice(start + 16, start + 20), 32, options)[0];
        this.blockAlign = byteData.fromBytes(
            bytes.slice(start + 20, start + 22), 16, options)[0];
        this.bitsPerSample = byteData.fromBytes(
            bytes.slice(start + 22, start + 24), 16, options)[0];
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
        if (start === -1 && this.enforceFact) {
            throw Error(this.WaveErrors.fact);
        }else if (start > -1) {
            this.factChunkId = "fact";
            //this.factChunkSize = byteData.uIntFrom4Bytes(
            //    bytes.slice(start + 4, start + 8));
            //this.dwSampleLength = byteData.uIntFrom4Bytes(
            //    bytes.slice(start + 8, start + 12));
        }
    }

    /**
     * Read the "bext" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "bext" chunk is found.
     */
    readBextChunk_(bytes) {
        let start = byteData.findString(bytes, "bext");
        if (start === -1 && this.enforceBext) {
            throw Error(this.WaveErrors.bext);
        }else if (start > -1){
            this.bextChunkId = "bext";
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
        this.subChunk2Id = "data";
        this.subChunk2Size = byteData.fromBytes(
            bytes.slice(start + 4, start + 8),
            32,
            {"be": this.chunkId == "RIFX"})[0];
        this.samplesFromBytes_(bytes, start);
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Uint8Array} bytes Array of bytes representing the wave file.
     * @param {number} start The offset to start reading.
     */
    samplesFromBytes_(bytes, start) {
        let params = {
            "signed": this.bitsPerSample == 8 ? false : true,
            "be": this.chunkId == "RIFX"
        };
        if (this.bitsPerSample == 32 && this.audioFormat == 3) {
            params.float = true;
        }
        let samples = bytes.slice(start + 8, start + 8 + this.subChunk2Size);
        if (this.bitsPerSample == 4) {
            this.samples_ = byteData.fromBytes(samples, 8, params);
        } else {
            this.samples_ = byteData.fromBytes(samples, this.bitsPerSample, params);
        }
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
    checkWriteInput_() {
        this.validateBitDepth_();
        this.validateNumChannels_();
        this.validateSampleRate_();
    }

    /**
     * Validate the bit depth.
     * @param {number} numChannels The number of channels
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
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
     * @param {number} numChannels The number of channels
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
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
     * @param {number} numChannels The number of channels
     *     Should be a int greater than zero smaller than the
     *     channel limit according to the bit depth.
     * @param {number} sampleRate The sample rate.
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
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
    samplesToBytes_() {
        let params = {"be": this.chunkId == "RIFX"};
        if (this.bitsPerSample == 32 && this.audioFormat == 3) {
            params.float = true;
        }
        let bitDepth = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        this.bytes_ = byteData.toBytes(this.samples_, bitDepth, params);
        if (this.bytes_.length % 2) {
            this.bytes_.push(0);
        }
    }

    /**
     * Turn a WaveFile object into a file.
     * @return {Uint8Array} The wav file bytes.
     */
    createWaveFile_() {
        let factVal = [];
        if (this.factChunkId) {
            factVal = byteData.toBytes(this.factChunkId, 8, {"char": true});
        }
        let options = {"be": this.chunkId == "RIFX"};
        return byteData.toBytes(this.chunkId, 8, {"char": true}).concat(
            byteData.toBytes([this.chunkSize], 32, options),
            byteData.toBytes(this.format, 8, {"char": true}), 
            byteData.toBytes(this.subChunk1Id, 8, {"char": true}),
            byteData.toBytes([this.subChunk1Size], 32, options),
            byteData.toBytes([this.audioFormat], 16, options),
            byteData.toBytes([this.numChannels], 16, options),
            byteData.toBytes([this.sampleRate], 32, options),
            byteData.toBytes([this.byteRate], 32, options),
            byteData.toBytes([this.blockAlign], 16, options),
            byteData.toBytes([this.bitsPerSample], 16, options),
            factVal,
            byteData.toBytes(this.subChunk2Id, 8, {"char": true}),
            byteData.toBytes([this.subChunk2Size], 32, options),
            this.bytes_);
    }
}

module.exports.WaveFileReaderWriter = WaveFileReaderWriter;
