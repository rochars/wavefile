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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var int8 = new Int8Array(4)
var int32 = new Int32Array(int8.buffer, 0, 1)
var float32 = new Float32Array(int8.buffer, 0, 1)

function pack(i) {
    int32[0] = i
    return float32[0]
}

function unpack(f) {
    float32[0] = f
    return int32[0]
}

module.exports = pack
module.exports.pack = pack
module.exports.unpack = unpack

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
 * byte-padding: Funcions to pad bits and bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

/**
 * Padding for binary strings.
 * @param {!Array<string>} bytes The bytes as binary strings.
 * @param {number} base The base.
 * @param {number} index The byte to pad.
 */
function padding(bytes, base, index) {
    let offset = bytes[index].length + 1;
    if (base == 2 && bytes[index].length < 8) {
        offset = 9;
    }else if (base == 16) {
        offset = 3;
    }
    if (bytes[index].length < offset -1) {
        bytes[index] = 
            new Array((offset - bytes[index].length)).join("0")  + bytes[index];    
    }
}

/**
 * Fix the size of nibbles.
 * @param {!Array<string>} nibbles The nibble as a binary or hex string.
 * @param {number} base The base.
 * @param {number} index The nibble offset.
 */
function paddingNibble(nibbles, base, index) {
    if (base == 2 && nibbles[index].length < 4) {
        nibbles[index] = 
            new Array((5 - nibbles[index].length)).join("0")  + nibbles[index];
    }
}   

/**
 * Fix the size of crumbs.
 * @param {!Array<string>} crumbs The nibble as a binary or hex string.
 * @param {number} base The base.
 * @param {number} index The nibble offset.
 */
function paddingCrumb(crumbs, base, index) {
    if ((base == 2 || base == 16) && crumbs[index].length < 2) {
        crumbs[index] = '0' + crumbs[index];
    }
}   

/**
 * Padding with 0s for byte strings.
 * @param {string} byte The byte as a binary or hex string.
 * @param {number} base The base.
 * @returns {string} The padded byte.
 */
function bytePadding(byte, base) {
    let offset = byte.length + 1;
    if (base == 2) {
        offset = 9;
    } else if (base == 16) {
        offset = 3;   
    }
    if (byte.length < offset -1) {
        byte = new Array((offset - byte.length)).join("0")  + byte;
    }
    return byte;
}

module.exports.padding = padding;
module.exports.paddingNibble = paddingNibble;
module.exports.paddingCrumb = paddingCrumb;
module.exports.bytePadding = bytePadding;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*!
 * endianness: Swap byte endianness in a array of bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/endianness
 */

/**
 * Make the resulting byte array big endian or little endian.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} offset The swap offset according to the bit depth.
 *  - 2 for 16-bit
 *  - 3 for 24-bit
 *  - 4 for 32-bit
 *  - 5 for 40-bit
 *  - 6 for 48-bit
 *  - 8 for 64-bit
 */
function endianness(bytes, offset) {
    let len = bytes.length;
    let i = 0;
    while (i < len) {
        byteSwap(bytes, i, offset);
        i+=offset;
    }
    return bytes;
}

/**
 * Swap the endianees of a unit of information in a array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @param {number} numBytes The number of bytes according to
 *      the bit depth of the data.
 */
function byteSwap(bytes, i, numBytes) {
    let x = 0;
    let y = numBytes - 1;
    let limit = parseInt(numBytes / 2, 10);
    let swap;
    while(x < limit) {
        swap = bytes[i+x];
        bytes[i+x] = bytes[i+y];
        bytes[i+y] = swap;
        x++;
        y--;
    }
}

module.exports.endianness = endianness;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Functions to turn data into bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const float = __webpack_require__(4);
const intBits = __webpack_require__(0);
const toHalf = __webpack_require__(10);

function write64BitFloat(bytes, numbers, i, j) {
    let number = float.toFloat64(numbers[i]);
    bytes[j++] = number[1] & 0xFF;
    bytes[j++] = number[1] >>> 8 & 0xFF;
    bytes[j++] = number[1] >>> 16 & 0xFF;
    bytes[j++] = number[1] >>> 24 & 0xFF;
    bytes[j++] = number[0] & 0xFF;
    bytes[j++] = number[0] >>> 8 & 0xFF;
    bytes[j++] = number[0] >>> 16 & 0xFF;
    bytes[j++] = number[0] >>> 24 & 0xFF;
    return j;
}

// https://github.com/majimboo/c-struct
function write48Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xFF;
    bytes[j++] = numbers[i] >> 8 & 0xFF;
    bytes[j++] = numbers[i] >> 16 & 0xFF;
    bytes[j++] = numbers[i] >> 24 & 0xFF;
    bytes[j++] = numbers[i] / 0x100000000 & 0xFF;
    bytes[j++] = numbers[i] / 0x10000000000 & 0xFF;
    return j;
}

// https://github.com/majimboo/c-struct
function write40Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xFF;
    bytes[j++] = numbers[i] >> 8 & 0xFF;
    bytes[j++] = numbers[i] >> 16 & 0xFF;
    bytes[j++] = numbers[i] >> 24 & 0xFF;
    bytes[j++] = numbers[i] / 0x100000000 & 0xFF;
    return j;
}

function write32BitFloat(bytes, numbers, i, j) {
    numbers[i] = intBits.unpack(numbers[i]);
    bytes[j++] = numbers[i] & 0xFF;
    bytes[j++] = numbers[i] >>> 8 & 0xFF;
    bytes[j++] = numbers[i] >>> 16 & 0xFF;
    bytes[j++] = numbers[i] >>> 24 & 0xFF;
    return j;
}

function write32Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xFF;
    bytes[j++] = numbers[i] >>> 8 & 0xFF;
    bytes[j++] = numbers[i] >>> 16 & 0xFF;
    bytes[j++] = numbers[i] >>> 24 & 0xFF;
    return j;
}

function write24Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xFF;
    bytes[j++] = numbers[i] >>> 8 & 0xFF;
    bytes[j++] = numbers[i] >>> 16 & 0xFF;
    return j;
}

function write16Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xFF;
    bytes[j++] = numbers[i] >>> 8 & 0xFF;
    return j;
}

function write16BitFloat(bytes, numbers, i, j) {
    numbers[i] = toHalf.toHalf(numbers[i]);
    bytes[j++] = numbers[i] >>> 8 & 0xFF;
    bytes[j++] = numbers[i] & 0xFF;
    return j;
}

