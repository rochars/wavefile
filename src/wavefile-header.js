/*
 * WaveFileHeader class
 * A structure representing a WAVE file header.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/**
 * Wave file headers.
 */
class WaveFileHeader {

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
        this.format = "";
        /**
         * "fmt "
         * @type {string}
         */
        this.fmtChunkId = "";
        /** @type {number} */
        this.fmtChunkSize = 0;
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

        /** @type {number} */
        this.validBitsPerSample = 0;

        /**
         * "fact" 
         * @type {string} 
         */
        this.factChunkId = "";
        /** @type {number} */
        this.factChunkSize = 0;
        /** @type {!Array<number>} */
        this.factChunkData = [];
        /** @type {number} */
        this.dwSampleLength = 0;

        /**
         * "cue "
         * @type {string}
         */
        this.cueChunkId = "";
        /** @type {number} */
        this.cueChunkSize = -1;
        /** @type {!Array<number>} */
        this.cueChunkData = [];

        /**
         * "data"
         * @type {string}
         */
        this.dataChunkId = "";
        /** @type {number} */
        this.dataChunkSize = 0;
        /**
         * "bext"
         * @type {string}
         */
        this.bextChunkId = "";
        /** @type {number} */
        this.bextChunkSize = 0;
        /** @type {!Array<number>} */
        this.bextChunkData = [];
        /** @type {Object} */
        this.bextChunkFields = {
            "description": "", //256
            "originator": "", //32
            "originatorReference": "", //32
            "originationDate": "", //10
            "originationTime": "", //8
            "timeReference": "", //64-bit value
            "version": "", //WORD
            "UMID": "", // 64
            "loudnessValue": "", //WORD
            "loudnessRange": "", //WORD
            "maxTruePeakLevel": "", //WORD
            "maxMomentaryLoudness": "", //WORD
            "maxShortTermLoudness": "", //WORD
            "reserved": "", //180
            "codingHistory": "" // string, unlimited
        };
    }
}

module.exports = WaveFileHeader;
