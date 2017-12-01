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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * helpers: functions to work with bytes and byte arrays.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const endianness = __webpack_require__(11);
const bitDepths = __webpack_require__(1);

/**
 * Padding for binary strings.
 * @param {!Array<string>} bytes The bytes as binary strings.
 * @param {number} base The base.
 * @param {number} index The byte to pad.
 */
function padding(bytes, base, index) {
    bytes[index] = bytePadding(bytes[index], base);
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
        offset = 8;
    } else if (base == 16) {
        offset = 2;
    }
    return lPadZeros(byte, offset);
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
 * Pad a string with zeros to the left.
 * TODO: This should support both arrays and strings.
 * @param {string} value The string (representing a binary or hex value).
 * @param {number} numZeros the max number of zeros.
 *      For 1 binary byte string it should be 8.
 */
function lPadZeros(value, numZeros) {
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

/**
 * Swap the endianness to big endian.
 * @param {!Array<number>} bytes The values.
 * @param {boolean} isBigEndian True if the bytes should be big endian.
 * @param {number} bitDepth The bitDepth of the data.
 */
function makeBigEndian(bytes, isBigEndian, bitDepth) {
    if (isBigEndian) {
        endianness(bytes, bitDepths.BitDepthOffsets[bitDepth]);
    }
}

/**
 * Turn bytes to base 2, 10 or 16.
 * @param {!Array<string>|!Array<number>} bytes The bytes.
 * @param {number} base The base.
 * @param {Function} padFunction The function to use for padding.
 */
function bytesToBase(bytes, base, padFunction=padding) {
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
 * Turn the output to the correct base.
 * @param {!Array<number>} bytes The bytes.
 * @param {number} bitDepth The bit depth of the data.
 * @param {number} base The desired base for the output data.
 */
function outputToBase(bytes, bitDepth, base) {
    if (bitDepth == 4) {
        bytesToBase(bytes, base, paddingNibble);
    } else if (bitDepth == 2) {
        bytesToBase(bytes, base, paddingCrumb);
    } else if(bitDepth == 1) {
        bytesToBase(bytes, base, function(){});
    }else {
        bytesToBase(bytes, base);
    }
}

/**
 * Make a single value an array in case it is not.
 * If the value is a string it stays a string.
 * @param {!Array<number>|number|string} values The value or values.
 * @return {!Array<number>|string}
 */
function turnToArray(values) {
    if (!Array.isArray(values) && typeof values != "string") {
        values = [values];
    }
    return values;
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

module.exports.makeBigEndian = makeBigEndian;
module.exports.bytesToBase = bytesToBase;
module.exports.outputToBase = outputToBase;
module.exports.turnToArray = turnToArray;
module.exports.signed = signed;
module.exports.bytesToInt = bytesToInt;
module.exports.fixByteArraySize = fixByteArraySize;
module.exports.padding = padding;
module.exports.paddingNibble = paddingNibble;
module.exports.paddingCrumb = paddingCrumb;
module.exports.bytePadding = bytePadding;
module.exports.lPadZeros = lPadZeros;


/***/ }),
/* 1 */
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
const BitDepthOffsets = {
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
const BitDepthMaxValues = {
    2: 4,
    4: 16,
    8: 256,
    16: 65536,
    24: 16777216,
    32: 4294967296,
    40: 1099511627776,
    48: 281474976710656
};

module.exports.BitDepthOffsets = BitDepthOffsets;
module.exports.BitDepthMaxValues = BitDepthMaxValues;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*!
 * wavefile
 * Read & write wave files with 8, 16, 24, 32 & 64-bit data.
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * byte-data
 * Readable data to and from byte buffers.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 *
 */

let toBytes = __webpack_require__(9);
let fromBytes = __webpack_require__(12);
let bitPacker = __webpack_require__(14);
let bitDepth = __webpack_require__(1);

/**
 * Find and return the start index of some string.
 * Return -1 if the string is not found.
 * @param {!Array<number>|Uint8Array} bytes Array of bytes.
 * @param {string} chunk Some string to look for.
 * @return {number} The start index of the first occurrence, -1 if not found
 */
function findString(bytes, chunk) {
    let found = "";
    for (let i = 0; i < bytes.length; i++) {
        found = fromBytes.fromBytes(bytes.slice(i, i + chunk.length),
            8, {"char": true});
        if (found == chunk) {
            return i;
        }
    }
    return -1;
}

/**
 * Turn a number or string into a byte buffer.
 * @param {number|string} value The value.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the input. Optional. Default is 10.
 * @return {!Array<number>|!Array<string>}
 */
function pack(value, type, base=10) {
    let theType = Object.assign({}, type);
    theType.base = base;
    theType.single = true;
    value = theType.char ? value[0] : value;
    return toBytes.toBytes(value, theType.bitDepth, theType);
}

/**
 * Turn a byte buffer into a readable value.
 * @param {!Array<number>|!Array<string>|Uint8Array} buffer An array of bytes.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the input. Optional. Default is 10.
 * @return {number|string}
 */
function unpack(buffer, type, base=10) {
    let theType = Object.assign({}, type);
    theType.base = base;
    theType.single = true;
    return fromBytes.fromBytes(buffer, theType.bitDepth, theType);
}

/**
 * Turn a array of numbers into a byte buffer.
 * @param {!Array<number>} values The values.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the input. Optional. Default is 10.
 * @return {!Array<number>|!Array<string>}
 */
function packSequence(values, type, base=10) {
    let theType = Object.assign({}, type);
    theType.base = base;
    theType.single = false;
    return toBytes.toBytes(values, theType.bitDepth, theType);
}

/**
 * Turn a byte array into a sequence of readable values.
 * @param {!Array<number>|!Array<string>|Uint8Array} buffer The byte array.
 * @param {Object} type One of the available types.
 * @param {number} base The base of the input. Optional. Default is 10.
 * @return {!Array<number>|string}
 */
function unpackSequence(buffer, type, base=10) {
    let theType = Object.assign({}, type);
    theType.base = base;
    theType.single = false;
    return fromBytes.fromBytes(buffer, theType.bitDepth, theType);
}

// interface
window['WaveFile'].pack = pack;
module.exports.unpack = unpack;
module.exports.packSequence = packSequence;
module.exports.unpackSequence = unpackSequence;

// types
module.exports.char = {"bitDepth": 8, "char": true, "single": true};
module.exports.bool = {"bitDepth": 1, "single": true};
module.exports.int2 = {"bitDepth": 2, "signed": true, "single": true};
module.exports.uInt2 = {"bitDepth": 2, "single": true};
module.exports.int4 = {"bitDepth": 4, "signed": true, "single": true};
module.exports.uInt4 = {"bitDepth": 4, "single": true};
module.exports.int8 = {"bitDepth": 8, "signed": true, "single": true};
module.exports.uInt8 = {"bitDepth": 8, "single": true};
module.exports.int16  = {"bitDepth": 16, "signed": true, "single": true};
module.exports.uInt16 = {"bitDepth": 16, "single": true};
module.exports.float16 = {"bitDepth": 16, "float": true, "single": true};
module.exports.int24 = {"bitDepth": 24, "signed": true, "single": true};
module.exports.uInt24 = {"bitDepth": 24, "single": true};
module.exports.int32 = {"bitDepth": 32, "signed": true, "single": true};
module.exports.uInt32 = {"bitDepth": 32, "single": true};
module.exports.float32 = {"bitDepth": 32, "float": true, "single": true};
module.exports.int40 = {"bitDepth": 40, "signed": true, "single": true};
module.exports.uInt40 = {"bitDepth": 40, "single": true};
module.exports.int48 = {"bitDepth": 48, "signed": true, "single": true};
module.exports.uInt48 = {"bitDepth": 48, "single": true};
module.exports.float64 = {"bitDepth": 64, "float": true, "single": true};

// Legacy types
module.exports.floatLE = {"float": true, "single": true};
module.exports.intLE = {"signed": true, "single": true};
module.exports.uIntLE = {"single": true};
module.exports.floatBE = {"float": true, "single": true, "be": true};
module.exports.intBE = {"signed": true, "single": true, "be": true};
module.exports.uIntBE = {"single": true, "be": true};

module.exports.floatArrayLE = {"float": true};
module.exports.intArrayLE = {"signed": true};
module.exports.uIntArrayLE = {"base": 10};
module.exports.floatArrayBE = {"float": true, "be": true};
module.exports.intArrayBE = {"signed": true, "be": true};
module.exports.uIntArrayBE = {"be": true};
module.exports.str = {"char": true};

// Legacy interface
module.exports.findString = findString;
module.exports.toBytes = toBytes.toBytes;
module.exports.fromBytes = fromBytes.fromBytes;
module.exports.packBooleans = bitPacker.packBooleans;
module.exports.unpackBooleans = bitPacker.unpackBooleans;
module.exports.packCrumbs = bitPacker.packCrumbs;
module.exports.unpackCrumbs = bitPacker.unpackCrumbs;
module.exports.packNibbles = bitPacker.packNibbles;
module.exports.unpackNibbles = bitPacker.unpackNibbles;
module.exports.BitDepthOffsets = bitDepth.BitDepthOffsets;
module.exports.BitDepthMaxValues = bitDepth.BitDepthMaxValues;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * float: Functions to work with 16, 32 & 64 bit floats.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const helpers = __webpack_require__(0);

function getBinary(bytes, rev=false) {
    let binary = "";
    let i = 0;
    let bytesLength = bytes.length;
    while(i < bytesLength) {
        let bits = helpers.lPadZeros(bytes[i].toString(2), 8);
        if (rev) {
            binary = binary + bits;
        } else {
            binary = bits + binary;
        }
        i++;
    }
    return binary;
}

/**
 * Turn bytes to a float 16..
 * Thanks https://stackoverflow.com/a/8796597
 * @param {number} bytes 2 bytes representing a float 16.
 */
function decodeFloat16 (bytes) {
    let binary = parseInt(getBinary(bytes, true), 2);
    let exponent = (binary & 0x7C00) >> 10;
    let fraction = binary & 0x03FF;
    let floatValue;
    if (exponent) {
        floatValue =  Math.pow(2, exponent - 15) * (1 + fraction / 0x400);
    } else {
        floatValue = 6.103515625e-5 * (fraction / 0x400);
    }
    return  floatValue * (binary >> 15 ? -1 : 1);
}

/**
 * Turn an array of bytes into a float 64.
 * Thanks https://gist.github.com/kg/2192799
 * @param {!Array<number>} bytes 8 bytes representing a float 64.
 */
function decodeFloat64(bytes) {
    if (bytes.toString() == "0,0,0,0,0,0,0,0") {
        return 0;
    }
    let binary = getBinary(bytes);
    let significandBin = "1" + binary.substr(1 + 11, 52);
    let val = 1;
    let significand = 0;
    let i = 0;
    while (i < significandBin.length) {
        significand += val * parseInt(significandBin.charAt(i), 10);
        val = val / 2;
        i++;
    }
    let sign = (binary.charAt(0) == "1") ? -1 : 1;
    let doubleValue = sign * significand *
        Math.pow(2, parseInt(binary.substr(1, 11), 2) - 1023);
    return doubleValue;
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

let floatView = new Float32Array(1);
let int32View = new Int32Array(floatView.buffer);

/**
 * to-half: int bits of half-precision floating point values
 * Based on:
 * https://mail.mozilla.org/pipermail/es-discuss/2017-April/047994.html
 * https://github.com/rochars/byte-data
 */
function toHalf(val) {
    floatView[0] = val;
    let x = int32View[0];
    let bits = (x >> 16) & 0x8000;
    let m = (x >> 12) & 0x07ff;
    let e = (x >> 23) & 0xff;
    if (e < 103) {
        return bits;
    }
    bits |= ((e - 112) << 10) | (m >> 1);
    bits += m & 1;
    return bits;
}

module.exports.getBinary = getBinary;
module.exports.decodeFloat16 = decodeFloat16;
module.exports.decodeFloat64 = decodeFloat64;
module.exports.toFloat64 = toFloat64;
module.exports.toHalf = toHalf;


/***/ }),
/* 5 */
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

window['WaveFile'] = pack
module.exports.pack = pack
module.exports.unpack = unpack

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * wavefile
 * Read & write wave files with 8, 16, 24, 32 & 64-bit data.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

const bitDepthLib = __webpack_require__(7);
const WaveErrors = __webpack_require__(2);
const WaveFileReaderWriter = __webpack_require__(8);
const riffChunks = __webpack_require__(16);

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
            this.bitDepth_ = "32f";
        }else {
            this.bitDepth_ = this.bitsPerSample.toString();
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
        if (!this.headerFormats_[this.bitDepth_]) {
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

window['WaveFile'] = WaveFile;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*!
 * bitdepth
 * Change the bit depth of samples to and from 8, 16, 24, 32 & 64-bit.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/bitdepth
 *
 */

const f64f32 = new Float32Array(1);

/**
 * Max number of different values for each bit depth.
 * @enum {number}
 */
const BitDepthMaxValues = {
    "8": 256,
    "16": 65536,
    "24": 16777216,
    "32": 4294967296,
    "32f": 1,
    "64": 1
};

/**
 * Functions to change the bit depth of a sample.
 */
const BitDepthFunctions = {

    /**
     * Change the bit depth from int to int.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    intToInt(sample, args) {
        if (sample > 0) {
            sample = parseInt(
                (sample / args.oldPositive) * args.newPositive, 10);
        } else {
            sample = parseInt(
                (sample / args.oldNegative) * args.newNegative, 10);
        }
        return sample;
    },

    /**
     * Change the bit depth from float to int.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    floatToInt(sample, args) {
        return sample > 0 ?
            sample * args.newPositive : sample * args.newNegative;
    },

    /**
     * Change the bit depth from int to float.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    intToFloat(sample, args) {
        return sample > 0 ?
            sample / args.oldPositive : sample / args.oldNegative;
    },

    /**
     * Change the bit depth from float to float.
     * @param {number} sample The sample.
     * @param {Object} args Data about the original and target bit depths.
     * @return {number}
     */
    floatToFloat(sample, args) {
        if (args.original == "64" && args.target == "32f") {
            f64f32[0] = sample;
            sample = f64f32[0];
        }
        return sample;
    }
};

/**
 * Change the bit depth of the data in a array.
 * The input array is modified in-place.
 * @param {!Array<number>} samples The samples.
 * @param {string} originalBitDepth The original bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @param {string} targetBitDepth The new bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 */
function toBitDepth(samples, originalBitDepth, targetBitDepth) {
    validateBitDepths(originalBitDepth, targetBitDepth);
    let toFunction = getBitDepthFunction(originalBitDepth, targetBitDepth);
    let len = samples.length;
    for (let i=0; i<len; i++) {        
        samples[i] = sign8Bit(samples[i], originalBitDepth);
        samples[i] = toFunction(
                samples[i],
                {
                    "oldNegative": BitDepthMaxValues[originalBitDepth] / 2,
                    "newNegative": BitDepthMaxValues[targetBitDepth] / 2,
                    "oldPositive": BitDepthMaxValues[originalBitDepth] / 2 - 1,
                    "newPositive": BitDepthMaxValues[targetBitDepth] / 2 - 1,
                    "original": originalBitDepth,
                    "target": targetBitDepth
                }
            );
        samples[i] = unsign8Bit(samples[i], targetBitDepth);
    }
}

/**
 * Get the function to change the bit depth of a sample.
 * @param {string} originalBitDepth The original bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @param {string} targetBitDepth The new bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @return {Function}
 */
function getBitDepthFunction(originalBitDepth, targetBitDepth) {
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
    return BitDepthFunctions[prefix + "To" + suffix];
}

/**
 * Sign unsigned 8-bit data.
 * @param {number} sample The sample.
 * @param {string} originalBitDepth The original bit depth of the data.
 *      One of "8", "16", "24", "32", "32f", "64"
 * @return {number}
 */
function sign8Bit(sample, originalBitDepth) {
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
 */
function unsign8Bit(sample, targetBitDepth) {
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
 */
function validateBitDepths(originalBitDepth, targetBitDepth) {
    let validBitDepths = ["8", "16", "24", "32", "32f", "64"];
    if (validBitDepths.indexOf(originalBitDepth) == -1 ||
        validBitDepths.indexOf(targetBitDepth) == -1) {
        throw new Error("Invalid bit depth.");
    }
    return true;
}

window['WaveFile'].toBitDepth = toBitDepth;
module.exports.BitDepthMaxValues = BitDepthMaxValues;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * WaveFileReaderWriter
 * Copyright (c) 2017 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */

const byteData = __webpack_require__(3);
const WaveErrors = __webpack_require__(2);
const uInt8 = byteData.uInt8;
const uInt16 = byteData.uInt16;
const uInt32 = byteData.uInt32;
const char = byteData.char;
let WaveFileHeader = __webpack_require__(15);

/**
 * Read and write wave files.
 */
class WaveFileReaderWriter extends WaveFileHeader {

    constructor() {
        super();
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
        /** @type {!Array<number>} */
        this.samples_ = [];
    }

    /**
     * Read the RIFF chunk a wave file.
     * @param {Uint8Array} bytes an array representing the wave file.
     * @throws {Error} If no "RIFF" chunk is found.
     */
    readRIFFChunk_(bytes) {
        this.chunkId = byteData.unpackSequence(bytes.slice(0, 4), char);
        if (this.chunkId != "RIFF" && this.chunkId != "RIFX") {
            throw Error(WaveErrors.format);
        }
        let bigEndian = this.LEorBE();
        this.chunkSize = byteData.fromBytes(
            bytes.slice(4, 8),
            32,
            {"be": bigEndian, "single": true});
        this.format = byteData.unpackSequence(bytes.slice(8, 12), char);
        if (this.format != "WAVE") {
            throw Error(WaveErrors.wave);
        }
    }

    LEorBE() {
        let bigEndian = this.chunkId == "RIFX";
        uInt8.be = bigEndian;
        uInt16.be = bigEndian;
        uInt32.be = bigEndian;
        return bigEndian;
    }

    /**
     * Read the "fmt " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "fmt " chunk is found.
     */
    readFmtChunk_(chunks) {
        let chunk = this.findChunk(chunks, "fmt ");
        if (chunk) {
            this.fmtChunkId = "fmt ";
            this.fmtChunkSize = chunk.chunkSize;
            this.audioFormat = byteData.unpack(
                chunk.chunkData.slice(0, 2), uInt16);
            this.numChannels = byteData.unpack(
                chunk.chunkData.slice(2, 4), uInt16);
            this.sampleRate = byteData.unpack(
                chunk.chunkData.slice(4, 8), uInt32);
            this.byteRate = byteData.unpack(
                chunk.chunkData.slice(8, 12), uInt32);
            this.blockAlign = byteData.unpack(
                chunk.chunkData.slice(12, 14), uInt16);
            this.bitsPerSample = byteData.unpack(
                    chunk.chunkData.slice(14, 16), uInt16);
            this.readFmtExtension(chunk);
        } else {
            throw Error(WaveErrors["fmt "]);
        }
    }

    /**
     * Read the "fmt " chunk extension.
     * @param {Object} chunk The "fmt " chunk.
     */
    readFmtExtension(chunk) {
        if (this.fmtChunkSize > 16) {
            this.cbSize = byteData.unpack(
                chunk.chunkData.slice(16, 18), uInt16);
            if (this.fmtChunkSize > 18) {
                this.validBitsPerSample = byteData.unpack(
                    chunk.chunkData.slice(18, 20), uInt16);
            }
        }
    }

    /**
     * Read the "fact" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "fact" chunk is found.
     */
    readFactChunk_(chunks) {
        let chunk = this.findChunk(chunks, "fact");
        if (chunk) {
            this.factChunkId = "fact";
            this.factChunkSize = chunk.chunkSize;
            this.dwSampleLength = byteData.unpack(
                chunk.chunkData.slice(0, 4), uInt32);
        } else if (this.enforceFact) {
            throw Error(WaveErrors["fact"]);
        }
    }

    /**
     * Read the "bext" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "bext" chunk is found.
     */
    readBextChunk_(chunks) {
        let chunk = this.findChunk(chunks, "bext");
        if (chunk) {
            this.bextChunkId = "bext";
            this.bextChunkSize = chunk.chunkSize;
            this.bextChunkData = chunk.chunkData;
        }
    }

    /**
     * Read the "cue " chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "cue" chunk is found.
     */
    readCueChunk_(chunks) {
        let chunk = this.findChunk(chunks, "cue ");
        if (chunk) {
            this.cueChunkId = "cue ";
            this.cueChunkSize = chunk.chunkSize;
            this.cueChunkData = chunk.chunkData;
        }
    }

    /**
     * Read the "data" chunk of a wave file.
     * @param {Object} chunks The RIFF file chunks.
     * @throws {Error} If no "data" chunk is found.
     */
    readDataChunk_(chunks, options) {
        let chunk = this.findChunk(chunks, "data");
        if (chunk) {
            this.dataChunkId = "data";
            this.dataChunkSize = chunk.chunkSize;
            this.samplesFromBytes_(chunk.chunkData, options);
        } else {
            throw Error(WaveErrors["data"]);
        }
    }

    /**
     * Find and return the start offset of the data chunk on a wave file.
     * @param {Uint8Array} bytes Array of bytes representing the wave file.
     */
    samplesFromBytes_(bytes, options) {
        options.signed = this.bitsPerSample == 8 ? false : true
        if (this.bitsPerSample == 32 && this.audioFormat == 3) {
            options.float = true;
        }
        options.single = false;
        if (this.bitsPerSample == 4) {
            this.samples_ = byteData.pack(bytes, uInt8);
        } else {
            this.samples_ = byteData.fromBytes(
                bytes, this.bitsPerSample, options);
        }
    }

    /**
     * Find a chunk by its FourCC in a array of RIFF chunks.
     * @return {Object|null}
     */
    findChunk(chunks, fourCC) {
        for (let i = 0; i<chunks.length; i++) {
            if (chunks[i].chunkId == fourCC) {
                return chunks[i];
            }
        }
        return null;
    }

    /**
     * Split each sample into bytes.
     */
    samplesToBytes_(options) {
        if (this.bitsPerSample == 32 && this.audioFormat == 3) {
            options.float = true;
        }
        let bitDepth = this.bitsPerSample == 4 ? 8 : this.bitsPerSample;
        let bytes = byteData.toBytes(this.samples_, bitDepth, options);
        if (bytes.length % 2) {
            bytes.push(0);
        }
        return bytes;
    }

    /**
     * Get the bytes of the "bext" chunk.
     * @return {!Array<number>} The "bext" chunk bytes.
     */
    getBextBytes_() {
        if (this.bextChunkId) {
            return [].concat(
                    byteData.packSequence(this.bextChunkId, char),
                    byteData.pack(this.bextChunkSize, uInt32),
                    this.bextChunkData
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "cue " chunk.
     * @return {!Array<number>} The "cue " chunk bytes.
     */
    getCueBytes_() {
        if (this.cueChunkId) {
            return [].concat(
                    byteData.packSequence(this.cueChunkId, char),
                    byteData.pack(this.cueChunkSize, uInt32),
                    this.cueChunkData
                );
        }
        return [];
    }

    /**
     * Get the bytes of the "fact" chunk.
     * @return {!Array<number>} The "fact" chunk bytes.
     */
    getFactBytes_() {
        if (this.factChunkId) {
            return [].concat(
                    byteData.packSequence(this.factChunkId, char),
                    byteData.pack(this.factChunkSize, uInt32),
                    byteData.pack(this.dwSampleLength, uInt32)
                );
        }
        return [];
    }

    /**
     * Get the bytes of the cbSize field.
     * @return {!Array<number>} The cbSize bytes.
     */
    getCbSizeBytes_() {
        if (this.fmtChunkSize > 16) {
            return byteData.pack(this.cbSize, uInt16);
        }
        return [];
    }

    /**
     * Get the bytes of the validBitsPerSample field.
     * @return {!Array<number>} The validBitsPerSample bytes.
     */
    getValidBitsPerSampleBytes_() {
        if (this.fmtChunkSize > 18) {
            return byteData.pack(this.validBitsPerSample, uInt16);
        }
        return [];
    }

    /**
     * Turn a WaveFile object into a file.
     * @return {Uint8Array} The wav file bytes.
     */
    createWaveFile_() {
        let options = {"be": this.LEorBE()};
        return byteData.packSequence(this.chunkId, char).concat(
                byteData.pack(this.chunkSize, uInt32),
                byteData.packSequence(this.format, char),
                this.getBextBytes_(),
                byteData.packSequence(this.fmtChunkId, char),
                byteData.pack(this.fmtChunkSize, uInt32),
                byteData.pack(this.audioFormat, uInt16),
                byteData.pack(this.numChannels, uInt16),
                byteData.pack(this.sampleRate, uInt32),
                byteData.pack(this.byteRate, uInt32),
                byteData.pack(this.blockAlign, uInt16),
                byteData.pack(this.bitsPerSample, uInt16),
                this.getCbSizeBytes_(),
                this.getValidBitsPerSampleBytes_(),
                this.getFactBytes_(),
                byteData.packSequence(this.dataChunkId, char),
                byteData.pack(this.dataChunkSize, uInt32),
                this.samplesToBytes_(options),
                this.getCueBytes_()
            );
    }
}

module.exports = WaveFileReaderWriter;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * to-bytes: bytes to numbers and strings.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const writer = __webpack_require__(10);
const helpers = __webpack_require__(0);

/**
 * Turn numbers and strings to bytes.
 * @param {!Array<number>|number|string} values The data.
 * @param {number} bitDepth The bit depth of the data.
 *   Possible values are 1, 2, 4, 8, 16, 24, 32, 40, 48 or 64.
 * @param {Object} options The options:
 *   - "float": True for floating point numbers. Default is false.
 *       This option is available for 16, 32 and 64-bit numbers.
 *   - "base": The base of the output. Default is 10. Can be 2, 10 or 16.
 *   - "char": If the bytes represent a string. Default is false.
 *   - "be": If the values are big endian. Default is false (little endian).
 *   - "buffer": If the bytes should be returned as a Uint8Array.
 *       Default is false (bytes are returned as a regular array).
 * @return {!Array<number>|!Array<string>|Uint8Array} the data as a byte buffer.
 */
function toBytes(values, bitDepth, options={"base": 10}) {
    values = helpers.turnToArray(values);
    let bytes = writeBytes(values, options.char, options.float, bitDepth);
    helpers.makeBigEndian(bytes, options.be, bitDepth);
    helpers.outputToBase(bytes, bitDepth, options.base);
    if (options.buffer) {
        bytes = new Uint8Array(bytes);
    }
    return bytes;
}

/**
 * Write values as bytes.
 * @param {!Array<number>|number|string} values The data.
 * @param {boolean} isChar True if it is a string.
 * @param {boolean} isFloat True if it is a IEEE floating point number.
 * @param {number} bitDepth The bitDepth of the data.
 * @return {!Array<number>} the bytes.
 */
function writeBytes(values, isChar, isFloat, bitDepth) {
    let bitWriter;
    if (isChar) {
        bitWriter = writer.writeString;
    } else {
        bitWriter = writer['write' + bitDepth + 'Bit' + (isFloat ? "Float" : "")];
    }
    let i = 0;
    let j = 0;
    let len = values.length;
    let bytes = [];
    while (i < len) {            
        j = bitWriter(bytes, values, i, j);
        i++;
    }
    return bytes;
}

module.exports.toBytes = toBytes;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Functions to turn data into bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const float = __webpack_require__(4);
const intBits = __webpack_require__(5);

function write64Bit(bytes, numbers, i, j) {
    let bits = float.toFloat64(numbers[i]);
    j = write32Bit(bytes, bits, 1, j);
    return write32Bit(bytes, bits, 0, j);
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
    let bits = intBits.unpack(numbers[i]);
    bytes[j++] = bits & 0xFF;
    bytes[j++] = bits >>> 8 & 0xFF;
    bytes[j++] = bits >>> 16 & 0xFF;
    bytes[j++] = bits >>> 24 & 0xFF;
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
    let bits = float.toHalf(numbers[i]);
    bytes[j++] = bits  >>> 8 & 0xFF;
    bytes[j++] = bits  & 0xFF;
    return j;
}

function write8Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xFF;
    return j;
}

function write4Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] & 0xF;
    return j;
}

function write2Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] < 0 ? numbers[i] + 4 : numbers[i];
    return j;
}

function write1Bit(bytes, numbers, i, j) {
    bytes[j++] = numbers[i] ? 1 : 0;
    return j;
}

function writeString(bytes, string, i, j) {
    bytes[j++] = string.charCodeAt(i);
    return j;
}

module.exports.write64Bit = write64Bit;
module.exports.write48Bit = write48Bit;
module.exports.write40Bit = write40Bit;
module.exports.write32BitFloat = write32BitFloat;
module.exports.write32Bit = write32Bit;
module.exports.write24Bit = write24Bit;
module.exports.write16Bit = write16Bit;
module.exports.write16BitFloat = write16BitFloat;
module.exports.write8Bit = write8Bit;
module.exports.write4Bit = write4Bit;
module.exports.write2Bit = write2Bit;
module.exports.write1Bit = write1Bit;
module.exports.writeString = writeString;


/***/ }),
/* 11 */
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
 * @param {number} offset The byte offset according to the bit depth.
 *  - 2 for 16-bit
 *  - 3 for 24-bit
 *  - 4 for 32-bit
 *  - 5 for 40-bit
 *  - 6 for 48-bit
 *  - 7 for 56-bit
 *  - 8 for 64-bit
 */
