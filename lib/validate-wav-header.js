/*
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
 * @fileoverview A tool to validate wav file headers.
 * @see https://github.com/rochars/wavefile
 */

import WAV_AUDIO_FORMATS from './wav-audio-formats.js';

/**
 * Validate the header of the file.
 * @throws {Error} If any property of the object appears invalid.
 * @private
 */
export default function validateWavHeader_(header) {
  validateBitDepth_(header);
  validateNumChannels_(header);
  validateSampleRate_(header);
}

/**
 * Validate the bit depth.
 * @return {boolean} True is the bit depth is valid.
 * @throws {Error} If bit depth is invalid.
 * @private
 */
function validateBitDepth_(header) {
  if (!WAV_AUDIO_FORMATS[header.bitDepth]) {
    if (parseInt(header.bitDepth, 10) > 8 &&
        parseInt(header.bitDepth, 10) < 54) {
      return true;
    }
    throw new Error('Invalid bit depth.');
  }
  return true;
}

/**
 * Validate the number of channels.
 * @return {boolean} True is the number of channels is valid.
 * @throws {Error} If the number of channels is invalid.
 * @private
 */
function validateNumChannels_(header) {
  /** @type {number} */
  let blockAlign = header.fmt.numChannels * header.fmt.bitsPerSample / 8;
  if (header.fmt.numChannels < 1 || blockAlign > 65535) {
    throw new Error('Invalid number of channels.');
  }
  return true;
}

/**
 * Validate the sample rate value.
 * @return {boolean} True is the sample rate is valid.
 * @throws {Error} If the sample rate is invalid.
 * @private
 */
function validateSampleRate_(header) {
  /** @type {number} */
  let byteRate = header.fmt.numChannels *
    (header.fmt.bitsPerSample / 8) * header.fmt.sampleRate;
  if (header.fmt.sampleRate < 1 || byteRate > 4294967295) {
    throw new Error('Invalid sample rate.');
  }
  return true;
}