function write8Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xFF;
    return j;
}

function writeString(bytes, string, i, j) {
    bytes[j++] = string.charCodeAt(i);
    return j;
}

module.exports.write64BitFloat = write64BitFloat;
module.exports.write48Bit = write48Bit;
module.exports.write40Bit = write40Bit;
module.exports.write32BitFloat = write32BitFloat;
module.exports.write32Bit = write32Bit;
module.exports.write24Bit = write24Bit;
module.exports.write16Bit = write16Bit;
module.exports.write16BitFloat = write16BitFloat;
module.exports.write8Bit = write8Bit;
module.exports.writeString = writeString;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
 * float: Functions to work with 16, 32 & 64 bit floats.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

/**
 * Turn bytes to a float 16..
 * Thanks https://stackoverflow.com/a/8796597
 * @param {number} binary 2 bytes representing a float 16.
 */
function decodeFloat16 (binary) {
    var exponent = (binary & 0x7C00) >> 10,
        fraction = binary & 0x03FF;
    return (binary >> 15 ? -1 : 1) * (
        exponent ?
        (
            exponent === 0x1F ?
            fraction ? NaN : Infinity :
            Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
        ) :
        6.103515625e-5 * (fraction / 0x400)
    );
}

/**
 * Turn an array of bytes into a float 64.
 * Thanks https://gist.github.com/kg/2192799
 * @param {!Array<number>} bytes 8 bytes representing a float 64.
 */
function decodeFloat(bytes) {
    if (bytes.toString() == "0,0,0,0,0,0,0,0") {
        return 0;
    }
    let binary = "";
    let bits;
    let i = 0;
    let bytesLength = bytes.length;
    while(i < bytesLength) {
        bits = bytes[i].toString(2);
        while (bits.length < 8) {
            bits = "0" + bits;
        }
        binary = bits + binary;
        i++;
    }
    let significandBin = "1" + binary.substr(1 + 11, 52);
    let val = 1;
    let significand = 0;
    i = 0;
    while (i < significandBin.length) {
        significand += val * parseInt(significandBin.charAt(i), 10);
        val = val / 2;
        i++;
    }
    let sign = (binary.charAt(0) == "1") ? -1 : 1;
    let doubleValue = sign * significand *
        Math.pow(2, parseInt(binary.substr(1, 11), 2) - 1023);
    return doubleValue === 2 ? 0 : doubleValue;
}

/**
 * Unpack a 64 bit float into two words.
 * Thanks https://stackoverflow.com/a/16043259
 * @param {number} value A float64 number.
 */
function toFloat64(value) {
    if (value == 0) {
        return [0, 0];
    }
    let hiWord = 0;
    let loWord = 0;
    if (value <= 0.0) {
        hiWord = 0x80000000;
        value = -value;
    }
    let exponent = Math.floor(
        Math.log(value) / Math.log(2));
    let significand = Math.floor(
        (value / Math.pow(2, exponent)) * Math.pow(2, 52));
    loWord = significand & 0xFFFFFFFF;
    significand /= Math.pow(2, 32);
    exponent += 1023;
    hiWord = hiWord | (exponent << 20);
    hiWord = hiWord | (significand & ~(-1 << 20));
    return [hiWord, loWord];
}

module.exports.decodeFloat16 = decodeFloat16;
module.exports.decodeFloat = decodeFloat;
module.exports.toFloat64 = toFloat64;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
 * bit-depth: Configurations based on bit depth.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

/**
 * Offset for reading each bit depth.
 * @enum {number}
 */
const bitDepthOffsets = {
    1: 1,
    2: 1,
    4: 1,
    8: 1,
    16: 2,
    24: 3,
    32: 4,
    40: 5,
    48: 6,
    64: 8
};

/**
 * Max value for each bit depth.
 * @enum {number}
 */
const maxBitDepth = {
    2: 4,
    4: 16,
    8: 256,
    16: 65536,
    24: 16777216,
    32: 4294967296,
    40: 1099511627776,
    48: 281474976710656
};

module.exports.bitDepthOffsets = bitDepthOffsets;
module.exports.maxBitDepth = maxBitDepth;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Function to read data from bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */


let pad = __webpack_require__(1);
const float = __webpack_require__(4);
const intBits = __webpack_require__(0);

/**
 * Read a group of bytes by turning it to bits.
 * Useful for 40 & 48-bit, but underperform.
 * TODO find better alternative for 40 & 48-bit.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @param {number} numBytes The number of bytes
 *      (1 for 8-bit, 2 for 16-bit, etc).
 * @return {number}
 */
function readBytesAsBits(bytes, i, numBytes) {
    let j = numBytes-1;
    let bits = "";
    while (j >= 0) {
        bits += pad.bytePadding(bytes[j + i].toString(2), 2);
        j--;
    }
    return parseInt(bits, 2);
}

/**
 * Read 1 1-bit int from from booleans.
 * @param {!Array<number>|Uint8Array} bytes An array of booleans.
 * @param {number} i The index to read.
 * @return {number}
 */
function read1Bit(bytes, i) {
    return parseInt(bytes[i], 2);
}

// read2Bit, read4Bit == read8Bit

/**
 * Read 1 8-bit int from from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read8Bit(bytes, i) {
    return bytes[i];
}

/**
 * Read 1 16-bit int from from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read16Bit(bytes, i) {
    return bytes[1 + i] << 8 | bytes[i];
}

/**
 * Read 1 16-bit float from from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read16BitFloat(bytes, i) {
    let nBytes = bytes.slice(i,i+2);
    let binary = "";
    let bits = "";
    let j = 0;
    let bytesLength = nBytes.length;
    while(j < bytesLength) {
        bits = nBytes[j].toString(2);
        while (bits.length < 8) {
            bits = "0" + bits;
        }
        binary = binary + bits;
        j++;
    }
    binary = parseInt(binary, 2);
    return float.decodeFloat16(binary);
}

/**
 * Read 1 24-bit int from from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read24Bit(bytes, i) {
    return bytes[2 + i] << 16 |
        bytes[1 + i] << 8 |
        bytes[i];
}

/**
 * Read 1 32-bit int from from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read32Bit(bytes, i) {
    return (bytes[3 + i] << 24 |
        bytes[2 + i] << 16 |
        bytes[1 + i] << 8 |
        bytes[i]) >>> 0;
}

/**
 * Read 1 32-bit float from from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read32BitFloat(bytes, i) {
    return intBits.pack(read32Bit(bytes, i));
}

/**
 * Read 1 40-bit int from from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read40Bit(bytes, i) {
    return readBytesAsBits(bytes, i, 5);
}

/**
 * Read 1 48-bit int from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read48Bit(bytes, i) {
    return readBytesAsBits(bytes, i, 6);
}

/**
 * Read 1 64-bit double from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 */