function endianness(bytes, offset) {
    let len = bytes.length;
    let i = 0;
    while (i < len) {
        byteSwap(bytes, offset, i);
        i += offset;
    }
}

/**
 * Swap the endianness of a unit of information in a array of bytes.
 * The original array is modified in-place.
 * @param {!Array<number>|!Array<string>|Uint8Array} bytes The bytes.
 * @param {number} offset The number of bytes according to the bit depth.
 * @param {number} index The start index of the unit of information.
 */
function byteSwap(bytes, offset, index) {
    let x = 0;
    let y = offset - 1;
    let limit = parseInt(offset / 2, 10);
    let swap;
    while(x < limit) {
        swap = bytes[index + x];
        bytes[index + x] = bytes[index + y];
        bytes[index + y] = swap;
        x++;
        y--;
    }
}

window['WaveFile'] = endianness;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * from-bytes: convert bytes to numbers and strings.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

const reader = __webpack_require__(13);
const bitDepths = __webpack_require__(1);
const helpers = __webpack_require__(0);

/**
 * Turn a byte buffer into what the bytes represent.
 * @param {!Array<number>|!Array<string>|Uint8Array} buffer An array of bytes.
 * @param {number} bitDepth The bit depth of the data.
 *   Possible values are 1, 2, 4, 8, 16, 24, 32, 40, 48 or 64.
 * @param {Object} options The options. They are:
 *   - "signed": If the numbers are signed. Default is false (unsigned).
 *   - "float": True for floating point numbers. Default is false.
 *       This option is available for 16, 32 and 64-bit numbers.
 *   - "base": The base of the input. Default is 10. Can be 2, 10 or 16.
 *   - "char": If the bytes represent a string. Default is false.
 *   - "be": If the values are big endian. Default is false (little endian).
 *   - "single": If it should return a single value instead of an array.
 *       Default is false.
 * @return {!Array<number>|string}
 */
