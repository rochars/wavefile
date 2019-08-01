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
 * @fileoverview The RIFFFile class.
 * @see https://github.com/rochars/wavefile
 */

import {unpackArray, unpackString, unpack} from 'byte-data';

/**
 * A class to perform low-level reading of RIFF files.
 */
export default class RIFFFile {

  constructor() {
    
    /** @type {number} */
    this.head_ = 0;
    /** @type {!Object} */
    this.uInt32_ = {bits: 32, be: false};
    /** @type {!Object} */
    this.uInt16_ = {bits: 16, be: false};
    /**
     * The container identifier.
     * 'RIFF', 'RIFX' and 'RF64' are supported.
     * @type {string}
     */
    this.container = '';
    /**
     * @type {number}
     */
    this.chunkSize = 0;
    /**
     * The format.
     * Always 'WAVE'.
     * @type {string}
     */
    this.format = '';
    /**
     * A object defining the start and end of all chunks in a wav buffer.
     * @type {!Object}
     */
    this.signature = {};
  }

  /**
   * Load a RIFF file.
   * @param {!Uint8Array} buffer The file bytes.
   */
  loadRIFF(buffer) {
    this.head_ = 0;
    this.readRIFFChunk_(buffer);
    this.getSignature_(buffer);
  }

  /**
   * Return the chunks in a RIFF/RIFX file.
   * @param {!Uint8Array} buffer The file bytes.
   */
  getSignature_(buffer) {
      this.head_ = 0;
      /** @type {string} */
      let chunkId = this.getChunkId_(buffer, 0);
      this.uInt32_.be = chunkId == 'RIFX';
      /** @type {string} */
      let format = unpackString(buffer, 8, 12);
      this.head_ += 4;
      this.signature = {
          chunkId: chunkId,
          chunkSize: this.getChunkSize_(buffer, 0),
          format: format,
          subChunks: this.getSubChunksIndex_(buffer)
      };
  }

  /**
    * Find a chunk by its fourCC_ in a array of RIFF chunks.
    * @param {string} chunkId The chunk fourCC_.
    * @param {boolean} multiple True if there may be multiple chunks
    *    with the same chunkId.
    * @return {Object}
    */
  findChunk_(chunkId, multiple=false) {
    /** @type {!Array<!Object>} */
    let chunks = this.signature.subChunks;
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
   * Return the sub chunks of a RIFF file.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @return {!Array<Object>} The subchunks of a RIFF/RIFX or LIST chunk.
   * @private
   */
  getSubChunksIndex_(buffer) {
      /** @type {!Array<!Object>} */
      let chunks = [];
      /** @type {number} */
      let i = this.head_;
      while(i <= buffer.length - 8) {
          chunks.push(this.getSubChunkIndex_(buffer, i));
          i += 8 + chunks[chunks.length - 1].chunkSize;
          i = i % 2 ? i + 1 : i;
      }
      return chunks;
  }

  /**
   * Return a sub chunk from a RIFF file.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @param {number} index The start index of the chunk.
   * @return {!Object} A subchunk of a RIFF/RIFX or LIST chunk.
   * @private
   */
  getSubChunkIndex_(buffer, index) {
      /** @type {!Object} */
      let chunk = {
          chunkId: this.getChunkId_(buffer, index),
          chunkSize: this.getChunkSize_(buffer, index),
      };
      if (chunk.chunkId == 'LIST') {
          chunk.format = unpackString(buffer, index + 8, index + 12);
          this.head_ += 4;
          chunk.subChunks = this.getSubChunksIndex_(buffer);
      } else {
          /** @type {number} */
          let realChunkSize = chunk.chunkSize % 2 ?
              chunk.chunkSize + 1 : chunk.chunkSize;
          this.head_ = index + 8 + realChunkSize;
          chunk.chunkData = {
              start: index + 8,
              end: this.head_
          };
      }
      return chunk;
  }

  /**
   * Return the fourCC_ of a chunk.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @param {number} index The start index of the chunk.
   * @return {string} The id of the chunk.
   * @private
   */
  getChunkId_(buffer, index) {
      this.head_ += 4;
      return unpackString(buffer, index, index + 4);
  }

  /**
   * Return the size of a chunk.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @param {number} index The start index of the chunk.
   * @return {number} The size of the chunk without the id and size fields.
   * @private
   */
  getChunkSize_(buffer, index) {
      this.head_ += 4;
      return unpack(buffer, this.uInt32_, index + 4);
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
    this.uInt16_.be = this.container === 'RIFX';
    this.uInt32_.be = this.uInt16_.be;
    this.chunkSize = this.read_(bytes, this.uInt32_);
    this.format = this.readString_(bytes, 4);
    if (this.format != 'WAVE') {
      throw Error('Could not find the "WAVE" format identifier');
    }
  }

  /**
   * Read bytes as a ZSTR string.
   * @param {!Uint8Array} bytes The bytes.
   * @param {number} index the index to start reading.
   * @return {string} The string.
   * @private
   */
  readZSTR_(bytes, index=0) {
    for (let i = index; i < bytes.length; i++) {
      this.head_++;
      if (bytes[i] === 0) {
        break;
      }
    }
    return unpackString(bytes, index, this.head_ - 1);
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
    str = unpackString(bytes, this.head_, this.head_ + maxSize);
    this.head_ += maxSize;
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
    let value = unpack(bytes, bdType, this.head_);
    this.head_ += size;
    return value;
  }
}