function read64Bit(bytes, i) {
    return float.decodeFloat(bytes.slice(i,i+8));
}

/**
 * Read 1 char from bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {string}
 */
function readChar(bytes, i) {
    return String.fromCharCode(bytes[i]);
}

module.exports.readChar = readChar;
module.exports.read1Bit = read1Bit;
module.exports.read8Bit = read8Bit;
module.exports.read16Bit = read16Bit;
module.exports.read16BitFloat = read16BitFloat;
module.exports.read24Bit = read24Bit;
module.exports.read32Bit = read32Bit;
module.exports.read32BitFloat = read32BitFloat;
module.exports.read40Bit = read40Bit;
module.exports.read48Bit = read48Bit;
module.exports.read64Bit = read64Bit;



/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Wavefile
 * Handle wave files with 4, 8, 16, 24, 32 PCM, 32 IEEE & 64-bit data.
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = __webpack_require__(8);
const wavefileheader = __webpack_require__(13);

/**
 * A wave file.
 */
class WaveFile extends wavefileheader.WaveFileHeader {

    /**
     * @param {Uint8Array} bytes The file bytes.
     * @param {boolean} enforceFact True if it should throw a error
     *      if no "fact" chunk is found.
     * @param {boolean} enforceBext True if it should throw a error
     *      if no "bext" chunk is found.
     */
    constructor(bytes, enforceFact=false, enforceBext=false) {
        super();
        /** @type {boolean} */
        this.enforceFact = enforceFact;
        /** @type {boolean} */
        this.enforceBext = enforceBext;        
        /**
         * Header formats.
         * @enum {number}
         */
        this.headerFormats_ = {
            "4": 17,
            "8": 1,
            "16": 1,
            "24": 1,
            "32": 1,
            "32f": 3,
            "64": 3
        };
        /**
         * Error messages.
         * @enum {string}
         */
        this.WaveErrors = {
            'format': "Not a supported format.",
            'wave': "Could not find the 'WAVE' chunk",
            'fmt ': "Could not find the 'fmt ' chunk",
            'data': "Could not find the 'data' chunk",
            'fact': "Could not find the 'fact' chunk",
            'bext': "Could not find the 'bext' chunk"
        };
        if(bytes) {
            this.fromBytes(bytes);
        }
    }

    /**
     * Read a wave file from an array of bytes.
     * @param {Uint8Array} bytes The wave file as an array of bytes.
     */    
    fromBytes(bytes) {
        this.readRIFFChunk_(bytes);
        this.readWAVEChunk_(bytes);
        this.readFmtChunk_(bytes);
        try {
            this.readFactChunk_(bytes);
        }catch(err) {
            if (this.enforceFact) {
                throw err;
            }
        }
        try {
            this.readBextChunk_(bytes);
        }catch(err) {
            if (this.enforceBext) {
                throw err;
            }
        }
        this.readDataChunk_(bytes);
    }

    /**
     * Turn the wave file represented by an object of this class into
     * a array of bytes.
     * @return {Uint8Array}
     */
    toBytes() {
        this.checkWriteInput_(this.numChannels, this.sampleRate, this.bitDepth_);
        this.samplesToBytes_();
        let header = this.createWaveHeader_();
        let file = this.createWaveFile_(header);
        return new Uint8Array(file);
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "RIFF" chunk is found.
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData.stringFromBytes(bytes.slice(0, 4));
        if (this.chunkId != "RIFF") {
            throw Error(this.WaveErrors.format);
        }
        this.chunkSize = byteData.intFrom4Bytes(
            bytes.slice(4, 8))[0];
    }