function fromBytes(buffer, bitDepth, options={"base": 10}) {
    helpers.makeBigEndian(buffer, options.be, bitDepth);
    helpers.bytesToInt(buffer, options.base);
    let values = readBytes(
            buffer,
            bitDepth,
            options.signed,
            getBitReader(bitDepth, options.float, options.char)
        );
    if (options.char) {
        values = values.join("");
    }
    if (options.single) {
        values = values[0];
    }
    return values;
}

/**
 * Turn a array of bytes into an array of what the bytes should represent.
 * @param {!Array<number>|!Array<string>|Uint8Array} bytes An array of bytes.
 * @param {number} bitDepth The bitDepth. 1, 2, 4, 8, 16, 24, 32, 40, 48, 64.
 * @param {boolean} isSigned True if the values should be signed.
 * @param {Function} bitReader The function to read the bytes.
 * @return {!Array<number>|string}
 */
function readBytes(bytes, bitDepth, isSigned, bitReader) {
    let values = [];
    let i = 0;
    let j = 0;
    let offset = bitDepths.BitDepthOffsets[bitDepth];
    let len = bytes.length - (offset -1);
    let maxBitDepthValue = bitDepths.BitDepthMaxValues[bitDepth];
    let signFunction = isSigned ? helpers.signed : function(x,y){return x;};
    while (i < len) {
        values[j] = signFunction(bitReader(bytes, i), maxBitDepthValue);
        i += offset;
        j++;
    }
    return values;
}

