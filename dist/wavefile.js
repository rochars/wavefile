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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Wavefile
 * Read wave files with 4, 8, 16, 24, 32 PCM, 32 IEEE & 64-bit data.
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 * 
 */

const byteData = __webpack_require__(2);

const unsupportedFormatError = "Not a supported format.";
const noWAVEChunkError = "Could not find the 'WAVE' chunk";
const noFmtChunkError = "Could not find the 'fmt ' chunk";
const noDataChunkError = "Could not find the 'data' chunk";

/*
 * A wave file.
 * Objects can be created by passing a Uint8Array
 * representing a wave file.
 */
class Wavefile {

    /**
     * @param {Uint8Array} wavBytes an array representing the wave file.
     */
    constructor(wavBytes) {
        /** @type {string} */
        this.chunkId = ""; // "RIFF"
        /** @type {number} */
        this.chunkSize = 0;
        /** @type {string} */
        this.subChunk1Id = ""; // "WAVE"
        /** @type {string} */
        this.format = ""; // "fmt "
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
        this.subChunk2Id = ""; // "data"
        /** @type {number} */
        this.subChunk2Size = 0;
        /** @type {!Array<number>} */
        this.samples = [];
        /** @type {string} */
        this.bitDepth_ = "";
        if(wavBytes) {
            this.readRIFFChunk_(wavBytes);
            this.readWAVEChunk_(wavBytes);
            this.readFmtChunk_(wavBytes);
            this.readDataChunk_(wavBytes);
        }
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "RIFF" chunk is found.
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData.stringFromBytes(bytes.slice(0, 4));
        if (this.chunkId != "RIFF") {
            throw Error(unsupportedFormatError);
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
            throw Error(noWAVEChunkError);
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
            throw Error(noFmtChunkError);
        }
        this.format = byteData.stringFromBytes(
            bytes.slice(start, start + 4));
        this.subChunk1Size = byteData.uIntFrom4Bytes(
            bytes.slice(start + 4, start + 8))[0];
        this.audioFormat = byteData.intFrom2Bytes(
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
     * Read the "data" chunk of a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "data" chunk is found.
     */
    readDataChunk_(bytes) {
        let start = byteData.findString(bytes, "data");
        if (start === -1) {
            throw Error(noDataChunkError);
        }
        this.subChunk2Id = byteData.stringFromBytes(
            bytes.slice(start, start + 4));
        this.subChunk2Size = byteData.intFrom4Bytes(
            bytes.slice(start + 4, start + 8))[0];
        this.readSamples_(bytes, start);
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Uint8Array} bytes Array of bytes representing the wave file.
     * @param {number} start The offset to start reading.
     */
    readSamples_(bytes, start) {
        let readingFunctions_ = {
            '4': byteData.intFrom1Byte,
            '8': byteData.uIntFrom1Byte,
            '16': byteData.intFrom2Bytes,
            '24': byteData.intFrom3Bytes,
            '32': byteData.intFrom4Bytes,
            '32f': byteData.floatFrom4Bytes,
            '64' : byteData.floatFrom8Bytes
        };
        this.samples = readingFunctions_[this.bitDepth_](
                bytes.slice(
                        start + 8,
                        start + 8 + this.subChunk2Size
                    )
            );
    }
}

module.exports.Wavefile = Wavefile;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * byte-data
 * Bytes to and from numbers and strings.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 * 
 */

// TODO: 48-bit

let toBytes = __webpack_require__(3);
let fromBytes = __webpack_require__(4);

/**
 * Find and return the start offset of some string.
 * Will return the start offset of the first occurrence found.
 * @param {Uint8Array} bytes Array of bytes.
 * @param {string} chunk Some string to look for.
 * @return {number} The start offset of the data chunk.
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

module.exports.floatTo8Bytes = toBytes.floatTo8Bytes;
module.exports.floatTo4Bytes = toBytes.floatTo4Bytes;
module.exports.intTo5Bytes = toBytes.intTo5Bytes;
module.exports.intTo4Bytes = toBytes.intTo4Bytes;
module.exports.intTo3Bytes = toBytes.intTo3Bytes;
module.exports.intTo2Bytes = toBytes.intTo2Bytes;
module.exports.intTo1Byte = toBytes.intTo1Byte;
module.exports.stringToBytes = toBytes.stringToBytes;

module.exports.intFrom1Byte = fromBytes.intFrom1Byte;
module.exports.uIntFrom1Byte = fromBytes.uIntFrom1Byte;
module.exports.intFrom2Bytes = fromBytes.intFrom2Bytes;
module.exports.uIntFrom2Bytes = fromBytes.uIntFrom2Bytes;
module.exports.intFrom3Bytes = fromBytes.intFrom3Bytes;
module.exports.uIntFrom3Bytes = fromBytes.uIntFrom3Bytes;
module.exports.intFrom4Bytes = fromBytes.intFrom4Bytes;
module.exports.uIntFrom4Bytes = fromBytes.uIntFrom4Bytes;
module.exports.floatFrom4Bytes = fromBytes.floatFrom4Bytes;
module.exports.floatFrom8Bytes = fromBytes.floatFrom8Bytes;
module.exports.stringFromBytes = fromBytes.stringFromBytes;

module.exports.findString = findString;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * to-bytes: convert bytes to numbers and strings.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 *
 */

const intBits = __webpack_require__(0);

/**
 * Unpack a 64 bit float into two words.
 * Thanks https://stackoverflow.com/a/16043259
 * @param {number} value A float64 number.
 */
function toFloat64(value) {
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

/**
 * Split 64 bit numbers into bytes.
 * @param {!Array<number>} numbers float64 numbers.
 */
function floatTo8Bytes(numbers) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i < len) {
        // fix the -0 bug
        if (numbers[i] == 0) {
            bytes[j++] = 0;
            bytes[j++] = 0;
            bytes[j++] = 0;
            bytes[j++] = 0;
            bytes[j++] = 0;
            bytes[j++] = 0;
            bytes[j++] = 0;
            bytes[j++] = 0;
        }else {
            numbers[i] = toFloat64(numbers[i]);
            bytes[j++] = (numbers[i][1]) & 0xFF;
            bytes[j++] = (numbers[i][1] >> 8) & 0xFF;
            bytes[j++] = (numbers[i][1] >> 16) & 0xFF;
            bytes[j++] = (numbers[i][1] >> 24) & 0xFF;
            bytes[j++] = (numbers[i][0]) & 0xFF;
            bytes[j++] = (numbers[i][0] >> 8) & 0xFF;
            bytes[j++] = (numbers[i][0] >> 16) & 0xFF;
            bytes[j++] = (numbers[i][0] >> 24) & 0xFF;
        }
        i++;
    }
    return bytes;
}

/**
 * Split 32 bit float numbers into bytes.
 * @param {!Array<number>} numbers float32 numbers.
 */
function floatTo4Bytes(numbers) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i < len) {            
        numbers[i] = intBits.unpack(numbers[i]);
        bytes[j++] = (numbers[i]) & 0xFF;
        bytes[j++] = (numbers[i] >> 8) & 0xFF;
        bytes[j++] = (numbers[i] >> 16) & 0xFF;
        bytes[j++] = (numbers[i] >> 24) & 0xFF;
        i++;
    }
    return bytes;
}

