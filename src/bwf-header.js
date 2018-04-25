/*
 * BWFHeader class
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

const WaveFileHeader = require("../src/wavefile-header");

/**
 * Wave file headers.
 */
class BWFHeader extends WaveFileHeader {

    constructor() {
        super();
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

module.exports = BWFHeader;
