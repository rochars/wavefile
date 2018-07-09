/*
 * imaadpcm: IMA ADPCM codec in JavaScript.
 * Derived from https://github.com/acida/pyima  
 * Copyright (c) 2016 acida. MIT License.  
 * Copyright (c) 2018 Rafael da Silva Rocha.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * @fileoverview imaadpcm API and private methods.
 */

/** @module imaadpcm */

/**
 * @type {!Array<number>}
 * @private
 */
const INDEX_TABLE = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8];
/**
 * @type {!Array<number>}
 * @private
 */
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
/**
 * @type {number}
 * @private
 */
let encoderPredicted_ = 0;
/**
 * @type {number}
 * @private
 */
let encoderIndex_ = 0;
/**
 * @type {number}
 * @private
 */
let decoderPredicted_ = 0;
/**
 * @type {number}
 * @private
 */
let decoderIndex_ = 0;
/**
 * @type {number}
 * @private
 */
let decoderStep_ = 7;

/**
 * Encode 16-bit PCM samples into 4-bit IMA ADPCM samples.
 * @param {!Int16Array} samples A array of samples.
 * @return {!Uint8Array}
 */
function encode(samples) {
  /** @type {!Uint8Array} */
  let adpcmSamples = new Uint8Array((samples.length / 2) + 512);
  /** @type {!Array<number>} */
  let block = [];
  /** @type {number} */
  let fileIndex = 0;
  for (let i=0; i<samples.length; i++) {
    if ((i % 505 == 0 && i != 0)) {
      adpcmSamples.set(encodeBlock(block), fileIndex);
      fileIndex += 256;
      block = [];
    }
    block.push(samples[i]);
  }
  return adpcmSamples;
}

/**
 * Decode IMA ADPCM samples into 16-bit PCM samples.
 * @param {!Uint8Array} adpcmSamples A array of ADPCM samples.
 * @param {number} blockAlign The block size.
 * @return {!Int16Array}
 */
function decode(adpcmSamples, blockAlign=256) {
  /** @type {!Int16Array} */
  let samples = new Int16Array(adpcmSamples.length * 2);
  /** @type {!Array<number>} */
  let block = [];
  /** @type {number} */
  let fileIndex = 0;
  for (let i=0; i<adpcmSamples.length; i++) {
    if (i % blockAlign == 0 && i != 0) {            
      samples.set(decodeBlock(block), fileIndex);
      fileIndex += blockAlign * 2;
      block = [];
    }
    block.push(adpcmSamples[i]);
  }
  return samples;
}

/**
 * Encode a block of 505 16-bit samples as 4-bit ADPCM samples.
 * @param {!Array<number>} block A sample block of 505 samples.
 * @return {!Array<number>}
 */
function encodeBlock(block) {
  /** @type {!Array<number>} */
  let adpcmSamples = blockHead_(block[0]);
  for (let i=3; i<block.length; i+=2) {
    /** @type {number} */
    let sample2 = encodeSample_(block[i]);
    /** @type {number} */
    let sample = encodeSample_(block[i + 1]);
    adpcmSamples.push((sample << 4) | sample2);
  }
  while (adpcmSamples.length < 256) {
    adpcmSamples.push(0);
  }
  return adpcmSamples;
}

/**
 * Decode a block of ADPCM samples into 16-bit PCM samples.
 * @param {!Array<number>} block A adpcm sample block.
 * @return {!Array<number>}
 */
function decodeBlock(block) {
  decoderPredicted_ = sign_((block[1] << 8) | block[0]);
  decoderIndex_ = block[2];
  decoderStep_ = STEP_TABLE[decoderIndex_];
  /** @type {!Array<number>} */
  let result = [
      decoderPredicted_,
      sign_((block[3] << 8) | block[2])
    ];
  for (let i=4; i<block.length; i++) {
    /** @type {number} */
    let original_sample = block[i];
    /** @type {number} */
    let second_sample = original_sample >> 4;
    /** @type {number} */
    let first_sample = (second_sample << 4) ^ original_sample;
    result.push(decodeSample_(first_sample));
    result.push(decodeSample_(second_sample));
  }
  return result;
}

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
 * Compress a 16-bit PCM sample into a 4-bit ADPCM sample.
 * @param {number} sample The sample.
 * @return {number}
 * @private
 */
function encodeSample_(sample) {
  /** @type {number} */
  let delta = sample - encoderPredicted_;
  /** @type {number} */
  let value = 0;
  if (delta >= 0) {
    value = 0;
  } else {
    value = 8;
    delta = -delta;
  }
  /** @type {number} */
  let step = STEP_TABLE[encoderIndex_];
  /** @type {number} */
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
  updateEncoder_(value, diff);
  return value;
}

/**
 * Set the value for encoderPredicted_ and encoderIndex_
 * after each sample is compressed.
 * @param {number} value The compressed ADPCM sample
 * @param {number} diff The calculated difference
 * @private
 */
function updateEncoder_(value, diff) {
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
 * Decode a 4-bit ADPCM sample into a 16-bit PCM sample.
 * @param {number} nibble A 4-bit adpcm sample.
 * @return {number}
 * @private
 */
function decodeSample_(nibble) {
  /** @type {number} */
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
  updateDecoder_(nibble);
  return decoderPredicted_;
}

/**
 * Update the index and step after decoding a sample.
 * @param {number} nibble A 4-bit adpcm sample.
 * @private
 */
function updateDecoder_(nibble) {
  decoderIndex_ += INDEX_TABLE[nibble];
  if (decoderIndex_ < 0) {
    decoderIndex_ = 0;
  } else if (decoderIndex_ > 88) {
    decoderIndex_ = 88;
  }
  decoderStep_ = STEP_TABLE[decoderIndex_];
}

/**
 * Return the head of a ADPCM sample block.
 * @param {number} sample The first sample of the block.
 * @return {!Array<number>}
 * @private
 */
function blockHead_(sample) {
  encodeSample_(sample);
  /** @type {!Array<number>} */
  let adpcmSamples = [];
  adpcmSamples.push(sample & 0xFF);
  adpcmSamples.push((sample >> 8) & 0xFF);
  adpcmSamples.push(encoderIndex_);
  adpcmSamples.push(0);
  return adpcmSamples;
}

export { encode, decode, encodeBlock, decodeBlock };