/**
 * Split 32 bit int numbers into bytes.
 * @param {!Array<number>} numbers int32 numbers.
 */
function intTo4Bytes(numbers) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i< len) {
        bytes[j++] = (numbers[i]) & 0xFF;
        bytes[j++] = (numbers[i] >> 8) & 0xFF;
        bytes[j++] = (numbers[i] >> 16) & 0xFF;
        bytes[j++] = (numbers[i] >> 24) & 0xFF;
        i++;
    }
    return bytes;
}

/**
 * Split 24 bit int numbers into bytes.
 * @param {!Array<number>} numbers int24 numbers.
 */
function intTo3Bytes(numbers) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i < len) {
        bytes[j++] = (numbers[i]) & 0xFF;
        bytes[j++] = (numbers[i] >> 8) & 0xFF;
        bytes[j++] = (numbers[i] >> 16) & 0xFF;
        i++;
    }
    return bytes;
}

/**
 * Split 16 bit int numbers into bytes.
 * @param {!Array<number>} numbers int16 numbers.
 */
function intTo2Bytes(numbers) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i < len) {
        bytes[j++] = (numbers[i]) & 0xFF;
        bytes[j++] = (numbers[i] >> 8) & 0xFF;
        i++;
    }
    return bytes;
}

/**
 * Split a 8 bit int numbers into bytes
 * @param {!Array<number>} numbers int8 numbers.
 */
function intTo1Byte(numbers) {
    let i = 0;
    let j = 0;
    let len = numbers.length;
    let bytes = [];
    while (i < len) {
        bytes[j++] = numbers[i] & 0xFF;
        i++;
    }
    return bytes;
}

/**
 * Turn a string to an array of bytes.
 * @param {string} string The string.
 */
function stringToBytes(string) {
    let i = 0;
    let j = 0;
    let len = string.length;
    let bytes = [];
    while (i < len) {
        bytes[j++] = string.charCodeAt(i);
        i++;
    }
    return bytes;
}

module.exports.floatTo8Bytes = floatTo8Bytes;
module.exports.floatTo4Bytes = floatTo4Bytes;
module.exports.intTo4Bytes = intTo4Bytes;
module.exports.intTo3Bytes = intTo3Bytes;
module.exports.intTo2Bytes = intTo2Bytes;
module.exports.intTo1Byte = intTo1Byte;
module.exports.stringToBytes = stringToBytes;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * from-bytes: convert bytes to numbers and strings.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 *
 */

