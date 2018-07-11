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
 * @fileoverview Make buffers of structured wav data.
 * @see https://github.com/rochars/wavefile
 */

import {pack, packTo, packStringTo, packString} from '../vendor/byte-data.js';
import BufferIO from './bufferio.js';

let io = new BufferIO();

/**
 * Return a .wav file byte buffer with the data from the WaveFile object.
 * The return value of this method can be written straight to disk.
 * @return {!Uint8Array} The wav file bytes.
 * @private
 */
export default function writeWavBuffer(wav) {
  let uInt32_ = {bits: 32, be: false};
  let uInt16_ = {bits: 16, be: false};
  uInt16_.be = wav.container === 'RIFX';
  uInt32_.be = uInt16_.be;
  /** @type {!Array<!Array<number>>} */
  let fileBody = [
    getJunkBytes_(wav, uInt32_),
    getDs64Bytes_(wav, uInt32_),
    getBextBytes_(wav, uInt32_, uInt16_),
    getFmtBytes_(wav, uInt32_, uInt16_),
    getFactBytes_(wav, uInt32_),
    packString(wav.data.chunkId),
    pack(wav.data.samples.length, uInt32_),
    wav.data.samples,
    getCueBytes_(wav, uInt32_),
    getSmplBytes_(wav, uInt32_),
    getLISTBytes_(wav, uInt32_, uInt16_)
  ];
  /** @type {number} */
  let fileBodyLength = 0;
  for (let i=0; i<fileBody.length; i++) {
    fileBodyLength += fileBody[i].length;
  }
  /** @type {!Uint8Array} */
  let file = new Uint8Array(fileBodyLength + 12);
  /** @type {number} */
  let index = 0;
  index = packStringTo(wav.container, file, index);
  index = packTo(fileBodyLength + 4, uInt32_, file, index);
  index = packStringTo(wav.format, file, index);
  for (let i=0; i<fileBody.length; i++) {
    file.set(fileBody[i], index);
    index += fileBody[i].length;
  }
  return file;
}

/**
 * Return the bytes of the 'bext' chunk.
 * @return {!Array<number>} The 'bext' chunk bytes.
 * @private
 */
function getBextBytes_(wav, uInt32_, uInt16_) {
  /** @type {!Array<number>} */
  let bytes = [];
  enforceBext_(wav);
  if (wav.bext.chunkId) {
    wav.bext.chunkSize = 602 + wav.bext.codingHistory.length;
    bytes = bytes.concat(
      packString(wav.bext.chunkId),
      pack(602 + wav.bext.codingHistory.length, uInt32_),
      io.writeString_(wav.bext.description, 256),
      io.writeString_(wav.bext.originator, 32),
      io.writeString_(wav.bext.originatorReference, 32),
      io.writeString_(wav.bext.originationDate, 10),
      io.writeString_(wav.bext.originationTime, 8),
      pack(wav.bext.timeReference[0], uInt32_),
      pack(wav.bext.timeReference[1], uInt32_),
      pack(wav.bext.version, uInt16_),
      io.writeString_(wav.bext.UMID, 64),
      pack(wav.bext.loudnessValue, uInt16_),
      pack(wav.bext.loudnessRange, uInt16_),
      pack(wav.bext.maxTruePeakLevel, uInt16_),
      pack(wav.bext.maxMomentaryLoudness, uInt16_),
      pack(wav.bext.maxShortTermLoudness, uInt16_),
      io.writeString_(wav.bext.reserved, 180),
      io.writeString_(
        wav.bext.codingHistory, wav.bext.codingHistory.length));
  }
  return bytes;
}

/**
 * Make sure a 'bext' chunk is created if BWF data was created in a file.
 * @private
 */
function enforceBext_(wav) {
  for (var prop in wav.bext) {
    if (wav.bext.hasOwnProperty(prop)) {
      if (wav.bext[prop] && prop != 'timeReference') {
        wav.bext.chunkId = 'bext';
        break;
      }
    }
  }
  if (wav.bext.timeReference[0] || wav.bext.timeReference[1]) {
    wav.bext.chunkId = 'bext';
  }
}

/**
 * Return the bytes of the 'ds64' chunk.
 * @return {!Array<number>} The 'ds64' chunk bytes.
 * @private
 */
function getDs64Bytes_(wav, uInt32_) {
  /** @type {!Array<number>} */
  let bytes = [];
  if (wav.ds64.chunkId) {
    bytes = bytes.concat(
      packString(wav.ds64.chunkId),
      pack(wav.ds64.chunkSize, uInt32_),
      pack(wav.ds64.riffSizeHigh, uInt32_),
      pack(wav.ds64.riffSizeLow, uInt32_),
      pack(wav.ds64.dataSizeHigh, uInt32_),
      pack(wav.ds64.dataSizeLow, uInt32_),
      pack(wav.ds64.originationTime, uInt32_),
      pack(wav.ds64.sampleCountHigh, uInt32_),
      pack(wav.ds64.sampleCountLow, uInt32_));
  }
  //if (this.ds64.tableLength) {
  //  ds64Bytes = ds64Bytes.concat(
  //    pack(this.ds64.tableLength, this.uInt32_),
  //    this.ds64.table);
  //}
  return bytes;
}

