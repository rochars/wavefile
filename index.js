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
 * @fileoverview The WaveFile class.
 * @see https://github.com/rochars/wavefile
 */

/** @module wavefile */

import {encode, decode} from 'base64-arraybuffer-es6';
import WaveFileConverter from './lib/wavefile-converter';

/**
 * A class to manipulate wav files.
 * @extends WaveFileConverter
 */
export default class WaveFile extends WaveFileConverter {

  /**
   * @param {?Uint8Array=} wavBuffer A wave file buffer.
   * @throws {Error} If container is not RIFF, RIFX or RF64.
   * @throws {Error} If format is not WAVE.
   * @throws {Error} If no 'fmt ' chunk is found.
   * @throws {Error} If no 'data' chunk is found.
   */
  constructor(wavBuffer=null) {
    super();
    if (wavBuffer) {
      this.fromBuffer(wavBuffer);
    }
  }

  /**
   * Use a .wav file encoded as a base64 string to load the WaveFile object.
   * @param {string} base64String A .wav file as a base64 string.
   * @throws {Error} If any property of the object appears invalid.
   */
  fromBase64(base64String) {
    this.fromBuffer(new Uint8Array(decode(base64String)));
  }

  /**
   * Return a base64 string representig the WaveFile object as a .wav file.
   * @return {string} A .wav file as a base64 string.
   * @throws {Error} If any property of the object appears invalid.
   */
  toBase64() {
    /** @type {!Uint8Array} */
    let buffer = this.toBuffer();
    return encode(buffer, 0, buffer.length);
  }

  /**
   * Return a DataURI string representig the WaveFile object as a .wav file.
   * The return of this method can be used to load the audio in browsers.
   * @return {string} A .wav file as a DataURI.
   * @throws {Error} If any property of the object appears invalid.
   */
  toDataURI() {
    return 'data:audio/wav;base64,' + this.toBase64();
  }

  /**
   * Use a .wav file encoded as a DataURI to load the WaveFile object.
   * @param {string} dataURI A .wav file as DataURI.
   * @throws {Error} If any property of the object appears invalid.
   */
  fromDataURI(dataURI) {
    this.fromBase64(dataURI.replace('data:audio/wav;base64,', ''));
  }
}
