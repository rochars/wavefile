/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
 * WAVE_ERRORS
 * Error messages.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/**
 * Error messages.
 * @enum {string}
 */
module.exports =  {
    "format": "Not a supported format.",
    "wave": "Could not find the 'WAVE' format identifier",
    "fmt ": "Could not find the 'fmt ' chunk",
    "data": "Could not find the 'data' chunk",
    "fact": "Could not find the 'fact' chunk",
    "bitDepth": "Invalid bit depth.",
    "numChannels": "Invalid number of channels.",
    "sampleRate": "Invalid sample rate."
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * byte-data
 * Pack and unpack binary data.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 *
 */

/** @private */
const rw = __webpack_require__(6);
const Type = __webpack_require__(2);

/**
 * Turn a number or fixed-length string into a byte buffer.
 * @param {number|string} value The value.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the output. Optional. Default is 10.
 *      Possible values are 2, 10 or 16.
 * @return {!Array<number>|!Array<string>}
 */
function pack(value, type, base=10) {
    let values = [];
    if (type.char) {
        values = type.char ? value.slice(0, type.offset) : value;
    } else if (!Array.isArray(value)) {
        values = [value];
    }
    return rw.toBytes(values, rw.getType(type, base));
}

/**
 * Turn a byte buffer into a number or a fixed-length string.
 * @param {!Array<number>|!Array<string>|Uint8Array} buffer An array of bytes.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the input. Optional. Default is 10.
 *      Possible values are 2, 10 or 16.
 * @return {number|string}
 */
function unpack(buffer, type, base=10) {
    let values = rw.fromBytes(
            buffer.slice(0, type.offset),
            rw.getType(type, base)
        );
    if (type.char) {
        values = values.slice(0, type.bits / 8);
    } else {
        values = values[0];
    }
    return values;
}

/**
 * Turn a array of numbers or a string into a byte buffer.
 * @param {!Array<number>|string} values The values.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the output. Optional. Default is 10.
 *      Possible values are 2, 10 or 16.
 * @return {!Array<number>|!Array<string>}
 */
function packArray(values, type, base=10) {
    return rw.toBytes(values, rw.getType(type, base));
}

/**
 * Turn a byte buffer into a array of numbers or a string.
 * @param {!Array<number>|!Array<string>|Uint8Array} buffer The byte array.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the input. Optional. Default is 10.
 *      Possible values are 2, 10 or 16.
 * @return {!Array<number>|string}
 */
function unpackArray(buffer, type, base=10) {
    return rw.fromBytes(buffer, rw.getType(type, base));
}

/**
 * Find and return the start index of some string.
 * Return -1 if the string is not found.
 * @param {!Array<number>|Uint8Array} buffer A byte buffer.
 * @param {string} text Some string to look for.
 * @return {number} The start index of the first occurrence, -1 if not found
 */
function findString(buffer, text) {
    let found = "";
    for (let i = 0; i < buffer.length; i++) {
        found = unpack(
                buffer.slice(i, i + text.length + 1),
                new Type({"bits": text.length * 8, "char": true})
            );
        if (found == text) {
            return i;
        }
    }
    return -1;
}

/**
 * Turn a struct into a byte buffer.
 * A struct is an array of values of not necessarily the same type.
 * @param {Array<number|string>} struct The struct values.
 * @param {!Array<Object>} def The struct type definition.
 * @param {number} base The base of the output. Optional. Default is 10.
 *      Possible values are 2, 10 or 16.
 * @return {!Array<number>|!Array<string>}
 */
function packStruct(struct, def, base=10) {
    if (struct.length < def.length) {
        return [];
    }
    let bytes = [];
    for (let i = 0; i < def.length; i++) {
        bytes = bytes.concat(pack(struct[i], def[i], base));
    }
    return bytes;
}

/**
 * Turn a byte buffer into a struct.
 * A struct is an array of values of not necessarily the same type.
 * @param {!Array<number>|!Array<string>|Uint8Array} buffer The byte buffer.
 * @param {!Array<Object>} def The struct type definition.
 * @param {number} base The base of the input. Optional. Default is 10.
 *      Possible values are 2, 10 or 16.
 * @return {Array<number|string>}
 */
function unpackStruct(buffer, def, base=10) {
    if (buffer.length < getStructDefSize(def)) {
        return [];
    }
    let struct = [];
    let i = 0;
    let j = 0;
    while (i < def.length) {
        struct = struct.concat(
                unpack(buffer.slice(j, j + def[i].offset), def[i], base)
            );
        j += def[i].offset;
        i++;
    }
    return struct;
}

/**
 * Get the length in bytes of a struct definition.
 * @param {!Array<Object>} def The struct type definition.
 * @return {number} The length of the structure in bytes.
 * @private
 */
function getStructDefSize(def) {
    let bits = 0;
    for (let i = 0; i < def.length; i++) {
        bits += def[i].offset;
    }
    return bits;
}

// interface
module.exports.pack = pack;
module.exports.unpack = unpack;
module.exports.packArray = packArray;
module.exports.unpackArray = unpackArray;
module.exports.unpackStruct = unpackStruct;
module.exports.packStruct = packStruct;
module.exports.findString = findString;
module.exports.Type = Type;
/** 
 * A char.
 * @type {Object}
 */
module.exports.chr = new Type({"bits": 8, "char": true});
/**
 * A 4-char string
 * @type {Object}
 */
module.exports.fourCC = new Type({"bits": 32, "char": true});
/**
 * Booleans
 * @type {Object}
 */
module.exports.bool = new Type({"bits": 1});
/**
 * Signed 2-bit integers
 * @type {Object}
 */
module.exports.int2 = new Type({"bits": 2, "signed": true});
/**
 * Unsigned 2-bit integers
 * @type {Object}
 */
module.exports.uInt2 = new Type({"bits": 2});
/**
 * Signed 4-bit integers
 * @type {Object}
 */
module.exports.int4 = new Type({"bits": 4, "signed": true});
/**
 * Unsigned 4-bit integers
 * @type {Object}
 */
module.exports.uInt4 = new Type({"bits": 4});
/**
 * Signed 8-bit integers
 * @type {Object}
 */
module.exports.int8 = new Type({"bits": 8, "signed": true});
/**
 * Unsigned 4-bit integers
 * @type {Object}
 */
module.exports.uInt8 = new Type({"bits": 8});
// LE
/**
 * Signed 16-bit integers little-endian
 * @type {Object}
 */
module.exports.int16  = new Type({"bits": 16, "signed": true});
/**
 * Unsigned 16-bit integers little-endian
 * @type {Object}
 */
module.exports.uInt16 = new Type({"bits": 16});
/**
 * Half-precision floating-point numbers little-endian
 * @type {Object}
 */
module.exports.float16 = new Type({"bits": 16, "float": true});
/**
 * Signed 24-bit integers little-endian
 * @type {Object}
 */
module.exports.int24 = new Type({"bits": 24, "signed": true});
/**
 * Unsigned 24-bit integers little-endian
 * @type {Object}
 */
module.exports.uInt24 = new Type({"bits": 24});
/**
 * Signed 32-bit integers little-endian
 * @type {Object}
 */
module.exports.int32 = new Type({"bits": 32, "signed": true});
/**
 * Unsigned 32-bit integers little-endian
 * @type {Object}
 */
module.exports.uInt32 = new Type({"bits": 32});
/**
 * Single-precision floating-point numbers little-endian
 * @type {Object}
 */
module.exports.float32 = new Type({"bits": 32, "float": true});
/**
 * Signed 40-bit integers little-endian
 * @type {Object}
 */
module.exports.int40 = new Type({"bits": 40, "signed": true});
/**
 * Unsigned 40-bit integers little-endian
 * @type {Object}
 */
module.exports.uInt40 = new Type({"bits": 40});
/**
 * Signed 48-bit integers little-endian
 * @type {Object}
 */
module.exports.int48 = new Type({"bits": 48, "signed": true});
/**
 * Unsigned 48-bit integers little-endian
 * @type {Object}
 */
module.exports.uInt48 = new Type({"bits": 48});
/**
 * Double-precision floating-point numbers little-endian
 * @type {Object}
 */
module.exports.float64 = new Type({"bits": 64, "float": true});
// BE
/**
 * Signed 16-bit integers big-endian
 * @type {Object}
 */
module.exports.int16BE  = new Type({"bits": 16, "signed": true, "be": true});
/**
 * Unsigned 16-bit integers big-endian
 * @type {Object}
 */
module.exports.uInt16BE = new Type({"bits": 16, "be": true});
/**
 * Half-precision floating-point numbers big-endian
 * @type {Object}
 */
module.exports.float16BE = new Type({"bits": 16, "float": true, "be": true});
/**
 * Signed 24-bit integers big-endian
 * @type {Object}
 */
module.exports.int24BE = new Type({"bits": 24, "signed": true, "be": true});
/**
 * Unsigned 24-bit integers big-endian
 * @type {Object}
 */
module.exports.uInt24BE = new Type({"bits": 24, "be": true});
/**
 * Signed 32-bit integers big-endian
 * @type {Object}
 */
module.exports.int32BE = new Type({"bits": 32, "signed": true, "be": true});
/**
 * Unsigned 32-bit integers big-endian
 * @type {Object}
 */
module.exports.uInt32BE = new Type({"bits": 32, "be": true});
/**
 * Single-precision floating-point numbers big-endian
 * @type {Object}
 */
module.exports.float32BE = new Type({"bits": 32, "float": true, "be": true});
/**
 * Signed 40-bit integers big-endian
 * @type {Object}
 */
module.exports.int40BE = new Type({"bits": 40, "signed": true, "be": true});
/**
 * Unsigned 40-bit integers big-endian
 * @type {Object}
 */
module.exports.uInt40BE = new Type({"bits": 40, "be": true});
/**
 * Signed 48-bit integers big-endian
 * @type {Object}
 */
module.exports.int48BE = new Type({"bits": 48, "signed": true, "be": true});
/**
 * Unsigned 48-bit integers big-endian
 * @type {Object}
 */
module.exports.uInt48BE = new Type({"bits": 48, "be": true});
/**
 * Double-precision floating-point numbers big-endian
 * @type {Object}
 */
module.exports.float64BE = new Type({"bits": 64, "float": true, "be": true});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * type: The Type class.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

/** @private */
let f32 = new Float32Array(1);
/** @private */
let i32 = new Int32Array(f32.buffer);
/** @private */
let f64 = new Float64Array(1);
/** @private */
let ui32 = new Uint32Array(f64.buffer);
let GenericInteger = __webpack_require__(7);

/**
 * A class to represent byte-data types.
 */
class Type extends GenericInteger {

    /**
     * @param {Object} options The type definition.
     * @param {number} options.bits Number of bits used by data of this type.
     * @param {boolean} options.char True for string/char types.
     * @param {boolean} options.float True for float types.
     *    Available only for 16, 32 and 64-bit data.
     * @param {boolean} options.base The base: 2, 10 or 16.
     * @param {boolean} options.be True for big-endian.
     * @param {boolean} options.signed True for signed types.
     */
    constructor(options) {
        super(options);
        /**
         * If this type is a char or not.
         * @type {boolean}
         */
        this.char = options["char"];
        /**
         * If this type is a floating-point number or not.
         * @type {boolean}
         */
        this.float = options["float"];
        /**
         * The base used to represent data of this type.
         * Default is 10.
         * @type {number}
         */
        this.base = options["base"] ? options["base"] : 10;
        this.buildType_();
    }

    /**
     * Read 1 16-bit float from from bytes.
     * Thanks https://stackoverflow.com/a/8796597
     * @param {!Array<number>|Uint8Array} bytes An array of bytes.
     * @param {number} i The index to read.
     * @return {number}
     * @private
     */
    read16F_(bytes, i) {
        let int = this.read(bytes, i, {"bits": 16, "offset": 2});
        let exponent = (int & 0x7C00) >> 10;
        let fraction = int & 0x03FF;
        let floatValue;
        if (exponent) {
            floatValue =  Math.pow(2, exponent - 15) * (1 + fraction / 0x400);
        } else {
            floatValue = 6.103515625e-5 * (fraction / 0x400);
        }
        return  floatValue * (int >> 15 ? -1 : 1);
    }

    /**
     * Read 1 32-bit float from bytes.
     * @param {!Array<number>|Uint8Array} bytes An array of bytes.
     * @param {number} i The index to read.
     * @return {number}
     * @private
     */
    read32F_(bytes, i) {
        i32[0] = this.read(bytes, i, {"bits": 32, "offset": 4});
        return f32[0];
    }

    /**
     * Read 1 64-bit double from bytes.
     * Thanks https://gist.github.com/kg/2192799
     * @param {!Array<number>|Uint8Array} bytes An array of bytes.
     * @param {number} i The index to read.
     * @return {number}
     * @private
     */
    read64F_(bytes, i) {
        let type32 = new Type({"bits": 32, "offset": 4});
        ui32[0] = type32.read(bytes, i, {"bits": 32, "offset": 4});
        ui32[1] = type32.read(bytes, i + 4, {"bits": 32, "offset": 4});
        return f64[0];
    }

    /**
     * Read 1 char from bytes.
     * @param {!Array<number>|Uint8Array} bytes An array of bytes.
     * @param {number} i The index to read.
     * @return {string}
     * @private
     */
    readChar_(bytes, i) {
        let chrs = "";
        let j = 0;
        while(j < this.offset) {
            chrs += String.fromCharCode(bytes[i+j]);
            j++;
        }
        return chrs;
    }

    /**
     * Write one 64-bit float as a binary value.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number to write as bytes.
     * @param {number} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     * @private
     */
    write64F_(bytes, number, j) {
        f64[0] = number;
        let type = new Type({"bits": 32, "offset": 4, "lastByteMask":255});
        j = type.write(bytes, ui32[0], j);
        return type.write(bytes, ui32[1], j);
    }

    /**
     * Write one 32-bit float as a binary value.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number to write as bytes.
     * @param {number} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     * @private
     */
    write32F_(bytes, number, j) {
        f32[0] = number;
        j = this.write(bytes, i32[0], j);
        return j;
    }

    /**
     * Write one 16-bit float as a binary value.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number to write as bytes.
     * @param {number} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     * @private
     */
    write16F_(bytes, number, j) {
        f32[0] = number;
        let x = i32[0];
        let bits = (x >> 16) & 0x8000;
        let m = (x >> 12) & 0x07ff;
        let e = (x >> 23) & 0xff;
        if (e >= 103) {
            bits |= ((e - 112) << 10) | (m >> 1);
            bits += m & 1;
        }
        bytes[j++] = bits & 0xFF;
        bytes[j++] = bits >>> 8 & 0xFF;
        return j;
    }
    
    /**
     * Write one char as a byte.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {string} string The string to write as bytes.
     * @param {number} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     * @private
     */
    writeChar_(bytes, string, j) {
        bytes[j++] = string.charCodeAt(0);
        return j;
    }

    /**
     * Build the type.
     * @private
     */
    buildType_() {
        this.setReader_();
        this.setWriter_();
        if (this.float) {
            this.min = -Infinity;
            this.max = Infinity;
        }
    }

    /**
     * Set the function to read data of this type.
     * @private
     */
    setReader_() {
        if (this.float) {
            if (this.bits == 16) {
                this.reader = this.read16F_;
            } else if(this.bits == 32) {
                this.reader = this.read32F_;
            } else if(this.bits == 64) {
                this.reader = this.read64F_;
            }
        } else if (this.char) {
            this.reader = this.readChar_;
        }
    }

    /**
     * Set the function to write data of this type.
     * @private
     */
    setWriter_() {
        if (this.float) {
            if (this.bits == 16) {
                this.writer = this.write16F_;
            } else if(this.bits == 32) {
                this.writer = this.write32F_;
            } else if(this.bits == 64) {
                this.writer = this.write64F_;
            }
        } else if (this.char) {
            this.writer = this.writeChar_;
        }
    }
}

module.exports = Type;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * wavefile
 * Read & write wave files with 4, 8, 11, 12, 20, 16, 24, 32 & 64-bit data.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/** @private */
const WAVE_ERRORS = __webpack_require__(0);
/** @private */
const bitDepth_ = __webpack_require__(4);
/** @private */
const riffChunks_ = __webpack_require__(5);
/** @private */
const imaadpcm_ = __webpack_require__(9);
/** @private */
const alawmulaw_ = __webpack_require__(10);
/** @private */
const WaveFileReaderWriter = __webpack_require__(13);

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

window['WaveFile'] = WaveFile;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*!
 * bitdepth
 * Change the bit depth of samples to and from 8, 16, 24, 32 & 64-bit.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/bitdepth
 *
 */

/** @private */
const f64f32_ = new Float32Array(1);

/**
 * Max number of different values for each bit depth.
 * @enum {number}
 * @private
 */
const MAX_VALUES = {
    "8": 256,
    "16": 65536,
    "24": 16777216,
    "32": 4294967296,
    "32f": 1,
    "64": 1
};

/**
 * Functions to change the bit depth of a sample.
 * @enum {Function}
 * @private
 */
const CODECS = {

    /**
     * Change the bit depth from int to int.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    "intToInt": function(sample, args) {
        if (sample > 0) {
            sample = parseInt(
                (sample / args["oldPositive"]) * args["newPositive"], 10);
        } else {
            sample = parseInt(
                (sample / args["oldNegative"]) * args["newNegative"], 10);
        }
        return sample;
    },

    /**
     * Change the bit depth from float to int.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    "floatToInt": function(sample, args) {
        return sample > 0 ?
            sample * args["newPositive"] : sample * args["newNegative"];
    },

    /**
     * Change the bit depth from int to float.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    "intToFloat": function(sample, args) {
        return sample > 0 ?
            sample / args["oldPositive"] : sample / args["oldNegative"];
    },

    /**
     * Change the bit depth from float to float.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    "floatToFloat": function(sample, args) {
        if (args["original"] == "64" && args["target"] == "32f") {
            f64f32_[0] = sample;
            sample = f64f32_[0];
        }
        return sample;
    }
};

/**
 * Change the bit depth of the data in a array.
 * The input array is modified in-place.
 * @param {Array<number>} samples The samples.
 * @param {string} originalBitDepth The original bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @param {string} targetBitDepth The new bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 */
function toBitDepth(samples, originalBitDepth, targetBitDepth) {
    validateBitDepths_(originalBitDepth, targetBitDepth);
    let toFunction = getBitDepthFunction_(originalBitDepth, targetBitDepth);
    let len = samples.length;
    for (let i=0; i<len; i++) {        
        samples[i] = sign8Bit_(samples[i], originalBitDepth);
        samples[i] = toFunction(
                samples[i],
                {
                    "oldNegative": MAX_VALUES[originalBitDepth] / 2,
                    "newNegative": MAX_VALUES[targetBitDepth] / 2,
                    "oldPositive": MAX_VALUES[originalBitDepth] / 2 - 1,
                    "newPositive": MAX_VALUES[targetBitDepth] / 2 - 1,
                    "original": originalBitDepth,
                    "target": targetBitDepth
                }
            );
        samples[i] = unsign8Bit_(samples[i], targetBitDepth);
    }
}

/**
 * Get the function to change the bit depth of a sample.
 * @param {string} originalBitDepth The original bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @param {string} targetBitDepth The new bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @return {Function}
 * @private
 */
function getBitDepthFunction_(originalBitDepth, targetBitDepth) {
    let prefix;
    let suffix;
    if (["32f", "64"].includes(originalBitDepth)) {
        prefix = "float";
    } else {
        prefix = "int";
    }
    if (["32f", "64"].includes(targetBitDepth)) {
        suffix = "Float";
    } else {
        suffix = "Int";
    }
    return CODECS[prefix + "To" + suffix];
}

/**
 * Sign unsigned 8-bit data.
 * @param {number} sample The sample.
 * @param {string} originalBitDepth The original bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @return {number}
 * @private
 */
function sign8Bit_(sample, originalBitDepth) {
    if (originalBitDepth == "8") {
        sample -= 128;
    }
    return sample;
}

/**
 * Unsign signed 8-bit data.
 * @param {number} sample The sample.
 * @param {string} targetBitDepth The target bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @return {number}
 * @private
 */
function unsign8Bit_(sample, targetBitDepth) {
    if (targetBitDepth == "8") {
        sample += 128;
    }
    return sample;
}

/**
 * Validate the bit depth.
 * @param {string} originalBitDepth The original bit depth.
 *     Should be one of "8", "16", "24", "32", "32f", "64".
 * @param {string} targetBitDepth The target bit depth.
 *     Should be one of "8", "16", "24", "32", "32f", "64".
 * @throws {Error} If any argument does not meet the criteria.
 * @return {boolean}
 * @private
 */
function validateBitDepths_(originalBitDepth, targetBitDepth) {
    let validBitDepths = ["8", "16", "24", "32", "32f", "64"];
    if (validBitDepths.indexOf(originalBitDepth) == -1 ||
        validBitDepths.indexOf(targetBitDepth) == -1) {
        throw new Error("Invalid bit depth.");
    }
    return true;
}

module.exports.toBitDepth = toBitDepth;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * riff-chunks
 * Read and write the chunks of RIFF and RIFX files.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/riff-chunks
 *
 */

/** @private */
const byteData = __webpack_require__(1);
/** @private */
const chr = byteData.chr;
/** @private */
let uInt32 = byteData.uInt32;


/**
 * Write the bytes of a RIFF/RIFX file.
 * @param {Object} chunks A structure like the return of riffChunks.read().
 * @return {Uint8Array} The file bytes as Uint8Array when
 *      chunkId is "RIFF" or "RIFX" or the chunk bytes as Array<number>
 *      when chunkId is "LIST".
 */
function write(chunks) {
    uInt32.be = chunks["chunkId"] === "RIFX";
    let bytes =
        byteData.packArray(chunks["chunkId"], chr).concat(
                byteData.pack(chunks["chunkSize"], uInt32),
                byteData.packArray(chunks["format"], chr),
                writeSubChunks_(chunks["subChunks"])
            );
    if (chunks["chunkId"] === "RIFF" || chunks["chunkId"] === "RIFX" ) {
        bytes = new Uint8Array(bytes);
    }
    return bytes;
}

/**
 * Get the chunks of a RIFF/RIFX file.
 * @param {Uint8Array|Array<number>} buffer The file bytes.
 * @return {Object} The chunk.
 */
function read(buffer) {
    buffer = [].slice.call(buffer);
    let chunkId = getChunkId_(buffer, 0);
    uInt32.be = chunkId === "RIFX";
    return {
        "chunkId": chunkId,
        "chunkSize": getChunkSize_(buffer, 0),
        "format": byteData.unpackArray(buffer.slice(8, 12), chr),
        "subChunks": getSubChunks_(buffer)
    };
}

/**
 * Write the sub chunks of a RIFF file.
 * @param {Array<Object>} chunks The chunks.
 * @return {Array<number>} The chunk bytes.
 * @private
 */
function writeSubChunks_(chunks) {
    let subChunks = [];
    let i = 0;
    while (i < chunks.length) {
        if (chunks[i]["chunkId"] === "LIST") {
            subChunks = subChunks.concat(write(chunks[i]));
        } else {
            subChunks = subChunks.concat(
                byteData.packArray(chunks[i]["chunkId"], chr),
                byteData.pack(chunks[i]["chunkSize"], uInt32),
                chunks[i]["chunkData"]
            );
        }
        i++;
    }
    return subChunks;
}

/**
 * Get the sub chunks of a RIFF file.
 * @param {Uint8Array|Array<number>} buffer the RIFF file bytes.
 * @return {Object} The subchunks of a RIFF/RIFX or LIST chunk.
 * @private
 */
function getSubChunks_(buffer) {
    let chunks = [];
    let i = 12;
    while(i < buffer.length) {
        chunks.push(getSubChunk_(buffer, i));
        i += 8 + chunks[chunks.length - 1]["chunkSize"];
    }
    return chunks;
}

/**
 * Get a sub chunk from a RIFF file.
 * @param {Uint8Array|Array<number>} buffer the RIFF file bytes.
 * @param {number} index The start index of the chunk.
 * @return {Object} A subchunk of a RIFF/RIFX or LIST chunk.
 * @private
 */
function getSubChunk_(buffer, index) {
    let chunk = {
        "chunkId": getChunkId_(buffer, index),
        "chunkSize": getChunkSize_(buffer, index)
    };
    if (chunk["chunkId"] === "LIST") {
        chunk["format"] = byteData.unpackArray(buffer.slice(8, 12), chr);
        chunk["subChunks"] = getSubChunks_(
            buffer.slice(index, index + chunk["chunkSize"]));
    } else {
        chunk["chunkData"] = buffer.slice(
            index + 8, index + 8 + chunk["chunkSize"]);
    }
    return chunk;
}

/**
 * Return the FourCC of a chunk.
 * @param {Uint8Array|Array<number>} buffer the RIFF file bytes.
 * @param {number} index The start index of the chunk.
 * @return {string} The id of the chunk.
 * @private
 */
function getChunkId_(buffer, index) {
    return byteData.unpackArray(buffer.slice(index, index + 4), chr);
}

/**
 * Return the size of a chunk.
 * @param {Uint8Array|Array<number>} buffer the RIFF file bytes.
 * @param {number} index The start index of the chunk.
 * @return {number} The size of the chunk without the id and size fields.
 * @private
 */
function getChunkSize_(buffer, index) {
    return byteData.unpack(buffer.slice(index + 4, index + 8), uInt32);
}

module.exports.read = read;
module.exports.write = write;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const Type = __webpack_require__(2);
const endianness = __webpack_require__(8);

/**
 * Turn a byte buffer into what the bytes represent.
 * @param {!Array<number>|!Array<string>|Uint8Array} buffer An array of bytes.
 * @param {Object} type One of the available types.
 * @return {!Array<number>|number|string}
 */
function fromBytes(buffer, type) {
    if (type.be) {
        endianness(buffer, type.offset);
    }
    if (type.base != 10) {
        bytesFromBase(buffer, type.base);
    }
    return readBytes(buffer, type);
}

/**
 * Turn numbers and strings to bytes.
 * @param {!Array<number>|number|string} values The data.
 * @param {Object} type One of the available types.
 * @return {!Array<number>|!Array<string>} the data as a byte buffer.
 */
function toBytes(values, type) {
    let bytes = writeBytes(values, type);
    if (type.be) {
        endianness(bytes, type.offset);
    }
    if (type.base != 10) {
        bytesToBase(bytes, type.base);
        formatOutput(bytes, type);
    }
    return bytes;
}

/**
 * Turn a array of bytes into an array of what the bytes should represent.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {Object} type The type.
 * @return {!Array<number>|string}
 */
function readBytes(bytes, type) {
    let values = [];
    let i = 0;
    let len = bytes.length - (type.offset - 1);
    while (i < len) {
        values.push(type.reader(bytes, i));
        i += type.offset;
    }
    if (type.char) {
        values = values.join("");
    }
    return values;
}

/**
 * Write values as bytes.
 * @param {!Array<number>|number|string} values The data.
 * @param {Object} type One of the available types.
 * @return {!Array<number>} the bytes.
 */
function writeBytes(values, type) {
    let i = 0;
    let j = 0;
    let len = values.length;
    let bytes = [];
    while (i < len) {
        j = type.writer(bytes, values[i++], j);
    }
    return bytes;
}

/**
 * Get the full type spec for the reading/writing.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the input.
 * @return {Object}
 */
function getType(type, base) {
    let theType = Object.assign(new Type({}), type);
    theType.base = base;
    return theType;
}

/**
 * Turn bytes to base 10 from base 2 or 16.
 * @param {!Array<number>|Uint8Array} bytes The bytes as binary or hex strings.
 * @param {number} base The base.
 */
function bytesFromBase(bytes, base) {
    let i = 0;
    let len = bytes.length;
    while(i < len) {
        bytes[i] = parseInt(bytes[i], base);
        i++;
    }
}

/**
 * Turn the output to the correct base.
 * @param {Array} bytes The bytes.
 * @param {Object} type The type.
 */
function formatOutput(bytes, type) {
    let i = 0;
    let len = bytes.length;
    let offset = (type.base == 2 ? 8 : 2) + 1;
    while(i < len) {
        bytes[i] = Array(offset - bytes[i].length).join("0") + bytes[i];
        i++;
    }
}

/**
 * Turn bytes from base 10 to base 2 or 16.
 * @param {!Array<string>|Array<number>} bytes The bytes.
 * @param {number} base The base.
 */
function bytesToBase(bytes, base) {
    let i = 0;
    let len = bytes.length;
    while (i < len) {
        bytes[i] = bytes[i].toString(base);
        i++;
    }
}

module.exports.getType = getType;
module.exports.toBytes = toBytes;
module.exports.fromBytes = fromBytes;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*!
 * generic-integer
 * Pack and unpack any integer from 1 to 53-Bit.
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/generic-integer
 * 
 */

/**
 * A class to read and write any integer from 1 to 53-Bit.
 */
class GenericInteger {

    /**
     * @param {Object} options The type definition.
     * @param {number} options.bits Number of bits used by the data.
     * @param {boolean} options.be True for big-endian.
     * @param {boolean} options.signed True for signed types.
     */
    constructor(options) {
        /**
         * The max number of bits used by the data.
         * @type {number}
         */
        this.bits = options["bits"];
        /**
         * If this type is big-endian or not.
         * @type {boolean}
         */
        this.be = options["be"];
        /**
         * If this type it is signed or not.
         * @type {boolean}
         */
        this.signed = options["signed"];
        /**
         * The function to read values from buffers.
         * @type {Function}
         */
        this.reader = this.read;
        /**
         * The function to write values to buffers.
         * @type {Function}
         */
        this.writer = this.write;
        /**
         * The number of bytes used by the data.
         * @type {number}
         */
        this.offset = 0;
        /**
         * Min value for numbers of this type.
         * @type {number}
         */
        this.min = -Infinity;
        /**
         * Max value for numbers of this type.
         * @type {number}
         */
        this.max = Infinity;
        /**
         * The practical number of bits used by the data.
         * @type {number}
         * @private
         */
        this.realBits_ = this.bits;
        /**
         * The mask to be used in the last byte.
         * @type {number}
         * @private
         */
        this.lastByteMask_ = 255;
        this.build_();
    }

    /**
     * Read one integer number from a byte buffer.
     * @param {!Array<number>|Uint8Array} bytes An array of bytes.
     * @param {number} i The index to read.
     * @return {number}
     */
    read(bytes, i=0) {
        if (this.bits > 32) {
            return this.readBits_(bytes, i);
        }
        let num = 0;
        let x = this.offset - 1;
        while (x > 0) {
            num = (bytes[x + i] << x * 8) | num;
            x--;
        }
        num = (bytes[i] | num) >>> 0;
        return this.overflow_(this.sign_(num));
    }

    /**
     * Write one integer number to a byte buffer.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number.
     * @param {number} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     */
    write(bytes, number, j=0) {
        number = this.overflow_(number);
        let mask = 255;
        j = this.writeFirstByte_(bytes, number, j);
        for (let i = 2; i <= this.offset; i++) {
            if (i == this.offset) {
                mask = this.lastByteMask_;
            }
            bytes[j++] = Math.floor(number / Math.pow(2, ((i - 1) * 8))) & mask;
        }
        return j;
    }

    /**
     * Read a integer number from a byte buffer by turning int bytes
     * to a string of bits. Used for data with more than 32 bits.
     * @param {!Array<number>|Uint8Array} bytes An array of bytes.
     * @param {number} i The index to read.
     * @return {number}
     * @private
     */
    readBits_(bytes, i=0) {
        let binary = "";
        let j = 0;
        while(j < this.offset) {
            let bits = bytes[i + j].toString(2);
            binary = Array(9 - bits.length).join("0") + bits + binary;
            j++;
        }
        return this.overflow_(this.sign_(parseInt(binary, 2)));
    }

    /**
     * Build the type.
     * @private
     */
    build_() {
        this.validateWordSize_();
        this.setRealBits_();
        this.setLastByteMask_();
        this.setMinMax_();
        this.offset = this.bits < 8 ? 1 : Math.ceil(this.realBits_ / 8);
    }

    /**
     * Sign a number.
     * @param {number} num The number.
     * @return {number}
     * @private
     */
    sign_(num) {
        if (num > this.max) {
            num -= (this.max * 2) + 2;
        }
        return num;
    }

    /**
     * Limit the value according to the bit depth in case of
     * overflow or underflow.
     * @param {number} value The data.
     * @return {number}
     * @private
     */
    overflow_(value) {
        if (value > this.max) {
            value = this.max;
        } else if (value < this.min) {
            value = this.min;
        }
        return value;
    }

    /**
     * Set the minimum and maximum values for the type.
     * @private
     */
    setMinMax_() {
        let max = Math.pow(2, this.bits);
        if (this.signed) {
            this.max = max / 2 -1;
            this.min = -max / 2;
        } else {
            this.max = max - 1;
            this.min = 0;
        }
    }

    /**
     * Validate the number of bits.
     * @private
     */
    validateWordSize_() {
        if (this.bits < 1 || this.bits > 64) {
            throw Error("Not a supported type.");
        }
    }

    /**
     * Set the practical bit number for data with bit count different
     * from the standard types (8, 16, 32, 40, 48, 64) and more than 8 bits.
     * @private
     */
    setRealBits_() {
        if (this.bits > 8) {
            this.realBits_ = ((this.bits - 1) | 7) + 1;
        }
    }

    /**
     * Set the mask that should be used when writing the last byte.
     * @private
     */
    setLastByteMask_() {
        let r = 8 - (this.realBits_ - this.bits);
        this.lastByteMask_ = Math.pow(2, r > 0 ? r : 8) -1;
    }

    /**
     * Write the first byte of a integer number.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number.
     * @param {number} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     * @private
     */
    writeFirstByte_(bytes, number, j) {
        if (this.bits < 8) {
            bytes[j++] = number < 0 ? number + Math.pow(2, this.bits) : number;
        } else {
            bytes[j++] = number & 255;
        }
        return j;
    }
}

module.exports = GenericInteger;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*!
 * endianness
 * Swap endianness in byte arrays.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/endianness
 *
 */

/**
 * Swap the endianness of units of information in a byte array.
 * The original array is modified in-place.
 * @param {!Array<number>|!Array<string>|Uint8Array} bytes The bytes.
 * @param {number} offset The number of bytes of each unit of information.
 */
function endianness(bytes, offset) {
    let len = bytes.length;
    let i = 0;
    while (i < len) {
        swap(bytes, offset, i);
        i += offset;
    }
}

/**
 * Swap the endianness of a unit of information in a byte array.
 * The original array is modified in-place.
 * @param {!Array<number>|!Array<string>|Uint8Array} bytes The bytes.
 * @param {number} offset The number of bytes of the unit of information.
 * @param {number} index The start index of the unit of information.
 */
function swap(bytes, offset, index) {
    let x = 0;
    let y = offset - 1;
    let limit = parseInt(offset / 2, 10);
    while(x < limit) {
        let theByte = bytes[index + x];
        bytes[index + x] = bytes[index + y];
        bytes[index + y] = theByte;
        x++;
        y--;
    }
}

module.exports = endianness;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*!
 * imaadpcm
 * JavaScript IMA ADPCM codec.
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/imaadpcm
 *
 * References:
 * http://www.cs.columbia.edu/~hgs/audio/dvi/
 * https://github.com/acida/pyima
 * https://wiki.multimedia.cx/index.php/IMA_ADPCM
 * 
 */

/** @private */
const INDEX_TABLE = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8];
/** @private */
const STEP_TABLE = [
    7, 8, 9, 10, 11, 12, 13, 14,
    16, 17, 19, 21, 23, 25, 28, 31,
    34, 37, 41, 45, 50, 55, 60, 66,
    73, 80, 88, 97, 107, 118, 130, 143,
    157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658,
    724, 796, 876, 963, 1060, 1166, 1282, 1411,
    1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024,
    3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484,
    7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794,
    32767];
/** @private */
var encoderPredicted_ = 0;
/** @private */
var encoderIndex_ = 0;
/** @private */
var encoderStep_ = 7;
/** @private */
var decoderPredicted_ = 0;
/** @private */
var decoderIndex_ = 0;
/** @private */
var decoderStep_ = 7;

/**
 * Sign a 16-bit integer.
 * @param {number} num A 16-bit integer.
 * @return {number}
 * @private
 */
function sign_(num) {
    return num > 32768 ? num - 65536 : num;
}

/**
 * Set the value for encoderPredicted_ and encoderIndex_
 * after each sample is compressed.
 * @param {number} value The compressed ADPCM sample
 * @param {number} diff The calculated difference
 * @private
 */
function setEncoderInfo_(value, diff) {
    if (value & 8) {
        encoderPredicted_ -= diff;
    } else {
        encoderPredicted_ += diff;
    }
    if (encoderPredicted_ < -0x8000) {
        encoderPredicted_ = -0x8000;
    } else if (encoderPredicted_ > 0x7fff) {
        encoderPredicted_ = 0x7fff;
    }
    encoderIndex_ += INDEX_TABLE[value & 7];
    if (encoderIndex_ < 0) {
        encoderIndex_ = 0;
    } else if (encoderIndex_ > 88) {
        encoderIndex_ = 88;
    }
}

/**
 * Compress a 16-bit PCM sample into a 4-bit ADPCM sample.
 * @param {number} sample The sample.
 * @return {number}
 * @private
 */
function encodeSample_(sample) {
    let delta = sample - encoderPredicted_;
    let value = 0;
    if (delta >= 0) {
        value = 0;
    } else {
        value = 8;
        delta = -delta;
    }
    let step = STEP_TABLE[encoderIndex_];
    let diff = step >> 3;
    if (delta > step) {
        value |= 4;
        delta -= step;
        diff += step;
    }
    step >>= 1;
    if (delta > step) {
        value |= 2;
        delta -= step;
        diff += step;
    }
    step >>= 1;
    if (delta > step) {
        value |= 1;
        diff += step;
    }
    setEncoderInfo_(value, diff);
    return value;
}

/**
 * Decode a 4-bit ADPCM sample into a 16-bit PCM sample.
 * @param {number} nibble A 4-bit adpcm sample.
 * @return {number}
 * @private
 */
function decodeSample_(nibble) {
    let difference = 0;
    if (nibble & 4) {
        difference += decoderStep_;
    }
    if (nibble & 2) {
        difference += decoderStep_ >> 1;
    }
    if (nibble & 1) {
        difference += decoderStep_ >> 2;
    }
    difference += decoderStep_ >> 3;
    if (nibble & 8) {
        difference = -difference;
    }
    decoderPredicted_ += difference;
    if (decoderPredicted_ > 32767) {
        decoderPredicted_ = 32767;
    } else if (decoderPredicted_ < -32767) {
        decoderPredicted_ = -32767;
    }
    decoderIndex_ += INDEX_TABLE[nibble];
    if (decoderIndex_ < 0) {
        decoderIndex_ = 0;
    } else if (decoderIndex_ > 88) {
        decoderIndex_ = 88;
    }
    decoderStep_ = STEP_TABLE[decoderIndex_];
    return decoderPredicted_;
}

/**
 * Return the head of a ADPCM sample block.
 * @param {number} sample The first sample of the block.
 * @return {!Array<number>}
 * @private
 */
function blockHead_(sample) {
    encodeSample_(sample);
    let adpcmSamples = [];
    adpcmSamples.push(sample & 0xFF);
    adpcmSamples.push((sample >> 8) & 0xFF);
    adpcmSamples.push(encoderIndex_);
    adpcmSamples.push(0);
    return adpcmSamples;
}

/**
 * Encode a block of 505 16-bit samples as 4-bit ADPCM samples.
 * @param {!Array<number>} block A sample block of 505 samples.
 * @return {!Array<number>}
 */
function encodeBlock(block) {
    let adpcmSamples = blockHead_(block[0]);
    for (let i=3; i<block.length; i+=2) {
        let sample2 = encodeSample_(block[i]);
        let sample = encodeSample_(block[i + 1]);
        adpcmSamples.push((sample << 4) | sample2);
    }
    while (adpcmSamples.length < 256) {
        adpcmSamples.push(0);
    }
    return adpcmSamples;
}

/**
 * Decode a block of 256 ADPCM samples into 16-bit PCM samples.
 * @param {!Array<number>} block A adpcm sample block of 256 samples.
 * @return {!Array<number>}
 */
function decodeBlock(block) {
    decoderPredicted_ = sign_((block[1] << 8) | block[0]);
    decoderIndex_ = block[2];
    decoderStep_ = STEP_TABLE[decoderIndex_];
    let result = [
            decoderPredicted_,
            sign_((block[3] << 8) | block[2])
        ];
    for (let i=4; i<block.length; i++) {
        let original_sample = block[i];
        let second_sample = original_sample >> 4;
        let first_sample = (second_sample << 4) ^ original_sample;
        result.push(decodeSample_(first_sample));
        result.push(decodeSample_(second_sample));
    }
    return result;
}

/**
 * Encode 16-bit PCM samples into 4-bit IMA ADPCM samples.
 * @param {!Array<number>} samples A array of samples.
 * @return {!Array<number>}
 */
function encode(samples) {
    let adpcmSamples = [];
    let block = [];
    for (let i=0; i<samples.length; i++) {
        block.push(samples[i]);
        if ((i % 505 == 0 && i != 0) || i == samples.length - 1) {
            adpcmSamples = adpcmSamples.concat(encodeBlock(block));
            block = [];
        }
    }
    return adpcmSamples;
}

/**
 * Decode IMA ADPCM samples into 16-bit PCM samples.
 * @param {!Array<number>} adpcmSamples A array of ADPCM samples.
 * @param {number} blockAlign The block size.
 * @return {!Array<number>}
 */
function decode(adpcmSamples, blockAlign=256) {
    let samples = [];
    let block = [];
    for (let i=0; i<adpcmSamples.length; i++) {
        if (i % blockAlign == 0 && i != 0) {            
            samples = samples.concat(decodeBlock(block));
            block = [];
        }
        block.push(adpcmSamples[i]);
    }
    return samples;
}

module.exports.encode = encode;
module.exports.decode = decode;
module.exports.encodeBlock = encodeBlock;
module.exports.decodeBlock = decodeBlock;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * alawmulaw
 * JavaScript A-Law and mu-Law codecs.
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/alawmulaw
 * 
 */

module.exports.alaw = __webpack_require__(11);
module.exports.mulaw = __webpack_require__(12);


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
 * alaw.js
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/alawmulaw
 *
 * References:
 * https://github.com/deftio/companders
 * http://dystopiancode.blogspot.com.br/2012/02/pcm-law-and-u-law-companding-algorithms.html
 * 
 */

/**
 * Encode a 16-bit linear PCM sample as 8-bit A-Law.
 * @param {number} sample A 16-bit linear PCM sample
 * @return {number}
 */
function encodeSample(sample) {
    let clip = 32635;
    let logTable = [
        1,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5, 
        6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6, 
        7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7, 
        7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7 
    ];
    let sign;
    let exponent;
    let mantissa; 
    let compandedValue; 
    sample = (sample ==-32768) ? -32767 : sample;
    sign = ((~sample) >> 8) & 0x80; 
    if (!sign) {
        sample = sample * -1; 
    }
    if (sample > clip) {
        sample = clip; 
    }
    if (sample >= 256)  { 
        exponent = logTable[(sample >> 8) & 0x7F]; 
        mantissa = (sample >> (exponent + 3) ) & 0x0F; 
        compandedValue = ((exponent << 4) | mantissa); 
    } else {
        compandedValue = sample >> 4; 
    } 
    compandedValue ^= (sign ^ 0x55); 
    return compandedValue; 
}

/**
 * Decode a 8-bit A-Law sample as 16-bit linear PCM.
 * @param {number} aLawSample The 8-bit A-Law sample
 * @return {number}
 */
function decodeSample(aLawSample) {
   let sign = 0x00;
   let position = 0;
   let decoded = 0;
   aLawSample ^= 0x55;
   if (aLawSample & 0x80) {
      aLawSample &= ~(1 << 7);
      sign = -1;
   }
   position = ((aLawSample & 0xF0) >> 4) + 4;
   if (position != 4) {
      decoded = ((1 << position) |
                ((aLawSample & 0x0F) << (position - 4)) |
                (1 << (position - 5)));
   } else {
      decoded = (aLawSample << 1)|1;
   }
   decoded = (sign === 0) ? (decoded) : (-decoded);
   return (decoded * 8) * -1;
}

/**
 * Encode 16-bit linear PCM samples into 8-bit A-Law samples.
 * @param {!Array<number>} samples A array of 16-bit PCM samples.
 * @return {!Array<number>}
 */
function encode(samples) {
    let aLawSamples = [];
    for (let i=0; i<samples.length; i++) {
        aLawSamples.push(encodeSample(samples[i]));
    }
    return aLawSamples;
}

/**
 * Decode 8-bit A-Law samples into 16-bit linear PCM samples.
 * @param {!Array<number>} samples A array of 8-bit A-Law samples.
 * @return {!Array<number>}
 */
function decode(samples) {
    let pcmSamples = [];
    for (let i=0; i<samples.length; i++) {
        pcmSamples.push(decodeSample(samples[i]));
    }
    return pcmSamples;
}

module.exports.encodeSample = encodeSample;
module.exports.decodeSample = decodeSample;
module.exports.encode = encode;
module.exports.decode = decode;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
 * mulaw.js
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/alawmulaw
 *
 * Reference:
 * https://github.com/torvalds/linux/blob/master/sound/core/oss/mulaw.c
 * 
 */

/** @private */
const BIAS = 0x84;
/** @private */
const SIGN_BIT = 0x80;
/** @private */
const QUANT_MASK = 0xf;
/** @private */
const SEG_MASK = 0x70;
/** @private */
const SEG_SHIFT = 4;

/** @private */
function valSeg_(val) {
  let r = 0;
  val >>= 7;
  if (val & 0xf0) {
    val >>= 4;
    r += 4;
  }
  if (val & 0x0c) {
    val >>= 2;
    r += 2;
  }
  if (val & 0x02) {
    r += 1;
  }
  return r;
}

/**
 * Encode a 16-bit linear PCM sample as 8-bit mu-Law.
 * @param {number} pcmSample A 16-bit sample
 * @return {number}
 */
function encodeSample(pcmSample) {
  let mask;
  let seg;
  let uval;
  if (pcmSample < 0) {
    pcmSample = BIAS - pcmSample;
    mask = 0x7F;
  } else {
    pcmSample += BIAS;
    mask = 0xFF;
  }
  if (pcmSample > 0x7FFF) {
    pcmSample = 0x7FFF;
  }
  seg = valSeg_(pcmSample);
  uval = (seg << 4) | ((pcmSample >> (seg + 3)) & 0xF);
  return uval ^ mask;
}

/**
 * Decode a 8-bit mu-Law sample as 16-bit linear PCM.
 * @param {number} muLawSample The 8-bit mu-Law sample
 * @return {number}
 */
function decodeSample(muLawSample) {
  let t;
  muLawSample = ~muLawSample;
  t = ((muLawSample & QUANT_MASK) << 3) + BIAS;
  t <<= (muLawSample & SEG_MASK) >> SEG_SHIFT;
  return ((muLawSample & SIGN_BIT) ? (BIAS - t) : (t - BIAS));
}

/**
 * Encode 16-bit linear PCM samples into 8-bit mu-Law samples.
 * @param {!Array<number>} samples A array of 16-bit linear PCM samples.
 * @return {!Array<number>}
 */
function encode(samples) {
    let muLawSamples = [];
    for (let i=0; i<samples.length; i++) {
        muLawSamples.push(encodeSample(samples[i]));
    }
    return muLawSamples;
}

/**
 * Decode 8-bit mu-Law samples into 16-bit linear PCM samples.
 * @param {!Array<number>} samples A array of 8-bit mu-Law samples.
 * @return {!Array<number>}
 */
function decode(samples) {
    let pcmSamples = [];
    for (let i=0; i<samples.length; i++) {
        pcmSamples.push(decodeSample(samples[i]));
    }
    return pcmSamples;
}

module.exports.encodeSample = encodeSample;
module.exports.decodeSample = decodeSample;
module.exports.encode = encode;
module.exports.decode = decode;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * WaveFileReaderWriter
 * Class to read and write wav files to and from buffers.
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/** @private */
const WAVE_ERRORS = __webpack_require__(0);
/** @private */
const WaveFileHeader = __webpack_require__(14);
/** @private */
const byteData_ = __webpack_require__(1);
/** @private */
let uInt8_ = byteData_.uInt8;
/** @private */
let uInt16_ = byteData_.uInt16;
/** @private */
let uInt32_ = byteData_.uInt32;
/** @private */
const chr_ = byteData_.chr;

/**
 * Class to read and write wav files to and from buffers.
 * @extends WaveFileHeader
 */
class WaveFileReaderWriter extends WaveFileHeader {

    constructor() {
        super();
        /**
         * @type {Array<number>}
         */
        this.samples = [];
        /**
         * Header formats.
         * Formats not listed here will be 65534.
         * @enum {number}
         * @private
         */
        this.headerFormats_ = {
            "4": 17,
            "8": 1,
            "8a": 6,
            "8m": 7,
            "16": 1,
            "24": 1,
            "32": 1,
            "32f": 3,
            "64": 3
        };
        /**
         * @type {number} 
         * @private
         */
        this.head_ = 0;
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes A wav buffer.
     * @throws {Error} If no "RIFF" chunk is found.
     * @private
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData_.unpackArray(bytes.slice(0, 4), chr_);
        if (this.chunkId != "RIFF" && this.chunkId != "RIFX") {
            throw Error(WAVE_ERRORS.format);
        }
        this.LEorBE_();
        this.chunkSize = byteData_.unpack(bytes.slice(4, 8), uInt32_);
        this.format = byteData_.unpackArray(bytes.slice(8, 12), chr_);
        if (this.format != "WAVE") {
            throw Error(WAVE_ERRORS.wave);
        }
    }

    /**
     * Set up to work wih big-endian or little-endian files.
     * The types used are changed from LE or BE. If the
     * the file is big-endian (RIFX), true is returned.
     * @private
     */
    LEorBE_() {
        let bigEndian = this.chunkId == "RIFX";
        uInt8_.be = bigEndian;
        uInt16_.be = bigEndian;
        uInt32_.be = bigEndian;
        return bigEndian;
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Object} chunks The wav file chunks.
     * @throws {Error} If no "fmt " chunk is found.
     * @private
     */
    readFmtChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "fmt ");
        if (chunk) {
            this.fmtChunkId = "fmt ";
            this.fmtChunkSize = chunk.chunkSize;
            this.audioFormat = byteData_.unpack(
                chunk.chunkData.slice(0, 2), uInt16_);
            this.numChannels = byteData_.unpack(
                chunk.chunkData.slice(2, 4), uInt16_);
            this.sampleRate = byteData_.unpack(
                chunk.chunkData.slice(4, 8), uInt32_);
            this.byteRate = byteData_.unpack(
                chunk.chunkData.slice(8, 12), uInt32_);
            this.blockAlign = byteData_.unpack(
                chunk.chunkData.slice(12, 14), uInt16_);
            this.bitsPerSample = byteData_.unpack(
                    chunk.chunkData.slice(14, 16), uInt16_);
            this.readFmtExtension_(chunk);
        } else {
            throw Error(WAVE_ERRORS["fmt "]);
        }
    }

    /**
     * Read the "fmt " chunk extension.
     * @param {Object} chunk The "fmt " chunk.
     * @private
     */
    readFmtExtension_(chunk) {
        if (this.fmtChunkSize > 16) {
            this.cbSize = byteData_.unpack(
                chunk.chunkData.slice(16, 18), uInt16_);
            if (this.fmtChunkSize > 18) {
                this.validBitsPerSample = byteData_.unpack(
                    chunk.chunkData.slice(18, 20), uInt16_);
                if (this.fmtChunkSize > 20) {
                    this.dwChannelMask = byteData_.unpack(
                        chunk.chunkData.slice(20, 24), uInt32_);
                    // 128-bit GUID read as 4 32-bit unsigned integer
                    this.subformat1 = byteData_.unpack(
                        chunk.chunkData.slice(24, 28), uInt32_);
                    this.subformat2 = byteData_.unpack(
                        chunk.chunkData.slice(28, 32), uInt32_);
                    this.subformat3 = byteData_.unpack(
                        chunk.chunkData.slice(32, 36), uInt32_);
                    this.subformat4 = byteData_.unpack(
                        chunk.chunkData.slice(36, 40), uInt32_);
                }
            }
        }
    }

    /**
     * Read the "fact" chunk of a wav file.
     * @param {Object} chunks The wav file chunks.
     * @throws {Error} If no "fact" chunk is found.
     * @private
     */
    readFactChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "fact");
        if (chunk) {
            this.factChunkId = "fact";
            this.factChunkSize = chunk.chunkSize;
            this.dwSampleLength = byteData_.unpack(
                chunk.chunkData.slice(0, 4), uInt32_);
        } else if (this.enforceFact) {
            throw Error(WAVE_ERRORS["fact"]);
        }
    }

    /**
     * Read the "bext" chunk of a wav file.
     * @param {Object} chunks The wav file chunks.
     * @throws {Error} If no "bext" chunk is found.
     * @private
     */
    readBextChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "bext");
        if (chunk) {
            this.bextChunkId = "bext";
            this.bextChunkSize = chunk.chunkSize;
            this.bextChunkData = chunk.chunkData;
            this.readBextChunkFields_();
        }
    }

    /**
     * Read the fields of the "bext" chunk.
     * @private
     */
    readBextChunkFields_() {
        this.head_ = 0;
        this.bextChunkFields =  {
            "description": this.readVariableSizeString_(
                this.bextChunkData, 256),
            "originator": this.readVariableSizeString_(
                this.bextChunkData, 32),
            "originatorReference": this.readVariableSizeString_(
                this.bextChunkData, 32),
            "originationDate": this.readVariableSizeString_(
                this.bextChunkData, 10),
            "originationTime": this.readVariableSizeString_(
                this.bextChunkData, 8),
            // timeReference is a 64-bit value
            "timeReference": this.readBytes_(
                this.bextChunkData, 8), 
            "version": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "UMID": this.readVariableSizeString_(
                this.bextChunkData, 64), 
            "loudnessValue": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "loudnessRange": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "maxTruePeakLevel": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "maxMomentaryLoudness": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "maxShortTermLoudness": this.readFromChunk_(
                this.bextChunkData, uInt16_),
            "reserved": this.readVariableSizeString_(
                this.bextChunkData, 180),
            "codingHistory": this.readVariableSizeString_(
                this.bextChunkData, this.bextChunkData.length - 602),
        }
    }

    /**
     * Return a slice of the byte array while moving the reading head.
     * @param {Array<number>|Uint8Array} bytes The bytes.
     * @param {number} size the number of bytes to read.
     * @private
     */
    readBytes_(bytes, size) {
        let v = this.head_;
        this.head_ += size;
        return bytes.slice(v, this.head_);
    }

    /**
     * Read bytes as a string from a RIFF chunk.
     * @param {Array<number>|Uint8Array} bytes The bytes.
     * @param {number} maxSize the max size of the string.
     * @private
     */
    readVariableSizeString_(bytes, maxSize) {
        let str = "";
        for (let i=0; i<maxSize; i++) {
            str += byteData_.unpack([bytes[this.head_]], chr_);
            this.head_++;
        }
        return str;
    }

    /**
     * Read a number from a chunk.
     * @param {Array<number>|Uint8Array} bytes The chunk bytes.
     * @param {Object} bdType The byte-data corresponding type.
     * @private
     */
    readFromChunk_(bytes, bdType) {
        let size = bdType.bits / 8;
        let value = byteData_.unpack(
            bytes.slice(this.head_, this.head_ + size), bdType);
        this.head_ += size;
        return value;
    }

    /**
     * Write a variable size string as bytes.
     * If the string is smaller than the max size it 
     * is filled with 0s.
     * @param {string} str The string to be written as bytes.
     * @param {number} maxSize the max size of the string.
     * @private
     */
    writeVariableSizeString_(str, maxSize) {
        let bytes = byteData_.packArray(str, chr_);
        for (let i=bytes.length; i<maxSize; i++) {
            bytes.push(0);
        }
        return bytes;
    }

    /**
     * Read the "cue " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "cue" chunk is found.
     * @private
     */
    readCueChunk_(chunks) {
        let chunk = this.findChunk_(chunks, "cue ");
        if (chunk) {
            this.cueChunkId = "cue ";
            this.cueChunkSize = chunk.chunkSize;
            this.cueChunkData = chunk.chunkData;
        }
    }

    /**
     * Read the "data" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @param {Object} options Type options.
     * @throws {Error} If no "data" chunk is found.
     * @private
     */
    readDataChunk_(chunks, options) {
        let chunk = this.findChunk_(chunks, "data");
        if (chunk) {
            this.dataChunkId = "data";
            this.dataChunkSize = chunk.chunkSize;
            this.samplesFromBytes_(chunk.chunkData, options);
        } else {
            throw Error(WAVE_ERRORS["data"]);
        }
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Array<number>|Uint8Array} bytes A wav file buffer.
     * @param {Object} options Type options.
     * @private
     */
    samplesFromBytes_(bytes, options) {
        options.bits = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        options.signed = options.bits == 8 ? false : true;
        options.float = (this.audioFormat == 3 || 
            this.bitsPerSample == 64) ? true : false;
        options.single = false;
        this.samples = byteData_.unpackArray(
            bytes, new byteData_.Type(options));
    }

    /**
     * Find a chunk by its FourCC in a array of RIFF chunks.
     * @param {Object} chunks The wav file chunks.
     * @param {string} fourCC The chunk fourCC.
     * @return {Object|null}
     * @private
     */
    findChunk_(chunks, fourCC) {
        for (let i = 0; i<chunks.length; i++) {
            if (chunks[i].chunkId == fourCC) {
                return chunks[i];
            }
        }
        return null;
    }

    /**
     * Turn samples to bytes.
     * @param {Object} options Type options.
     * @private
     */
    samplesToBytes_(options) {
        options.bits = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        options.signed = options.bits == 8 ? false : true;
        options.float = (this.audioFormat == 3  ||
                this.bitsPerSample == 64) ? true : false;
        let bytes = byteData_.packArray(
            this.samples, new byteData_.Type(options));
        if (bytes.length % 2) {
            bytes.push(0);
        }
        return bytes;
    }

    /**
     * Get the bytes of the "bext" chunk.
     * @return {Array<number>} The "bext" chunk bytes.
     * @private
     */
    getBextBytes_() {
        if (this.bextChunkId) {
            let bextBytes = [].concat(this.writeVariableSizeString_(
                this.bextChunkFields["description"], 256));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originator"], 32));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originatorReference"], 32));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originationDate"], 10));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["originationTime"], 8));
            // 64-bit value rw as bytes
            bextBytes = bextBytes.concat(
                this.bextChunkFields["timeReference"]);
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["version"], uInt16_));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["UMID"], 64));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["loudnessValue"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["loudnessRange"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["maxTruePeakLevel"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["maxMomentaryLoudness"], uInt16_));
            bextBytes = bextBytes.concat(byteData_.pack(
                this.bextChunkFields["maxShortTermLoudness"], uInt16_));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["reserved"], 180));
            bextBytes = bextBytes.concat(this.writeVariableSizeString_(
                this.bextChunkFields["codingHistory"],
                this.bextChunkData.length - 602));
            return [].concat(
                    byteData_.packArray(this.bextChunkId, chr_),
                    byteData_.pack(bextBytes.length, uInt32_),
                    bextBytes
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "cue " chunk.
     * @return {Array<number>} The "cue " chunk bytes.
     * @private
     */
    getCueBytes_() {
        if (this.cueChunkId) {
            return [].concat(
                    byteData_.packArray(this.cueChunkId, chr_),
                    byteData_.pack(this.cueChunkSize, uInt32_),
                    this.cueChunkData
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "fact" chunk.
     * @return {Array<number>} The "fact" chunk bytes.
     * @private
     */
    getFactBytes_() {
        if (this.factChunkId) {
            return [].concat(
                    byteData_.packArray(this.factChunkId, chr_),
                    byteData_.pack(this.factChunkSize, uInt32_),
                    byteData_.pack(this.dwSampleLength, uInt32_)
                );
        }
        return [];
    }

    /**
     * Get the bytes of the cbSize field.
     * @return {Array<number>} The cbSize bytes.
     * @private
     */
    getCbSizeBytes_() {
        if (this.fmtChunkSize > 16) {
            return byteData_.pack(this.cbSize, uInt16_);
        }
        return [];
    }

    /**
     * Get the bytes of the validBitsPerSample field.
     * @return {Array<number>} The validBitsPerSample bytes.
     * @private
     */
    getValidBitsPerSampleBytes_() {
        if (this.fmtChunkSize > 18) {
            return byteData_.pack(this.validBitsPerSample, uInt16_);
        }
        return [];
    }

    /**
     * Get the bytes of the validBitsPerSample field.
     * @return {Array<number>} The validBitsPerSample bytes.
     * @private
     */
    getFmtExtensionBytes_() {
        if (this.fmtChunkSize > 20) {
            return byteData_.pack(this.dwChannelMask, uInt32_).concat(
                    byteData_.pack(this.subformat1, uInt32_),
                    byteData_.pack(this.subformat2, uInt32_),
                    byteData_.pack(this.subformat3, uInt32_),
                    byteData_.pack(this.subformat4, uInt32_)
                );

        }
        return [];
    }
    
    /**
     * Turn a WaveFile object into a file.
     * @return {Array<number>} The wav file bytes.
     * @private
     */
    createWaveFile_() {
        let options = {"be": this.LEorBE_()};
        return byteData_.packArray(this.chunkId, chr_).concat(
                byteData_.pack(this.chunkSize, uInt32_),
                byteData_.packArray(this.format, chr_),
                this.getBextBytes_(),
                byteData_.packArray(this.fmtChunkId, chr_),
                byteData_.pack(this.fmtChunkSize, uInt32_),
                byteData_.pack(this.audioFormat, uInt16_),
                byteData_.pack(this.numChannels, uInt16_),
                byteData_.pack(this.sampleRate, uInt32_),
                byteData_.pack(this.byteRate, uInt32_),
                byteData_.pack(this.blockAlign, uInt16_),
                byteData_.pack(this.bitsPerSample, uInt16_),
                this.getCbSizeBytes_(),
                this.getValidBitsPerSampleBytes_(),
                this.getFmtExtensionBytes_(),
                this.getFactBytes_(),
                byteData_.packArray(this.dataChunkId, chr_),
                byteData_.pack(this.dataChunkSize, uInt32_),
                this.samplesToBytes_(options),
                this.getCueBytes_()
            );
    }
}

module.exports = WaveFileReaderWriter;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

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
        /** @type {number} */
        this.dwChannelMask = 0; // 4 bytes
        /** @type {string} */ // ??
        this.subformat1 = 0;
        this.subformat2 = 0;
        this.subformat3 = 0;
        this.subformat4 = 0;

        /**
         * "fact" 
         * @type {string} 
         */
        this.factChunkId = "";
        /** @type {number} */
        this.factChunkSize = 0;
        /** @type {Array<number>} */
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
        /** @type {Array<number>} */
        this.cueChunkData = [];

        /**
         * "bext"
         * @type {string}
         */
        this.bextChunkId = "";
        /** @type {number} */
        this.bextChunkSize = 0;
        /** @type {Array<number>} */
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

        /**
         * "data"
         * @type {string}
         */
        this.dataChunkId = "";
        /** @type {number} */
        this.dataChunkSize = 0;
    }
}

module.exports = WaveFileHeader;


/***/ })
/******/ ]);