/**
 * Return a function to read binary data.
 * @param {number} bitDepth The bitDepth. 1, 2, 4, 8, 16, 24, 32, 40, 48, 64.
 * @param {boolean} isFloat True if the values are IEEE floating point numbers.
 * @param {boolean} isChar True if it is a string.
 * @return {Function}
 */
function getBitReader(bitDepth, isFloat, isChar) {
    let bitReader;
    if (isChar) {
        bitReader = reader.readChar;
    } else {
        bitReader = reader[getReaderFunctionName(bitDepth, isFloat)];
    }
    return bitReader;
}

/**
 * Build a bit reading function name based on the arguments.
 * @param {number} bitDepth The bitDepth. 1, 2, 4, 8, 16, 24, 32, 40, 48, 64.
 * @param {boolean} isFloat True if the values are IEEE floating point numbers.
 * @return {string}
 */
function getReaderFunctionName(bitDepth, isFloat) {
    return 'read' +
        ((bitDepth == 2 || bitDepth == 4) ? 8 : bitDepth) +
        'Bit' +
        (isFloat ? "Float" : "");
}

module.exports.fromBytes = fromBytes;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Function to read data from bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */


let helpers = __webpack_require__(0);
const float = __webpack_require__(4);
const intBits = __webpack_require__(5);

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
        bits += helpers.bytePadding(bytes[j + i].toString(2), 2);
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
    return float.decodeFloat16(bytes.slice(i,i+2));
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
    return float.decodeFloat64(bytes.slice(i,i+8));
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * bit-packer: Pack and unpack nibbles, crumbs and booleans into bytes.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/byte-data
 */