    /**
     * Read the WAVE chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "WAVE" chunk is found.
     */
    readWAVEChunk_(bytes) {
        let start = byteData.findString(bytes, "WAVE");
        if (start === -1) {
            throw Error(this.WaveErrors.wave);
        }
        this.subChunk1Id = byteData.stringFromBytes(
                bytes.slice(start, start + 4));
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "fmt " chunk is found.
     */
    readFmtChunk_(bytes) {
        let start = byteData.findString(bytes, "fmt ");
        if (start === -1) {
            throw Error(this.WaveErrors['fmt ']);
        }
        this.format = byteData.stringFromBytes(
            bytes.slice(start, start + 4));
        this.subChunk1Size = byteData.uIntFrom4Bytes(
            bytes.slice(start + 4, start + 8))[0];
        this.audioFormat = byteData.uIntFrom2Bytes(
            bytes.slice(start + 8, start + 10))[0];
        this.numChannels = byteData.uIntFrom2Bytes(
            bytes.slice(start + 10, start + 12))[0];
        this.sampleRate = byteData.uIntFrom4Bytes(
            bytes.slice(start + 12, start + 16))[0];
        this.byteRate = byteData.uIntFrom4Bytes(
            bytes.slice(start + 16, start + 20))[0];
        this.blockAlign = byteData.uIntFrom2Bytes(
            bytes.slice(start + 20, start + 22))[0];
        this.bitsPerSample = byteData.uIntFrom2Bytes(
            bytes.slice(start + 22, start + 24))[0];
        // The bitDepth_ is used internally to determine
        // wich function use to read the samples
        if (this.audioFormat == 3 && this.bitsPerSample == 32) {
            this.bitDepth_ = "32f";
        }else {
            this.bitDepth_ = this.bitsPerSample.toString();
        }
    }

    /**
     * Read the "fact" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "fact" chunk is found.
     */
    readFactChunk_(bytes) {
        let start = byteData.findString(bytes, "fact");
        if (start === -1) {
            throw Error(this.WaveErrors.fact);
        }else {
            this.factChunkId = byteData.stringFromBytes(
                bytes.slice(start, start + 4));
            this.factChunkSize = byteData.uIntFrom4Bytes(
                bytes.slice(start + 4, start + 8)); // minimum 4
            this.dwSampleLength = byteData.uIntFrom4Bytes(
                bytes.slice(start + 8, start + 16));
        }
    }

    /**
     * Read the "bext" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "bext" chunk is found.
     */
    readBextChunk_(bytes) {
        let start = byteData.findString(bytes, "bext");
        if (start === -1) {
            throw Error(this.WaveErrors.bext);
        }else {
            this.bextChunkId = byteData.stringFromBytes(
                bytes.slice(start, start + 4));
        }
    }

    /**
     * Read the "data" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "data" chunk is found.
     */
    readDataChunk_(bytes) {
        let start = byteData.findString(bytes, "data");
        if (start === -1) {
            throw Error(this.WaveErrors.data);
        }
        this.subChunk2Id = byteData.stringFromBytes(
            bytes.slice(start, start + 4));
        this.subChunk2Size = byteData.intFrom4Bytes(
            bytes.slice(start + 4, start + 8))[0];
        this.samplesFromBytes_(bytes, start);
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Uint8Array} bytes Array of bytes representing the wave file.
     * @param {number} start The offset to start reading.
     */
    samplesFromBytes_(bytes, start) {
        let readingFunctions = {
            "4": byteData.intFrom1Byte,
            "8": byteData.uIntFrom1Byte,
            "16": byteData.intFrom2Bytes,
            "24": byteData.intFrom3Bytes,
            "32": byteData.intFrom4Bytes,
            "32f": byteData.floatFrom4Bytes,
            "64" : byteData.floatFrom8Bytes
        };
        let samples = bytes.slice(start + 8, start + 8 + this.subChunk2Size);
        this.samples_ = readingFunctions[this.bitDepth_](samples);
    }

    /**
     * Validate the input for wav writing.
     * @param {number} numChannels The number of channels
     *     Should be a int greater than zero smaller than the
     *     channel limit according to the bit depth.
     * @param {number} sampleRate The sample rate.
     *     Should be a int greater than zero smaller than the
     *     channel limit according to the bit depth and number of channels.
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
     * @throws {Error} If any argument does not meet the criteria.
     */
    checkWriteInput_(numChannels, sampleRate, bitDepth) {
        if (typeof bitDepth !== "string" ||
            !(bitDepth in this.headerFormats_)) {
            throw new Error("Invalid bit depth.");
        }
        this.validateNumChannels_(numChannels, bitDepth);
        this.validateSampleRate_(numChannels, sampleRate, bitDepth);
    }

    /**
     * Validate the sample rate value.
     * @param {number} numChannels The number of channels
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
     * @throws {Error} If any argument does not meet the criteria.
     */
    validateNumChannels_(numChannels, bitDepth) {
        let errorText = "Invalid number of channels.";
        let validChannnelNumber = false;
        let blockAlign = numChannels * (parseInt(bitDepth, 10) / 8);
        if (blockAlign <= 65535) {
            validChannnelNumber = true;
        }
        if (numChannels < 1 || !validChannnelNumber ||
            !(typeof numChannels==="number" && (numChannels%1)===0)) {
            throw new Error(errorText);
        }
        return true;
    }

    /**
     * Validate the sample rate value.
     * @param {number} numChannels The number of channels
     *     Should be a int greater than zero smaller than the
     *     channel limit according to the bit depth.
     * @param {number} sampleRate The sample rate.
     * @param {string} bitDepth The audio bit depth.
     *     Should be one of "8", "16", "24", "32", "32f", "64".
     * @throws {Error} If any argument does not meet the criteria.
     */
    validateSampleRate_(numChannels, sampleRate, bitDepth) {
        let errorText = "Invalid sample rate.";
        let validSampleRateValue = false;
        let byteRate = numChannels * (parseInt(bitDepth, 10) / 8) * sampleRate;
        if (byteRate <= 4294967295) {
            validSampleRateValue = true;
        }
        if (sampleRate < 1 || !validSampleRateValue ||
            !(typeof sampleRate==="number" && (sampleRate%1)===0)) {
            throw new Error(errorText);
        }
        return true;
    }

    /**
     * Return a object representing the wave file header data.
     * @return {Object} The wav file header.
     */
    createWaveHeader_() {
        let bytes = parseInt(this.bitDepth_, 10) / 8;
        let chunkSizeBase;
        let subChunk1SizeVal;
        let byteRateVal;
        let blockAlignVal;
        let subChunk2SizeVal;
        let factVal;
        if (this.bitDepth_ == "4") {
            chunkSizeBase = 40;
            subChunk1SizeVal = 20;
            byteRateVal = this.byteRate;
            blockAlignVal = this.blockAlign;
            subChunk2SizeVal = this.samples_.length;
            factVal = byteData.stringToBytes("fact");
        } else {
            chunkSizeBase = 36;
            subChunk1SizeVal = 16;
            byteRateVal = (this.numChannels * bytes) * this.sampleRate;
            blockAlignVal = this.numChannels * bytes;
            subChunk2SizeVal = this.samples_.length * bytes;
            factVal = [];
        }
        return {
            chunkId      : byteData.stringToBytes("RIFF"),
            chunkSize    : chunkSizeBase + this.samples_.length * bytes,
            format       : byteData.stringToBytes("WAVE"),
            subChunk1Id  : byteData.stringToBytes("fmt "),
            subChunk1Size: subChunk1SizeVal,
            audioFormat  : this.headerFormats_[this.bitDepth_],
            numChannels  : this.numChannels,
            sampleRate   : this.sampleRate,
            byteRate     : byteRateVal,
            blockAlign   : blockAlignVal,
            bitsPerSample: parseInt(this.bitDepth_, 10),
            fact         : factVal,
            subChunk2Id  : byteData.stringToBytes("data"),
            subChunk2Size: subChunk2SizeVal
        };
    }

    /**
     * Split each sample into bytes.
     */
    samplesToBytes_() {
        let writingFunctions = {
            "4": byteData.intTo1Byte,
            "8": byteData.intTo1Byte,
            "16": byteData.intTo2Bytes,
            "24": byteData.intTo3Bytes,
            "32": byteData.intTo4Bytes,
            "32f": byteData.floatTo4Bytes,
            "64" : byteData.floatTo8Bytes
        };
        // FIXME byte-data should not modify the original array
        let s = [];
        for (let l=0; l<this.samples_.length; l++) {
            s[l] = this.samples_[l];
        }
        this.bytes_ = writingFunctions[this.bitDepth_](s);
        if (this.bytes_.length % 2) {
            this.bytes_.push(0);
        }
    }

    /**
     * Join the wav header and the samples.
     * @param {Object} header The header byte array.
     * @return {Uint8Array} The wav file bytes.
     */
    createWaveFile_(header) {
        return header.chunkId.concat(
            byteData.intTo4Bytes([header.chunkSize]),
            header.format, 
            header.subChunk1Id,
            byteData.intTo4Bytes([header.subChunk1Size]),
            byteData.intTo2Bytes([header.audioFormat]),
            byteData.intTo2Bytes([header.numChannels]),
            byteData.intTo4Bytes([header.sampleRate]),
            byteData.intTo4Bytes([header.byteRate]),
            byteData.intTo2Bytes([header.blockAlign]),
            byteData.intTo2Bytes([header.bitsPerSample]),
            header.fact,
            header.subChunk2Id,
            byteData.intTo4Bytes([header.subChunk2Size]),
            this.bytes_);
    }
}

window['WaveFile'] = WaveFile;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * byte-data
 * Readable data to and from bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

let toBytes = __webpack_require__(9);
let fromBytes = __webpack_require__(11);
let bitPacker = __webpack_require__(12);
let writer = __webpack_require__(3);
let reader = __webpack_require__(6);

/**
 * Find and return the start offset of some string.
 * @param {!Array<number>|Uint8Array} bytes Array of bytes.
 * @param {string} chunk Some string to look for.
 * @return {number} The start offset of the first occurrence found.
 */
function findString(bytes, chunk) {
    let found = "";
    for (let i = 0; i < bytes.length; i++) {
        found = fromBytes.stringFromBytes(bytes.slice(i, i + chunk.length));
        if (found == chunk) {
            return i;
        }
    }
    return -1;
}

module.exports.packBooleans = bitPacker.packBooleans;
module.exports.unpackBooleans = bitPacker.unpackBooleans;
module.exports.packCrumbs = bitPacker.packCrumbs;
module.exports.unpackCrumbs = bitPacker.unpackCrumbs;
module.exports.packNibbles = bitPacker.packNibbles;
module.exports.unpackNibbles = bitPacker.unpackNibbles;

module.exports.findString = findString;
module.exports.stringToBytes = toBytes.stringToBytes;
module.exports.stringFromBytes = fromBytes.stringFromBytes;

module.exports.doubleTo8Bytes = toBytes.floatTo8Bytes;
module.exports.floatTo8Bytes = toBytes.floatTo8Bytes;
module.exports.floatTo4Bytes = toBytes.floatTo4Bytes;
module.exports.intTo6Bytes = toBytes.intTo6Bytes;
module.exports.intTo5Bytes = toBytes.intTo5Bytes;
module.exports.intTo4Bytes = toBytes.intTo4Bytes;
module.exports.intTo3Bytes = toBytes.intTo3Bytes;
module.exports.intTo2Bytes = toBytes.intTo2Bytes;
module.exports.floatTo2Bytes = toBytes.floatTo2Bytes;
module.exports.intTo1Byte = toBytes.intTo1Byte;
module.exports.intToNibble = toBytes.intToNibble;
module.exports.toCrumb = toBytes.toCrumb;
module.exports.toBoolean = toBytes.toBoolean;

module.exports.floatFrom8Bytes = fromBytes.floatFrom8Bytes;
module.exports.doubleFrom8Bytes = fromBytes.floatFrom8Bytes;
module.exports.intFrom6Bytes = fromBytes.intFrom6Bytes;
module.exports.uIntFrom6Bytes = fromBytes.uIntFrom6Bytes;
module.exports.intFrom5Bytes = fromBytes.intFrom5Bytes;
module.exports.uIntFrom5Bytes = fromBytes.uIntFrom5Bytes;
module.exports.intFrom4Bytes = fromBytes.intFrom4Bytes;
module.exports.uIntFrom4Bytes = fromBytes.uIntFrom4Bytes;
module.exports.floatFrom4Bytes = fromBytes.floatFrom4Bytes;
module.exports.intFrom3Bytes = fromBytes.intFrom3Bytes;
module.exports.uIntFrom3Bytes = fromBytes.uIntFrom3Bytes;
module.exports.floatFrom2Bytes = fromBytes.floatFrom2Bytes;
module.exports.intFrom2Bytes = fromBytes.intFrom2Bytes;
module.exports.uIntFrom2Bytes = fromBytes.uIntFrom2Bytes;
module.exports.intFrom1Byte = fromBytes.intFrom1Byte;
module.exports.uIntFrom1Byte = fromBytes.uIntFrom1Byte;
module.exports.intFromNibble = fromBytes.intFromNibble;
module.exports.uIntFromNibble = fromBytes.uIntFromNibble;
module.exports.intFromCrumb = fromBytes.intFromCrumb;
module.exports.uIntFromCrumb = fromBytes.uIntFromCrumb;
module.exports.fromBoolean = fromBytes.fromBoolean;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * to-bytes: convert bytes to numbers and strings.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const intBits = __webpack_require__(0);
const pad = __webpack_require__(1);
const endianness = __webpack_require__(2);
const writer = __webpack_require__(3);
const bitDepths = __webpack_require__(5);

/**
 * Turn numbers and strings to bytes.
 * @param {!Array<number>|string} numbers float64 numbers.
 * @param {number} base The base, 2, 10 or 16.
 * @param {Function} writer The function to turn the data to bytes.
 * @param {number} bitDepth The desired bitDepth for the data.
 * @param {boolean} bigEndian If the the bytes should be big endian or not.
 * @return {!Array<number>} the bytes.
 */
function toBytes(numbers, base, writer, bitDepth, bigEndian) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i < len) {            
        j = writer(bytes, numbers, i, j);
        i++;
    }
    bytesToBase(bytes, base);
    if (bigEndian) {
        endianness.endianness(bytes, bitDepths.bitDepthOffsets[bitDepth]);
    }
    return bytes;
}

