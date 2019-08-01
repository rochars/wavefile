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
 * @fileoverview The dwChannelMask function.
 * @see https://github.com/rochars/wavefile
 */

/**
 * Return the value for dwChannelMask according to the number of channels.
 * @param {number} numChannels the number of channels.
 * @return {number} the dwChannelMask value.
 */
export default function dwChannelMask(numChannels) {
  /** @type {number} */
  let mask = 0;
  // mono = FC
  if (numChannels === 1) {
    mask = 0x4;
  // stereo = FL, FR
  } else if (numChannels === 2) {
    mask = 0x3;
  // quad = FL, FR, BL, BR
  } else if (numChannels === 4) {
    mask = 0x33;
  // 5.1 = FL, FR, FC, LF, BL, BR
  } else if (numChannels === 6) {
    mask = 0x3F;
  // 7.1 = FL, FR, FC, LF, BL, BR, SL, SR
  } else if (numChannels === 8) {
    mask = 0x63F;
  }
  return mask;
}