/**
 * Return the bytes of the 'cue ' chunk.
 * @return {!Array<number>} The 'cue ' chunk bytes.
 * @private
 */
function getCueBytes_(wav, uInt32_) {
  /** @type {!Array<number>} */
  let bytes = [];
  if (wav.cue.chunkId) {
    /** @type {!Array<number>} */
    let cuePointsBytes = getCuePointsBytes_(wav, uInt32_);
    bytes = bytes.concat(
      packString(wav.cue.chunkId),
      pack(cuePointsBytes.length + 4, uInt32_),
      pack(wav.cue.dwCuePoints, uInt32_),
      cuePointsBytes);
  }
  return bytes;
}

/**
 * Return the bytes of the 'cue ' points.
 * @return {!Array<number>} The 'cue ' points as an array of bytes.
 * @private
 */
function getCuePointsBytes_(wav, uInt32_) {
  /** @type {!Array<number>} */
  let points = [];
  for (let i=0; i<wav.cue.dwCuePoints; i++) {
    points = points.concat(
      pack(wav.cue.points[i].dwName, uInt32_),
      pack(wav.cue.points[i].dwPosition, uInt32_),
      packString(wav.cue.points[i].fccChunk),
      pack(wav.cue.points[i].dwChunkStart, uInt32_),
      pack(wav.cue.points[i].dwBlockStart, uInt32_),
      pack(wav.cue.points[i].dwSampleOffset, uInt32_));
  }
  return points;
}

/**
 * Return the bytes of the 'smpl' chunk.
 * @return {!Array<number>} The 'smpl' chunk bytes.
 * @private
 */
function getSmplBytes_(wav, uInt32_) {
  /** @type {!Array<number>} */
  let bytes = [];
  if (wav.smpl.chunkId) {
    /** @type {!Array<number>} */
    let smplLoopsBytes = getSmplLoopsBytes_(wav, uInt32_);
    bytes = bytes.concat(
      packString(wav.smpl.chunkId),
      pack(smplLoopsBytes.length + 36, uInt32_),
      pack(wav.smpl.dwManufacturer, uInt32_),
      pack(wav.smpl.dwProduct, uInt32_),
      pack(wav.smpl.dwSamplePeriod, uInt32_),
      pack(wav.smpl.dwMIDIUnityNote, uInt32_),
      pack(wav.smpl.dwMIDIPitchFraction, uInt32_),
      pack(wav.smpl.dwSMPTEFormat, uInt32_),
      pack(wav.smpl.dwSMPTEOffset, uInt32_),
      pack(wav.smpl.dwNumSampleLoops, uInt32_),
      pack(wav.smpl.dwSamplerData, uInt32_),
      smplLoopsBytes);
  }
  return bytes;
}

/**
 * Return the bytes of the 'smpl' loops.
 * @return {!Array<number>} The 'smpl' loops as an array of bytes.
 * @private
 */
function getSmplLoopsBytes_(wav, uInt32_) {
  /** @type {!Array<number>} */
  let loops = [];
  for (let i=0; i<wav.smpl.dwNumSampleLoops; i++) {
    loops = loops.concat(
      pack(wav.smpl.loops[i].dwName, uInt32_),
      pack(wav.smpl.loops[i].dwType, uInt32_),
      pack(wav.smpl.loops[i].dwStart, uInt32_),
      pack(wav.smpl.loops[i].dwEnd, uInt32_),
      pack(wav.smpl.loops[i].dwFraction, uInt32_),
      pack(wav.smpl.loops[i].dwPlayCount, uInt32_));
  }
  return loops;
}

/**
 * Return the bytes of the 'fact' chunk.
 * @return {!Array<number>} The 'fact' chunk bytes.
 * @private
 */
function getFactBytes_(wav, uInt32_) {
  /** @type {!Array<number>} */
  let bytes = [];
  if (wav.fact.chunkId) {
    bytes = bytes.concat(
      packString(wav.fact.chunkId),
      pack(wav.fact.chunkSize, uInt32_),
      pack(wav.fact.dwSampleLength, uInt32_));
  }
  return bytes;
}

/**
 * Return the bytes of the 'fmt ' chunk.
 * @return {!Array<number>} The 'fmt' chunk bytes.
 * @throws {Error} if no 'fmt ' chunk is present.
 * @private
 */
function getFmtBytes_(wav, uInt32_, uInt16_) {
  /** @type {!Array<number>} */
  let fmtBytes = [];
  if (wav.fmt.chunkId) {
    return fmtBytes.concat(
      packString(wav.fmt.chunkId),
      pack(wav.fmt.chunkSize, uInt32_),
      pack(wav.fmt.audioFormat, uInt16_),
      pack(wav.fmt.numChannels, uInt16_),
      pack(wav.fmt.sampleRate, uInt32_),
      pack(wav.fmt.byteRate, uInt32_),
      pack(wav.fmt.blockAlign, uInt16_),
      pack(wav.fmt.bitsPerSample, uInt16_),
      getFmtExtensionBytes_(wav, uInt32_, uInt16_));
  }
  throw Error('Could not find the "fmt " chunk');
}

