/*
 * wavefile
 * Read & write wave files with 4, 8, 11, 12, 16, 20, 24, 32 & 64-bit data.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/** @private */
const bitDepth_ = require("bitdepth");
/** @private */
const riffChunks_ = require("riff-chunks");
/** @private */
const imaadpcm_ = require("imaadpcm");
/** @private */
const alawmulaw_ = require("alawmulaw");
/** @private */
const byteData_ = require("byte-data");
/** @private */
const encodeBase64 = require("base64-arraybuffer").encode;
/** @private */
const uInt16_ = {"bits": 16};
/** @private */
const uInt32_ = {"bits": 32};
/** @private */
const fourCC_ = {"bits": 32, "char": true};
/** @private */
const chr_ = {"bits": 8, "char": true};

/**
 * Class representing a wav file.
 */
class WaveFile {

    /**
     * @param {Uint8Array|Array<number>} bytes A wave file buffer.
     * @throws {Error} If no "RIFF" chunk is found.
     * @throws {Error} If no "fmt " chunk is found.
     * @throws {Error} If no "fact" chunk is found and "fact" is needed.
     * @throws {Error} If no "data" chunk is found.
     */
    constructor(bytes) {
        /**
         * The container identifier.
         * Only "RIFF" and "RIFX" are supported.
         * @type {!string}
         * @export
         */
        this.container = "";
        /**
         * @type {!number}
         * @export
         */
        this.chunkSize = 0;
        /**
         * The format.
         * Always "WAVE".
         * @type {!string}
         * @export
         */
        this.format = "";
        /**
         * The data of the "fmt" chunk.
         * @type {!Object<!string, *>}
         * @export
         */
        this.fmt = {
            /** @export @type {!string} */
            "chunkId": "",
            /** @export @type {!number} */
            "chunkSize": 0,
            /** @export @type {!number} */
            "audioFormat": 0,
            /** @export @type {!number} */
            "numChannels": 0,
            /** @export @type {!number} */
            "sampleRate": 0,
            /** @export @type {!number} */
            "byteRate": 0,
            /** @export @type {!number} */
            "blockAlign": 0,
            /** @export @type {!number} */
            "bitsPerSample": 0,
            /** @export @type {!number} */
            "cbSize": 0,
            /** @export @type {!number} */
            "validBitsPerSample": 0,
            /** @export @type {!number} */
            "dwChannelMask": 0,
            /**
             * 4 32-bit values representing a 128-bit ID
             * @export @type {!Array<number>}
             */
            "subformat": []
        };
        /**
         * The data of the "fact" chunk.
         * @type {!Object<!string, *>}
         * @export
         */
        this.fact = {
            /** @export @type {!string} */
            "chunkId": "",
            /** @export @type {!number} */
            "chunkSize": 0,
            /** @export @type {!number} */
            "dwSampleLength": 0
        };
        /**
         * The data of the "cue " chunk.
         * @type {!Object<!string, *>}
         * @export
         */
        this.cue = {
            /** @export @type {!string} */
            "chunkId": "",
            /** @export @type {!number} */
            "chunkSize": 0,
            /** @export @type {!number} */
            "dwCuePoints": 0,
            /** @export @type {!Array<Object>} */
            "points": [],
        };
        /**
         * The data of the "bext" chunk.
         * @type {!Object<!string, *>}
         * @export
         */
        this.bext = {
            /** @export @type {!string} */
            "chunkId": "",
            /** @export @type {!number} */
            "chunkSize": 0,
            /** @export @type {!string} */
            "description": "", //256
            /** @export @type {!string} */
            "originator": "", //32
            /** @export @type {!string} */
            "originatorReference": "", //32
            /** @export @type {!string} */
            "originationDate": "", //10
            /** @export @type {!string} */
            "originationTime": "", //8
            /**
             * 2 32-bit values, timeReference high and low
             * @export @type {!Array<number>}
             */
            "timeReference": [],
            /** @export @type {!number} */
            "version": 0, //WORD
            /** @export @type {!string} */
            "UMID": "", // 64 chars
            /** @export @type {!number} */
            "loudnessValue": 0, //WORD
            /** @export @type {!number} */
            "loudnessRange": 0, //WORD
            /** @export @type {!number} */
            "maxTruePeakLevel": 0, //WORD
            /** @export @type {!number} */
            "maxMomentaryLoudness": 0, //WORD
            /** @export @type {!number} */
            "maxShortTermLoudness": 0, //WORD
            /** @export @type {!string} */
            "reserved": "", //180
            /** @export @type {!string} */
            "codingHistory": "" // string, unlimited
        };
        /**
         * The data of the "ds64" chunk.
         * Used only with RF64 files.
         * @type {!Object<!string, *>}
         * @export
         */
        this.ds64 = {
            /** @type {!string} */
            "chunkId": "",
            /** @export @type {!number} */
            "chunkSize": 0,
            /** @export @type {!number} */
            "riffSizeHigh": 0, // DWORD
            /** @export @type {!number} */
            "riffSizeLow": 0, // DWORD
            /** @export @type {!number} */
            "dataSizeHigh": 0, // DWORD
            /** @export @type {!number} */
            "dataSizeLow": 0, // DWORD
            /** @export @type {!number} */
            "originationTime": 0, // DWORD
            /** @export @type {!number} */
            "sampleCountHigh": 0, // DWORD
            /** @export @type {!number} */
            "sampleCountLow": 0, // DWORD
            /** @export @type {!number} */
            //"tableLength": 0, // DWORD
            /** @export @type {!Array<number>} */
            //"table": []
        };
        /**
         * The data of the "data" chunk.
         * @type {!Object<!string, *>}
         * @export
         */
        this.data = {
            /** @export @type {!string} */
            "chunkId": "",
            /** @export @type {!number} */
            "chunkSize": 0,
            /** @export @type {!Array<number>} */
            "samples": []
        };
        /**
         * The data of the "LIST" chunks.
         * Each item in this list must have this signature:
         *  {
         *      "chunkId": "",
         *      "chunkSize": 0,
         *      "format": "",
         *      "subChunks": []
         *   }
         * @type {!Array<Object>}
         * @export
         */
        this.LIST = [];
        /**
         * The data of the "junk" chunk.
         * @type {!Object<!string, *>}
         * @export
         */
        this.junk = {
            /** @export @type {!string} */
            "chunkId": "",
            /** @export @type {!number} */
            "chunkSize": 0,
            /** @export @type {!Array<number>} */
            "chunkData": []
        };
        /**
         * If the data in data.samples is interleaved or not.
         * @type {!boolean}
         * @export
         */
        this.isInterleaved = true;
        /**
         * @type {!string}
         * @export
         */
        this.bitDepth = "0";
        /**
         * Audio formats.
         * Formats not listed here will be set to 65534
         * and treated as WAVE_FORMAT_EXTENSIBLE
         * @enum {!number}
         * @private
         */
        this.audioFormats_ = {
            "4": 17,
            "8": 1,
            "8a": 6,
            "8m": 7,
            "16": 1,
            "24": 1,
            "32": 1,
            "32f": 3,
            "40": 65534,
            "48": 65534,
            "64": 3
        };
        /**
         * @type {!number}
         * @private
         */
        this.head_ = 0;
        /**
         * If the "fact" chunk should be enforced or not.
         * @type {!boolean}
         * @export
         */
        this.enforceFact = false;
        // Load a file from the buffer if one was passed
        // when creating the object
        if(bytes) {
            this.fromBuffer(bytes);
        }
    }

