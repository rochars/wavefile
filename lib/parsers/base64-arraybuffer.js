/*
 * Copyright (c) 2019 Rafael da Silva Rocha.
 * Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen
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

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Encode a byte buffer as a base64 string.
 * @param {!Uint8Array} bytes The buffer.
 * @return {string} A .wav file as a DataURI.
 */
export function encode(bytes) {
  /** @type {string} */
  let base64 = '';
  for (let i = 0; i < bytes.length; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
    base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
    base64 += chars[bytes[i + 2] & 63];
  }
  if (bytes.length % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + '=';
  } else if (bytes.length % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + '==';
  }
  return base64;
}

/**
 * Decode a base64 string as a byte as buffer.
 * @param {string} base64 A .wav file as a DataURI.
 * @return {!Uint8Array} A .wav file as a DataURI.
 */
export function decode(base64) {
  /** @type {!Uint8Array} */
  let lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  /** @type {number} */
  let bufferLength = base64.length * 0.75;
  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }
  /** @type {!Uint8Array} */
  let bytes = new Uint8Array(bufferLength);
  for (let i = 0, j = 0; i < base64.length; i += 4) {
    /** @type {number} */
    let encoded1 = lookup[base64.charCodeAt(i)];
    /** @type {number} */
    let encoded2 = lookup[base64.charCodeAt(i + 1)];
    /** @type {number} */
    let encoded3 = lookup[base64.charCodeAt(i + 2)];
    /** @type {number} */
    let encoded4 = lookup[base64.charCodeAt(i + 3)];
    bytes[j++] = encoded1 << 2 | encoded2 >> 4;
    bytes[j++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[j++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return bytes;
}
