/*!
 * wavefile
 * Read & write wave files with 4, 8, 11, 12, 20, 16, 24, 32 & 64-bit data.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/** @private */
const WAVE_ERRORS = require("./src/wave-errors");
/** @private */
const bitDepth_ = require("bitdepth");
/** @private */
const riffChunks_ = require("riff-chunks");
/** @private */
const imaadpcm_ = require("imaadpcm");
/** @private */
const alawmulaw_ = require("alawmulaw");
/** @private */
const WaveFileReaderWriter = require("./src/wavefile-reader-writer");

/**
 * Class representing a wav file.
 * @extends WaveFileReaderWriter
 */
class WaveFile extends WaveFileReaderWriter {

    /**
     * @param {Uint8Array|Array<number>} bytes A wave file buffer.
     */
    constructor(bytes) {
        super();
        if(bytes) {
            this.fromBuffer(bytes);
        }
    }

    /**
     * Create a WaveFile object based on the arguments passed.
     * @param {number} numChannels The number of channels
     *     (Integer numbers: 1 for mono, 2 stereo and so on).
     * @param {number} sampleRate The sample rate.
     *     Integer numbers like 8000, 44100, 48000, 96000, 192000.
     * @param {string} bitDepth The audio bit depth.
     *     One of "8", "16", "24", "32", "32f", "64".
     * @param {Array<number>} samples Array of samples to be written.
     *     The samples must be in the correct range according to the
     *     bit depth.
     */
    fromScratch(numChannels, sampleRate, bitDepth, samples, options={}) {
        if (!options.container) {
            options.container = "RIFF";
        }
        // closest nuber of bytes if not / 8
        let numBytes = (((parseInt(bitDepth, 10) - 1) | 7) + 1) / 8;
        // Clear the fact chunk
        this.clearFactChunk_();
        // Normal PCM file header
        this.chunkSize = 36 + samples.length * numBytes;
        this.fmtChunkSize = 16;
        this.byteRate = (numChannels * numBytes) * sampleRate;
        this.blockAlign = numChannels * numBytes;
        this.chunkId = options.container;
        this.format = "WAVE";
        this.fmtChunkId = "fmt ";
        this.audioFormat = this.headerFormats_[bitDepth] ? this.headerFormats_[bitDepth] : 65534;
        this.numChannels = numChannels;
        this.sampleRate = sampleRate;
        this.bitsPerSample = parseInt(bitDepth, 10);
        this.dataChunkId = "data";
        this.dataChunkSize = samples.length * numBytes;
        this.samples = samples;
        this.bitDepth = bitDepth;
        // IMA ADPCM header
        if (bitDepth == "4") {
            this.chunkSize = 44 + samples.length;
            this.fmtChunkSize = 20;
            this.byteRate = 4055;
            this.blockAlign = 256;
            this.bitsPerSample = 4;
            this.dataChunkSize = samples.length;
            this.cbSize = 2;
            this.validBitsPerSample = 505;
            this.factChunkId = "fact";
            this.factChunkSize = 4;
            this.dwSampleLength = samples.length * 2;
        }
        // A-Law and mu-Law header
        if (bitDepth == "8a" || bitDepth == "8m") {
            this.chunkSize = 44 + samples.length;
            this.fmtChunkSize = 20;
            this.cbSize = 2;
            this.validBitsPerSample = 8;
            this.factChunkId = "fact";
            this.factChunkSize = 4;
            this.dwSampleLength = samples.length;
        }
        // WAVE_FORMAT_EXTENSIBLE
        if (parseInt(bitDepth, 10) > 8 && (parseInt(bitDepth, 10) % 8)) {
            this.chunkSize = 36 + 24 + samples.length * numBytes;
            this.fmtChunkSize = 40;
            this.bitsPerSample = (((parseInt(bitDepth, 10) - 1) | 7) + 1);
            this.cbSize = 22;
            this.validBitsPerSample = parseInt(bitDepth, 10);
            this.dwChannelMask = 0;
            // subformat 128-bit GUID as 4 32-bit values
            // only supports uncompressed integer PCM samples
            this.subformat1 = 1;
            this.subformat2 = 1048576;
            this.subformat3 = 2852126848;
            this.subformat4 = 1905997824;
        }
    }

