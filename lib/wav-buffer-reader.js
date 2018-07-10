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
 * @fileoverview Get structured wav data out of buffers.
 * @see https://github.com/rochars/wavefile
 */

import {riffChunks, findChunk_} from '../vendor/riff-chunks.js';
import BufferIO from './bufferio.js';

let io = new BufferIO();

/**
 * Set up the WaveFile object from a byte buffer.
 * @param {!Uint8Array} buffer The buffer.
 * @param {boolean} samples True if the samples should be loaded.
 * @param {!Object} wav True if the samples should be loaded.
 * @param {!Object} uInt32_ True if the samples should be loaded.
 * @param {!Object} uInt16_ True if the samples should be loaded.
 * @throws {Error} If container is not RIFF, RIFX or RF64.
 * @throws {Error} If no 'fmt ' chunk is found.
 * @throws {Error} If no 'data' chunk is found.
 */
export default function readWavBuffer(buffer, samples, wav, uInt32_, uInt16_) {
  io.head_ = 0;
  readRIFFChunk_(buffer, wav, uInt32_, uInt16_);
  /** @type {!Object} */
  let chunk = riffChunks(buffer);
  readDs64Chunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  readFmtChunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  readFactChunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  readBextChunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  readCueChunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  readSmplChunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  readDataChunk_(buffer, chunk.subChunks, samples, wav, uInt32_, uInt16_);
  readJunkChunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  readLISTChunk_(buffer, chunk.subChunks, wav, uInt32_, uInt16_);
  bitDepthFromFmt_(wav, uInt32_, uInt16_);
}

/**
 * Set the string code of the bit depth based on the 'fmt ' chunk.
 * @private
 */
function bitDepthFromFmt_(wav, uInt32_, uInt16_) {
  if (wav.fmt.audioFormat === 3 && wav.fmt.bitsPerSample === 32) {
    wav.bitDepth = '32f';
  } else if (wav.fmt.audioFormat === 6) {
    wav.bitDepth = '8a';
  } else if (wav.fmt.audioFormat === 7) {
    wav.bitDepth = '8m';
  } else {
    wav.bitDepth = wav.fmt.bitsPerSample.toString();
  }
}

/**
 * Read the RIFF chunk a wave file.
 * @param {!Uint8Array} bytes A wav buffer.
 * @throws {Error} If no 'RIFF' chunk is found.
 * @private
 */
function readRIFFChunk_(bytes, wav, uInt32_, uInt16_) {
  io.head_ = 0;
  wav.container = io.readString_(bytes, 4);
  if (['RIFF', 'RIFX', 'RF64'].indexOf(wav.container) === -1) {
    throw Error('Not a supported format.');
  }
  uInt16_.be = wav.container === 'RIFX';
  uInt32_.be = uInt16_.be;
  wav.chunkSize = io.read_(bytes, uInt32_);
  wav.format = io.readString_(bytes, 4);
  if (wav.format != 'WAVE') {
    throw Error('Could not find the "WAVE" format identifier');
  }
}

/**
 * Read the 'fmt ' chunk of a wave file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @throws {Error} If no 'fmt ' chunk is found.
 * @private
 */
function readFmtChunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'fmt ');
  if (chunk) {
    io.head_ = chunk.chunkData.start;
    wav.fmt.chunkId = chunk.chunkId;
    wav.fmt.chunkSize = chunk.chunkSize;
    wav.fmt.audioFormat = io.read_(buffer, uInt16_);
    wav.fmt.numChannels = io.read_(buffer, uInt16_);
    wav.fmt.sampleRate = io.read_(buffer, uInt32_);
    wav.fmt.byteRate = io.read_(buffer, uInt32_);
    wav.fmt.blockAlign = io.read_(buffer, uInt16_);
    wav.fmt.bitsPerSample = io.read_(buffer, uInt16_);
    readFmtExtension_(buffer, wav, uInt32_, uInt16_);
  } else {
    throw Error('Could not find the "fmt " chunk');
  }
}

/**
 * Read the 'fmt ' chunk extension.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @private
 */
function readFmtExtension_(buffer, wav, uInt32_, uInt16_) {
  if (wav.fmt.chunkSize > 16) {
    wav.fmt.cbSize = io.read_(buffer, uInt16_);
    if (wav.fmt.chunkSize > 18) {
      wav.fmt.validBitsPerSample = io.read_(buffer, uInt16_);
      if (wav.fmt.chunkSize > 20) {
        wav.fmt.dwChannelMask = io.read_(buffer, uInt32_);
        wav.fmt.subformat = [
          io.read_(buffer, uInt32_),
          io.read_(buffer, uInt32_),
          io.read_(buffer, uInt32_),
          io.read_(buffer, uInt32_)];
      }
    }
  }
}