/**
 * Turn bytes to base.
 * @param {!Array<string>|!Array<number>} bytes The bytes.
 * @param {number} base The base.
 * @param {Function} padFunction The function to use for padding.
 */
function bytesToBase(bytes, base, padFunction=pad.padding) {
    if (base != 10) {
        let i = 0;
        let len = bytes.length;
        while (i < len) {
            bytes[i] = bytes[i].toString(base);
            padFunction(bytes, base, i);
            i++;
        }
    }
}

/**
 * Split 64 bit numbers into bytes.
 * @param {!Array<number>} numbers float64 numbers.
 * @return {!Array<number>} the bytes.
 */
function floatTo8Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write64BitFloat, 64, bigEndian);
}

/**
 * Split 32 bit float numbers into bytes.
 * @param {!Array<number>} numbers float32 numbers.
 * @return {!Array<number>} the bytes.
 */
function floatTo4Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write32BitFloat, 32, bigEndian);
}

/**
 * Split 48 bit int numbers into 6 bytes.
 * @param {!Array<number>} numbers.
 * @return {!Array<number>} the bytes.
 */
function intTo6Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write48Bit, 48, bigEndian);
}

/**
 * Split 40 bit int numbers into 5 bytes.
 * @param {!Array<number>} numbers.
 * @return {!Array<number>} the bytes.
 */