    /**
     * Set up a WaveFile object based on the arguments passed.
     * @param {!number} numChannels The number of channels
     *     (Integer numbers: 1 for mono, 2 stereo and so on).
     * @param {!number} sampleRate The sample rate.
     *     Integer numbers like 8000, 44100, 48000, 96000, 192000.
     * @param {!string} bitDepth The audio bit depth.
     *     One of "4", "8", "8a", "8m", "16", "24", "32", "32f", "64"
     *     or any value between "8" and "32".
     * @param {!Array<number>} samples Array of samples to be written.
     *     The samples must be in the correct range according to the
     *     bit depth.
     * @throws {Error} If any argument does not meet the criteria.
     * @export
     */
    fromScratch(numChannels, sampleRate, bitDepth, samples, options={}) {
        if (!options["container"]) {
            options["container"] = "RIFF";
        }
        // closest nuber of bytes if not / 8
        let numBytes = (((parseInt(bitDepth, 10) - 1) | 7) + 1) / 8;
        this.clearHeader_();
        this.bitDepth = bitDepth;
        // interleave the samples if they were passed de-interleaved
        this.data.samples = samples;
        if (samples.length > 0) {
            if (samples[0].constructor === Array) {
                this.isInterleaved = false;
                this.interleave();
            }
        }
        // Normal PCM file header
        this.container = options["container"];
        this.chunkSize = 36 + this.data.samples.length * numBytes;
        this.format = "WAVE";
        this.fmt.chunkId = "fmt ";
        this.fmt.chunkSize = 16;
        this.fmt.byteRate = (numChannels * numBytes) * sampleRate;
        this.fmt.blockAlign = numChannels * numBytes;
        this.fmt.audioFormat = this.audioFormats_[bitDepth] ?
            this.audioFormats_[bitDepth] : 65534;
        this.fmt.numChannels = numChannels;
        this.fmt.sampleRate = sampleRate;
        this.fmt.bitsPerSample = parseInt(bitDepth, 10);
        this.fmt.cbSize = 0;
        this.fmt.validBitsPerSample = 0;
        this.data.chunkId = "data";
        this.data.chunkSize = this.data.samples.length * numBytes;
        // IMA ADPCM header
        if (bitDepth == "4") {
            this.chunkSize = 40 + this.data.samples.length;
            this.fmt.chunkSize = 20;
            this.fmt.byteRate = 4055;
            this.fmt.blockAlign = 256;
            this.fmt.bitsPerSample = 4;
            this.fmt.cbSize = 2;
            this.fmt.validBitsPerSample = 505;
            this.fact.chunkId = "fact";
            this.fact.chunkSize = 4;
            this.fact.dwSampleLength = this.data.samples.length * 2;
            this.data.chunkSize = this.data.samples.length;
        }
        // A-Law and mu-Law header
        if (bitDepth == "8a" || bitDepth == "8m") {
            this.chunkSize = 40 + this.data.samples.length;
            this.fmt.chunkSize = 20;
            this.fmt.cbSize = 2;
            this.fmt.validBitsPerSample = 8;
            this.fact.chunkId = "fact";
            this.fact.chunkSize = 4;
            this.fact.dwSampleLength = this.data.samples.length;
        }
        // WAVE_FORMAT_EXTENSIBLE
        if (this.fmt.audioFormat == 65534) {
            this.chunkSize = 36 + 24 + this.data.samples.length * numBytes;
            this.fmt.chunkSize = 40;
            this.fmt.bitsPerSample = ((parseInt(bitDepth, 10) - 1) | 7) + 1;
            this.fmt.cbSize = 22;
            this.fmt.validBitsPerSample = parseInt(bitDepth, 10);
            this.fmt.dwChannelMask = 0;
            // subformat 128-bit GUID as 4 32-bit values
            // only supports uncompressed integer PCM samples
            this.fmt.subformat = [1, 1048576, 2852126848, 1905997824];
        }
        this.checkWriteInput_();
        this.LEorBE_();
    }

    /**
     * Init a WaveFile object from a byte buffer.
     * @param {!Uint8Array|!Array<number>} bytes The buffer.
     * @throws {Error} If container is not RIFF or RIFX.
     * @throws {Error} If no "fmt " chunk is found.
     * @throws {Error} If no "fact" chunk is found and "fact" is needed.
     * @throws {Error} If no "data" chunk is found.
     * @export
     */
    fromBuffer(bytes) {
        this.clearHeader_();
        this.readRIFFChunk_(bytes);
        let chunk = riffChunks_.read(bytes);
        this.readDs64Chunk_(chunk["subChunks"]);
        this.readFmtChunk_(chunk["subChunks"]);
        this.readFactChunk_(chunk["subChunks"]);
        this.readBextChunk_(chunk["subChunks"]);
        this.readCueChunk_(chunk["subChunks"]);
        this.readDataChunk_(chunk["subChunks"]);
        this.readLISTChunk_(chunk["subChunks"]);
        this.readJunkChunk_(chunk["subChunks"]);
        this.bitDepthFromFmt_();
    }

