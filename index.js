/*!
 * wavefile
 * Read & write wave files with 8, 16, 24, 32 PCM, 32 IEEE & 64-bit data.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

const bitDepthLib = require("bitdepth");
const waveFileReaderWriter = require("./src/wavefile-reader-writer");

/**
 * WaveFile
 */
class WaveFile extends waveFileReaderWriter.WaveFileReaderWriter {

    /**
     * @param {Uint8Array} bytes A wave file buffer.
     * @param {boolean} enforceFact True if it should throw a error
     *      if no "fact" chunk is found.
     * @param {boolean} enforceBext True if it should throw a error
     *      if no "bext" chunk is found.
     */
    constructor(bytes, enforceFact=false, enforceBext=false) {
        super(enforceFact, enforceBext);
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
        this.samples_ = samples;
        this.bitDepth_ = bitDepth;
    }
    
    /**
     * Turn the file to RIFF.
     * All values will be little-endian when writing.
     */
    toRIFF() {
        this.chunkId = "RIFF";
    }

    /**
     * Turn the file to RIFX.
     * All values but FourCCs will be big-endian when writing.
     */
    toRIFX() {
        this.chunkId = "RIFX";
    }

    /**
     * Change the bit depth of the data.
     * @param {string} bitDepth The new bit depth of the data.
     *      One of "8", "16", "24", "32", "32f", "64"
     */
    toBitDepth(bitDepth) {
        bitDepthLib.toBitDepth(this.samples_, this.bitDepth_, bitDepth);
        this.fromScratch(
            this.numChannels,
            this.sampleRate,
            bitDepth,
            this.samples_,
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
        let numChannels = this.samples_[0].length;
        for (i = 0; i < numChannels; i++) {
            for (j = 0; j < this.samples_.length; j++) {
                finalSamples.push(this.samples_[j][i]);
            }
        }
        this.samples_ = finalSamples;
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
        while (i < this.samples_.length) {
            for (j = 0; j < this.numChannels; j++) {
                finalSamples[j].push(this.samples_[i+j]);
            }
            i += j;
        }
        this.samples_ = finalSamples;
    }
}

module.exports.WaveFile = WaveFile;

