/*!
 * wavefile
 * Read & write wave files with 8, 16, 24, 32 PCM, 32 IEEE & 64-bit data.
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
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
     * @param {Uint8Array} bytes The file bytes.
     * @param {Uint8Array} buffer A wave file buffer.
     * @param {boolean} enforceFact True if it should throw a error
     *      if no "fact" chunk is found.
     * @param {boolean} enforceBext True if it should throw a error
     *      if no "bext" chunk is found.
     */
    constructor(buffer, enforceFact=false, enforceBext=false) {
        super(enforceFact, enforceBext);
        if(buffer) {
            this.fromBuffer(buffer);
        }
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