    /**
     * Return a byte buffer representig the WaveFile object as a wav file.
     * The return value of this method can be written straight to disk.
     * @return {!Uint8Array} A .wav file.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    toBuffer() {
        this.checkWriteInput_();
        this.assureInterleaved_();
        return this.createWaveFile_();
    }

    /**
     * Return a base64 string representig the WaveFile object as a wav file.
     * @return {string} A .wav file as a base64 string.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    toBase64() {
        return encodeBase64(this.toBuffer());
    }

    /**
     * Return a base64 string representig the WaveFile object as a wav file.
     * The return value of this method can be used to load the audio in browsers.
     * @return {string} A .wav file as a DataURI.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    toDataURI() {
        return "data:audio/wav;base64," + this.toBase64();
    }

    /**
     * Force a file as RIFF.
     * @export
     */
    toRIFF() {
        if (this.container == "RF64") {
            this.fromScratch(
                this.fmt.numChannels,
                this.fmt.sampleRate,
                this.bitDepth,
                this.data.samples);
        } else {
            this.container = "RIFF";
            this.LEorBE_();
        }
    }

    /**
     * Force a file as RIFX.
     * @export
     */
    toRIFX() {
        if (this.container == "RF64") {
            this.fromScratch(
                this.fmt.numChannels,
                this.fmt.sampleRate,
                this.bitDepth,
                this.data.samples,
                {"container": "RIFX"});
        } else {
            this.container = "RIFX";
            this.LEorBE_();
        }
    }

    /**
     * Change the bit depth of the samples.
     * @param {!string} bitDepth The new bit depth of the samples.
     *      One of "8" ... "32" (integers), "32f" or "64" (floats)
     * @param {!boolean} changeResolution A boolean indicating if the
     *      resolution of samples should be actually changed or not.
     * @throws {Error} If the bit depth is not valid.
     * @export
     */
    toBitDepth(bitDepth, changeResolution=true) {
        let toBitDepth = bitDepth;
        let thisBitDepth = this.bitDepth;
        if (!changeResolution) {
            toBitDepth = this.realBitDepth_(bitDepth);
            thisBitDepth = this.realBitDepth_(this.bitDepth);
        }
        this.assureInterleaved_();
        this.assureUncompressed_();
        bitDepth_.toBitDepth(this.data.samples, thisBitDepth, toBitDepth);
        this.fromScratch(
            this.fmt.numChannels,
            this.fmt.sampleRate,
            bitDepth,
            this.data.samples,
            {"container": this.correctContainer_()});
    }

    /**
     * Interleave multi-channel samples.
     * @export
     */
    interleave() {
        if (!this.isInterleaved) {
            let finalSamples = [];
            let numChannels = this.data.samples[0].length;
            for (let i = 0; i < numChannels; i++) {
                for (let j = 0; j < this.data.samples.length; j++) {
                    finalSamples.push(this.data.samples[j][i]);
                }
            }
            this.data.samples = finalSamples;
            this.isInterleaved = true;
        }
    }

    /**
     * De-interleave samples into multiple channels.
     * @export
     */
    deInterleave() {
        if (this.isInterleaved) {
            let finalSamples = [];
            let i;
            for (i = 0; i < this.fmt.numChannels; i++) {
                finalSamples[i] = [];
            }
            i = 0;
            let j;
            while (i < this.data.samples.length) {
                for (j = 0; j < this.fmt.numChannels; j++) {
                    finalSamples[j].push(this.data.samples[i+j]);
                }
                i += j;
            }
            this.data.samples = finalSamples;
            this.isInterleaved = false;
        }
    }

    /**
     * Encode a 16-bit wave file as 4-bit IMA ADPCM.
     * @throws {Error} If sample rate is not 8000.
     * @throws {Error} If number of channels is not 1.
     * @export
     */
    toIMAADPCM() {
        if (this.fmt.sampleRate != 8000) {
            throw new Error(
                "Only 8000 Hz files can be compressed as IMA-ADPCM.");
        } else if(this.fmt.numChannels != 1) {
            throw new Error(
                "Only mono files can be compressed as IMA-ADPCM.");
        } else {
            this.assure16Bit_();
            this.fromScratch(
                this.fmt.numChannels,
                this.fmt.sampleRate,
                "4",
                imaadpcm_.encode(this.data.samples),
                {"container": this.correctContainer_()});
        }
    }

    /**
     * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
     * @param {!string} bitDepth The new bit depth of the samples.
     *      One of "8" ... "32" (integers), "32f" or "64" (floats).
     *      Optional. Default is 16.
     * @export
     */
    fromIMAADPCM(bitDepth="16") {
        this.fromScratch(
            this.fmt.numChannels,
            this.fmt.sampleRate,
            "16",
            imaadpcm_.decode(this.data.samples, this.fmt.blockAlign),
            {"container": this.correctContainer_()});
        if (bitDepth != "16") {
            this.toBitDepth(bitDepth);
        }
    }

    /**
     * Encode 16-bit wave file as 8-bit A-Law.
     * @export
     */
    toALaw() {
        this.assure16Bit_();
        this.assureInterleaved_();
        this.fromScratch(
            this.fmt.numChannels,
            this.fmt.sampleRate,
            "8a",
            alawmulaw_.alaw.encode(this.data.samples),
            {"container": this.correctContainer_()});
    }

