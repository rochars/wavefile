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
 * @fileoverview Read and write to buffers.
 * @see https://github.com/rochars/wavefile
 */

import {unpack, unpackString, packString} from 'byte-data';

/**
 * A class to read and write to buffers.
 */
export default class BufferIO {
	
  constructor() {
  	/**
     * @type {number}
     * @private
     */
    this.head_ = 0;
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
   * Read bytes as a ZSTR string.
   * @param {!Uint8Array} bytes The bytes.
   * @return {string} The string.
   * @private
   */
  readZSTR_(bytes, index=0) {
    /** @type {string} */
    let str = '';
    for (let i = index; i < bytes.length; i++) {
      this.head_++;
      if (bytes[i] === 0) {
        break;
      }
      str += unpackString(bytes, i, i + 1);
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