/*
 * WaveFileHeader
 * Class representing a wav file header.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/**
 * Class representing a wav file header.
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
        /**
         * The audio format.
         *  - 00001: PCM
         *  - 00003: IEEE Floating Point
         *  - 00006: A-Law
         *  - 00007: mu-Law
         *  - 00017: IMA-ADPCM
         *  - 65534: WAVE_FORMAT_EXTENSIBLE
         * @type {number}
         */
        this.audioFormat = 0;
        /** 
         * The number of channels. 1 for mono, 2 for stereo
         * @type {number}
         */
        this.numChannels = 0;
        /**
         * The sample rate in Herz.
         * Values like 8000, 44100, 96000 and so on.
         * @type {number}
         */
        this.sampleRate = 0;
        /**
         * The byte rate. For non-compressed samples it is always:
         * (nummber of channels * number of bytes used by each sample) * sample rate
         * @type {number}
         */
        this.byteRate = 0;
        /**
         * The block align. For non-compressed samples it is always:
         * nummber of channels * number of bytes used by each sample
         * @type {number}
         */
        this.blockAlign = 0;
        /** @type {number} */
        this.bitsPerSample = 0;

        /**
         * The size of the extension of the "fmt " chunk.
         * @type {number}
         */
        this.cbSize = 0;
        /** @type {number} */
        this.validBitsPerSample = 0;
        /** @type {number} */
        this.dwChannelMask = 0;
        /** 
         * First value of the subformat.
         * Subformat is a 128-bit GUID split into 4 32-bit values.
         * @type {number}
         */
        this.subformat1 = 0;
        /** @type {number} */
        this.subformat2 = 0;
        /** @type {number} */
        this.subformat3 = 0;
        /** @type {number} */
        this.subformat4 = 0;

        /**
         * "fact" 
         * @type {string} 
         */
        this.factChunkId = "";
        /** @type {number} */
        this.factChunkSize = 0;
        /** @type {number} */
        this.dwSampleLength = 0;

        /**
         * "cue "
         * @type {string}
         */
        this.cueChunkId = "";
        /** @type {number} */
        this.cueChunkSize = -1;
        /**
         * The raw bytes of the "cue " chunk.
         * @type {Array<number>}
         * @private
         */
        this.cueChunkData_ = [];

        /**
         * "bext"
         * @type {string}
         */
        this.bextChunkId = "";
        /** @type {number} */
        this.bextChunkSize = 0;
        /**
         * The data of the "bext" chunk.
         * @type {Object}
         */
        this.bextChunkFields = {
            "description": "", //256
            "originator": "", //32
            "originatorReference": "", //32
            "originationDate": "", //10
            "originationTime": "", //8
            "timeReference": [], //64-bit value kept as bytes
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

        /**
         * "data"
         * @type {string}
         */
        this.dataChunkId = "";
        /** @type {number} */
        this.dataChunkSize = 0;

        /**
         * The raw bytes of the "bext" chunk.
         * @type {Array<number>}
         * @private
         */
        this.bextChunkData_ = [];
    }
}

module.exports = WaveFileHeader;