    /**
     * Decode a 8-bit A-Law wave file into a 16-bit wave file.
     * @param {!string} bitDepth The new bit depth of the samples.
     *      One of "8" ... "32" (integers), "32f" or "64" (floats).
     *      Optional. Default is 16.
     * @export
     */
    fromALaw(bitDepth="16") {
        this.fromScratch(
            this.fmt.numChannels,
            this.fmt.sampleRate,
            "16",
            alawmulaw_.alaw.decode(this.data.samples),
            {"container": this.correctContainer_()});
        if (bitDepth != "16") {
            this.toBitDepth(bitDepth);
        }
    }

    /**
     * Encode 16-bit wave file as 8-bit mu-Law.
     * @export
     */
    toMuLaw() {
        this.assure16Bit_();
        this.assureInterleaved_();
        this.fromScratch(
            this.fmt.numChannels,
            this.fmt.sampleRate,
            "8m",
            alawmulaw_.mulaw.encode(this.data.samples),
            {"container": this.correctContainer_()});
    }

    /**
     * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
     * @param {!string} bitDepth The new bit depth of the samples.
     *      One of "8" ... "32" (integers), "32f" or "64" (floats).
     *      Optional. Default is 16.
     * @export
     */
    fromMuLaw(bitDepth="16") {
        this.fromScratch(
            this.fmt.numChannels,
            this.fmt.sampleRate,
            "16",
            alawmulaw_.mulaw.decode(this.data.samples),
            {"container": this.correctContainer_()});
        if (bitDepth != "16") {
            this.toBitDepth(bitDepth);
        }
    }

    /**
     * Return the closest greater number of bits for a number of bits that
     * do not fill a full sequence of bytes.
     * @param {!string} bitDepth The bit depth.
     * @return {!string}
     */
    realBitDepth_(bitDepth) {
        if (bitDepth != "32f") {
            bitDepth = (((parseInt(bitDepth, 10) - 1) | 7) + 1).toString();
        }
        return bitDepth;
    }

    /**
     * Validate the input for wav writing.
     * @throws {Error} If any property of the object appears invalid.
     * @private
     */
    checkWriteInput_() {
        this.validateBitDepth_();
        this.validateNumChannels_();
        this.validateSampleRate_();
    }

    /**
     * Validate the bit depth.
     * @return {!boolean} True is the bit depth is valid.
     * @throws {Error} If bit depth is invalid.
     * @private
     */
    validateBitDepth_() {
        if (!this.audioFormats_[this.bitDepth]) {
            if (parseInt(this.bitDepth, 10) > 8 &&
                    parseInt(this.bitDepth, 10) < 54) {
                return true;
            }
            throw new Error("Invalid bit depth.");
        }
        return true;
    }

    /**
     * Validate the number of channels.
     * @return {!boolean} True is the number of channels is valid.
     * @throws {Error} If the number of channels is invalid.
     * @private
     */
    validateNumChannels_() {
        let blockAlign = this.fmt.numChannels * this.fmt.bitsPerSample / 8;
        if (this.fmt.numChannels < 1 || blockAlign > 65535) {
            throw new Error("Invalid number of channels.");
        }
        return true;
    }

    /**
     * Validate the sample rate value.
     * @return {!boolean} True is the sample rate is valid.
     * @throws {Error} If the sample rate is invalid.
     * @private
     */
    validateSampleRate_() {
        let byteRate = this.fmt.numChannels *
            (this.fmt.bitsPerSample / 8) * this.fmt.sampleRate;
        if (this.fmt.sampleRate < 1 || byteRate > 4294967295) {
            throw new Error("Invalid sample rate.");
        }
        return true;
    }

    /**
     * Reset attributes that should emptied when a file is
     * created with the fromScratch() or fromBuffer() methods.
     * @private
     */
    clearHeader_() {
        this.fmt.cbSize = 0;
        this.fmt.validBitsPerSample = 0;
        this.fact.chunkId = "";
        this.ds64.chunkId = "";
    }

    /**
     * Make the file 16-bit if it is not.
     * @private
     */
    assure16Bit_() {
        this.assureUncompressed_();
        if (this.bitDepth != "16") {
            this.toBitDepth("16");
        }
    }

    /**
     * Uncompress the samples in case of a compressed file.
     * @private
     */
    assureUncompressed_() {
        if (this.bitDepth == "8a") {
            this.fromALaw();
        } else if(this.bitDepth == "8m") {
            this.fromMuLaw();
        } else if (this.bitDepth == "4") {
            this.fromIMAADPCM();
        }
    }

    /**
     * Interleave the samples in case they are de-Interleaved.
     * @private
     */
    assureInterleaved_() {
        if (!this.isInterleaved) {
            this.interleave();
        }
    }

    /**
     * Set up to work wih big-endian or little-endian files.
     * The types used are changed to LE or BE. If the
     * the file is big-endian (RIFX), true is returned.
     * @return {!boolean} True if the file is RIFX.
     * @private
     */
    LEorBE_() {
        let bigEndian = this.container === "RIFX";
        uInt16_["be"] = bigEndian;
        uInt32_["be"] = bigEndian;
        return bigEndian;
    }

