/*
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
 * @fileoverview A class to read and write wav data.
 * @see https://github.com/rochars/wavefile
 */

import riffChunks from '../vendor/riff-chunks.js';
import {pack, unpackFrom, unpackString,
  packStringTo, packTo, packString,} from '../vendor/byte-data.js';

// @type {WavStruct}
import WavStruct from './wavstruct.js';

/**
 * A class to read and write wav data.
 * @extends WavStruct
 */
export default class WavIO extends WavStruct {

  constructor() {
    super();
    /**
     * @type {!Object}
     * @private
     */
    this.uInt16_ = {bits: 16, be: false};
    /**
     * @type {!Object}
     * @private
     */
    this.uInt32_ = {bits: 32, be: false};
    /**
     * The bit depth code according to the samples.
     * @type {string}
     */
    this.bitDepth = '0';
    /**
     * @type {number}
     * @private
     */
    this.head_ = 0;
    /**
     * @type {!Object}
     * @private
     */
    this.dataType = {};
  }

  /**
   * Write a variable size string as bytes. If the string is smaller
   * than the max size the output array is filled with 0s.
   * @param {string} str The string to be written as bytes.
   * @param {number} maxSize the max size of the string.
   * @return {!Array<number>} The bytes.
   * @private
   */
  writeString_(str, maxSize, push=true) {
    /** @type {!Array<number>} */   
    let bytes = packString(str);
    if (push) {
      for (let i=bytes.length; i<maxSize; i++) {
        bytes.push(0);
      }  
    }
    return bytes;
  }

  /**
   * Return the bytes of the 'bext' chunk.
   * @return {!Array<number>} The 'bext' chunk bytes.
   * @private
   */
  getBextBytes_() {
    /** @type {!Array<number>} */
    let bytes = [];
    this.enforceBext_();
    if (this.bext.chunkId) {
      this.bext.chunkSize = 602 + this.bext.codingHistory.length;
      bytes = bytes.concat(
        packString(this.bext.chunkId),
        pack(602 + this.bext.codingHistory.length, this.uInt32_),
        this.writeString_(this.bext.description, 256),
        this.writeString_(this.bext.originator, 32),
        this.writeString_(this.bext.originatorReference, 32),
        this.writeString_(this.bext.originationDate, 10),
        this.writeString_(this.bext.originationTime, 8),
        pack(this.bext.timeReference[0], this.uInt32_),
        pack(this.bext.timeReference[1], this.uInt32_),
        pack(this.bext.version, this.uInt16_),
        this.writeString_(this.bext.UMID, 64),
        pack(this.bext.loudnessValue, this.uInt16_),
        pack(this.bext.loudnessRange, this.uInt16_),
        pack(this.bext.maxTruePeakLevel, this.uInt16_),
        pack(this.bext.maxMomentaryLoudness, this.uInt16_),
        pack(this.bext.maxShortTermLoudness, this.uInt16_),
        this.writeString_(this.bext.reserved, 180),
        this.writeString_(
          this.bext.codingHistory, this.bext.codingHistory.length));
    }
    return bytes;
  }

  /**
   * Make sure a 'bext' chunk is created if BWF data was created in a file.
   * @private
   */
  enforceBext_() {
    for (var prop in this.bext) {
      if (this.bext.hasOwnProperty(prop)) {
        if (this.bext[prop] && prop != 'timeReference') {
          this.bext.chunkId = 'bext';
          break;
        }
      }
    }
    if (this.bext.timeReference[0] || this.bext.timeReference[1]) {
      this.bext.chunkId = 'bext';
    }
  }