/**
 * Return the bytes of the fmt extension fields.
 * @return {!Array<number>} The fmt extension bytes.
 * @private
 */
function getFmtExtensionBytes_(wav, uInt32_, uInt16_) {
  /** @type {!Array<number>} */
  let extension = [];
  if (wav.fmt.chunkSize > 16) {
    extension = extension.concat(
      pack(wav.fmt.cbSize, uInt16_));
  }
  if (wav.fmt.chunkSize > 18) {
    extension = extension.concat(
      pack(wav.fmt.validBitsPerSample, uInt16_));
  }
  if (wav.fmt.chunkSize > 20) {
    extension = extension.concat(
      pack(wav.fmt.dwChannelMask, uInt32_));
  }
  if (wav.fmt.chunkSize > 24) {
    extension = extension.concat(
      pack(wav.fmt.subformat[0], uInt32_),
      pack(wav.fmt.subformat[1], uInt32_),
      pack(wav.fmt.subformat[2], uInt32_),
      pack(wav.fmt.subformat[3], uInt32_));
  }
  return extension;
}

/**
 * Return the bytes of the 'LIST' chunk.
 * @return {!Array<number>} The 'LIST' chunk bytes.
 */
function getLISTBytes_(wav, uInt32_, uInt16_) {
  /** @type {!Array<number>} */
  let bytes = [];
  for (let i=0; i<wav.LIST.length; i++) {
    /** @type {!Array<number>} */
    let subChunksBytes = getLISTSubChunksBytes_(
        wav.LIST[i].subChunks, wav.LIST[i].format, wav, uInt32_, uInt16_);
    bytes = bytes.concat(
      packString(wav.LIST[i].chunkId),
      pack(subChunksBytes.length + 4, uInt32_),
      packString(wav.LIST[i].format),
      subChunksBytes);
  }
  return bytes;
}

/**
 * Return the bytes of the sub chunks of a 'LIST' chunk.
 * @param {!Array<!Object>} subChunks The 'LIST' sub chunks.
 * @param {string} format The format of the 'LIST' chunk.
 *    Currently supported values are 'adtl' or 'INFO'.
 * @return {!Array<number>} The sub chunk bytes.
 * @private
 */
function getLISTSubChunksBytes_(subChunks, format, wav, uInt32_, uInt16_) {
  /** @type {!Array<number>} */
  let bytes = [];
  for (let i=0; i<subChunks.length; i++) {
    if (format == 'INFO') {
      bytes = bytes.concat(
        packString(subChunks[i].chunkId),
        pack(subChunks[i].value.length + 1, uInt32_),
        io.writeString_(
          subChunks[i].value, subChunks[i].value.length));
      bytes.push(0);
    } else if (format == 'adtl') {
      if (['labl', 'note'].indexOf(subChunks[i].chunkId) > -1) {
        bytes = bytes.concat(
          packString(subChunks[i].chunkId),
          pack(
            subChunks[i].value.length + 4 + 1, uInt32_),
          pack(subChunks[i].dwName, uInt32_),
          io.writeString_(
            subChunks[i].value,
            subChunks[i].value.length));
        bytes.push(0);
      } else if (subChunks[i].chunkId == 'ltxt') {
        bytes = bytes.concat(
          getLtxtChunkBytes_(subChunks[i], wav, uInt32_, uInt16_));
      }
    }
    if (bytes.length % 2) {
      bytes.push(0);
    }
  }
  return bytes;
}

/**
 * Return the bytes of a 'ltxt' chunk.
 * @param {!Object} ltxt the 'ltxt' chunk.
 * @return {!Array<number>} The 'ltxt' chunk bytes.
 * @private
 */
function getLtxtChunkBytes_(ltxt, wav, uInt32_, uInt16_) {
  return [].concat(
    packString(ltxt.chunkId),
    pack(ltxt.value.length + 20, uInt32_),
    pack(ltxt.dwName, uInt32_),
    pack(ltxt.dwSampleLength, uInt32_),
    pack(ltxt.dwPurposeID, uInt32_),
    pack(ltxt.dwCountry, uInt16_),
    pack(ltxt.dwLanguage, uInt16_),
    pack(ltxt.dwDialect, uInt16_),
    pack(ltxt.dwCodePage, uInt16_),
    io.writeString_(ltxt.value, ltxt.value.length));
}

/**
 * Return the bytes of the 'junk' chunk.
 * @return {!Array<number>} The 'junk' chunk bytes.
 * @private
 */
function getJunkBytes_(wav, uInt32_) {
  /** @type {!Array<number>} */
  let bytes = [];
  if (wav.junk.chunkId) {
    return bytes.concat(
      packString(wav.junk.chunkId),
      pack(wav.junk.chunkData.length, uInt32_),
      wav.junk.chunkData);
  }
  return bytes;
}