function intTo5Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write40Bit, 40, bigEndian);
}

/**
 * Split 32 bit int numbers into bytes.
 * @param {!Array<number>} numbers int32 numbers.
 * @return {!Array<number>} the bytes.
 */
function intTo4Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write32Bit, 32, bigEndian);
}

/**
 * Split 24 bit int numbers into bytes.
 * @param {!Array<number>} numbers int24 numbers.
 * @return {!Array<number>} the bytes.
 */
function intTo3Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write24Bit, 24, bigEndian);
}

/**
 * Split 16 bit int numbers into bytes.
 * @param {!Array<number>} numbers int16 numbers.
 * @return {!Array<number>} the bytes.
 */
function intTo2Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write16Bit, 16, bigEndian);
}

/**
 * Split a 8 bit int numbers into bytes
 * @param {!Array<number>} numbers int8 numbers.
 * @return {!Array<number>} the bytes.
 */
function intTo1Byte(numbers, base=10) {
    return toBytes(numbers, base, writer.write8Bit, 8, false);
}

/**
 * 4-bit int numbers into a nibbles.
 * @param {!Array<number>} numbers int8 numbers.
 * @return {!Array<number>} the bytes.
 */
function intToNibble(numbers, base=10) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i < len) {
        bytes[j++] = numbers[i] & 0xF;
        i++;
    }
    bytesToBase(bytes, base, pad.paddingNibble);
    return bytes;
}

/**
 * Values to crumb form.
 * @param {!Array<number>} values Array of numbers.
 * @param {number} base The base.
 * @return {!Array<number>} the crumbs.
 */
function toCrumb(values, base=10) {
    let i = 0;
    let j = 0;
    let len = values.length;
    let bytes = [];
    while (i < len) {
        bytes[j++] = values[i] < 0 ? values[i] + 4 : values[i];
        i++;
    }
    bytesToBase(bytes, base, pad.paddingCrumb);
    return bytes;
}

/**
 * Values to boolean form.
 * @param {!Array<number>} values Array of numbers.
 * @param {number} base The base.
 * @return {!Array<number>} the booleans.
 */
function toBoolean(values, base=10) {
    let i = 0;
    let j = 0;
    let len = values.length;
    let booleans = [];
    while (i < len) {
        booleans[j++] = values[i] ? 1 : 0;
        i++;
    }
    bytesToBase(booleans, base, function(){});
    return booleans;
}

/**
 * Turn a string to an array of bytes.
 * @param {string} string The string.
 * @return {!Array<number>} the bytes.
 */
function stringToBytes(string, base=10) {
    return toBytes(string, base, writer.writeString, 8, false);
}

function floatTo2Bytes(numbers, base=10, bigEndian=false) {
    return toBytes(numbers, base, writer.write16BitFloat, 16, bigEndian);
}

module.exports.toBytes = toBytes;

// old interface
module.exports.floatTo8Bytes = floatTo8Bytes;
module.exports.floatTo4Bytes = floatTo4Bytes;
module.exports.floatTo2Bytes = floatTo2Bytes;
module.exports.intTo6Bytes = intTo6Bytes;
module.exports.intTo5Bytes = intTo5Bytes;
module.exports.intTo4Bytes = intTo4Bytes;
module.exports.intTo3Bytes = intTo3Bytes;
module.exports.intTo2Bytes = intTo2Bytes;
module.exports.intTo1Byte = intTo1Byte;
module.exports.intToNibble = intToNibble;
module.exports.toCrumb = toCrumb;
module.exports.toBoolean = toBoolean;
module.exports.stringToBytes = stringToBytes;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*!
 * to-half: int bits of half-precision floating point values
 * Based on:
 * https://mail.mozilla.org/pipermail/es-discuss/2017-April/047994.html
 * https://github.com/rochars/byte-data
 */

var floatView = new Float32Array(1);
var int32View = new Int32Array(floatView.buffer);

function toHalf(val) {
    floatView[0] = val;
    var x = int32View[0];
    var bits = (x >> 16) & 0x8000;
    var m = (x >> 12) & 0x07ff;
    var e = (x >> 23) & 0xff;
    if (e < 103) {
        return bits;
    }
    bits |= ((e - 112) << 10) | (m >> 1);
    bits += m & 1;
    return bits;
}

module.exports.toHalf = toHalf;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * from-bytes: convert bytes to numbers and strings.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const pad = __webpack_require__(1);
const endianness = __webpack_require__(2);
const reader = __webpack_require__(6);
const bitDepths = __webpack_require__(5);

/**
 * Turn a array of bytes into an array of what the bytes should represent.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. 2, 10 or 16.
 * @param {Function} reader The function to read the bytes.
 * @param {number} bitDepth The bitDepth. 1, 2, 4, 8, 16, 24, 32, 40, 48, 64.
 * @param {boolean} isSigned If readed numbers should be signed or not.
 * @return {!Array<number>} The values represented in the bytes.
 */
function fromBytes(bytes, base, reader, bitDepth, isSigned=false) {
    let numbers = [];
    let i = 0;
    let j = 0;
    let offset = bitDepths.bitDepthOffsets[bitDepth];
    let len = bytes.length - (offset -1);
    let maxBitDepthValue = bitDepths.maxBitDepth[bitDepth];
    bytesToInt(bytes, base);   
    if (isSigned) {
        while (i < len) {
            numbers[j] = signed(reader(bytes, i), maxBitDepthValue);
            i += offset;
            j++;
        }    
    } else {
        while (i < len) {
            numbers[j] = reader(bytes, i);
            i += offset;
            j++;
        }    
    }
    return numbers;
}

/**
 * Turn bytes to base 10.
 * @param {!Array<number>|Uint8Array} bytes The bytes as binary or hex strings.
 * @param {number} base The base.
 */