  /**
   * Return the bytes of the 'ds64' chunk.
   * @return {!Array<number>} The 'ds64' chunk bytes.
   * @private
   */
  getDs64Bytes_() {
    /** @type {!Array<number>} */
    let bytes = [];
    if (this.ds64.chunkId) {
      bytes = bytes.concat(
        packString(this.ds64.chunkId),
        pack(this.ds64.chunkSize, this.uInt32_),
        pack(this.ds64.riffSizeHigh, this.uInt32_),
        pack(this.ds64.riffSizeLow, this.uInt32_),
        pack(this.ds64.dataSizeHigh, this.uInt32_),
        pack(this.ds64.dataSizeLow, this.uInt32_),
        pack(this.ds64.originationTime, this.uInt32_),
        pack(this.ds64.sampleCountHigh, this.uInt32_),
        pack(this.ds64.sampleCountLow, this.uInt32_));
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
  getCueBytes_() {
    /** @type {!Array<number>} */
    let bytes = [];
    if (this.cue.chunkId) {
      /** @type {!Array<number>} */
      let cuePointsBytes = this.getCuePointsBytes_();
      bytes = bytes.concat(
        packString(this.cue.chunkId),
        pack(cuePointsBytes.length + 4, this.uInt32_),
        pack(this.cue.dwCuePoints, this.uInt32_),
        cuePointsBytes);
    }
    return bytes;
  }

  /**
   * Return the bytes of the 'cue ' points.
   * @return {!Array<number>} The 'cue ' points as an array of bytes.
   * @private
   */
  getCuePointsBytes_() {
    /** @type {!Array<number>} */
    let points = [];
    for (let i=0; i<this.cue.dwCuePoints; i++) {
      points = points.concat(
        pack(this.cue.points[i].dwName, this.uInt32_),
        pack(this.cue.points[i].dwPosition, this.uInt32_),
        packString(this.cue.points[i].fccChunk),
        pack(this.cue.points[i].dwChunkStart, this.uInt32_),
        pack(this.cue.points[i].dwBlockStart, this.uInt32_),
        pack(this.cue.points[i].dwSampleOffset, this.uInt32_));
    }
    return points;
  }

  /**
   * Return the bytes of the 'smpl' chunk.
   * @return {!Array<number>} The 'smpl' chunk bytes.
   * @private
   */
  getSmplBytes_() {
    /** @type {!Array<number>} */
    let bytes = [];
    if (this.smpl.chunkId) {
      /** @type {!Array<number>} */
      let smplLoopsBytes = this.getSmplLoopsBytes_();
      bytes = bytes.concat(
        packString(this.smpl.chunkId),
        pack(smplLoopsBytes.length + 36, this.uInt32_),
        pack(this.smpl.dwManufacturer, this.uInt32_),
        pack(this.smpl.dwProduct, this.uInt32_),
        pack(this.smpl.dwSamplePeriod, this.uInt32_),
        pack(this.smpl.dwMIDIUnityNote, this.uInt32_),
        pack(this.smpl.dwMIDIPitchFraction, this.uInt32_),
        pack(this.smpl.dwSMPTEFormat, this.uInt32_),
        pack(this.smpl.dwSMPTEOffset, this.uInt32_),
        pack(this.smpl.dwNumSampleLoops, this.uInt32_),
        pack(this.smpl.dwSamplerData, this.uInt32_),
        smplLoopsBytes);
    }
    return bytes;
  }

  /**
   * Return the bytes of the 'smpl' loops.
   * @return {!Array<number>} The 'smpl' loops as an array of bytes.
   * @private
   */
  getSmplLoopsBytes_() {
    /** @type {!Array<number>} */
    let loops = [];
    for (let i=0; i<this.smpl.dwNumSampleLoops; i++) {
      loops = loops.concat(
        pack(this.smpl.loops[i].dwName, this.uInt32_),
        pack(this.smpl.loops[i].dwType, this.uInt32_),
        pack(this.smpl.loops[i].dwStart, this.uInt32_),
        pack(this.smpl.loops[i].dwEnd, this.uInt32_),
        pack(this.smpl.loops[i].dwFraction, this.uInt32_),
        pack(this.smpl.loops[i].dwPlayCount, this.uInt32_));
    }
    return loops;
  }

  /**
   * Return the bytes of the 'fact' chunk.
   * @return {!Array<number>} The 'fact' chunk bytes.
   * @private
   */
  getFactBytes_() {
    /** @type {!Array<number>} */
    let bytes = [];
    if (this.fact.chunkId) {
      bytes = bytes.concat(
        packString(this.fact.chunkId),
        pack(this.fact.chunkSize, this.uInt32_),
        pack(this.fact.dwSampleLength, this.uInt32_));
    }
    return bytes;
  }

  /**
   * Return the bytes of the 'fmt ' chunk.
   * @return {!Array<number>} The 'fmt' chunk bytes.
   * @throws {Error} if no 'fmt ' chunk is present.
   * @private
   */
  getFmtBytes_() {
    /** @type {!Array<number>} */
    let fmtBytes = [];
    if (this.fmt.chunkId) {
      return fmtBytes.concat(
        packString(this.fmt.chunkId),
        pack(this.fmt.chunkSize, this.uInt32_),
        pack(this.fmt.audioFormat, this.uInt16_),
        pack(this.fmt.numChannels, this.uInt16_),
        pack(this.fmt.sampleRate, this.uInt32_),
        pack(this.fmt.byteRate, this.uInt32_),
        pack(this.fmt.blockAlign, this.uInt16_),
        pack(this.fmt.bitsPerSample, this.uInt16_),
        this.getFmtExtensionBytes_());
    }
    throw Error('Could not find the "fmt " chunk');
  }

  /**
   * Return the bytes of the fmt extension fields.
   * @return {!Array<number>} The fmt extension bytes.
   * @private
   */
  getFmtExtensionBytes_() {
    /** @type {!Array<number>} */
    let extension = [];
    if (this.fmt.chunkSize > 16) {
      extension = extension.concat(
        pack(this.fmt.cbSize, this.uInt16_));
    }
    if (this.fmt.chunkSize > 18) {
      extension = extension.concat(
        pack(this.fmt.validBitsPerSample, this.uInt16_));
    }
    if (this.fmt.chunkSize > 20) {
      extension = extension.concat(
        pack(this.fmt.dwChannelMask, this.uInt32_));
    }
    if (this.fmt.chunkSize > 24) {
      extension = extension.concat(
        pack(this.fmt.subformat[0], this.uInt32_),
        pack(this.fmt.subformat[1], this.uInt32_),
        pack(this.fmt.subformat[2], this.uInt32_),
        pack(this.fmt.subformat[3], this.uInt32_));
    }
    return extension;
  }

  /**
   * Return the bytes of the 'LIST' chunk.
   * @return {!Array<number>} The 'LIST' chunk bytes.
   */
  getLISTBytes_() {
    /** @type {!Array<number>} */
    let bytes = [];
    for (let i=0; i<this.LIST.length; i++) {
      /** @type {!Array<number>} */
      let subChunksBytes = this.getLISTSubChunksBytes_(
          this.LIST[i].subChunks, this.LIST[i].format);
      bytes = bytes.concat(
        packString(this.LIST[i].chunkId),
        pack(subChunksBytes.length + 4, this.uInt32_),
        packString(this.LIST[i].format),
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
  getLISTSubChunksBytes_(subChunks, format) {
    /** @type {!Array<number>} */
    let bytes = [];
    for (let i=0; i<subChunks.length; i++) {
      if (format == 'INFO') {
        bytes = bytes.concat(
          packString(subChunks[i].chunkId),
          pack(subChunks[i].value.length + 1, this.uInt32_),
          this.writeString_(
            subChunks[i].value, subChunks[i].value.length));
        bytes.push(0);
      } else if (format == 'adtl') {
        if (['labl', 'note'].indexOf(subChunks[i].chunkId) > -1) {
          bytes = bytes.concat(
            packString(subChunks[i].chunkId),
            pack(
              subChunks[i].value.length + 4 + 1, this.uInt32_),
            pack(subChunks[i].dwName, this.uInt32_),
            this.writeString_(
              subChunks[i].value,
              subChunks[i].value.length));
          bytes.push(0);
        } else if (subChunks[i].chunkId == 'ltxt') {
          bytes = bytes.concat(
            this.getLtxtChunkBytes_(subChunks[i]));
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
  getLtxtChunkBytes_(ltxt) {
    return [].concat(
      packString(ltxt.chunkId),
      pack(ltxt.value.length + 20, this.uInt32_),
      pack(ltxt.dwName, this.uInt32_),
      pack(ltxt.dwSampleLength, this.uInt32_),
      pack(ltxt.dwPurposeID, this.uInt32_),
      pack(ltxt.dwCountry, this.uInt16_),
      pack(ltxt.dwLanguage, this.uInt16_),
      pack(ltxt.dwDialect, this.uInt16_),
      pack(ltxt.dwCodePage, this.uInt16_),
      this.writeString_(ltxt.value, ltxt.value.length));
  }

  /**
   * Return the bytes of the 'junk' chunk.
   * @return {!Array<number>} The 'junk' chunk bytes.
   * @private
   */
  getJunkBytes_() {
    /** @type {!Array<number>} */
    let bytes = [];
    if (this.junk.chunkId) {
      return bytes.concat(
        packString(this.junk.chunkId),
        pack(this.junk.chunkData.length, this.uInt32_),
        this.junk.chunkData);
    }
    return bytes;
  }

  /**
   * Return 'RIFF' if the container is 'RF64', the current container name
   * otherwise. Used to enforce 'RIFF' when RF64 is not allowed.
   * @return {string}
   * @private
   */
  correctContainer_() {
    return this.container == 'RF64' ? 'RIFF' : this.container;
  }

  /**
   * Set the string code of the bit depth based on the 'fmt ' chunk.
   * @private
   */
  bitDepthFromFmt_() {
    if (this.fmt.audioFormat === 3 && this.fmt.bitsPerSample === 32) {
      this.bitDepth = '32f';
    } else if (this.fmt.audioFormat === 6) {
      this.bitDepth = '8a';
    } else if (this.fmt.audioFormat === 7) {
      this.bitDepth = '8m';
    } else {
      this.bitDepth = this.fmt.bitsPerSample.toString();
    }
  }

  /**
   * Return a .wav file byte buffer with the data from the WaveFile object.
   * The return value of this method can be written straight to disk.
   * @return {!Uint8Array} The wav file bytes.
   * @private
   */
  createWaveFile_() {
    /** @type {!Array<!Array<number>>} */
    let fileBody = [
      this.getJunkBytes_(),
      this.getDs64Bytes_(),
      this.getBextBytes_(),
      this.getFmtBytes_(),
      this.getFactBytes_(),
      packString(this.data.chunkId),
      pack(this.data.samples.length, this.uInt32_),
      this.data.samples,
      this.getCueBytes_(),
      this.getSmplBytes_(),
      this.getLISTBytes_()
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
    index = packStringTo(this.container, file, index);
    index = packTo(fileBodyLength + 4, this.uInt32_, file, index);
    index = packStringTo(this.format, file, index);
    for (let i=0; i<fileBody.length; i++) {
      file.set(fileBody[i], index);
      index += fileBody[i].length;
    }
    return file;
  }

  /**
   * Update the type definition used to read and write the samples.
   * @private
   */
  updateDataType_() {
    /** @type {!Object} */
    this.dataType = {
      bits: ((parseInt(this.bitDepth, 10) - 1) | 7) + 1,
      float: this.bitDepth == '32f' || this.bitDepth == '64',
      signed: this.bitDepth != '8',
      be: this.container == 'RIFX'
    };
    if (['4', '8a', '8m'].indexOf(this.bitDepth) > -1 ) {
      this.dataType.bits = 8;
      this.dataType.signed = false;
    }
  }

  /**
   * Set up the WaveFile object from a byte buffer.
   * @param {!Uint8Array} buffer The buffer.
   * @param {boolean=} samples True if the samples should be loaded.
   * @throws {Error} If container is not RIFF, RIFX or RF64.
   * @throws {Error} If no 'fmt ' chunk is found.
   * @throws {Error} If no 'data' chunk is found.
   */
  readWavBuffer(buffer, samples=true) {
    this.head_ = 0;
    this.clearHeader_();
    this.readRIFFChunk_(buffer);
    /** @type {!Object} */
    let chunk = riffChunks(buffer);
    this.readDs64Chunk_(buffer, chunk.subChunks);
    this.readFmtChunk_(buffer, chunk.subChunks);
    this.readFactChunk_(buffer, chunk.subChunks);
    this.readBextChunk_(buffer, chunk.subChunks);
    this.readCueChunk_(buffer, chunk.subChunks);
    this.readSmplChunk_(buffer, chunk.subChunks);
    this.readDataChunk_(buffer, chunk.subChunks, samples);
    this.readJunkChunk_(buffer, chunk.subChunks);
    this.readLISTChunk_(buffer, chunk.subChunks);
    this.bitDepthFromFmt_();
    this.updateDataType_();
  }

  /**
   * Return the closest greater number of bits for a number of bits that
   * do not fill a full sequence of bytes.
   * @param {string} bitDepthCode The bit depth.
   * @return {string}
   * @private
   */
  realBitDepth_(bitDepthCode) {
    if (bitDepthCode != '32f') {
      bitDepthCode = (((parseInt(bitDepthCode, 10) - 1) | 7) + 1).toString();
    }
    return bitDepthCode;
  }

  /**
   * Reset attributes that should emptied when a file is
   * created with the fromScratch() or fromBuffer() methods.
   * @private
   */
  clearHeader_() {
    this.fmt.cbSize = 0;
    this.fmt.validBitsPerSample = 0;
    this.fact.chunkId = '';
    this.ds64.chunkId = '';
  }

  /**
   * Set up to work wih big-endian or little-endian files.
   * The types used are changed to LE or BE. If the
   * the file is big-endian (RIFX), true is returned.
   * @return {boolean} True if the file is RIFX.
   * @private
   */
  LEorBE_() {
    /** @type {boolean} */
    let bigEndian = this.container === 'RIFX';
    this.uInt16_.be = bigEndian;
    this.uInt32_.be = bigEndian;
    return bigEndian;
  }

  /**
   * Find a chunk by its fourCC_ in a array of RIFF chunks.
   * @param {!Object} chunks The wav file chunks.
   * @param {string} chunkId The chunk fourCC_.
   * @param {boolean} multiple True if there may be multiple chunks
   *    with the same chunkId.
   * @return {?Array<!Object>}
   * @private
   */
  findChunk_(chunks, chunkId, multiple=false) {
    /** @type {!Array<!Object>} */
    let chunk = [];
    for (let i=0; i<chunks.length; i++) {
      if (chunks[i].chunkId == chunkId) {
        if (multiple) {
          chunk.push(chunks[i]);
        } else {
          return chunks[i];
        }
      }
    }
    if (chunkId == 'LIST') {
      return chunk.length ? chunk : null;
    }
    return null;
  }

  /**
   * Read the RIFF chunk a wave file.
   * @param {!Uint8Array} bytes A wav buffer.
   * @throws {Error} If no 'RIFF' chunk is found.
   * @private
   */
  readRIFFChunk_(bytes) {
    this.head_ = 0;
    this.container = this.readString_(bytes, 4);
    if (['RIFF', 'RIFX', 'RF64'].indexOf(this.container) === -1) {
      throw Error('Not a supported format.');
    }
    this.LEorBE_();
    this.chunkSize = this.read_(bytes, this.uInt32_);
    this.format = this.readString_(bytes, 4);
    if (this.format != 'WAVE') {
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
  readFmtChunk_(buffer, signature) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'fmt ');
    if (chunk) {
      this.head_ = chunk.chunkData.start;
      this.fmt.chunkId = chunk.chunkId;
      this.fmt.chunkSize = chunk.chunkSize;
      this.fmt.audioFormat = this.read_(buffer, this.uInt16_);
      this.fmt.numChannels = this.read_(buffer, this.uInt16_);
      this.fmt.sampleRate = this.read_(buffer, this.uInt32_);
      this.fmt.byteRate = this.read_(buffer, this.uInt32_);
      this.fmt.blockAlign = this.read_(buffer, this.uInt16_);
      this.fmt.bitsPerSample = this.read_(buffer, this.uInt16_);
      this.readFmtExtension_(buffer);
    } else {
      throw Error('Could not find the "fmt " chunk');
    }
  }

  /**
   * Read the 'fmt ' chunk extension.
   * @param {!Uint8Array} buffer The wav file buffer.
   * @private
   */
  readFmtExtension_(buffer) {
    if (this.fmt.chunkSize > 16) {
      this.fmt.cbSize = this.read_(buffer, this.uInt16_);
      if (this.fmt.chunkSize > 18) {
        this.fmt.validBitsPerSample = this.read_(buffer, this.uInt16_);
        if (this.fmt.chunkSize > 20) {
          this.fmt.dwChannelMask = this.read_(buffer, this.uInt32_);
          this.fmt.subformat = [
            this.read_(buffer, this.uInt32_),
            this.read_(buffer, this.uInt32_),
            this.read_(buffer, this.uInt32_),
            this.read_(buffer, this.uInt32_)];
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
  readFactChunk_(buffer, signature) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'fact');
    if (chunk) {
      this.head_ = chunk.chunkData.start;
      this.fact.chunkId = chunk.chunkId;
      this.fact.chunkSize = chunk.chunkSize;
      this.fact.dwSampleLength = this.read_(buffer, this.uInt32_);
    }
  }

  /**
   * Read the 'cue ' chunk of a wave file.
   * @param {!Uint8Array} buffer The wav file buffer.
   * @param {!Object} signature The file signature.
   * @private
   */
  readCueChunk_(buffer, signature) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'cue ');
    if (chunk) {
      this.head_ = chunk.chunkData.start;
      this.cue.chunkId = chunk.chunkId;
      this.cue.chunkSize = chunk.chunkSize;
      this.cue.dwCuePoints = this.read_(buffer, this.uInt32_);
      for (let i=0; i<this.cue.dwCuePoints; i++) {
        this.cue.points.push({
          dwName: this.read_(buffer, this.uInt32_),
          dwPosition: this.read_(buffer, this.uInt32_),
          fccChunk: this.readString_(buffer, 4),
          dwChunkStart: this.read_(buffer, this.uInt32_),
          dwBlockStart: this.read_(buffer, this.uInt32_),
          dwSampleOffset: this.read_(buffer, this.uInt32_),
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
  readSmplChunk_(buffer, signature) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'smpl');
    if (chunk) {
      this.head_ = chunk.chunkData.start;
      this.smpl.chunkId = chunk.chunkId;
      this.smpl.chunkSize = chunk.chunkSize;
      this.smpl.dwManufacturer = this.read_(buffer, this.uInt32_);
      this.smpl.dwProduct = this.read_(buffer, this.uInt32_);
      this.smpl.dwSamplePeriod = this.read_(buffer, this.uInt32_);
      this.smpl.dwMIDIUnityNote = this.read_(buffer, this.uInt32_);
      this.smpl.dwMIDIPitchFraction = this.read_(buffer, this.uInt32_);
      this.smpl.dwSMPTEFormat = this.read_(buffer, this.uInt32_);
      this.smpl.dwSMPTEOffset = this.read_(buffer, this.uInt32_);
      this.smpl.dwNumSampleLoops = this.read_(buffer, this.uInt32_);
      this.smpl.dwSamplerData = this.read_(buffer, this.uInt32_);
      for (let i=0; i<this.smpl.dwNumSampleLoops; i++) {
        this.smpl.loops.push({
          dwName: this.read_(buffer, this.uInt32_),
          dwType: this.read_(buffer, this.uInt32_),
          dwStart: this.read_(buffer, this.uInt32_),
          dwEnd: this.read_(buffer, this.uInt32_),
          dwFraction: this.read_(buffer, this.uInt32_),
          dwPlayCount: this.read_(buffer, this.uInt32_),
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
  readDataChunk_(buffer, signature, samples) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'data');
    if (chunk) {
      this.data.chunkId = 'data';
      this.data.chunkSize = chunk.chunkSize;
      if (samples) {
        this.data.samples = buffer.slice(
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
  readBextChunk_(buffer, signature) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'bext');
    if (chunk) {
      this.head_ = chunk.chunkData.start;
      this.bext.chunkId = chunk.chunkId;
      this.bext.chunkSize = chunk.chunkSize;
      this.bext.description = this.readString_(buffer, 256);
      this.bext.originator = this.readString_(buffer, 32);
      this.bext.originatorReference = this.readString_(buffer, 32);
      this.bext.originationDate = this.readString_(buffer, 10);
      this.bext.originationTime = this.readString_(buffer, 8);
      this.bext.timeReference = [
        this.read_(buffer, this.uInt32_),
        this.read_(buffer, this.uInt32_)];
      this.bext.version = this.read_(buffer, this.uInt16_);
      this.bext.UMID = this.readString_(buffer, 64);
      this.bext.loudnessValue = this.read_(buffer, this.uInt16_);
      this.bext.loudnessRange = this.read_(buffer, this.uInt16_);
      this.bext.maxTruePeakLevel = this.read_(buffer, this.uInt16_);
      this.bext.maxMomentaryLoudness = this.read_(buffer, this.uInt16_);
      this.bext.maxShortTermLoudness = this.read_(buffer, this.uInt16_);
      this.bext.reserved = this.readString_(buffer, 180);
      this.bext.codingHistory = this.readString_(
        buffer, this.bext.chunkSize - 602);
    }
  }

  /**
   * Read the 'ds64' chunk of a wave file.
   * @param {!Uint8Array} buffer The wav file buffer.
   * @param {!Object} signature The file signature.
   * @throws {Error} If no 'ds64' chunk is found and the file is RF64.
   * @private
   */
  readDs64Chunk_(buffer, signature) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'ds64');
    if (chunk) {
      this.head_ = chunk.chunkData.start;
      this.ds64.chunkId = chunk.chunkId;
      this.ds64.chunkSize = chunk.chunkSize;
      this.ds64.riffSizeHigh = this.read_(buffer, this.uInt32_);
      this.ds64.riffSizeLow = this.read_(buffer, this.uInt32_);
      this.ds64.dataSizeHigh = this.read_(buffer, this.uInt32_);
      this.ds64.dataSizeLow = this.read_(buffer, this.uInt32_);
      this.ds64.originationTime = this.read_(buffer, this.uInt32_);
      this.ds64.sampleCountHigh = this.read_(buffer, this.uInt32_);
      this.ds64.sampleCountLow = this.read_(buffer, this.uInt32_);
      //if (this.ds64.chunkSize > 28) {
      //  this.ds64.tableLength = unpack(
      //    chunkData.slice(28, 32), this.uInt32_);
      //  this.ds64.table = chunkData.slice(
      //     32, 32 + this.ds64.tableLength); 
      //}
    } else {
      if (this.container == 'RF64') {
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
  readLISTChunk_(buffer, signature) {
    /** @type {?Object} */
    let listChunks = this.findChunk_(signature, 'LIST', true);
    if (listChunks === null) {
      return;
    }
    for (let j=0; j < listChunks.length; j++) {
      /** @type {!Object} */
      let subChunk = listChunks[j];
      this.LIST.push({
        chunkId: subChunk.chunkId,
        chunkSize: subChunk.chunkSize,
        format: subChunk.format,
        subChunks: []});
      for (let x=0; x<subChunk.subChunks.length; x++) {
        this.readLISTSubChunks_(subChunk.subChunks[x],
          subChunk.format, buffer);
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
  readLISTSubChunks_(subChunk, format, buffer) {
    if (format == 'adtl') {
      if (['labl', 'note','ltxt'].indexOf(subChunk.chunkId) > -1) {
        this.head_ = subChunk.chunkData.start;
        /** @type {!Object<string, string|number>} */
        let item = {
          chunkId: subChunk.chunkId,
          chunkSize: subChunk.chunkSize,
          dwName: this.read_(buffer, this.uInt32_)
        };
        if (subChunk.chunkId == 'ltxt') {
          item.dwSampleLength = this.read_(buffer, this.uInt32_);
          item.dwPurposeID = this.read_(buffer, this.uInt32_);
          item.dwCountry = this.read_(buffer, this.uInt16_);
          item.dwLanguage = this.read_(buffer, this.uInt16_);
          item.dwDialect = this.read_(buffer, this.uInt16_);
          item.dwCodePage = this.read_(buffer, this.uInt16_);
        }
        item.value = this.readZSTR_(buffer, this.head_);
        this.LIST[this.LIST.length - 1].subChunks.push(item);
      }
    // RIFF INFO tags like ICRD, ISFT, ICMT
    } else if(format == 'INFO') {
      this.head_ = subChunk.chunkData.start;
      this.LIST[this.LIST.length - 1].subChunks.push({
        chunkId: subChunk.chunkId,
        chunkSize: subChunk.chunkSize,
        value: this.readZSTR_(buffer,  this.head_)
      });
    }
  }

  /**
   * Read the 'junk' chunk of a wave file.
   * @param {!Uint8Array} buffer The wav file buffer.
   * @param {!Object} signature The file signature.
   * @private
   */
  readJunkChunk_(buffer, signature) {
    /** @type {?Object} */
    let chunk = this.findChunk_(signature, 'junk');
    if (chunk) {
      this.junk = {
        chunkId: chunk.chunkId,
        chunkSize: chunk.chunkSize,
        chunkData: [].slice.call(buffer.slice(
          chunk.chunkData.start,
          chunk.chunkData.end))
      };
    }
  }

  /**
   * Read bytes as a ZSTR string.
   * @param {!Uint8Array} bytes The bytes.
   * @return {string} The string.
   * @private
   */
  readZSTR_(bytes, index=0) {
    /** @type {string} */
    let str = '';
    for (let i=index; i<bytes.length; i++) {
      this.head_++;
      if (bytes[i] === 0) {
        break;
      }
      str += unpackString(bytes, i, 1);
    }
    return str;
  }

  /**
   * Read bytes as a string from a RIFF chunk.
   * @param {!Uint8Array} bytes The bytes.
   * @param {number} maxSize the max size of the string.
   * @return {string} The string.
   * @private
   */
  readString_(bytes, maxSize) {
    /** @type {string} */
    let str = '';
    for (let i=0; i<maxSize; i++) {
      str += unpackString(bytes, this.head_, 1);
      this.head_++;
    }
    return str;
  }

  /**
   * Read a number from a chunk.
   * @param {!Uint8Array} bytes The chunk bytes.
   * @param {!Object} bdType The type definition.
   * @return {number} The number.
   * @private
   */
  read_(bytes, bdType) {
    /** @type {number} */
    let size = bdType.bits / 8;
    /** @type {number} */
    let value = unpackFrom(bytes, bdType, this.head_);
    this.head_ += size;
    return value;
  }


  /**
   * Truncate float samples on over and underflow.
   * @private
   */
  truncateSamples(samples) {
    if (this.fmt.audioFormat === 3) {
      /** @type {number} */   
      let len = samples.length;
      for (let i=0; i<len; i++) {
        if (samples[i] > 1) {
          samples[i] = 1;
        } else if (samples[i] < -1) {
          samples[i] = -1;
        }
      }
    }
  }
}
