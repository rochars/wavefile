/*
 * Copyright (c) 2019 Rafael da Silva Rocha.
 * Copyright (c) 2014 Florian Markert
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
 * @fileoverview FIR LPF. Based on the FIR LPF from Fili by Florian Markert.
 * @see https://github.com/rochars/wavefile
 * @see https://github.com/markert/fili.js
 */

/**
 * A FIR low pass filter.
 */
export class FIRLPF {
  
  /**
   * @param {number} order The order of the filter.
   * @param {number} sampleRate The sample rate.
   * @param {number} cutOff The cut off frequency.
   */
  constructor(order, sampleRate, cutOff) {
    /** @type {number} */
    let omega = 2 * Math.PI * cutOff / sampleRate;
    /** @type {number} */
    let dc = 0;
    this.filters = [];
    for (let i = 0; i <= order; i++) {
      if (i - order / 2 === 0) {
        this.filters[i] = omega;
      } else {
        this.filters[i] = Math.sin(omega * (i - order / 2)) / (i - order / 2);
        // Hamming window
        this.filters[i] *= (0.54 - 0.46 * Math.cos(2 * Math.PI * i / order));
      }
      dc = dc + this.filters[i];
    }
    // normalize
    for (let i = 0; i <= order; i++) {
      this.filters[i] /= dc;
    }
    this.z = this.initZ_();
  }

  /**
   * @param {number} sample A sample of a sequence.
   * @return {number}
   */
  filter(sample) {
    this.z.buf[this.z.pointer] = sample;
    /** @type {number} */
    let out = 0;
    for (let i = 0, len = this.z.buf.length; i < len; i++) {
      out += (
        this.filters[i] * this.z.buf[(this.z.pointer + i) % this.z.buf.length]);
    }
    this.z.pointer = (this.z.pointer + 1) % (this.z.buf.length);
    return out;
  }

  /**
   * Reset the filter.
   */
  reset() {
    this.z = this.initZ_();
  }

  /**
   * Return the default value for z.
   * @private
   */
  initZ_() {
    /** @type {!Array} */
    let r = [];
    for (let i = 0; i < this.filters.length - 1; i++) {
      r.push(0);
    }
    return {
      buf: r,
      pointer: 0
    };
  }
}