    /**
     * Find a chunk by its fourCC_ in a array of RIFF chunks.
     * @param {!Array<!Object>} chunks The wav file chunks.
     * @param {!string} chunkId The chunk fourCC_.
     * @param {boolean} multiple True if there may be multiple chunks
     *      with the same chunkId.
     * @return {Object|Array<Object>|null}
     * @private
     */
    findChunk_(chunks, chunkId, multiple=false) {
        let chunk = [];
        for (let i=0; i<chunks.length; i++) {
            if (chunks[i]["chunkId"] == chunkId) {
                if (multiple) {
                    chunk.push(chunks[i]);
                } else {
                    return chunks[i];
                }
            }
        }
        if (chunkId == "LIST") {
            return chunk.length ? chunk : null;
        }
        return null;
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {!Uint8Array|!Array<number>} bytes A wav buffer.
     * @throws {Error} If no "RIFF" chunk is found.
     * @private
     */
    readRIFFChunk_(bytes) {
        this.head_ = 0;
        this.container = this.readString_(bytes, 4);
        if (["RIFF", "RIFX", "RF64"].indexOf(this.container) === -1) {
            throw Error("Not a supported format.");
        }
        this.LEorBE_();
        this.chunkSize = this.read_(bytes, uInt32_);
        this.format = this.readString_(bytes, 4);
        if (this.format != "WAVE") {
            throw Error("Could not find the 'WAVE' format identifier");
        }
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {!Array<!Object>} chunks The wav file chunks.
     * @throws {Error} If no "fmt " chunk is found.
     * @private
     */
    readFmtChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "fmt ");
        if (chunk) {
            this.head_ = 0;
            let chunkData = chunk["chunkData"];
            this.fmt.chunkId = chunk["chunkId"];
            this.fmt.chunkSize = chunk["chunkSize"];
            this.fmt.audioFormat = this.read_(chunkData, uInt16_);
            this.fmt.numChannels = this.read_(chunkData, uInt16_);
            this.fmt.sampleRate = this.read_(chunkData, uInt32_);
            this.fmt.byteRate = this.read_(chunkData, uInt32_);
            this.fmt.blockAlign = this.read_(chunkData, uInt16_);
            this.fmt.bitsPerSample = this.read_(chunkData, uInt16_);
            this.readFmtExtension_(chunkData);
        } else {
            throw Error("Could not find the 'fmt ' chunk");
        }
    }

    /**
     * Read the "fmt " chunk extension.
     * @param {!Array<number>} chunkData The "fmt " chunk.
     * @private
     */
    readFmtExtension_(chunkData) {
        if (this.fmt.chunkSize > 16) {
            this.fmt.cbSize = this.read_(
                chunkData, uInt16_);
            if (this.fmt.chunkSize > 18) {
                this.fmt.validBitsPerSample = this.read_(chunkData, uInt16_);
                if (this.fmt.chunkSize > 20) {
                    this.fmt.dwChannelMask = this.read_(chunkData, uInt32_);
                    this.fmt.subformat = [
                        this.read_(chunkData, uInt32_),
                        this.read_(chunkData, uInt32_),
                        this.read_(chunkData, uInt32_),
                        this.read_(chunkData, uInt32_)];
                }
            }
        }
    }