    /**
     * Init a WaveFile object from a byte buffer.
     * @param {Uint8Array|Array<number>} bytes The buffer.
     */
    fromBuffer(bytes) {
        this.readRIFFChunk_(bytes);
        let bigEndian = this.chunkId == "RIFX";
        let chunk = riffChunks_.read(bytes, bigEndian);
        this.readFmtChunk_(chunk.subChunks);
        this.readFactChunk_(chunk.subChunks);
        this.readBextChunk_(chunk.subChunks);
        this.readCueChunk_(chunk.subChunks);
        this.readDataChunk_(
                chunk.subChunks,
                {"be": bigEndian, "single": true}
            );
        if (this.audioFormat == 3 && this.bitsPerSample == 32) {
            this.bitDepth = "32f";
        }else {
            this.bitDepth = this.bitsPerSample.toString();
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
     * Turn the file to RIFF.
     */
    toRIFF() {
        this.chunkId = "RIFF";
        this.LEorBE_();
    }

    /**
     * Turn the file to RIFX.
     */
    toRIFX() {
        this.chunkId = "RIFX";
        this.LEorBE_();
    }

    /**
     * Change the bit depth of the samples.
     * @param {string} bitDepth The new bit depth of the samples.
     *      One of "8", "16", "24", "32", "32f", "64"
     */
    toBitDepth(bitDepth) {
        let toBitDepth = bitDepth;
        if (toBitDepth != "32f" && toBitDepth != "64") {
            toBitDepth = (((parseInt(toBitDepth, 10) - 1) | 7) + 1)
                .toString();
        }
        let thisBitDepth = this.bitDepth;
        if (thisBitDepth != "32f" && thisBitDepth != "64") {
            thisBitDepth = (((parseInt(thisBitDepth, 10) - 1) | 7) + 1)
                .toString();
        }
        bitDepth_.toBitDepth(this.samples, thisBitDepth, toBitDepth);
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            bitDepth,
            this.samples,
            {"container": this.chunkId}
        );
    }

    /**
     * Interleave multi-channel samples.
     */
    interleave() {
        let finalSamples = [];
        let i;
        let j;
        let numChannels = this.samples[0].length;
        for (i = 0; i < numChannels; i++) {
            for (j = 0; j < this.samples.length; j++) {
                finalSamples.push(this.samples[j][i]);
            }
        }
        this.samples = finalSamples;
    }

    /**
     * De-interleave samples into multiple channels.
     */
    deInterleave() {
        let finalSamples = [];
        let i;
        for (i = 0; i < this.numChannels; i++) {
            finalSamples[i] = [];
        }
        i = 0;
        let j;
        while (i < this.samples.length) {
            for (j = 0; j < this.numChannels; j++) {
                finalSamples[j].push(this.samples[i+j]);
            }
            i += j;
        }
        this.samples = finalSamples;
    }

    /**
     * Encode a 16-bit wave file as 4-bit IMA ADPCM.
     */
    toIMAADPCM() {
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            "4",
            imaadpcm_.encode(this.samples),
            {"container": this.chunkId}
        );
    }

    /**
     * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
     */
    fromIMAADPCM() {
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            "16",
            imaadpcm_.decode(this.samples, this.blockAlign),
            {"container": this.chunkId}
        );
    }

    /**
     * Encode 16-bit wave file as 8-bit A-Law.
     */
    toALaw() {
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            "8a",
            alawmulaw_.alaw.encode(this.samples),
            {"container": this.chunkId}
        );
    }

    /**
     * Decode a 8-bit A-Law wave file into a 16-bit wave file.
     */
    fromALaw() {
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            "16",
            alawmulaw_.alaw.decode(this.samples),
            {"container": this.chunkId}
        );
    }

    /**
     * Encode 16-bit wave file as 8-bit mu-Law.
     */
    toMuLaw() {
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            "8m",
            alawmulaw_.mulaw.encode(this.samples),
            {"container": this.chunkId}
        );
    }

    /**
     * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
     */
    fromMuLaw() {
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            "16",
            alawmulaw_.mulaw.decode(this.samples),
            {"container": this.chunkId}
        );
    }

    /**
     * Validate the input for wav writing.
     * @throws {Error} If any argument does not meet the criteria.
     * @private
     */
    checkWriteInput_() {
        this.validateBitDepth_();
        this.validateNumChannels_();
        this.validateSampleRate_();
    }

    /**
     * Validate the bit depth.
     * @throws {Error} If any argument does not meet the criteria.
     * @private
     */
    validateBitDepth_() {
        if (!this.headerFormats_[this.bitDepth]) {
            if (parseInt(this.bitDepth, 10) > 8 &&
                    parseInt(this.bitDepth, 10) < 32) {
                return true;
            }
            throw new Error(WAVE_ERRORS.bitDepth);
        }
        return true;
    }

    /**
     * Validate the sample rate value.
     * @throws {Error} If any argument does not meet the criteria.
     * @private
     */
    validateNumChannels_() {
        let blockAlign = this.numChannels * this.bitsPerSample / 8;
        if (this.numChannels < 1 || blockAlign > 65535) {
            throw new Error(WAVE_ERRORS.numChannels);
        }
        return true;
    }

    /**
     * Validate the sample rate value.
     * @throws {Error} If any argument does not meet the criteria.
     * @private
     */
    validateSampleRate_() {
        let byteRate = this.numChannels *
            (this.bitsPerSample / 8) * this.sampleRate;
        if (this.sampleRate < 1 || byteRate > 4294967295) {
            throw new Error(WAVE_ERRORS.sampleRate);
        }
        return true;
    }

    /**
     * Reset the attributes related to the "fact" chunk.
     */
    clearFactChunk_() {
        this.cbSize = 0;
        this.validBitsPerSample = 0;
        this.factChunkId = "";
        this.factChunkSize = 0;
        this.factChunkData = [];
        this.dwSampleLength = 0;
    }
}

module.exports = WaveFile;