function bytesToInt(bytes, base) {
    if (base != 10) {
        let i = 0;
        let len = bytes.length;
        while(i < len) {
            bytes[i] = parseInt(bytes[i], base);
            i++;
        }
    }
}

/**
 * Turn a unsigned number to a signed number.
 * @param {number} number The number.
 * @param {number} maxValue The max range for the number bit depth.
 */
function signed(number, maxValue) {
    if (number > parseInt(maxValue / 2, 10) - 1) {
        number -= maxValue;
    }
    return number;
}

/**
 * Read numbers from a array of booleans.
 * @param {!Array<number>|Uint8Array} booleans An array of booleans.
 * @param {number} base The base. Defaults to 10.
 * @return {!Array<number>} The numbers.
 */
function fromBoolean(booleans, base=10) {
    return fromBytes(booleans, base, reader.read1Bit, 1);
}

/**
 * Read 2-bit signed ints from an array of crumbs.
 * @param {!Array<number>|Uint8Array} bytes An array of crumbs.
 * @param {number} base The base. Defaults to 10.
 * @return {!Array<number>} The numbers.
 */
function intFromCrumb(bytes, base=10) {
    return fromBytes(bytes, base, reader.read8Bit, 2, true);
}

/**
 * Read 4-bit signed ints from an array of nibbles.
 * @param {!Array<number>|Uint8Array} bytes An array of nibbles.
 * @param {number} base The base. Defaults to 10.
 * @return {!Array<number>} The numbers.
 */
function intFromNibble(bytes, base=10) {
    return fromBytes(bytes, base, reader.read8Bit, 4, true);
}

/**
 * Read 8-bit unsigned ints from an array of bytes.
 * Just return a copy of the original array.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @return {!Array<number>} The numbers.
 */
function uIntFrom1Byte(bytes, base=10) {
    return fromBytes(bytes, base, reader.read8Bit, 8);
}

/**
 * Read 8-bit signed ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @return {!Array<number>} The numbers.
 */
function intFrom1Byte(bytes, base=10) {
    return fromBytes(bytes, base, reader.read8Bit, 8, true);
}

/**
 * Read 16-bit unsigned ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function uIntFrom2Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 2);
    }
    return fromBytes(bytes, base, reader.read16Bit, 16);
}

/**
 * Read 16-bit signed ints from an array of bytes.
 * Thanks https://stackoverflow.com/a/38298413
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function intFrom2Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 2);
    }
    return fromBytes(bytes, base, reader.read16Bit, 16, true);
}

function floatFrom2Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 2);
    }
    return fromBytes(bytes, base, reader.read16BitFloat, 16);
}

/**
 * Read 24-bit unsigned ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function uIntFrom3Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 3);
    }
    return fromBytes(bytes, base, reader.read24Bit, 24);
}

/**
 * Read 24-bit signed ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function intFrom3Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 3);
    }
    return fromBytes(bytes, base, reader.read24Bit, 24, true);
}

/**
 * Read 32-bit unsigned ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function uIntFrom4Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 4);
    }
    return fromBytes(bytes, base, reader.read32Bit, 32);
}

/**
 * Read 32-bit signed ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function intFrom4Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 4);
    }
    return fromBytes(bytes, base, reader.read32Bit, 32, true);
}

/**
 * Read 32-bit float numbers from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function floatFrom4Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 4);
    }
    return fromBytes(bytes, base, reader.read32BitFloat, 32);
}

/**
 * Read 40-bit unsigned ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function uIntFrom5Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 5);
    }
    return fromBytes(bytes, base, reader.read40Bit, 40);
}

/**
 * Read 40-bit unsigned ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function intFrom5Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 5);
    }
    return fromBytes(bytes, base, reader.read40Bit, 40, true);
}

/**
 * Read 48-bit unsigned ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function uIntFrom6Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 6);
    }
    return fromBytes(bytes, base, reader.read48Bit, 48);
}

/**
 * Read 48-bit unsigned ints from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function intFrom6Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 6);
    }
    return fromBytes(bytes, base, reader.read48Bit, 48, true);
}

/**
 * Read 64-bit double precision numbers from an array of bytes.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @param {number} base The base. Defaults to 10.
 * @param {boolean} bigEndian If the bytes are big endian. Defaults to false.
 * @return {!Array<number>} The numbers.
 */
function floatFrom8Bytes(bytes, base=10, bigEndian=false) {
    if (bigEndian) {
        endianness.endianness(bytes, 8);
    }
    return fromBytes(bytes, base, reader.read64Bit, 64);
}

/**
 * Convert an array of bytes to a string.
 * @param {!Array<number>|Uint8Array} bytes An array of bytes.
 * @return {string} The string.
 */
function stringFromBytes(bytes, base=10) {
    return fromBytes(bytes, base, reader.readChar, 8).join("");
}

module.exports.fromBoolean = fromBoolean;
module.exports.intFromCrumb = intFromCrumb;
module.exports.uIntFromCrumb = uIntFrom1Byte;
module.exports.intFromNibble = intFromNibble;
module.exports.uIntFromNibble = uIntFrom1Byte;
module.exports.intFrom1Byte = intFrom1Byte;
module.exports.uIntFrom1Byte = uIntFrom1Byte;
module.exports.intFrom2Bytes = intFrom2Bytes;
module.exports.uIntFrom2Bytes = uIntFrom2Bytes;
module.exports.floatFrom2Bytes = floatFrom2Bytes;
module.exports.intFrom3Bytes = intFrom3Bytes;
module.exports.uIntFrom3Bytes = uIntFrom3Bytes;
module.exports.intFrom4Bytes = intFrom4Bytes;
module.exports.uIntFrom4Bytes = uIntFrom4Bytes;
module.exports.floatFrom4Bytes = floatFrom4Bytes;
module.exports.intFrom5Bytes = intFrom5Bytes;
module.exports.uIntFrom5Bytes = uIntFrom5Bytes;
module.exports.intFrom6Bytes = intFrom6Bytes;
module.exports.uIntFrom6Bytes = uIntFrom6Bytes;
module.exports.floatFrom8Bytes = floatFrom8Bytes;
module.exports.stringFromBytes = stringFromBytes;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
 * bit-packer: Pack and unpacl nibbles, crumbs and booleans into bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

/**
 * Pack 2 nibbles in 1 byte.
 * @param {!Array<number>} nibbles Array of nibbles.
 * @return {!Array<number>} Pairs of neebles packed as one byte.
 */
