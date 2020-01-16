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

/**
 * Change the sample rate of the samples to a new sample rate.
 * @param {!Array|!TypedArray} samples The original samples.
 * @param {number} oldSampleRate The original sample rate.
 * @param {number} sampleRate The target sample rate.
 * @param {?Object} details The extra configuration, if needed.
 * @return {!Float64Array} the new samples.
 */
export function resample(
  samples, oldSampleRate, sampleRate, details={}) {  
  // Make the new sample container
  let rate = ((sampleRate - oldSampleRate) / oldSampleRate) + 1;
  let newSamples = new Float64Array(samples.length * (rate));
  // Create the interpolator
  let interpolator = new Interpolator(
    samples.length,
    newSamples.length,
    {
      method: details.method || 'cubic',
      tension: details.tension || 0,
      sincFilterSize: details.sincFilterSize || 32,
      sincWindow: details.sincWindow || undefined,
      lanczosFilterSize: details.lanczosFilterSize || 16,
      clip: details.clip || 'mirror'
    });
  // Upsampling
  if (sampleRate > oldSampleRate) {
    upsample_(
      samples, newSamples, interpolator, 
      sampleRate, oldSampleRate, details.LPForder || 71);
  // Downsampling
  } else {
    downsample_(
      samples, newSamples, interpolator,
      sampleRate, oldSampleRate, details.LPForder || 71);
  }
  return newSamples;
}

/**
 * Upsample.
 * @param {!Array|!TypedArray} samples The original samples.
 * @param {!Float64Array} newSamples The container for the new samples.
 * @param {Object} interpolator The interpolator.
 * @param {number} sampleRate The target sample rate.
 * @param {number} oldSampleRate The original sample rate.
 * @param {number} LPForder The LPF order.
 * @return {!Float64Array}
 * @private
 */
function upsample_(
  samples, newSamples, interpolator, sampleRate, oldSampleRate, LPForder) {
  // Resample and filter
  let filter = new FIRLPF(LPForder, sampleRate, (oldSampleRate / 2));
  for (let i=0; i< newSamples.length; i++) {
    newSamples[i] = filter.filter(interpolator.interpolate(i, samples));
  }
  // Reverse filter
  filter = new FIRLPF(LPForder, sampleRate, (oldSampleRate / 2));
  for (let i = newSamples.length - 1; i >= 0; i--) {
    newSamples[i]  = filter.filter(newSamples[i]);
  }
  return newSamples;
}

/**
 * Downsample.
 * @param {!Array|!TypedArray} samples The original samples.
 * @param {!Float64Array} newSamples The container for the new samples.
 * @param {Object} interpolator The interpolator.
 * @param {number} sampleRate The target sample rate.
 * @param {number} oldSampleRate The original sample rate.
 * @param {number} LPForder The LPF order.
 * @return {!Float64Array}
 * @private
 */
function downsample_(
  samples, newSamples, interpolator, sampleRate, oldSampleRate, LPForder) {
  // Filter
  let filter = new FIRLPF(LPForder, oldSampleRate, sampleRate / 2);
  for (let i = 0; i < samples.length; i++) {
    samples[i]  = filter.filter(samples[i]);
  }
  // Reverse filter
  filter = new FIRLPF(LPForder, oldSampleRate, sampleRate / 2);
  for (let i = samples.length - 1; i >= 0; i--) {
    samples[i]  = filter.filter(samples[i]);
  }
  // Resample
  for (let i=0; i< newSamples.length; i++) {
    newSamples[i] = interpolator.interpolate(i, samples);
  }
  return newSamples;
}
