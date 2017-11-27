/*
 * WaveFileHeader class
 * A structure representing a WAVE file header.
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

/**
 * Wave file headers.
 */
module.exports.WaveFileHeader = class {

    constructor() {
        /**
         * "RIFF"
         * @type {string}
         */
        this.chunkId = "";
        /** @type {number} */
        this.chunkSize = 0;
        /**
         * "WAVE"
         * @type {string}
         */
        this.subChunk1Id = "";
        /**
         * "fmt "
         * @type {string}
         */
        this.format = "";
        /** @type {number} */
        this.subChunk1Size = 0;
        /** @type {number} */
        this.audioFormat = 0;
        /** @type {number} */
        this.numChannels = 0;
        /** @type {number} */
        this.sampleRate = 0;
        /** @type {number} */
        this.byteRate = 0;
        /** @type {number} */
        this.blockAlign = 0;
        /** @type {number} */
        this.bitsPerSample = 0;

        /** @type {number} */
        this.cbSize = 0;

        /** @type {string} */
        this.factChunkId = "";
        /**
         * minimum 4
         * @type {number}
         */
        this.factChunkSize = 4;
        /** @type {number} */
        this.dwSampleLength = 0;
        /**
         * "data"
         * @type {string}
         */
        this.subChunk2Id = "";
        /** @type {number} */
        this.subChunk2Size = 0;
        /**
         * "bext"
         * @type {string}
         */
        this.bextChunkId = "";
        this.bextChunkSize = 0;
        this.bextChunkData = [];
    }
}
