/*
 * bitdepth: Change the resolution of samples to and from any bit depth.
 * https://github.com/rochars/bitdepth
 *
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
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
 * @fileoverview The bitdepth() function and private helper functions.
 */

/** @module bitdepth */

/** @private */
const f64f32_ = new Float32Array(1);

/**
 * Change the bit depth of samples. The input array.
 * @param {!TypedArray} input The samples.
 * @param {string} original The original bit depth of the data.
 *      One of "8" ... "53", "32f", "64"
 * @param {string} target The desired bit depth for the data.
 *      One of "8" ... "53", "32f", "64"
 * @param {!TypedArray} output The output array.
 */
function bitDepth(input, original, target, output) {
  validateBitDepth_(original);
  validateBitDepth_(target);
  /** @type {!Function} */
  let toFunction = getBitDepthFunction_(original, target);
  /** @type {!Object<string, number>} */
  let options = {
    oldMin: Math.pow(2, parseInt(original, 10)) / 2,
    newMin: Math.pow(2, parseInt(target, 10)) / 2,
    oldMax: (Math.pow(2, parseInt(original, 10)) / 2) - 1,
    newMax: (Math.pow(2, parseInt(target, 10)) / 2) - 1,
  };
  /** @type {number} */
  const len = input.length;
  // sign the samples if original is 8-bit
  if (original == "8") {
    for (let i=0; i<len; i++) {
      output[i] = input[i] -= 128;
    }
  }
  // change the resolution of the samples
  for (let i=0; i<len; i++) {        
    output[i] = toFunction(input[i], options);
  }
  // unsign the samples if target is 8-bit
  if (target == "8") {
    for (let i=0; i<len; i++) {
      output[i] = output[i] += 128;
    }
  }
}

/**
 * Change the bit depth from int to int.
 * @param {number} sample The sample.
 * @param {!Object<string, number>} args Data about the original and target bit depths.
 * @return {number}
 * @private
 */
function intToInt_(sample, args) {
  if (sample > 0) {
    sample = parseInt((sample / args.oldMax) * args.newMax, 10);
  } else {
    sample = parseInt((sample / args.oldMin) * args.newMin, 10);
  }
  return sample;
}

/**
 * Change the bit depth from float to int.
 * @param {number} sample The sample.
 * @param {!Object<string, number>} args Data about the original and target bit depths.
 * @return {number}
 * @private
 */
function floatToInt_(sample, args) {
  return parseInt(
    sample > 0 ? sample * args.newMax : sample * args.newMin, 10);
}

/**
 * Change the bit depth from int to float.
 * @param {number} sample The sample.
 * @param {!Object<string, number>} args Data about the original and target bit depths.
 * @return {number}
 * @private
 */
function intToFloat_(sample, args) {
  return sample > 0 ? sample / args.oldMax : sample / args.oldMin;
}

/**
 * Change the bit depth from float to float.
 * @param {number} sample The sample.
 * @return {number}
 * @private
 */
function floatToFloat_(sample) {
  f64f32_[0] = sample;
  return f64f32_[0];
}

/**
 * Return the function to change the bit depth of a sample.
 * @param {string} original The original bit depth of the data.
 *      One of "8" ... "53", "32f", "64"
 * @param {string} target The new bit depth of the data.
 *      One of "8" ... "53", "32f", "64"
 * @return {!Function}
 * @private
 */
function getBitDepthFunction_(original, target) {
  /** @type {!Function} */
  let func = function(x) {return x;};
  if (original != target) {
    if (["32f", "64"].includes(original)) {
      if (["32f", "64"].includes(target)) {
        func = floatToFloat_;
      } else {
        func = floatToInt_;
      }
    } else {
      if (["32f", "64"].includes(target)) {
        func = intToFloat_;
      } else {
        func = intToInt_;
      }
    }
  }
  return func;
}

/**
 * Validate the bit depth.
 * @param {string} bitDepth The original bit depth.
 *     Should be one of "8" ... "53", "32f" or "64".
 * @throws {Error} If any argument does not meet the criteria.
 * @private
 */
function validateBitDepth_(bitDepth) {
  if ((bitDepth != "32f" && bitDepth != "64") &&
      (parseInt(bitDepth, 10) < "8" || parseInt(bitDepth, 10) > "53")) {
    throw new Error("Invalid bit depth.");
  }
}

export default bitDepth;