function packNibbles(nibbles) {
    let packed = [];
    let i = 0;
    let j = 0;
    let len = nibbles.length;
    if (len % 2) {
        nibbles.push(0);
    }
    while (i < len) {
        packed[j++] = parseInt(
            nibbles[i].toString(16) + nibbles[i+1].toString(16), 16);
        i+=2;
    }
    return packed;
}

/**
 * Unpack a byte into 2 nibbles.
 * @param {!Array<number>|Uint8Array} bytes Array of bytes.
 * @return {!Array<number>} The nibbles.
 */
function unpackNibbles(bytes) {
    let unpacked = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        unpacked[j++] = parseInt(bytes[i].toString(16)[0], 16);
        unpacked[j++] = parseInt(bytes[i].toString(16)[1], 16);
        i++;
    }
    return unpacked;
}

/**
 * Pack 4 crumbs in 1 byte.
 * @param {!Array<number>} crumbs Array of crumbs.
 * @return {!Array<number>} 4 crumbs packed as one byte.
 */
function packCrumbs(crumbs) {
    let packed = [];
    let i = 0;
    let j = 0;
    fixByteArraySize(crumbs, 4);
    let len = crumbs.length - 3;
    while (i < len) {
        packed[j++] = parseInt(
            lPadZeros(crumbs[i].toString(2), 2) +
            lPadZeros(crumbs[i+1].toString(2), 2) +
            lPadZeros(crumbs[i+2].toString(2), 2) +
            lPadZeros(crumbs[i+3].toString(2), 2), 2);
        i+=4;
    }
    return packed;
}

/**
 * Unpack a byte into 4 crumbs.
 * @param {!Array<number>|Uint8Array} crumbs Array of bytes.
 * @return {!Array<number>} The crumbs.
 */
function unpackCrumbs(crumbs) {
    let unpacked = [];
    let i = 0;
    let j = 0;
    let len = crumbs.length;
    let bitCrumb;
    console.log(len);
    while (i < len) {
        bitCrumb = lPadZeros(crumbs[i].toString(2), 8);
        unpacked[j++] = parseInt(bitCrumb[0] + bitCrumb[1], 2);
        unpacked[j++] = parseInt(bitCrumb[2] + bitCrumb[3], 2);
        unpacked[j++] = parseInt(bitCrumb[4] + bitCrumb[5], 2);
        unpacked[j++] = parseInt(bitCrumb[6] + bitCrumb[7], 2);
        i++;
    }
    return unpacked;
}

/**
 * Pack 8 booleans in 1 byte.
 * @param {!Array<number>} booleans Array of booleans.
 * @return {!Array<number>} 4 crumbs packed as one byte.
 */
function packBooleans(booleans) {
    let packed = [];
    let i = 0;
    let j = 0;
    fixByteArraySize(booleans, 8);
    let len = booleans.length - 7;
    while (i < len) {
        packed[j++] = parseInt(
            lPadZeros(booleans[i].toString(2), 1) +
            lPadZeros(booleans[i+1].toString(2), 1) +
            lPadZeros(booleans[i+2].toString(2), 1) +
            lPadZeros(booleans[i+3].toString(2), 1) +
            lPadZeros(booleans[i+4].toString(2), 1) +
            lPadZeros(booleans[i+5].toString(2), 1) +
            lPadZeros(booleans[i+6].toString(2), 1) +
            lPadZeros(booleans[i+7].toString(2), 1), 2);
        i+=8;
    }
    return packed;
}

/**
 * Unpack a byte into 8 booleans.
 * @param {!Array<number>|Uint8Array} booleans Array of bytes.
 * @return {!Array<number>} The booleans.
 */
function unpackBooleans(booleans) {
    let unpacked = [];
    let i = 0;
    let j = 0;
    let len = booleans.length;
    let bitBoolean;
    while (i < len) {
        bitBoolean = lPadZeros(booleans[i].toString(2), 8);
        unpacked[j++] = parseInt(bitBoolean[0], 2);
        unpacked[j++] = parseInt(bitBoolean[1], 2);
        unpacked[j++] = parseInt(bitBoolean[2], 2);
        unpacked[j++] = parseInt(bitBoolean[3], 2);
        unpacked[j++] = parseInt(bitBoolean[4], 2);
        unpacked[j++] = parseInt(bitBoolean[5], 2);
        unpacked[j++] = parseInt(bitBoolean[6], 2);
        unpacked[j++] = parseInt(bitBoolean[7], 2);
        i++;
    }
    return unpacked;
}

/**
 * Pad a string with zeros to the left.
 * TODO: This should support both arrays and strings.
 * @param {string} value The string (representing a binary or hex value).
 * @param {number} numZeros the max number of zeros.
 *      For 1 binary byte string it should be 8.
 */
function lPadZeros(value, numZeros) {
    let i = 0;
    while (value.length < numZeros) {
        value = '0' + value;
    }
    return value;
}

/**
 * Pad a array with zeros to the right.
 * @param {!Array<number>} byteArray The array.
 * @param {number} numZeros the max number of zeros.
 *      For 1 binary byte string it should be 8.
 *      TODO: better explanation of numZeros
 */
function fixByteArraySize(byteArray, numZeros) {
    let i = 0;
    let fix = byteArray.length % numZeros;
    if (fix) {
        fix = (fix - numZeros) * -1;
        while(i < fix) {
            byteArray.push(0);
            i++;
        }
    }
}

module.exports.packBooleans = packBooleans;
module.exports.unpackBooleans = unpackBooleans;
module.exports.packCrumbs = packCrumbs;
module.exports.unpackCrumbs = unpackCrumbs;
module.exports.packNibbles = packNibbles;
module.exports.unpackNibbles = unpackNibbles;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/*
 * WaveFileHeader
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
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
        /** @type {string} */
        this.factChunkId = "";
        /**
         * minimum 4
         * @type {number}
         */
        this.factChunkSize = 0;
        /** @type {number} */
        this.dwSampleLength = 0;
        /**
         * "data"
         * @type {string}
         */
        this.subChunk2Id = "";
        /** @type {number} */
        this.subChunk2Size = 0;
        /** @type {!Array<number>} */
        this.samples_ = [];
        /** @type {!Array<number>} */
        this.bytes_ = [];
        /** @type {string} */
        this.bitDepth_ = "";
        /**
         * "bext"
         * @type {string}
         */
        this.bextChunkId = "";
    }
}

module.exports.WaveFileHeader = WaveFileHeader;


/***/ })
/******/ ]);