/**
 * Read the 'fact' chunk of a wav file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @private
 */
function readFactChunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'fact');
  if (chunk) {
    io.head_ = chunk.chunkData.start;
    wav.fact.chunkId = chunk.chunkId;
    wav.fact.chunkSize = chunk.chunkSize;
    wav.fact.dwSampleLength = io.read_(buffer, uInt32_);
  }
}

/**
 * Read the 'cue ' chunk of a wave file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @private
 */
function readCueChunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'cue ');
  if (chunk) {
    io.head_ = chunk.chunkData.start;
    wav.cue.chunkId = chunk.chunkId;
    wav.cue.chunkSize = chunk.chunkSize;
    wav.cue.dwCuePoints = io.read_(buffer, uInt32_);
    for (let i=0; i<wav.cue.dwCuePoints; i++) {
      wav.cue.points.push({
        dwName: io.read_(buffer, uInt32_),
        dwPosition: io.read_(buffer, uInt32_),
        fccChunk: io.readString_(buffer, 4),
        dwChunkStart: io.read_(buffer, uInt32_),
        dwBlockStart: io.read_(buffer, uInt32_),
        dwSampleOffset: io.read_(buffer, uInt32_),
      });
    }
  }
}

/**
 * Read the 'smpl' chunk of a wave file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @private
 */
function readSmplChunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'smpl');
  if (chunk) {
    io.head_ = chunk.chunkData.start;
    wav.smpl.chunkId = chunk.chunkId;
    wav.smpl.chunkSize = chunk.chunkSize;
    wav.smpl.dwManufacturer = io.read_(buffer, uInt32_);
    wav.smpl.dwProduct = io.read_(buffer, uInt32_);
    wav.smpl.dwSamplePeriod = io.read_(buffer, uInt32_);
    wav.smpl.dwMIDIUnityNote = io.read_(buffer, uInt32_);
    wav.smpl.dwMIDIPitchFraction = io.read_(buffer, uInt32_);
    wav.smpl.dwSMPTEFormat = io.read_(buffer, uInt32_);
    wav.smpl.dwSMPTEOffset = io.read_(buffer, uInt32_);
    wav.smpl.dwNumSampleLoops = io.read_(buffer, uInt32_);
    wav.smpl.dwSamplerData = io.read_(buffer, uInt32_);
    for (let i=0; i<wav.smpl.dwNumSampleLoops; i++) {
      wav.smpl.loops.push({
        dwName: io.read_(buffer, uInt32_),
        dwType: io.read_(buffer, uInt32_),
        dwStart: io.read_(buffer, uInt32_),
        dwEnd: io.read_(buffer, uInt32_),
        dwFraction: io.read_(buffer, uInt32_),
        dwPlayCount: io.read_(buffer, uInt32_),
      });
    }
  }
}

/**
 * Read the 'data' chunk of a wave file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @param {boolean} samples True if the samples should be loaded.
 * @throws {Error} If no 'data' chunk is found.
 * @private
 */
function readDataChunk_(buffer, signature, samples, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'data');
  if (chunk) {
    wav.data.chunkId = 'data';
    wav.data.chunkSize = chunk.chunkSize;
    if (samples) {
      wav.data.samples = buffer.slice(
        chunk.chunkData.start,
        chunk.chunkData.end);
    }
  } else {
    throw Error('Could not find the "data" chunk');
  }
}

/**
 * Read the 'bext' chunk of a wav file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @private
 */
function readBextChunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'bext');
  if (chunk) {
    io.head_ = chunk.chunkData.start;
    wav.bext.chunkId = chunk.chunkId;
    wav.bext.chunkSize = chunk.chunkSize;
    wav.bext.description = io.readString_(buffer, 256);
    wav.bext.originator = io.readString_(buffer, 32);
    wav.bext.originatorReference = io.readString_(buffer, 32);
    wav.bext.originationDate = io.readString_(buffer, 10);
    wav.bext.originationTime = io.readString_(buffer, 8);
    wav.bext.timeReference = [
      io.read_(buffer, uInt32_),
      io.read_(buffer, uInt32_)];
    wav.bext.version = io.read_(buffer, uInt16_);
    wav.bext.UMID = io.readString_(buffer, 64);
    wav.bext.loudnessValue = io.read_(buffer, uInt16_);
    wav.bext.loudnessRange = io.read_(buffer, uInt16_);
    wav.bext.maxTruePeakLevel = io.read_(buffer, uInt16_);
    wav.bext.maxMomentaryLoudness = io.read_(buffer, uInt16_);
    wav.bext.maxShortTermLoudness = io.read_(buffer, uInt16_);
    wav.bext.reserved = io.readString_(buffer, 180);
    wav.bext.codingHistory = io.readString_(
      buffer, wav.bext.chunkSize - 602);
  }
}

