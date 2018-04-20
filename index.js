/*!
 * wavefile
 * Read & write wave files with 4, 8, 16, 24, 32 & 64-bit data.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = require("byte-data");
const uInt8 = byteData.uInt8;
const bitDepthLib = require("bitdepth");
const WaveErrors = require("./src/wave-errors");
const WaveFileReaderWriter = require("./src/wavefile-reader-writer");
const riffChunks = require("riff-chunks");
const adpcm = require("imaadpcm");
const alaw = require("alaw");
const mulaw = require("mulaw-js");

/**
 * WaveFile
 */
class WaveFile extends WaveFileReaderWriter {

    /**
     * @param {Uint8Array} bytes A wave file buffer.
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
        this.cbSize = 0;
        this.validBitsPerSample = 0;
        this.factChunkId = "";
        this.factChunkSize = 0;
        this.factChunkData = [];
        this.dwSampleLength = 0;
        if (!options.container) {
            options.container = "RIFF";
        }
        let bytes = parseInt(bitDepth, 10) / 8;
        this.chunkSize = 36 + samples.length * bytes;
        this.fmtChunkSize = 16;
        this.byteRate = (numChannels * bytes) * sampleRate;
        this.blockAlign = numChannels * bytes;
        this.chunkId = options.container;
        this.format = "WAVE";
        this.fmtChunkId = "fmt ";
        this.audioFormat = this.headerFormats_[bitDepth];
        this.numChannels = numChannels;
        this.sampleRate = sampleRate;
        this.bitsPerSample = parseInt(bitDepth, 10);
        this.dataChunkId = "data";
        this.dataChunkSize = samples.length * bytes;
        this.samples = samples;
        this.bitDepth = bitDepth;
        // adpcm
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
        // a-law
        if (bitDepth == "8a") {
            this.chunkSize = 44 + samples.length;
            this.fmtChunkSize = 20;
            this.cbSize = 2;
            this.validBitsPerSample = 8;
            this.factChunkId = "fact";
            this.factChunkSize = 4;
            this.dwSampleLength = samples.length;
        }
        // mu-law
        if (bitDepth == "8m") {
            this.chunkSize = 44 + samples.length;
            this.fmtChunkSize = 20;
            this.cbSize = 2;
            this.validBitsPerSample = 8;
            this.factChunkId = "fact";
            this.factChunkSize = 4;
            this.dwSampleLength = samples.length;
        }
    }

    /**
     * Init a WaveFile object from a byte buffer.
     * @param {Uint8Array} bytes The buffer.
     */
    fromBuffer(bytes) {
        this.readRIFFChunk_(bytes);
        let bigEndian = this.chunkId == "RIFX";
        let chunk = riffChunks.read(bytes, bigEndian);
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
     * All values will be little-endian when writing.
     */
    toRIFF() {
        this.chunkId = "RIFF";
        this.LEorBE();
    }

    /**
     * Turn the file to RIFX.
     * All values but FourCCs will be big-endian when writing.
     */
    toRIFX() {
        this.chunkId = "RIFX";
        this.LEorBE();
    }

    /**
     * Change the bit depth of the data.
     * @param {string} bitDepth The new bit depth of the data.
     *      One of "8", "16", "24", "32", "32f", "64"
     */
    toBitDepth(bitDepth) {
        bitDepthLib.toBitDepth(this.samples, this.bitDepth, bitDepth);
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            bitDepth,
            byteData.unpackArray(this.samples, uInt8),
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
            adpcm.encode(this.samples),
            {"container": this.chunkId}
        );
    }

    /**
     * Decode a IMA ADPCM wave file as a 16-bit wave file.
     */
    fromIMAADPCM(blockAlign=256) {
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            "16",
            adpcm.decode(this.samples, blockAlign),
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
            alaw.encode(this.samples),
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
            alaw.decode(this.samples),
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
            mulaw.encode(this.samples),
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
            mulaw.decode(this.samples),
            {"container": this.chunkId}
        );
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
        if (!this.headerFormats_[this.bitDepth]) {
            throw new Error(WaveErrors.bitDepth);
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
            throw new Error(WaveErrors.numChannels);
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
            throw new Error(WaveErrors.sampleRate);
        }
        return true;
    }
}

module.exports = WaveFile;
