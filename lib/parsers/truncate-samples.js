/*
 * Copyright (c) 2017-2019 Rafael da Silva Rocha.
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
 * @fileoverview The truncateSamples function.
 * @see https://github.com/rochars/wavefile
 */

/**
 * Truncate float samples on overflow.
 * @param {!Array|!TypedArray} samples the samples.
 */
export function truncateSamples(samples) {
  for (let i = 0, len = samples.length; i < len; i++) {
    if (samples[i] > 1) {
      samples[i] = 1;
    } else if (samples[i] < -1) {
      samples[i] = -1;
    }
  }
}

/**
 * Truncate int samples on overflow.
 * @param {!Array|!TypedArray} samples the samples.
 * @param {number} bits The number of bits used by each sample.
 */
export function truncateIntSamples(samples, bits) {
  let max = bits === 8 ? 255 : Math.pow(2, bits) / 2 - 1;
  let min = bits === 8 ? 0 : -max - 1;
  for (let i = 0, len = samples.length; i < len; i++) {
    samples[i] = Math.round(samples[i]);
    if (samples[i] > max) {
      samples[i] = max;
    } else if (samples[i] < min) {
      samples[i] = min;
    }
  }
}
