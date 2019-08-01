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
 * @fileoverview The writeString function.
 * @see https://github.com/rochars/wavefile
 */

import {packString} from 'byte-data';

/**
 * Pack a string an array of bytes. If the string is smaller than the max size
 * and the string is of fixed size, the output array is filled with 0s.
 * @param {string} str The string to be written as bytes.
 * @param {number} maxSize the max size of the string.
 * @param {boolean} fixedSize If the string is of fixed size or not.
 * @return {!Array<number>} The packed string.
 */
export default function writeString(str, maxSize, fixedSize=true) {
  /** @type {!Array<number>} */   
  let packedString = packString(str);
  if (fixedSize) {
    for (let i=packedString.length; i<maxSize; i++) {
      packedString.push(0);
    }  
  }
  return packedString;
}
