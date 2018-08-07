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
 * @fileoverview A tool to create wav file headers.
 * @see https://github.com/rochars/wavefile
 */

import WAV_AUDIO_FORMATS from './wav-audio-formats.js';

/**
 * Return the header for a wav file.
 * @param {string} bitDepthCode The audio bit depth
 * @param {number} numChannels The number of channels
 * @param {number} sampleRate The sample rate.
 * @param {number} numBytes The number of bytes each sample use.
 * @param {number} samplesLength The length of the samples in bytes.
 * @param {!Object} options The extra options, like container defintion.
 * @private
 */
export default function makeWavHeader(
  bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
  /** @type {!Object} */
  let header = {};
  if (bitDepthCode == '4') {
    header = createADPCMHeader_(
      bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);

  } else if (bitDepthCode == '8a' || bitDepthCode == '8m') {
    header = createALawMulawHeader_(
      bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);

  } else if(Object.keys(WAV_AUDIO_FORMATS).indexOf(bitDepthCode) == -1 ||
      numChannels > 2) {
    header = createExtensibleHeader_(
      bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);

  } else {
    header = createPCMHeader_(
      bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);      
  }
  return header;
}

/**
 * Create the header of a linear PCM wave file.
 * @param {string} bitDepthCode The audio bit depth
 * @param {number} numChannels The number of channels
 * @param {number} sampleRate The sample rate.
 * @param {number} numBytes The number of bytes each sample use.
 * @param {number} samplesLength The length of the samples in bytes.
 * @param {!Object} options The extra options, like container defintion.
 * @private
 */
function createPCMHeader_(
  bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
  return {
    container: options.container,
    chunkSize: 36 + samplesLength,
    format: 'WAVE',
    bitDepth: bitDepthCode,
    fmt: {
      chunkId: 'fmt ',
      chunkSize: 16,
      audioFormat: WAV_AUDIO_FORMATS[bitDepthCode] || 65534,
      numChannels: numChannels,
      sampleRate: sampleRate,
      byteRate: (numChannels * numBytes) * sampleRate,
      blockAlign: numChannels * numBytes,
      bitsPerSample: parseInt(bitDepthCode, 10),
      cbSize: 0,
      validBitsPerSample: 0,
      dwChannelMask: 0,
      subformat: []
    }
  };
}

/**
 * Create the header of a ADPCM wave file.
 * @param {string} bitDepthCode The audio bit depth
 * @param {number} numChannels The number of channels
 * @param {number} sampleRate The sample rate.
 * @param {number} numBytes The number of bytes each sample use.
 * @param {number} samplesLength The length of the samples in bytes.
 * @param {!Object} options The extra options, like container defintion.
 * @private
 */
function createADPCMHeader_(
  bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
  /** @type {!Object} */
  let header = createPCMHeader_(
    bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
  header.chunkSize = 40 + samplesLength;
  header.fmt.chunkSize = 20;
  header.fmt.byteRate = 4055;
  header.fmt.blockAlign = 256;
  header.fmt.bitsPerSample = 4;
  header.fmt.cbSize = 2;
  header.fmt.validBitsPerSample = 505;
  header.fact = {
    chunkId: 'fact',
    chunkSize: 4,
    dwSampleLength: samplesLength * 2
  };
  return header;
}

/**
 * Create the header of WAVE_FORMAT_EXTENSIBLE file.
 * @param {string} bitDepthCode The audio bit depth
 * @param {number} numChannels The number of channels
 * @param {number} sampleRate The sample rate.
 * @param {number} numBytes The number of bytes each sample use.
 * @param {number} samplesLength The length of the samples in bytes.
 * @param {!Object} options The extra options, like container defintion.
 * @private
 */
function createExtensibleHeader_(
    bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
  /** @type {!Object} */
  let header = createPCMHeader_(
    bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
  header.chunkSize = 36 + 24 + samplesLength;
  header.fmt.chunkSize = 40;
  header.fmt.bitsPerSample = ((parseInt(bitDepthCode, 10) - 1) | 7) + 1;
  header.fmt.cbSize = 22;
  header.fmt.validBitsPerSample = parseInt(bitDepthCode, 10);
  header.fmt.dwChannelMask = getDwChannelMask_(numChannels);
  // subformat 128-bit GUID as 4 32-bit values
  // only supports uncompressed integer PCM samples
  header.fmt.subformat = [1, 1048576, 2852126848, 1905997824];
  return header;
}

/**
 * Create the header of mu-Law and A-Law wave files.
 * @param {string} bitDepthCode The audio bit depth
 * @param {number} numChannels The number of channels
 * @param {number} sampleRate The sample rate.
 * @param {number} numBytes The number of bytes each sample use.
 * @param {number} samplesLength The length of the samples in bytes.
 * @param {!Object} options The extra options, like container defintion.
 * @private
 */
function createALawMulawHeader_(
    bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options) {
  /** @type {!Object} */
  let header = createPCMHeader_(
    bitDepthCode, numChannels, sampleRate, numBytes, samplesLength, options);
  header.chunkSize = 40 + samplesLength;
  header.fmt.chunkSize = 20;
  header.fmt.cbSize = 2;
  header.fmt.validBitsPerSample = 8;
  header.fact = {
    chunkId: 'fact',
    chunkSize: 4,
    dwSampleLength: samplesLength
  };
  return header;
}

/**
 * Get the value for dwChannelMask according to the number of channels.
 * @return {number} the dwChannelMask value.
 * @private
 */
function getDwChannelMask_(numChannels) {
  /** @type {number} */
  let dwChannelMask = 0;
  // mono = FC
  if (numChannels === 1) {
    dwChannelMask = 0x4;
  // stereo = FL, FR
  } else if (numChannels === 2) {
    dwChannelMask = 0x3;
  // quad = FL, FR, BL, BR
  } else if (numChannels === 4) {
    dwChannelMask = 0x33;
  // 5.1 = FL, FR, FC, LF, BL, BR
  } else if (numChannels === 6) {
    dwChannelMask = 0x3F;
  // 7.1 = FL, FR, FC, LF, BL, BR, SL, SR
  } else if (numChannels === 8) {
    dwChannelMask = 0x63F;
  }
  return dwChannelMask;
}