    /**
     * Read the "fact" chunk of a wav file.
     * @param {!Array<Object>} chunks The wav file chunks.
     * @throws {Error} If no "fact" chunk is found.
     * @private
     */
    readFactChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "fact");
        if (chunk) {
            this.head_ = 0;
            this.fact.chunkId = chunk["chunkId"];
            this.fact.chunkSize = chunk["chunkSize"];
            this.fact.dwSampleLength = this.read_(chunk["chunkData"], uInt32_);
        } else if (this.enforceFact) {
            throw Error("Could not find the 'fact' chunk");
        }
    }

    /**
     * Read the "cue " chunk of a wave file.
     * @param {!Array<Object>} chunks The RIFF file chunks.
     * @private
     */
    readCueChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "cue ");
        if (chunk) {
            this.head_ = 0;
            let chunkData = chunk["chunkData"];
            this.cue.chunkId = chunk["chunkId"];
            this.cue.chunkSize = chunk["chunkSize"];
            this.cue.dwCuePoints = this.read_(chunkData, uInt32_);
            for (let i=0; i<this.cue.dwCuePoints; i++) {
                this.cue.points.push({
                    "dwName": this.read_(chunkData, uInt32_),
                    "dwPosition": this.read_(chunkData, uInt32_),
                    "fccChunk": this.readString_(chunkData, 4),
                    "dwChunkStart": this.read_(chunkData, uInt32_),
                    "dwBlockStart": this.read_(chunkData, uInt32_),
                    "dwSampleOffset": this.read_(chunkData, uInt32_),
                });
            }
        }
    }

    /**
     * Read the "data" chunk of a wave file.
     * @param {!Array<Object>} chunks The RIFF file chunks.
     * @throws {Error} If no "data" chunk is found.
     * @private
     */
    readDataChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "data");
        if (chunk) {
            this.data.chunkId = "data";
            this.data.chunkSize = chunk["chunkSize"];
            this.samplesFromBytes_(chunk["chunkData"]);
        } else {
            throw Error("Could not find the 'data' chunk");
        }
    }

    /**
     * Read the "bext" chunk of a wav file.
     * @param {!Array<Object>} chunks The wav file chunks.
     * @private
     */
    readBextChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "bext");
        if (chunk) {
            this.head_ = 0;
            let chunkData = chunk["chunkData"];
            this.bext.chunkId = chunk["chunkId"];
            this.bext.chunkSize = chunk["chunkSize"];
            this.bext.description = this.readString_(chunkData, 256);
            this.bext.originator = this.readString_(chunkData, 32);
            this.bext.originatorReference = this.readString_(chunkData, 32);
            this.bext.originationDate = this.readString_(chunkData, 10);
            this.bext.originationTime = this.readString_(chunkData, 8);
            this.bext.timeReference = [
                this.read_(chunkData, uInt32_),
                this.read_(chunkData, uInt32_)];
            this.bext.version = this.read_(chunkData, uInt16_);
            this.bext.UMID = this.readString_(chunkData, 64);
            this.bext.loudnessValue = this.read_(chunkData, uInt16_);
            this.bext.loudnessRange = this.read_(chunkData, uInt16_);
            this.bext.maxTruePeakLevel = this.read_(chunkData, uInt16_);
            this.bext.maxMomentaryLoudness = this.read_(chunkData, uInt16_);
            this.bext.maxShortTermLoudness = this.read_(chunkData, uInt16_);
            this.bext.reserved = this.readString_(chunkData, 180);
            this.bext.codingHistory = this.readString_(
                chunkData, this.bext.chunkSize - 602);
        }
    }

    /**
     * Read the "ds64" chunk of a wave file.
     * @param {!Array<Object>} chunks The wav file chunks.
     * @throws {Error} If no "ds64" chunk is found and the file is RF64.
     * @private
     */
    readDs64Chunk_(chunks) {
        let chunk = this.findChunk_(chunks, "ds64");
        if (chunk) {
            this.head_ = 0;
            let chunkData = chunk["chunkData"];
            this.ds64.chunkId = chunk["chunkId"];
            this.ds64.chunkSize = chunk["chunkSize"];
            this.ds64.riffSizeHigh = this.read_(chunkData, uInt32_);
            this.ds64.riffSizeLow = this.read_(chunkData, uInt32_);
            this.ds64.dataSizeHigh = this.read_(chunkData, uInt32_);
            this.ds64.dataSizeLow = this.read_(chunkData, uInt32_);
            this.ds64.originationTime = this.read_(chunkData, uInt32_);
            this.ds64.sampleCountHigh = this.read_(chunkData, uInt32_);
            this.ds64.sampleCountLow = this.read_(chunkData, uInt32_);
            //if (this.ds64.chunkSize > 28) {
            //    this.ds64.tableLength = byteData_.unpack(
            //        chunkData.slice(28, 32), uInt32_);
            //    this.ds64.table = chunkData.slice(
            //         32, 32 + this.ds64.tableLength); 
            //}
        } else {
            if (this.container == "RF64") {
                throw Error("Could not find the 'ds64' chunk");    
            }
        }
    }

    /**
     * Read the "LIST" chunks of a wave file.
     * @param {!Array<Object>} chunks The wav file chunks.
     * @private
     */
    readLISTChunk_(chunks) {
        let listChunks = this.findChunk_(chunks, "LIST", true);
        if (listChunks === null) {
            return;
        }
        for (let j=0; j<listChunks.length; j++) {
            let subChunk = listChunks[j];
            this.LIST.push({
                "chunkId": subChunk["chunkId"],
                "chunkSize": subChunk["chunkSize"],
                "format": subChunk["format"],
                "chunkData": subChunk["chunkData"],
                "subChunks": []});
            for (let x=0; x<subChunk["subChunks"].length; x++) {
                this.readLISTSubChunks_(subChunk["subChunks"][x],
                    subChunk["format"]);
            }
        }
    }

    /**
     * Read the sub chunks of a "LIST" chunk.
     * @param {!Object} subChunk The "LIST" subchunks.
     * @param {!string} format The "LIST" format, "adtl" or "INFO".
     * @private
     */
    readLISTSubChunks_(subChunk, format) {
        // 'labl', 'note', 'ltxt', 'file'
        if (format == 'adtl') {
            if (["labl", "note"].indexOf(subChunk["chunkId"]) > -1) {
                this.LIST[this.LIST.length - 1]["subChunks"].push({
                    "chunkId": subChunk["chunkId"],
                    "chunkSize": subChunk["chunkSize"],
                    "dwName": byteData_.unpack(
                        subChunk["chunkData"].slice(0, 4),uInt32_),
                    "value": this.readZSTR_(subChunk["chunkData"].slice(4))
                });
            }
        // RIFF 'INFO' tags like ICRD, ISFT, ICMT
        // https://sno.phy.queensu.ca/~phil/exiftool/TagNames/RIFF.html#Info
        } else if(format == 'INFO') {
            this.LIST[this.LIST.length - 1]["subChunks"].push({
                "chunkId": subChunk["chunkId"],
                "chunkSize": subChunk["chunkSize"],
                "value": this.readZSTR_(subChunk["chunkData"].slice(0))
            });
        } //else {
        //    this.LIST[this.LIST.length - 1]["subChunks"].push({
        //        "chunkId": subChunk["chunkId"],
        //        "chunkSize": subChunk["chunkSize"],
        //        "value": subChunk["chunkData"]
        //    });
        //}
    }

    /**
     * Read the "junk" chunk of a wave file.
     * @param {!Array<Object>} chunks The wav file chunks.
     * @private
     */
    readJunkChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "junk");
        if (chunk) {
            this.junk = {
                "chunkId": chunk["chunkId"],
                "chunkSize": chunk["chunkSize"],
                "chunkData": chunk["chunkData"]
            };
        }
    }

    /**
     * Read bytes as a ZSTR string.
     * @param {!Array<number>|!Uint8Array} bytes The bytes.
     * @return {!string} The string.
     * @private
     */
    readZSTR_(bytes) {
        let str = "";
        for (let i=0; i<bytes.length; i++) {
            if (bytes[i] === 0) {
                break;
            }
            str += byteData_.unpack([bytes[i]], chr_);
        }
        return str;
    }

    /**
     * Read bytes as a string from a RIFF chunk.
     * @param {!Array<number>|!Uint8Array} bytes The bytes.
     * @param {!number} maxSize the max size of the string.
     * @return {!string} The string.
     * @private
     */
    readString_(bytes, maxSize) {
        let str = "";
        for (let i=0; i<maxSize; i++) {
            str += byteData_.unpack([bytes[this.head_]], chr_);
            this.head_++;
        }
        return str;
    }

    /**
     * Read a number from a chunk.
     * @param {!Array<number>|!Uint8Array} bytes The chunk bytes.
     * @param {!Object} bdType The type definition.
     * @return {number} The number.
     * @private
     */
    read_(bytes, bdType) {
        let size = bdType["bits"] / 8;
        let value = byteData_.unpack(
            bytes.slice(this.head_, this.head_ + size), bdType);
        this.head_ += size;
        return value;
    }

    /**
     * Write a variable size string as bytes. If the string is smaller
     * than the max size the output array is filled with 0s.
     * @param {!string} str The string to be written as bytes.
     * @param {!number} maxSize the max size of the string.
     * @return {!Array<number>} The bytes.
     * @private
     */
    writeString_(str, maxSize, push=true) {
        
        let bytes = byteData_.packArray(str, chr_);
        if (push) {
            for (let i=bytes.length; i<maxSize; i++) {
                bytes.push(0);
            }    
        }
        return bytes;
    }

    /**
     * Turn the samples to bytes.
     * @return {!Array<number>} The bytes.
     * @private
     */
    samplesToBytes_() {
        let bdType = {
            "be": this.container === "RIFX",
            "bits": this.fmt.bitsPerSample == 4 ? 8 : this.fmt.bitsPerSample,
            "float": this.fmt.audioFormat == 3 ? true : false
        };
        bdType["signed"] = bdType["bits"] == 8 ? false : true;
        let bytes = byteData_.packArray(this.data.samples, bdType);
        return bytes;
    }

    /**
     * Turn bytes to samples and load them in the data.samples property.
     * @param {!Array<number>|!Uint8Array} bytes The bytes.
     * @private
     */
    samplesFromBytes_(bytes) {
        let bdType = {
            "be": this.container === "RIFX",
            "bits": this.fmt.bitsPerSample == 4 ? 8 : this.fmt.bitsPerSample,
            "float": this.fmt.audioFormat == 3 ? true : false
        };
        bdType["signed"] = bdType["bits"] == 8 ? false : true;
        this.data.samples = byteData_.unpackArray(bytes, bdType);
    }

    /**
     * Return the bytes of the "bext" chunk.
     * @return {!Array<number>} The "bext" chunk bytes.
     * @private
     */
    getBextBytes_() {
        let bextBytes = [];
        if (this.bext.chunkId) {
            return bextBytes.concat(
                byteData_.pack(this.bext.chunkId, fourCC_),
                byteData_.pack(602 + this.bext.codingHistory.length, uInt32_),
                this.writeString_(this.bext.description, 256),
                this.writeString_(this.bext.originator, 32),
                this.writeString_(this.bext.originatorReference, 32),
                this.writeString_(this.bext.originationDate, 10),
                this.writeString_(this.bext.originationTime, 8),
                byteData_.pack(this.bext.timeReference[0], uInt32_),
                byteData_.pack(this.bext.timeReference[1], uInt32_),
                byteData_.pack(this.bext.version, uInt16_),
                this.writeString_(this.bext.UMID, 64),
                byteData_.pack(this.bext.loudnessValue, uInt16_),
                byteData_.pack(this.bext.loudnessRange, uInt16_),
                byteData_.pack(this.bext.maxTruePeakLevel, uInt16_),
                byteData_.pack(this.bext.maxMomentaryLoudness, uInt16_),
                byteData_.pack(this.bext.maxShortTermLoudness, uInt16_),
                this.writeString_(this.bext.reserved, 180),
                this.writeString_(
                    this.bext.codingHistory, this.bext.codingHistory.length));
        }
        return bextBytes;
    }

    /**
     * Return the bytes of the "ds64" chunk.
     * @return {!Array<number>} The "ds64" chunk bytes.
     * @private
     */
    getDs64Bytes_() {
        let ds64Bytes = [];
        if (this.ds64.chunkId) {
            ds64Bytes = ds64Bytes.concat(
                byteData_.pack(this.ds64.chunkId, fourCC_),
                byteData_.pack(this.ds64.chunkSize, uInt32_), // 
                byteData_.pack(this.ds64.riffSizeHigh, uInt32_),
                byteData_.pack(this.ds64.riffSizeLow, uInt32_),
                byteData_.pack(this.ds64.dataSizeHigh, uInt32_),
                byteData_.pack(this.ds64.dataSizeLow, uInt32_),
                byteData_.pack(this.ds64.originationTime, uInt32_),
                byteData_.pack(this.ds64.sampleCountHigh, uInt32_),
                byteData_.pack(this.ds64.sampleCountLow, uInt32_));          
        }
        //if (this.ds64.tableLength) {
        //    ds64Bytes = ds64Bytes.concat(
        //        byteData_.pack(this.ds64.tableLength, uInt32_),
        //        this.ds64.table);
        //}
        return ds64Bytes;
    }

    /**
     * Return the bytes of the "cue " chunk.
     * @return {!Array<number>} The "cue " chunk bytes.
     * @private
     */
    getCueBytes_() {
        let cueBytes = [];
        if (this.cue.chunkId) {
            let cuePointsBytes = this.getCuePointsBytes_();
            return cueBytes.concat(
                byteData_.pack(this.cue.chunkId, fourCC_),
                byteData_.pack(cuePointsBytes.length + 4, uInt32_),
                byteData_.pack(this.cue.dwCuePoints, uInt32_),
                cuePointsBytes);
        }
        return cueBytes;
    }

    /**
     * Return the bytes of the "cue " points.
     * @return {!Array<number>} The "cue " points as an array of bytes.
     * @private
     */
    getCuePointsBytes_() {
        let points = [];
        for (let i=0; i<this.cue.dwCuePoints; i++) {
            points = points.concat(
                byteData_.pack(this.cue.points[i]["dwName"], uInt32_),
                byteData_.pack(this.cue.points[i]["dwPosition"], uInt32_),
                byteData_.pack(this.cue.points[i]["fccChunk"], fourCC_),
                byteData_.pack(this.cue.points[i]["dwChunkStart"], uInt32_),
                byteData_.pack(this.cue.points[i]["dwBlockStart"], uInt32_),
                byteData_.pack(this.cue.points[i]["dwSampleOffset"], uInt32_));
        }
        return points;
    }

    /**
     * Return the bytes of the "fact" chunk.
     * @return {!Array<number>} The "fact" chunk bytes.
     * @private
     */
    getFactBytes_() {
        let factBytes = [];
        if (this.fact.chunkId) {
            return factBytes.concat(
                byteData_.pack(this.fact.chunkId, fourCC_),
                byteData_.pack(this.fact.chunkSize, uInt32_),
                byteData_.pack(this.fact.dwSampleLength, uInt32_));
        }
        return factBytes;
    }

    /**
     * Return the bytes of the "fmt " chunk.
     * @return {!Array<number>} The "fmt" chunk bytes.
     * @throws {Error} if no "fmt " chunk is present.
     * @private
     */
    getFmtBytes_() {
        if (this.fmt.chunkId) {
            return [].concat(
                byteData_.pack(this.fmt.chunkId, fourCC_),
                byteData_.pack(this.fmt.chunkSize, uInt32_),
                byteData_.pack(this.fmt.audioFormat, uInt16_),
                byteData_.pack(this.fmt.numChannels, uInt16_),
                byteData_.pack(this.fmt.sampleRate, uInt32_),
                byteData_.pack(this.fmt.byteRate, uInt32_),
                byteData_.pack(this.fmt.blockAlign, uInt16_),
                byteData_.pack(this.fmt.bitsPerSample, uInt16_),
                this.getFmtExtensionBytes_()
            );
        } else {
            throw Error("Could not find the 'fmt ' chunk");
        }
    }

    /**
     * Return the bytes of the fmt extension fields.
     * @return {!Array<number>} The fmt extension bytes.
     * @private
     */
    getFmtExtensionBytes_() {
        let extension = [];
        if (this.fmt.chunkSize > 16) {
            extension = extension.concat(
                byteData_.pack(this.fmt.cbSize, uInt16_));
        }
        if (this.fmt.chunkSize > 18) {
            extension = extension.concat(
                byteData_.pack(this.fmt.validBitsPerSample, uInt16_));
        }
        if (this.fmt.chunkSize > 20) {
            extension = extension.concat(
                byteData_.pack(this.fmt.dwChannelMask, uInt32_));
        }
        if (this.fmt.chunkSize > 24) {
            extension = extension.concat(
                byteData_.pack(this.fmt.subformat[0], uInt32_),
                byteData_.pack(this.fmt.subformat[1], uInt32_),
                byteData_.pack(this.fmt.subformat[2], uInt32_),
                byteData_.pack(this.fmt.subformat[3], uInt32_));
        }
        return extension;
    }

    /**
     * Return the bytes of the "LIST" chunk.
     * @return {!Array<number>} The "LIST" chunk bytes.
     * @export for tests
     */
    getLISTBytes_() {
        let bytes = [];
        for (let i=0; i<this.LIST.length; i++) {
            let subChunksBytes = this.getLISTSubChunksBytes_(
                    this.LIST[i]["subChunks"], this.LIST[i]["format"]);
            bytes = bytes.concat(
                byteData_.pack(this.LIST[i]["chunkId"], fourCC_),
                byteData_.pack(subChunksBytes.length + 4, uInt32_),
                byteData_.pack(this.LIST[i]["format"], fourCC_),
                subChunksBytes);
        }
        return bytes;
    }

    /**
     * Return the bytes of the sub chunks of a "LIST" chunk.
     * @param {!Array<Object>} subChunks The "LIST" sub chunks.
     * @param {!string} format The format of the "LIST" chunk: "adtl" or "INFO".
     * @return {!Array<number>} The sub chunk bytes.
     * @private
     */
    getLISTSubChunksBytes_(subChunks, format) {
        let bytes = [];
        for (let i=0; i<subChunks.length; i++) {
            if (format == "INFO") {
                bytes = bytes.concat(
                    byteData_.pack(subChunks[i]["chunkId"], fourCC_),
                    byteData_.pack(subChunks[i]["value"].length + 1, uInt32_),
                    this.writeString_(subChunks[i]["value"], subChunks[i]["value"].length));
                bytes.push(0);
            } else if (format == "adtl") {
                if (["labl", "note"].indexOf(subChunks[i]["chunkId"]) > -1) {
                    bytes = bytes.concat(
                        byteData_.pack(subChunks[i]["chunkId"], fourCC_),
                        byteData_.pack(subChunks[i]["value"].length + 4 + 1, uInt32_),
                        byteData_.pack(subChunks[i]["dwName"], uInt32_),
                        this.writeString_(subChunks[i]["value"], subChunks[i]["value"].length));
                    bytes.push(0);
                }
            } //else {
            //    bytes = bytes.concat(
            //        byteData_.pack(subChunks[i]["chunkData"].length, uInt32_),
            //        subChunks[i]["chunkData"]
            //    );
            //}
            if (bytes.length % 2) {
                bytes.push(0);
            }
        }
        return bytes;
    }

    /**
     * Return the bytes of the "junk" chunk.
     * @return {!Array<number>} The "junk" chunk bytes.
     * @private
     */
    getJunkBytes_() {
        let junkBytes = [];
        if (this.junk.chunkId) {
            return junkBytes.concat(
                byteData_.pack(this.junk.chunkId, fourCC_),
                byteData_.pack(this.junk.chunkData.length, uInt32_),
                this.junk.chunkData);
        }
        return junkBytes;
    }

    /**
     * Return "RIFF" if the container is "RF64", the current container name
     * otherwise. Used to enforce "RIFF" when RF64 is not allowed.
     * @return {!string}
     * @private
     */
    correctContainer_() {
        return this.container == "RF64" ? "RIFF" : this.container;
    }

    /**
     * Set the string code of the bit depth based on the "fmt " chunk.
     * @private
     */
    bitDepthFromFmt_() {
        if (this.fmt.audioFormat == 3 && this.fmt.bitsPerSample == 32) {
            this.bitDepth = "32f";
        } else if (this.fmt.audioFormat == 6) {
            this.bitDepth = "8a";
        } else if (this.fmt.audioFormat == 7) {
            this.bitDepth = "8m";
        } else {
            this.bitDepth = this.fmt.bitsPerSample.toString();
        }
    }

    /**
     * Return a .wav file byte buffer with the data from the WaveFile object.
     * The return value of this method can be written straight to disk.
     * @return {!Uint8Array} The wav file bytes.
     * @private
     */
    createWaveFile_() {
        let samplesBytes = this.samplesToBytes_();
        let fileBody = [].concat(
            byteData_.pack(this.format, fourCC_),
            this.getJunkBytes_(),
            this.getDs64Bytes_(),
            this.getBextBytes_(),
            this.getFmtBytes_(),
            this.getFactBytes_(),
            byteData_.pack(this.data.chunkId, fourCC_),
            byteData_.pack(samplesBytes.length, uInt32_),
            samplesBytes,
            this.getCueBytes_(),
            this.getLISTBytes_());
        return new Uint8Array([].concat(
            byteData_.pack(this.container, fourCC_),
            byteData_.pack(fileBody.length, uInt32_),
            fileBody));            
    }
}

module.exports = WaveFile;