/**
 * Read the 'ds64' chunk of a wave file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @throws {Error} If no 'ds64' chunk is found and the file is RF64.
 * @private
 */
function readDs64Chunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'ds64');
  if (chunk) {
    io.head_ = chunk.chunkData.start;
    wav.ds64.chunkId = chunk.chunkId;
    wav.ds64.chunkSize = chunk.chunkSize;
    wav.ds64.riffSizeHigh = io.read_(buffer, uInt32_);
    wav.ds64.riffSizeLow = io.read_(buffer, uInt32_);
    wav.ds64.dataSizeHigh = io.read_(buffer, uInt32_);
    wav.ds64.dataSizeLow = io.read_(buffer, uInt32_);
    wav.ds64.originationTime = io.read_(buffer, uInt32_);
    wav.ds64.sampleCountHigh = io.read_(buffer, uInt32_);
    wav.ds64.sampleCountLow = io.read_(buffer, uInt32_);
    //if (wav.ds64.chunkSize > 28) {
    //  wav.ds64.tableLength = unpack(
    //    chunkData.slice(28, 32), uInt32_);
    //  wav.ds64.table = chunkData.slice(
    //     32, 32 + wav.ds64.tableLength);
    //}
  } else {
    if (wav.container == 'RF64') {
      throw Error('Could not find the "ds64" chunk');
    }
  }
}

/**
 * Read the 'LIST' chunks of a wave file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @private
 */
function readLISTChunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let listChunks = findChunk_(signature, 'LIST', true);
  if (listChunks === null) {
    return;
  }
  for (let j=0; j < listChunks.length; j++) {
    /** @type {!Object} */
    let subChunk = listChunks[j];
    wav.LIST.push({
      chunkId: subChunk.chunkId,
      chunkSize: subChunk.chunkSize,
      format: subChunk.format,
      subChunks: []});
    for (let x=0; x<subChunk.subChunks.length; x++) {
      readLISTSubChunks_(subChunk.subChunks[x],
        subChunk.format, buffer, wav, uInt32_, uInt16_);
    }
  }
}

/**
 * Read the sub chunks of a 'LIST' chunk.
 * @param {!Object} subChunk The 'LIST' subchunks.
 * @param {string} format The 'LIST' format, 'adtl' or 'INFO'.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @private
 */
function readLISTSubChunks_(subChunk, format, buffer, wav, uInt32_, uInt16_) {
  if (format == 'adtl') {
    if (['labl', 'note','ltxt'].indexOf(subChunk.chunkId) > -1) {
      io.head_ = subChunk.chunkData.start;
      /** @type {!Object<string, string|number>} */
      let item = {
        chunkId: subChunk.chunkId,
        chunkSize: subChunk.chunkSize,
        dwName: io.read_(buffer, uInt32_)
      };
      if (subChunk.chunkId == 'ltxt') {
        item.dwSampleLength = io.read_(buffer, uInt32_);
        item.dwPurposeID = io.read_(buffer, uInt32_);
        item.dwCountry = io.read_(buffer, uInt16_);
        item.dwLanguage = io.read_(buffer, uInt16_);
        item.dwDialect = io.read_(buffer, uInt16_);
        item.dwCodePage = io.read_(buffer, uInt16_);
      }
      item.value = io.readZSTR_(buffer, io.head_);
      wav.LIST[wav.LIST.length - 1].subChunks.push(item);
    }
  // RIFF INFO tags like ICRD, ISFT, ICMT
  } else if(format == 'INFO') {
    io.head_ = subChunk.chunkData.start;
    wav.LIST[wav.LIST.length - 1].subChunks.push({
      chunkId: subChunk.chunkId,
      chunkSize: subChunk.chunkSize,
      value: io.readZSTR_(buffer, io.head_)
    });
  }
}

/**
 * Read the 'junk' chunk of a wave file.
 * @param {!Uint8Array} buffer The wav file buffer.
 * @param {!Object} signature The file signature.
 * @private
 */
function readJunkChunk_(buffer, signature, wav, uInt32_, uInt16_) {
  /** @type {?Object} */
  let chunk = findChunk_(signature, 'junk');
  if (chunk) {
    wav.junk = {
      chunkId: chunk.chunkId,
      chunkSize: chunk.chunkSize,
      chunkData: [].slice.call(buffer.slice(
        chunk.chunkData.start,
        chunk.chunkData.end))
    };
  }
}