const intBits = __webpack_require__(0);

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
 * Read 8-bit unsigned ints from an array of bytes.
 * Just return a copy of the original array.
 * @param {Uint8Array} bytes An array of bytes.
 */
function uIntFrom1Byte(bytes) {
    return bytes.slice();
}

/**
 * Read 8-bit signed ints from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function intFrom1Byte(bytes) {
    let samples = [];
    let i = 0;
    let len = bytes.length;
    while (i < len) {
        samples[i] = bytes[i];
        if (samples[i] > 127) {
            samples[i] -= 256;
        }
        i+=1;
    }
    return samples;
}

/**
 * Read 16-bit signed ints from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function intFrom2Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = (bytes[1 + i] << 8) | bytes[i];
         // Thanks https://stackoverflow.com/a/38298413
        if (bytes[1 + i] & (1 << 7)) {
           samples[j] = 0xFFFF0000 | samples[j];
        }
        j++;
        i+=2;
    }
    return samples;
}

/**
 * Read 16-bit unsigned ints from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function uIntFrom2Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = (bytes[1 + i] << 8) | bytes[i];                 
        j++;
        i+=2;
    }
    return samples;
}

/**
 * Read 24-bit signed ints from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function intFrom3Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = (
                bytes[2 + i] << 16 |
                bytes[1 + i] << 8 |
                bytes[i]
            );
        if ((samples[j] & 0x00800000) > 0) {
            samples[j] = samples[j] | 0xFF000000;
        } else {  
            samples[j] = samples[j] & 0x00FFFFFF;
        } 
        j++;
        i+=3;
    }
    return samples;
}

/**
 * Read 24-bit unsigned ints from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function uIntFrom3Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = (
                bytes[2 + i] << 16 |
                bytes[1 + i] << 8 |
                bytes[i]
            );
        j++;
        i+=3;
    }
    return samples;
}

/**
 * Read 32-bit signed ints from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function intFrom4Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = (
                bytes[3 + i] << 24 |
                bytes[2 + i] << 16 |
                bytes[1 + i] << 8 |
                bytes[i]
            );
        if ((samples[j] & 0x80000000) < 0) {
            samples[j] = samples[j] & 0xFFFFFFFF;  
        }
        j++;
        i+=4;
    }
    return samples;
}

/**
 * Read 32-bit unsigned ints from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function uIntFrom4Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = (
                bytes[3 + i] << 24 |
                bytes[2 + i] << 16 |
                bytes[1 + i] << 8 |
                bytes[i]
            );
        samples[j] = samples[j] >>> 0;
        j++;
        i+=4;
    }
    return samples;
}

/**
 * Read 8-bit IEEE numbers from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function floatFrom4Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = intBits.pack(
                bytes[3 + i] << 24 |
                bytes[2 + i] << 16 |
                bytes[1 + i] << 8 |
                bytes[i]
            );
        j++;
        i+=4;
    }
    return samples;
}

/**
 * Read 64-bit IEEE numbers from an array of bytes.
 * @param {Uint8Array} bytes An array of bytes.
 */
function floatFrom8Bytes(bytes) {
    let samples = [];
    let i = 0;
    let j = 0;
    let len = bytes.length;
    while (i < len) {
        samples[j] = decodeFloat([
                bytes[i],
                bytes[1 + i],
                bytes[2 + i],
                bytes[3 + i],
                bytes[4 + i],
                bytes[5 + i],
                bytes[6 + i],
                bytes[7 + i]
            ]);
        j++;
        i+=8;
    }
    return samples;
}

/**
 * Convert an array of bytes to a string.
 * @param {Uint8Array} bytes An array of bytes.
 * @returns {string} The string.
 */
function stringFromBytes(bytes) {
    let string = "";
    let i = 0;
    let len = bytes.length;
    while (i < len) {
        string += String.fromCharCode(bytes[i]);
        i++;
    }    
    return string;
}

module.exports.intFrom1Byte = intFrom1Byte;
module.exports.uIntFrom1Byte = uIntFrom1Byte;
module.exports.intFrom2Bytes = intFrom2Bytes;
module.exports.uIntFrom2Bytes = uIntFrom2Bytes;
module.exports.intFrom3Bytes = intFrom3Bytes;
module.exports.uIntFrom3Bytes = uIntFrom3Bytes;
module.exports.intFrom4Bytes = intFrom4Bytes;
module.exports.uIntFrom4Bytes = uIntFrom4Bytes;
module.exports.floatFrom4Bytes = floatFrom4Bytes;
module.exports.floatFrom8Bytes = floatFrom8Bytes;
module.exports.stringFromBytes = stringFromBytes;


/***/ })
/******/ ]);