let helpers = __webpack_require__(0);

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
    helpers.fixByteArraySize(crumbs, 4);
    let len = crumbs.length - 3;
    while (i < len) {
        packed[j++] = parseInt(
            helpers.lPadZeros(crumbs[i].toString(2), 2) +
            helpers.lPadZeros(crumbs[i+1].toString(2), 2) +
            helpers.lPadZeros(crumbs[i+2].toString(2), 2) +
            helpers.lPadZeros(crumbs[i+3].toString(2), 2), 2);
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
    while (i < len) {
        bitCrumb = helpers.lPadZeros(crumbs[i].toString(2), 8);
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
    helpers.fixByteArraySize(booleans, 8);
    let len = booleans.length - 7;
    while (i < len) {
        packed[j++] = parseInt(
            booleans[i].toString(2) +
            booleans[i+1].toString(2) +
            booleans[i+2].toString(2) +
            booleans[i+3].toString(2) +
            booleans[i+4].toString(2) +
            booleans[i+5].toString(2) +
            booleans[i+6].toString(2) +
            booleans[i+7].toString(2), 2);
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
        bitBoolean = helpers.lPadZeros(booleans[i].toString(2), 8);
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

module.exports.packBooleans = packBooleans;
module.exports.unpackBooleans = unpackBooleans;
module.exports.packCrumbs = packCrumbs;
module.exports.unpackCrumbs = unpackCrumbs;
module.exports.packNibbles = packNibbles;
module.exports.unpackNibbles = unpackNibbles;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

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
        this.cueChunkSize = -1;
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
        this.bextChunkSize = 0;
        this.bextChunkData = [];
    }
}

module.exports = WaveFileHeader;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * riff-chunks
 * Read and write the chunks of RIFF and RIFX files.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/riff-chunks
 *
 */

const byteData = __webpack_require__(3);
const uInt32 = byteData.uInt32;
const char = byteData.char;

/**
 * Write the bytes of a RIFF/RIFX file.
 * @param {Object} chunks A structure like the return of riffChunks.read().
 * @param {boolean} bigEndian if the bytes should be big endian.
 *      "RIFX" chunkId will always set bigEndian to true.
 * @return {Array<number>|Uint8Array} The:
 *      - file bytes as Uint8Array when chunkId is "RIFF" or "RIFX" or
 *      - chunk bytes as Array<number> if chunkId is "LIST".
 */
function write(chunks, bigEndian=false) {
    if (!bigEndian) {
        uInt32.be = chunks.chunkId == "RIFX";
    }
    let bytes =
        byteData.packSequence(chunks.chunkId, char).concat(
                byteData.pack(chunks.chunkSize, uInt32),
                byteData.packSequence(chunks.format, char),
                writeSubChunks(chunks.subChunks, uInt32.be)
            );
    if (chunks.chunkId == "RIFF" || chunks.chunkId == "RIFX" ) {
        bytes = new Uint8Array(bytes);
    }
    return bytes;
}

/**
 * Get the chunks of a RIFF/RIFX file.
 * @param {Uint8Array|!Array<number>} buffer The file bytes.
 * @return {Object}
 */
function read(buffer) {
    buffer = [].slice.call(buffer);
    let chunkId = getChunkId(buffer, 0);
    uInt32.be = chunkId == "RIFX";
    let chunkSize = getChunkSize(buffer, 0);
    return {
        "chunkId": chunkId,
        "chunkSize": chunkSize,
        "format": byteData.unpackSequence(buffer.slice(8, 12), char),
        "subChunks": getSubChunks(buffer)
    };
}

/**
 * Write the sub chunks of a RIFF file.
 * @param {Array<Object>} chunks The chunks.
 * @param {boolean} bigEndian true if its RIFX.
 * @return {Array<number>}
 */
function writeSubChunks(chunks, bigEndian) {
    let subChunks = [];
    let i = 0;
    while (i < chunks.length) {
        if (chunks[i].chunkId == "LIST") {
            subChunks = subChunks.concat(write(chunks[i], bigEndian));
        } else {
            subChunks = subChunks.concat(
                byteData.packSequence(chunks[i].chunkId, char),
                byteData.pack(chunks[i].chunkSize, uInt32),
                chunks[i].chunkData
            );
        }
        i++;
    }
    return subChunks;
}

/**
 * Get the sub chunks of a RIFF file.
 * @param {Uint8Array|!Array<number>} buffer the RIFF file bytes.
 * @return {Object}
 */
function getSubChunks(buffer) {
    let chunks = [];
    let i = 12;
    while(i < buffer.length) {
        chunks.push(getSubChunk(buffer, i));
        i += 8 + chunks[chunks.length - 1].chunkSize;
    }
    return chunks;
}

/**
 * Get a sub chunk from a RIFF file.
 * @param {Uint8Array|!Array<number>} buffer the RIFF file bytes.
 * @param {number} index The start index of the chunk.
 * @return {Object}
 */
function getSubChunk(buffer, index) {
    let chunk = {
        "chunkId": getChunkId(buffer, index),
        "chunkSize": getChunkSize(buffer, index)
    };
    if (chunk.chunkId == "LIST") {
        chunk.format = byteData.unpackSequence(buffer.slice(8, 12), char);
        chunk.subChunks = getSubChunks(
            buffer.slice(index, index + chunk.chunkSize));
    } else {
        chunk.chunkData = buffer.slice(index + 8, index + 8 + chunk.chunkSize);
    }
    return chunk;
}

/**
 * Return the FourCC of a chunk.
 * @param {Uint8Array|!Array<number>} buffer the RIFF file bytes.
 * @param {number} index The start index of the chunk.
 * @return {string}
 */
function getChunkId(buffer, index) {
    return byteData.unpackSequence(buffer.slice(index, index + 4), char);
}

/**
 * Return the size of a chunk.
 * @param {Uint8Array|!Array<number>} buffer the RIFF file bytes.
 * @param {number} index The start index of the chunk.
 * @return {number}
 */
function getChunkSize(buffer, index) {
    return byteData.unpack(buffer.slice(index + 4, index + 8), uInt32);
}

window['WaveFile'].read = read;
module.exports.write = write;


/***/ })
/******/ ]);