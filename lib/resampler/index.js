/*
 * Copyright (c) 2019 Rafael da Silva Rocha.
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
 * @fileoverview The resample function.
 * @see https://github.com/rochars/wavefile
 */

import { Interpolator } from './interpolator';
import { FIRLPF } from './fir-lpf';
import { ButterworthLPF } from './butterworth-lpf';

/**
 * Default use of LPF for each resampling method.
 * @readonly
 * @enum {boolean}
 * @private
 */
const DEFAULT_LPF_USE = {
  'point': false,
  'linear': false,
  'cubic': true,
  'sinc': true
};

/**
 * Default LPF order for each type of LPF.
 * @readonly
 * @enum {number}
 * @private
 */
const DEFAULT_LPF_ORDER = {
  'IIR': 16,
  'FIR': 71
};

/**
 * Default LPF class for each type of LPF.
 * @readonly
 * @enum {!Function}
 * @private
 */
const DEFAULT_LPF = {
  'IIR': ButterworthLPF,
  'FIR': FIRLPF
};

/**
 * Change the sample rate of the samples to a new sample rate.
 * @param {!Array<number>|!TypedArray} samples The original samples.
 * @param {number} oldSampleRate The original sample rate.
 * @param {number} sampleRate The target sample rate.
 * @param {Object=} options The extra configuration, if needed.
 * @return {!Float64Array} the new samples.
 */
export function resample(samples, oldSampleRate, sampleRate, options=null) {
  options = options || {};
  // Make the new sample container
  /** @type {number} */
  let rate = ((sampleRate - oldSampleRate) / oldSampleRate) + 1;
  /** @type {!Float64Array} */
  let newSamples = new Float64Array(samples.length * (rate));
  // Create the interpolator
  options.method = options.method || 'cubic';
  /** @type {!Object} */
  let interpolator = new Interpolator(
    samples.length,
    newSamples.length,
    {
      method: options.method,
      tension: options.tension || 0,
      sincFilterSize: options.sincFilterSize || 6,
      sincWindow: options.sincWindow || undefined,
      clip: options.clip || 'mirror'
    });
  // Resample + LPF
  if (options.LPF === undefined) {
    options.LPF = DEFAULT_LPF_USE[options.method];
  } 
  if (options.LPF) {
    options.LPFType = options.LPFType || 'IIR';
    const LPF = DEFAULT_LPF[options.LPFType];
    // Upsampling
    if (sampleRate > oldSampleRate) {
      /** @type {!Object} */
      let filter = new LPF(
        options.LPForder || DEFAULT_LPF_ORDER[options.LPFType],
        sampleRate,
        (oldSampleRate / 2));
      upsample_(
        samples, newSamples, interpolator, filter);
    // Downsampling
    } else {
      /** @type {!Object} */
      let filter = new LPF(
        options.LPForder || DEFAULT_LPF_ORDER[options.LPFType],
        oldSampleRate,
        sampleRate / 2);
      downsample_(
        samples, newSamples, interpolator, filter);
    }
  // Resample, no LPF
  } else {
    resample_(samples, newSamples, interpolator);
  }
  return newSamples;
}

/**
 * Resample.
 * @param {!Array<number>|!TypedArray} samples The original samples.
 * @param {!Float64Array} newSamples The container for the new samples.
 * @param {Object} interpolator The interpolator.
 * @private
 */
function resample_(samples, newSamples, interpolator) {
  // Resample
  for (let i = 0, len = newSamples.length; i < len; i++) {
    newSamples[i] = interpolator.interpolate(i, samples);
  }
}

/**
 * Upsample with LPF.
 * @param {!Array<number>|!TypedArray} samples The original samples.
 * @param {!Float64Array} newSamples The container for the new samples.
 * @param {Object} interpolator The interpolator.
 * @param {Object} filter The LPF object.
 * @private
 */
function upsample_(samples, newSamples, interpolator, filter) {
  // Resample and filter
  for (let i = 0, len = newSamples.length; i < len; i++) {
    newSamples[i] = filter.filter(interpolator.interpolate(i, samples));
  }
  // Reverse filter
  filter.reset();
  for (let i = newSamples.length - 1; i >= 0; i--) {
    newSamples[i]  = filter.filter(newSamples[i]);
  }
}

/**
 * Downsample with LPF.
 * @param {!Array<number>|!TypedArray} samples The original samples.
 * @param {!Float64Array} newSamples The container for the new samples.
 * @param {Object} interpolator The interpolator.
 * @param {Object} filter The LPF object.
 * @private
 */
function downsample_(samples, newSamples, interpolator, filter) {
  // Filter
  for (let i = 0, len = samples.length; i < len; i++) {
    samples[i]  = filter.filter(samples[i]);
  }
  // Reverse filter
  filter.reset();
  for (let i = samples.length - 1; i >= 0; i--) {
    samples[i]  = filter.filter(samples[i]);
  }
  // Resample
  resample_(samples, newSamples, interpolator);
}
