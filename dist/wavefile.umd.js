(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.WaveFile = factory());
}(this, (function () { 'use strict';

  /*
   * bitdepth: Change the resolution of samples to and from any bit depth.
   * https://github.com/rochars/bitdepth
   *
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
   * @fileoverview The bitdepth() function and private helper functions.
   */

  /** @module bitdepth */

  /** @private */
  const f64f32_ = new Float32Array(1);

  /**
   * Change the bit depth of samples. The input array is modified in-place.
   * @param {!Array<number>} samples The samples.
   * @param {string} original The original bit depth of the data.
   *      One of "8" ... "53", "32f", "64"
   * @param {string} target The desired bit depth for the data.
   *      One of "8" ... "53", "32f", "64"
   * @param {Array<number>=} outputArray An optional array to write
          converted samples to. Useful for writing to typed arrays.
   */
  function bitdepth(samples, original, target, outputArray) {
    validateBitDepth_(original);
    validateBitDepth_(target);
    outputArray = outputArray || samples;
    /** @type {!Function} */
    let toFunction = getBitDepthFunction_(original, target);
    /** @type {!Object<string, number>} */
    let options = {
      oldMin: Math.pow(2, parseInt(original, 10)) / 2,
      newMin: Math.pow(2, parseInt(target, 10)) / 2,
      oldMax: (Math.pow(2, parseInt(original, 10)) / 2) - 1,
      newMax: (Math.pow(2, parseInt(target, 10)) / 2) - 1,
    };
    /** @type {number} */
    const len = samples.length;
    // sign the samples if original is 8-bit
    if (original == "8") {
      for (let i=0; i<len; i++) {
        outputArray[i] = samples[i] -= 128;
      }
    }
    // change the resolution of the samples
    for (let i=0; i<len; i++) {        
      outputArray[i] = toFunction(samples[i], options);
    }
    // unsign the samples if target is 8-bit
    if (target == "8") {
      for (let i=0; i<len; i++) {
        outputArray[i] = outputArray[i] += 128;
      }
    }
  }

  /**
   * Change the bit depth from int to int.
   * @param {number} sample The sample.
   * @param {!Object<string, number>} args Data about the original and target bit depths.
   * @return {number}
   * @private
   */
  function intToInt_(sample, args) {
    if (sample > 0) {
      sample = parseInt((sample / args.oldMax) * args.newMax, 10);
    } else {
      sample = parseInt((sample / args.oldMin) * args.newMin, 10);
    }
    return sample;
  }

  /**
   * Change the bit depth from float to int.
   * @param {number} sample The sample.
   * @param {!Object<string, number>} args Data about the original and target bit depths.
   * @return {number}
   * @private
   */
  function floatToInt_(sample, args) {
    return parseInt(
      sample > 0 ? sample * args.newMax : sample * args.newMin, 10);
  }

  /**
   * Change the bit depth from int to float.
   * @param {number} sample The sample.
   * @param {!Object<string, number>} args Data about the original and target bit depths.
   * @return {number}
   * @private
   */
  function intToFloat_(sample, args) {
    return sample > 0 ? sample / args.oldMax : sample / args.oldMin;
  }

  /**
   * Change the bit depth from float to float.
   * @param {number} sample The sample.
   * @return {number}
   * @private
   */
  function floatToFloat_(sample) {
    f64f32_[0] = sample;
    return f64f32_[0];
  }

  /**
   * Return the function to change the bit depth of a sample.
   * @param {string} original The original bit depth of the data.
   *      One of "8" ... "53", "32f", "64"
   * @param {string} target The new bit depth of the data.
   *      One of "8" ... "53", "32f", "64"
   * @return {!Function}
   * @private
   */
  function getBitDepthFunction_(original, target) {
    /** @type {!Function} */
    let func = function(x) {return x;};
    if (original != target) {
      if (["32f", "64"].includes(original)) {
        if (["32f", "64"].includes(target)) {
          func = floatToFloat_;
        } else {
          func = floatToInt_;
        }
      } else {
        if (["32f", "64"].includes(target)) {
          func = intToFloat_;
        } else {
          func = intToInt_;
        }
      }
    }
    return func;
  }

  /**
   * Validate the bit depth.
   * @param {string} bitDepth The original bit depth.
   *     Should be one of "8" ... "53", "32f" or "64".
   * @throws {Error} If any argument does not meet the criteria.
   * @private
   */
  function validateBitDepth_(bitDepth) {
    if ((bitDepth != "32f" && bitDepth != "64") &&
        (parseInt(bitDepth, 10) < "8" || parseInt(bitDepth, 10) > "53")) {
      throw new Error("Invalid bit depth.");
    }
  }

  /*
   * byte-data: Pack and unpack binary data.
   * https://github.com/rochars/byte-data
   *
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
   * @fileoverview Pack and unpack two's complement ints and unsigned ints.
   */

  /**
   * A class to pack and unpack two's complement ints and unsigned ints.
   */
  class Integer {

    /**
     * @param {number} bits Number of bits used by the data.
     * @param {boolean} signed True for signed types.
     * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
     */
    constructor(bits, signed) {
      /**
       * The max number of bits used by the data.
       * @type {number}
       */
      this.bits = bits;
      /**
       * If this type it is signed or not.
       * @type {boolean}
       */
      this.signed = signed;
      /**
       * The number of bytes used by the data.
       * @type {number}
       */
      this.offset = 0;
      /**
       * Min value for numbers of this type.
       * @type {number}
       */
      this.min = -Infinity;
      /**
       * Max value for numbers of this type.
       * @type {number}
       */
      this.max = Infinity;
      /**
       * The practical number of bits used by the data.
       * @type {number}
       * @private
       */
      this.realBits_ = this.bits;
      /**
       * The mask to be used in the last byte.
       * @type {number}
       * @private
       */
      this.lastByteMask_ = 255;
      this.build_();
    }

    /**
     * Read one integer number from a byte buffer.
     * @param {!Uint8Array} bytes An array of bytes.
     * @param {number=} i The index to read.
     * @return {number}
     */
    read(bytes, i=0) {
      let num = 0;
      let x = this.offset - 1;
      while (x > 0) {
        num = (bytes[x + i] << x * 8) | num;
        x--;
      }
      num = (bytes[i] | num) >>> 0;
      return this.overflow_(this.sign_(num));
    }

    /**
     * Write one integer number to a byte buffer.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number.
     * @param {number=} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     */
    write(bytes, number, j=0) {
      number = this.overflow_(number);
      bytes[j++] = number & 255;
      for (let i = 2; i <= this.offset; i++) {
        bytes[j++] = Math.floor(number / Math.pow(2, ((i - 1) * 8))) & 255;
      }
      return j;
    }

    /**
     * Write one integer number to a byte buffer.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number.
     * @param {number=} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     * @private
     */
    writeEsoteric_(bytes, number, j=0) {
      number = this.overflow_(number);
      j = this.writeFirstByte_(bytes, number, j);
      for (let i = 2; i < this.offset; i++) {
        bytes[j++] = Math.floor(number / Math.pow(2, ((i - 1) * 8))) & 255;
      }
      if (this.bits > 8) {
        bytes[j++] = Math.floor(
            number / Math.pow(2, ((this.offset - 1) * 8))) &
          this.lastByteMask_;
      }
      return j;
    }

    /**
     * Read a integer number from a byte buffer by turning int bytes
     * to a string of bits. Used for data with more than 32 bits.
     * @param {!Uint8Array} bytes An array of bytes.
     * @param {number=} i The index to read.
     * @return {number}
     * @private
     */
    readBits_(bytes, i=0) {
      let binary = '';
      let j = 0;
      while(j < this.offset) {
        let bits = bytes[i + j].toString(2);
        binary = new Array(9 - bits.length).join('0') + bits + binary;
        j++;
      }
      return this.overflow_(this.sign_(parseInt(binary, 2)));
    }

    /**
     * Build the type.
     * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
     * @private
     */
    build_() {
      this.setRealBits_();
      this.setLastByteMask_();
      this.setMinMax_();
      this.offset = this.bits < 8 ? 1 : Math.ceil(this.realBits_ / 8);
      if ((this.realBits_ != this.bits) || this.bits < 8 || this.bits > 32) {
        this.write = this.writeEsoteric_;
        this.read = this.readBits_;
      }
    }

    /**
     * Sign a number.
     * @param {number} num The number.
     * @return {number}
     * @private
     */
    sign_(num) {
      if (num > this.max) {
        num -= (this.max * 2) + 2;
      }
      return num;
    }

    /**
     * Limit the value according to the bit depth in case of
     * overflow or underflow.
     * @param {number} value The data.
     * @return {number}
     * @private
     */
    overflow_(value) {
      if (value > this.max) {
        throw new Error('Overflow.');
      } else if (value < this.min) {
        throw new Error('Underflow.');
      }
      return value;
    }

    /**
     * Set the minimum and maximum values for the type.
     * @private
     */
    setMinMax_() {
      let max = Math.pow(2, this.bits);
      if (this.signed) {
        this.max = max / 2 -1;
        this.min = -max / 2;
      } else {
        this.max = max - 1;
        this.min = 0;
      }
    }

    /**
     * Set the practical bit number for data with bit count different
     * from the standard types (8, 16, 32, 40, 48, 64) and more than 8 bits.
     * @private
     */
    setRealBits_() {
      if (this.bits > 8) {
        this.realBits_ = ((this.bits - 1) | 7) + 1;
      }
    }

    /**
     * Set the mask that should be used when writing the last byte.
     * @private
     */
    setLastByteMask_() {
      let r = 8 - (this.realBits_ - this.bits);
      this.lastByteMask_ = Math.pow(2, r > 0 ? r : 8) -1;
    }

    /**
     * Write the first byte of a integer number.
     * @param {!Array<number>} bytes An array of bytes.
     * @param {number} number The number.
     * @param {number} j The index being written in the byte buffer.
     * @return {number} The next index to write on the byte buffer.
     * @private
     */
    writeFirstByte_(bytes, number, j) {
      if (this.bits < 8) {
        bytes[j++] = number < 0 ? number + Math.pow(2, this.bits) : number;
      } else {
        bytes[j++] = number & 255;
      }
      return j;
    }
  }

  /*
   * endianness: Swap endianness in byte arrays.
   * https://github.com/rochars/endianness
   *
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
   * @fileoverview A function to swap endianness in byte buffers.
   */

  /**
   * @module endianness
   */

  /**
   * Swap the byte ordering in a buffer. The buffer is modified in place.
   * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
   * @param {number} offset The byte offset.
   * @param {number=} start The start index. Assumes 0.
   * @param {?number=} end The end index. Assumes the buffer length.
   * @throws {Error} If the buffer length is not valid.
   */
  function endianness(bytes, offset, start=0, end=null) {
      let len = end || bytes.length;
      let limit = parseInt(offset / 2, 10);
      if (len % offset) {
          throw new Error("Bad buffer length.");
      }
      let i = start;
      while (i < len) {
          swap(bytes, offset, i, limit);
          i += offset;
      }
  }

  /**
   * Swap the byte order of a value in a buffer. The buffer is modified in place.
   * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
   * @param {number} offset The byte offset.
   * @param {number} index The start index.
   * @private
   */
  function swap(bytes, offset, index, limit) {
      let x = 0;
      let y = offset - 1;
      while(x < limit) {
          let theByte = bytes[index + x];
          bytes[index + x] = bytes[index + y];
          bytes[index + y] = theByte;
          x++;
          y--;
      }
  }

  /*
   * byte-data: Pack and unpack binary data.
   * https://github.com/rochars/byte-data
   *
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
   * @fileoverview Functions to validate input.
   */

  /**
   * Validate that the value is not null or undefined.
   * @param {number} value The value.
   */
  function validateNotUndefined(value) {
    if (value === undefined) {
      throw new Error('Undefined value.');
    }
  }

  /**
   * Validate the type definition.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   */
  function validateType(theType) {
    if (!theType) {
      throw new Error('Undefined type.');
    }
    if (theType.float) {
      validateFloatType_(theType);
    } else {
      validateIntType_(theType);
    }
  }

  /**
   * Validate the type definition of floating point numbers.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   * @private
   */
  function validateFloatType_(theType) {
    if ([16,32,64].indexOf(theType.bits) == -1) {
      throw new Error('Bad float type.');
    }
  }

  /**
   * Validate the type definition of integers.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   * @private
   */
  function validateIntType_(theType) {
    if (theType.bits < 1 || theType.bits > 53) {
      throw new Error('Bad type definition.');
    }
  }

  /*
   * byte-data: Pack and unpack binary data.
   * https://github.com/rochars/byte-data
   *
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

  // Strings
  /**
   * Read a string from a byte buffer.
   * @param {!Uint8Array} bytes A byte buffer.
   * @param {number=} index The index to read.
   * @param {?number=} len The number of bytes to read.
   * @return {string}
   */
  function unpackString(bytes, index=0, len=null) {
    let chrs = '';
    len = len || bytes.length - index;
    for(let j = 0; j < len; j++) {
      chrs += String.fromCharCode(bytes[index+j]);
    }
    return chrs;
  }

  /**
   * Write a string as a byte buffer.
   * @param {string} str The string to pack.
   * @return {!Array<number>} The next index to write on the buffer.
   */
  function packString(str) {
    let bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Write a string to a byte buffer.
   * @param {string} str The string to pack.
   * @param {!Uint8Array} bytes A byte buffer.
   * @param {number=} index The index to write in the buffer.
   * @return {number} The next index to write in the buffer.
   */
  function packStringTo(str, bytes, index=0) {
    for (let i = 0; i < str.length; i++) {
      bytes[index] = str.charCodeAt(i);
      index++;
    }
    return index;
  }

  // Numbers
  /**
   * Pack a number as a byte buffer.
   * @param {number} value The number.
   * @param {!Object} theType The type definition.
   * @return {!Array<number>} The packed value.
   * @throws {Error} If the type definition is not valid.
   * @throws {Error} If the value is not valid.
   */
  function pack(value, theType) {
    setUp_(theType);
    return toBytes_([value], theType);
  }

  /**
   * Pack an array of numbers as a byte buffer.
   * @param {!Array<number>} values The values.
   * @param {!Object} theType The type definition.
   * @return {!Array<number>} The packed values.
   * @throws {Error} If the type definition is not valid.
   * @throws {Error} If any of the values are not valid.
   */
  function packArray(values, theType) {
    setUp_(theType);
    return toBytes_(values, theType);
  }

  /**
   * Pack a number to a byte buffer.
   * @param {number} value The value.
   * @param {!Object} theType The type definition.
   * @param {!Uint8Array} buffer The output buffer.
   * @param {number=} index The index to write.
   * @return {number} The next index to write.
   * @throws {Error} If the type definition is not valid.
   * @throws {Error} If the value is not valid.
   */
  function packTo(value, theType, buffer, index=0) {
    setUp_(theType);
    return writeBytes_(value,
      theType,
      buffer,
      index,
      index + theType.offset,
      validateNotUndefined,
      theType.be);
  }

  /**
   * Pack a array of numbers to a byte buffer.
   * @param {!Array<number>} values The value.
   * @param {!Object} theType The type definition.
   * @param {!Uint8Array} buffer The output buffer.
   * @param {number=} index The buffer index to write.
   * @return {number} The next index to write.
   * @throws {Error} If the type definition is not valid.
   * @throws {Error} If the value is not valid.
   */
  function packArrayTo(values, theType, buffer, index=0) {
    setUp_(theType);
    let be = theType.be;
    let offset = theType.offset;
    for (let i=0; i<values.length; i++) {
      index = writeBytes_(
        values[i],
        theType,
        buffer,
        index,
        index + offset,
        validateNotUndefined,
        be);
    }
    return index;
  }

  /**
   * Unpack an array of numbers from a byte buffer.
   * @param {!Uint8Array} buffer The byte buffer.
   * @param {!Object} theType The type definition.
   * @return {!Array<number>}
   * @throws {Error} If the type definition is not valid.
   */
  function unpackArray(buffer, theType) {
    setUp_(theType);
    return fromBytes_(buffer, theType);
  }

  /**
   * Unpack a number from a byte buffer by index.
   * @param {!Uint8Array} buffer The byte buffer.
   * @param {!Object} theType The type definition.
   * @param {number=} index The buffer index to read.
   * @return {number}
   * @throws {Error} If the type definition is not valid
   */
  function unpackFrom(buffer, theType, index=0) {
    setUp_(theType);
    if (theType.be) {
      endianness(buffer, theType.offset, index, index + theType.offset);
    }
    let value = reader_(buffer, index);
    if (theType.be) {
      endianness(buffer, theType.offset, index, index + theType.offset);
    }
    return value;
  }

  /**
   * @type {!Int8Array}
   * @private
   */
  const int8_ = new Int8Array(8);
  /**
   * @type {!Uint32Array}
   * @private
   */
  const ui32_ = new Uint32Array(int8_.buffer);
  /**
   * @type {!Float32Array}
   * @private
   */
  const f32_ = new Float32Array(int8_.buffer);
  /**
   * @type {!Float64Array}
   * @private
   */
  const f64_ = new Float64Array(int8_.buffer);
  /**
   * @type {Function}
   * @private
   */
  let reader_;
  /**
   * @type {Function}
   * @private
   */
  let writer_;
  /**
   * @type {Object}
   * @private
   */
  let gInt_ = {};

  /**
   * Turn numbers to bytes.
   * @param {number} value The value to be packed.
   * @param {!Object} theType The type definition.
   * @param {!Uint8Array} buffer The buffer to write the bytes to.
   * @param {number} index The index to start writing.
   * @param {number} len The end index.
   * @param {!Function} validate The function used to validate input.
   * @param {boolean} be True if big-endian.
   * @return {number} the new index to be written.
   * @private
   */
  function writeBytes_(value, theType, buffer, index, len, validate, be) {
    while (index < len) {
      validate(value, theType);
      index = writer_(buffer, value, index);
    }
    if (be) {
      endianness(
        buffer, theType.offset, index - theType.offset, index);
    }
    return index;
  }

  /**
   * Turn a byte buffer into what the bytes represent.
   * @param {!Uint8Array} buffer An array of bytes.
   * @param {!Object} theType The type definition.
   * @return {!Array<number>}
   * @private
   */
  function fromBytes_(buffer, theType) {
    if (theType.be) {
      endianness(buffer, theType.offset);
    }
    let len = buffer.length;
    let values = [];
    len = len - (theType.offset - 1);
    for (let i=0; i<len; i+=theType.offset) {
      values.push(reader_(buffer, i));
    }
    return values;
  }

  /**
   * Turn numbers to bytes.
   * @param {!Array<number>} values The data.
   * @param {!Object} theType The type definition.
   * @return {!Array<number>} the data as a byte buffer.
   * @private
   */
  function toBytes_(values, theType) {
    let j = 0;
    let bytes = [];
    let len = values.length;
    for(let i=0; i < len; i++) {
      validateNotUndefined(values[i]);
      j = writer_(bytes, values[i], j);
    }
    if (theType.be) {
      endianness(bytes, theType.offset);
    }
    return bytes;
  }

  /**
   * Read int values from bytes.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function readInt_(bytes, i) {
    return gInt_.read(bytes, i);
  }

  /**
   * Read 1 16-bit float from bytes.
   * Thanks https://stackoverflow.com/a/8796597
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function read16F_(bytes, i) {
    let int = gInt_.read(bytes, i);
    let exponent = (int & 0x7C00) >> 10;
    let fraction = int & 0x03FF;
    let floatValue;
    if (exponent) {
      floatValue =  Math.pow(2, exponent - 15) * (1 + fraction / 0x400);
    } else {
      floatValue = 6.103515625e-5 * (fraction / 0x400);
    }
    return floatValue * (int >> 15 ? -1 : 1);
  }

  /**
   * Read 1 32-bit float from bytes.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function read32F_(bytes, i) {
    ui32_[0] = gInt_.read(bytes, i);
    return f32_[0];
  }

  /**
   * Read 1 64-bit float from bytes.
   * Thanks https://gist.github.com/kg/2192799
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} i The index to read.
   * @return {number}
   * @private
   */
  function read64F_(bytes, i) {
    ui32_[0] = gInt_.read(bytes, i);
    ui32_[1] = gInt_.read(bytes, i + 4);
    return f64_[0];
  }

  /**
   * Write a integer value to a byte buffer.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {!number} The next index to write on the byte buffer.
   * @private
   */
  function writeInt_(bytes, number, j) {
    return gInt_.write(bytes, number, j);
  }

  /**
   * Write one 16-bit float as a binary value.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  function write16F_(bytes, number, j) {
    f32_[0] = number;
    let x = ui32_[0];
    let bits = (x >> 16) & 0x8000;
    let m = (x >> 12) & 0x07ff;
    let e = (x >> 23) & 0xff;
    if (e >= 103) {
      bits |= ((e - 112) << 10) | (m >> 1);
      bits += m & 1;
    }
    bytes[j++] = bits & 0xFF;
    bytes[j++] = bits >>> 8 & 0xFF;
    return j;
  }

  /**
   * Write one 32-bit float as a binary value.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  function write32F_(bytes, number, j) {
    f32_[0] = number;
    return gInt_.write(bytes, ui32_[0], j);
  }

  /**
   * Write one 64-bit float as a binary value.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number} number The number to write as bytes.
   * @param {number} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  function write64F_(bytes, number, j) {
    f64_[0] = number;
    j = gInt_.write(bytes, ui32_[0], j);
    return gInt_.write(bytes, ui32_[1], j);
  }

  /**
   * Set the function to unpack the data.
   * @param {!Object} theType The type definition.
   * @private
   */
  function setReader(theType) {
    if (theType.float) {
      if (theType.bits == 16) {
        reader_ = read16F_;
      } else if(theType.bits == 32) {
        reader_ = read32F_;
      } else if(theType.bits == 64) {
        reader_ = read64F_;
      }
    } else {
      reader_ = readInt_;
    }
  }

  /**
   * Set the function to pack the data.
   * @param {!Object} theType The type definition.
   * @private
   */
  function setWriter(theType) {
    if (theType.float) {
      if (theType.bits == 16) {
        writer_ = write16F_;
      } else if(theType.bits == 32) {
        writer_ = write32F_;
      } else if(theType.bits == 64) {
        writer_ = write64F_;
      }
    } else {
      writer_ = writeInt_;
    }   
  }

  /**
   * Validate the type and set up the packing/unpacking functions.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   * @private
   */
  function setUp_(theType) {
    validateType(theType);
    theType.offset = theType.bits < 8 ? 1 : Math.ceil(theType.bits / 8);
    setReader(theType);
    setWriter(theType);
    gInt_ = new Integer(
      theType.bits == 64 ? 32 : theType.bits,
      theType.float ? false : theType.signed);
  }

  /*
   * riff-chunks: Read and write the chunks of RIFF and RIFX files.
   * https://github.com/rochars/riff-chunks
   *
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

  /** @private */
  const uInt32_ = {bits: 32};
  /** @type {number} */
  let head_ = 0;

  /**
   * Return the chunks in a RIFF/RIFX file.
   * @param {!Uint8Array} buffer The file bytes.
   * @return {!Object} The RIFF chunks.
   */
  function riffChunks(buffer) {
      head_ = 0;
      let chunkId = getChunkId_(buffer, 0);
      uInt32_.be = chunkId == 'RIFX';
      let format = unpackString(buffer, 8, 4);
      head_ += 4;
      return {
          chunkId: chunkId,
          chunkSize: getChunkSize_(buffer, 0),
          format: format,
          subChunks: getSubChunksIndex_(buffer)
      };
  }

  /**
   * Return the sub chunks of a RIFF file.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @return {!Array<Object>} The subchunks of a RIFF/RIFX or LIST chunk.
   * @private
   */
  function getSubChunksIndex_(buffer) {
      let chunks = [];
      let i = head_;
      while(i <= buffer.length - 8) {
          chunks.push(getSubChunkIndex_(buffer, i));
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
  function getSubChunkIndex_(buffer, index) {
      let chunk = {
          chunkId: getChunkId_(buffer, index),
          chunkSize: getChunkSize_(buffer, index),
      };
      if (chunk.chunkId == 'LIST') {
          chunk.format = unpackString(buffer, index + 8, 4);
          head_ += 4;
          chunk.subChunks = getSubChunksIndex_(buffer);
      } else {
          let realChunkSize = chunk.chunkSize % 2 ?
              chunk.chunkSize + 1 : chunk.chunkSize;
          head_ = index + 8 + realChunkSize;
          chunk.chunkData = {
              start: index + 8,
              end: head_
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
  function getChunkId_(buffer, index) {
      head_ += 4;
      return unpackString(buffer, index, 4);
  }

  /**
   * Return the size of a chunk.
   * @param {!Uint8Array} buffer the RIFF file bytes.
   * @param {number} index The start index of the chunk.
   * @return {number} The size of the chunk without the id and size fields.
   * @private
   */
  function getChunkSize_(buffer, index) {
      head_ += 4;
      return unpackFrom(buffer, uInt32_, index + 4);
  }

  /*
   * imaadpcm: IMA ADPCM codec in JavaScript.
   * https://github.com/rochars/imaadpcm
   *
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
   * @fileoverview imaadpcm public API and private methods.
   */

  /** @module imaadpcm */

  /**
   * @type {!Array<number>}
   * @private
   */
  const INDEX_TABLE = [
      -1, -1, -1, -1, 2, 4, 6, 8,
      -1, -1, -1, -1, 2, 4, 6, 8];
  /**
   * @type {!Array<number>}
   * @private
   */
  const STEP_TABLE = [
      7, 8, 9, 10, 11, 12, 13, 14,
      16, 17, 19, 21, 23, 25, 28, 31,
      34, 37, 41, 45, 50, 55, 60, 66,
      73, 80, 88, 97, 107, 118, 130, 143,
      157, 173, 190, 209, 230, 253, 279, 307,
      337, 371, 408, 449, 494, 544, 598, 658,
      724, 796, 876, 963, 1060, 1166, 1282, 1411,
      1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024,
      3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484,
      7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
      15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794,
      32767];
  /**
   * @type {number}
   * @private
   */
  let encoderPredicted_ = 0;
  /**
   * @type {number}
   * @private
   */
  let encoderIndex_ = 0;
  /**
   * @type {number}
   * @private
   */
  let decoderPredicted_ = 0;
  /**
   * @type {number}
   * @private
   */
  let decoderIndex_ = 0;
  /**
   * @type {number}
   * @private
   */
  let decoderStep_ = 7;

  /**
   * Encode 16-bit PCM samples into 4-bit IMA ADPCM samples.
   * @param {!Array<number>} samples A array of samples.
   * @return {!Array<number>}
   */
  function encode(samples) {
      /** @type {!Array<number>} */
      let adpcmSamples = [];
      /** @type {Array<number>} */
      let block = [];
      for (let i=0; i<samples.length; i++) {
          block.push(samples[i]);
          if ((i % 505 == 0 && i != 0) || i == samples.length - 1) {
              adpcmSamples = adpcmSamples.concat(encodeBlock(block));
              block = [];
          }
      }
      return adpcmSamples;
  }

  /**
   * Decode IMA ADPCM samples into 16-bit PCM samples.
   * @param {!Array<number>} adpcmSamples A array of ADPCM samples.
   * @param {number} blockAlign The block size.
   * @return {!Array<number>}
   */
  function decode(adpcmSamples, blockAlign=256) {
      /** @type {!Array<number>} */
      let samples = [];
      /** @type {!Array<number>} */
      let block = [];
      for (let i=0; i<adpcmSamples.length; i++) {
          if (i % blockAlign == 0 && i != 0) {            
              samples = samples.concat(decodeBlock(block));
              block = [];
          }
          block.push(adpcmSamples[i]);
      }
      return samples;
  }

  /**
   * Encode a block of 505 16-bit samples as 4-bit ADPCM samples.
   * @param {!Array<number>} block A sample block of 505 samples.
   * @return {!Array<number>}
   */
  function encodeBlock(block) {
      /** @type {!Array<number>} */
      let adpcmSamples = blockHead_(block[0]);
      for (let i=3; i<block.length; i+=2) {
          /** @type {number} */
          let sample2 = encodeSample_(block[i]);
          /** @type {number} */
          let sample = encodeSample_(block[i + 1]);
          adpcmSamples.push((sample << 4) | sample2);
      }
      while (adpcmSamples.length < 256) {
          adpcmSamples.push(0);
      }
      return adpcmSamples;
  }

  /**
   * Decode a block of ADPCM samples into 16-bit PCM samples.
   * @param {!Array<number>} block A adpcm sample block.
   * @return {!Array<number>}
   */
  function decodeBlock(block) {
      decoderPredicted_ = sign_((block[1] << 8) | block[0]);
      decoderIndex_ = block[2];
      decoderStep_ = STEP_TABLE[decoderIndex_];
      /** @type {!Array<number>} */
      let result = [
              decoderPredicted_,
              sign_((block[3] << 8) | block[2])
          ];
      for (let i=4; i<block.length; i++) {
          /** @type {number} */
          let original_sample = block[i];
          /** @type {number} */
          let second_sample = original_sample >> 4;
          /** @type {number} */
          let first_sample = (second_sample << 4) ^ original_sample;
          result.push(decodeSample_(first_sample));
          result.push(decodeSample_(second_sample));
      }
      return result;
  }

  /**
   * Sign a 16-bit integer.
   * @param {number} num A 16-bit integer.
   * @return {number}
   * @private
   */
  function sign_(num) {
      return num > 32768 ? num - 65536 : num;
  }

  /**
   * Compress a 16-bit PCM sample into a 4-bit ADPCM sample.
   * @param {number} sample The sample.
   * @return {number}
   * @private
   */
  function encodeSample_(sample) {
      /** @type {number} */
      let delta = sample - encoderPredicted_;
      /** @type {number} */
      let value = 0;
      if (delta >= 0) {
          value = 0;
      } else {
          value = 8;
          delta = -delta;
      }
      /** @type {number} */
      let step = STEP_TABLE[encoderIndex_];
      /** @type {number} */
      let diff = step >> 3;
      if (delta > step) {
          value |= 4;
          delta -= step;
          diff += step;
      }
      step >>= 1;
      if (delta > step) {
          value |= 2;
          delta -= step;
          diff += step;
      }
      step >>= 1;
      if (delta > step) {
          value |= 1;
          diff += step;
      }
      updateEncoder_(value, diff);
      return value;
  }

  /**
   * Set the value for encoderPredicted_ and encoderIndex_
   * after each sample is compressed.
   * @param {number} value The compressed ADPCM sample
   * @param {number} diff The calculated difference
   * @private
   */
  function updateEncoder_(value, diff) {
      if (value & 8) {
          encoderPredicted_ -= diff;
      } else {
          encoderPredicted_ += diff;
      }
      if (encoderPredicted_ < -0x8000) {
          encoderPredicted_ = -0x8000;
      } else if (encoderPredicted_ > 0x7fff) {
          encoderPredicted_ = 0x7fff;
      }
      encoderIndex_ += INDEX_TABLE[value & 7];
      if (encoderIndex_ < 0) {
          encoderIndex_ = 0;
      } else if (encoderIndex_ > 88) {
          encoderIndex_ = 88;
      }
  }

  /**
   * Decode a 4-bit ADPCM sample into a 16-bit PCM sample.
   * @param {number} nibble A 4-bit adpcm sample.
   * @return {number}
   * @private
   */
  function decodeSample_(nibble) {
      /** @type {number} */
      let difference = 0;
      if (nibble & 4) {
          difference += decoderStep_;
      }
      if (nibble & 2) {
          difference += decoderStep_ >> 1;
      }
      if (nibble & 1) {
          difference += decoderStep_ >> 2;
      }
      difference += decoderStep_ >> 3;
      if (nibble & 8) {
          difference = -difference;
      }
      decoderPredicted_ += difference;
      if (decoderPredicted_ > 32767) {
          decoderPredicted_ = 32767;
      } else if (decoderPredicted_ < -32767) {
          decoderPredicted_ = -32767;
      }
      updateDecoder_(nibble);
      return decoderPredicted_;
  }

  /**
   * Update the index and step after decoding a sample.
   * @param {number} nibble A 4-bit adpcm sample.
   * @private
   */
  function updateDecoder_(nibble) {
      decoderIndex_ += INDEX_TABLE[nibble];
      if (decoderIndex_ < 0) {
          decoderIndex_ = 0;
      } else if (decoderIndex_ > 88) {
          decoderIndex_ = 88;
      }
      decoderStep_ = STEP_TABLE[decoderIndex_];
  }

  /**
   * Return the head of a ADPCM sample block.
   * @param {number} sample The first sample of the block.
   * @return {!Array<number>}
   * @private
   */
  function blockHead_(sample) {
      encodeSample_(sample);
      /** @type {!Array<number>} */
      let adpcmSamples = [];
      adpcmSamples.push(sample & 0xFF);
      adpcmSamples.push((sample >> 8) & 0xFF);
      adpcmSamples.push(encoderIndex_);
      adpcmSamples.push(0);
      return adpcmSamples;
  }

  /*
   * alawmulaw: A-Law and mu-Law codecs in JavaScript.
   * https://github.com/rochars/alawmulaw
   *
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
   * @fileoverview A-Law codec.
   * References:
   * https://github.com/deftio/companders
   * http://dystopiancode.blogspot.com.br/2012/02/pcm-law-and-u-law-companding-algorithms.html
   */

  /** @module alawmulaw/alaw */

  /** @type {!Array<number>} */
  const LOG_TABLE = [
    1,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5, 
    6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6, 
    7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7, 
    7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7 
  ];

  /**
   * Encode a 16-bit linear PCM sample as 8-bit A-Law.
   * @param {number} sample A 16-bit linear PCM sample
   * @return {number}
   */
  function encodeSample(sample) {
    /** @type {number} */
    let compandedValue; 
    sample = (sample ==-32768) ? -32767 : sample;
    /** @type {number} */
    let sign = ((~sample) >> 8) & 0x80; 
    if (!sign) {
      sample = sample * -1; 
    }
    if (sample > 32635) {
      sample = 32635; 
    }
    if (sample >= 256)  {
      /** @type {number} */
      let exponent = LOG_TABLE[(sample >> 8) & 0x7F];
      /** @type {number} */
      let mantissa = (sample >> (exponent + 3) ) & 0x0F; 
      compandedValue = ((exponent << 4) | mantissa); 
    } else {
      compandedValue = sample >> 4; 
    } 
    return compandedValue ^ (sign ^ 0x55);
  }

  /**
   * Decode a 8-bit A-Law sample as 16-bit linear PCM.
   * @param {number} aLawSample The 8-bit A-Law sample
   * @return {number}
   */
  function decodeSample(aLawSample) {
    /** @type {number} */
    let sign = 0;
    aLawSample ^= 0x55;
    if (aLawSample & 0x80) {
      aLawSample &= ~(1 << 7);
      sign = -1;
    }
    /** @type {number} */
    let position = ((aLawSample & 0xF0) >> 4) + 4;
    /** @type {number} */
    let decoded = 0;
    if (position != 4) {
      decoded = ((1 << position) |
        ((aLawSample & 0x0F) << (position - 4)) |
        (1 << (position - 5)));
    } else {
      decoded = (aLawSample << 1)|1;
    }
    decoded = (sign === 0) ? (decoded) : (-decoded);
    return (decoded * 8) * -1;
  }

  /**
   * Encode 16-bit linear PCM samples into 8-bit A-Law samples.
   * @param {!Array<number>} samples A array of 16-bit PCM samples.
   * @return {!Array<number>}
   */
  function encode$1(samples) {
    /** @type {!Array<number>} */
    let aLawSamples = [];
    for (let i=0; i<samples.length; i++) {
      aLawSamples.push(encodeSample(samples[i]));
    }
    return aLawSamples;
  }

  /**
   * Decode 8-bit A-Law samples into 16-bit linear PCM samples.
   * @param {!Array<number>} samples A array of 8-bit A-Law samples.
   * @return {!Array<number>}
   */
  function decode$1(samples) {
    /** @type {!Array<number>} */
    let pcmSamples = [];
    for (let i=0; i<samples.length; i++) {
      pcmSamples.push(decodeSample(samples[i]));
    }
    return pcmSamples;
  }

  var alaw = /*#__PURE__*/Object.freeze({
    encodeSample: encodeSample,
    decodeSample: decodeSample,
    encode: encode$1,
    decode: decode$1
  });

  /*
   * alawmulaw: A-Law and mu-Law codecs in JavaScript.
   * https://github.com/rochars/alawmulaw
   *
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
   * @fileoverview mu-Law codec.
   * References:
   * https://github.com/torvalds/linux/blob/master/sound/core/oss/mulaw.c
   */

  /** @module alawmulaw/mulaw */

  /**
   * @type {number}
   * @private
   */
  const BIAS = 0x84;

  /**
   * Encode a 16-bit linear PCM sample as 8-bit mu-Law.
   * @param {number} pcmSample A 16-bit sample
   * @return {number}
   */
  function encodeSample$1(pcmSample) {
    /** @type {number} */
    let mask = 0xFF;
    if (pcmSample < 0) {
      pcmSample = BIAS - pcmSample;
      mask = 0x7F;
    } else {
      pcmSample += BIAS;
    }
    if (pcmSample > 0x7FFF) {
      pcmSample = 0x7FFF;
    }
    /** @type {number} */
    let seg = segmentValue_(pcmSample);
    /** @type {number} */
    let uval = (seg << 4) | ((pcmSample >> (seg + 3)) & 0xF);
    return uval ^ mask;
  }

  /**
   * Decode a 8-bit mu-Law sample as 16-bit linear PCM.
   * @param {number} muLawSample The 8-bit mu-Law sample
   * @return {number}
   */
  function decodeSample$1(muLawSample) {
    muLawSample = ~muLawSample;
    /** @type {number} */
    let t = ((muLawSample & 0xf) << 3) + BIAS;
    t <<= (muLawSample & 0x70) >> 4;
    return ((muLawSample & 0x80) ? (BIAS - t) : (t - BIAS));
  }

  /**
   * Encode 16-bit linear PCM samples into 8-bit mu-Law samples.
   * @param {!Array<number>} samples A array of 16-bit linear PCM samples.
   * @return {!Array<number>}
   */
  function encode$2(samples) {
    /** @type {!Array<number>} */
    let muLawSamples = [];
    for (let i=0; i<samples.length; i++) {
      muLawSamples.push(encodeSample$1(samples[i]));
    }
    return muLawSamples;
  }

  /**
   * Decode 8-bit mu-Law samples into 16-bit linear PCM samples.
   * @param {!Array<number>} samples A array of 8-bit mu-Law samples.
   * @return {!Array<number>}
   */
  function decode$2(samples) {
    /** @type {!Array<number>} */
    let pcmSamples = [];
    for (let i=0; i<samples.length; i++) {
      pcmSamples.push(decodeSample$1(samples[i]));
    }
    return pcmSamples;
  }

  /**
   * Return the segment value of a PCM sample.
   * @param {number} sample
   * @return {number}
   * @private
   */
  function segmentValue_(sample) {
    /** @type {number} */
    let segment = 0;
    sample >>= 7;
    if (sample & 0xf0) {
      sample >>= 4;
      segment += 4;
    }
    if (sample & 0x0c) {
      sample >>= 2;
      segment += 2;
    }
    if (sample & 0x02) {
      segment += 1;
    }
    return segment;
  }

  var mulaw = /*#__PURE__*/Object.freeze({
    encodeSample: encodeSample$1,
    decodeSample: decodeSample$1,
    encode: encode$2,
    decode: decode$2
  });

  /*
   * alawmulaw: A-Law and mu-Law codecs in JavaScript.
   * https://github.com/rochars/alawmulaw
   *
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

  var alawmulaw = {
  	/**
  	 * @type {!Object}
  	 * @export
  	 */
  	'alaw': alaw,
  	/**
  	 * @type {!Object}
  	 * @export
  	 */
  	'mulaw': mulaw
  };

  /*
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  // Use a lookup table to find the index.
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
  }

  const encode$3 = function (arraybuffer, byteOffset, length) {
      const bytes = new Uint8Array(arraybuffer, byteOffset, length),
          len = bytes.length;
      let base64 = '';

      for (let i = 0; i < len; i += 3) {
          base64 += chars[bytes[i] >> 2];
          base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
          base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
          base64 += chars[bytes[i + 2] & 63];
      }

      if ((len % 3) === 2) {
          base64 = base64.substring(0, base64.length - 1) + '=';
      } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + '==';
      }

      return base64;
  };

  const decode$3 = function (base64) {
      const len = base64.length;

      let bufferLength = base64.length * 0.75;
      let p = 0;
      let encoded1, encoded2, encoded3, encoded4;

      if (base64[base64.length - 1] === '=') {
          bufferLength--;
          if (base64[base64.length - 2] === '=') {
              bufferLength--;
          }
      }

      const arraybuffer = new ArrayBuffer(bufferLength),
          bytes = new Uint8Array(arraybuffer);

      for (let i = 0; i < len; i += 4) {
          encoded1 = lookup[base64.charCodeAt(i)];
          encoded2 = lookup[base64.charCodeAt(i + 1)];
          encoded3 = lookup[base64.charCodeAt(i + 2)];
          encoded4 = lookup[base64.charCodeAt(i + 3)];

          bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
          bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
          bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
      }

      return arraybuffer;
  };

  /*
   * wavefile: Read and write wave files.
   * https://github.com/rochars/wavefile
   *
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
   * @type {!Object}
   * @private
   */
  let uInt16_ = {bits: 16};
  /**
   * @type {!Object}
   * @private
   */
  let uInt32_$1 = {bits: 32};

  /**
   * Class representing a wav file.
   */
  class WaveFile {

    /**
     * @param {?Uint8Array} bytes A wave file buffer.
     * @throws {Error} If no 'RIFF' chunk is found.
     * @throws {Error} If no 'fmt ' chunk is found.
     * @throws {Error} If no 'data' chunk is found.
     */
    constructor(bytes=null) {
      /**
       * The container identifier.
       * 'RIFF', 'RIFX' and 'RF64' are supported.
       * @type {string}
       * @export
       */
      this.container = '';
      /**
       * @type {number}
       * @export
       */
      this.chunkSize = 0;
      /**
       * The format.
       * Always 'WAVE'.
       * @type {string}
       * @export
       */
      this.format = '';
      /**
       * The data of the 'fmt' chunk.
       * @type {!Object<string, *>}
       * @export
       */
      this.fmt = {
        /** @export @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {number} */
        audioFormat: 0,
        /** @export @type {number} */
        numChannels: 0,
        /** @export @type {number} */
        sampleRate: 0,
        /** @export @type {number} */
        byteRate: 0,
        /** @export @type {number} */
        blockAlign: 0,
        /** @export @type {number} */
        bitsPerSample: 0,
        /** @export @type {number} */
        cbSize: 0,
        /** @export @type {number} */
        validBitsPerSample: 0,
        /** @export @type {number} */
        dwChannelMask: 0,
        /**
         * 4 32-bit values representing a 128-bit ID
         * @export @type {!Array<number>}
         */
        subformat: []
      };
      /**
       * The data of the 'fact' chunk.
       * @type {!Object<string, *>}
       * @export
       */
      this.fact = {
        /** @export @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {number} */
        dwSampleLength: 0
      };
      /**
       * The data of the 'cue ' chunk.
       * @type {!Object<string, *>}
       * @export
       */
      this.cue = {
        /** @export @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {number} */
        dwCuePoints: 0,
        /** @export @type {!Array<!Object>} */
        points: [],
      };
      /**
       * The data of the 'smpl' chunk.
       * @type {!Object<string, *>}
       * @export
       */
      this.smpl = {
        /** @export @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {number} */
        dwManufacturer: 0,
        /** @export @type {number} */
        dwProduct: 0,
        /** @export @type {number} */
        dwSamplePeriod: 0,
        /** @export @type {number} */
        dwMIDIUnityNote: 0,
        /** @export @type {number} */
        dwMIDIPitchFraction: 0,
        /** @export @type {number} */
        dwSMPTEFormat: 0,
        /** @export @type {number} */
        dwSMPTEOffset: 0,
        /** @export @type {number} */
        dwNumSampleLoops: 0,
        /** @export @type {number} */
        dwSamplerData: 0,
        /** @export @type {!Array<!Object>} */
        loops: [],
      };
      /**
       * The data of the 'bext' chunk.
       * @type {!Object<string, *>}
       * @export
       */
      this.bext = {
        /** @export @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {string} */
        description: '', //256
        /** @export @type {string} */
        originator: '', //32
        /** @export @type {string} */
        originatorReference: '', //32
        /** @export @type {string} */
        originationDate: '', //10
        /** @export @type {string} */
        originationTime: '', //8
        /**
         * 2 32-bit values, timeReference high and low
         * @export @type {!Array<number>}
         */
        timeReference: [0, 0],
        /** @export @type {number} */
        version: 0, //WORD
        /** @export @type {string} */
        UMID: '', // 64 chars
        /** @export @type {number} */
        loudnessValue: 0, //WORD
        /** @export @type {number} */
        loudnessRange: 0, //WORD
        /** @export @type {number} */
        maxTruePeakLevel: 0, //WORD
        /** @export @type {number} */
        maxMomentaryLoudness: 0, //WORD
        /** @export @type {number} */
        maxShortTermLoudness: 0, //WORD
        /** @export @type {string} */
        reserved: '', //180
        /** @export @type {string} */
        codingHistory: '' // string, unlimited
      };
      /**
       * The data of the 'ds64' chunk.
       * Used only with RF64 files.
       * @type {!Object<string, *>}
       * @export
       */
      this.ds64 = {
        /** @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {number} */
        riffSizeHigh: 0, // DWORD
        /** @export @type {number} */
        riffSizeLow: 0, // DWORD
        /** @export @type {number} */
        dataSizeHigh: 0, // DWORD
        /** @export @type {number} */
        dataSizeLow: 0, // DWORD
        /** @export @type {number} */
        originationTime: 0, // DWORD
        /** @export @type {number} */
        sampleCountHigh: 0, // DWORD
        /** @export @type {number} */
        sampleCountLow: 0, // DWORD
        /** @export @type {number} */
        //'tableLength': 0, // DWORD
        /** @export @type {!Array<number>} */
        //'table': []
      };
      /**
       * The data of the 'data' chunk.
       * @type {!Object<string, *>}
       * @export
       */
      this.data = {
        /** @export @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {!Uint8Array} */
        samples: new Uint8Array(0)
      };
      /**
       * The data of the 'LIST' chunks.
       * Each item in this list must have this signature:
       *  {
       *    'chunkId': '',
       *    'chunkSize': 0,
       *    'format': '',
       *    'subChunks': []
       *   }
       * @type {!Array<!Object>}
       * @export
       */
      this.LIST = [];
      /**
       * The data of the 'junk' chunk.
       * @type {!Object<string, *>}
       * @export
       */
      this.junk = {
        /** @export @type {string} */
        chunkId: '',
        /** @export @type {number} */
        chunkSize: 0,
        /** @export @type {!Array<number>} */
        chunkData: []
      };
      /**
       * The bit depth code according to the samples.
       * @type {string}
       * @export
       */
      this.bitDepth = '0';
      /**
       * Audio formats.
       * Formats not listed here will be set to 65534
       * and treated as WAVE_FORMAT_EXTENSIBLE
       * @enum {number}
       * @private
       */
      this.audioFormats_ = {
        '4': 17,
        '8': 1,
        '8a': 6,
        '8m': 7,
        '16': 1,
        '24': 1,
        '32': 1,
        '32f': 3,
        '64': 3
      };
      /**
       * @type {number}
       * @private
       */
      this.head_ = 0;
      // Load a file from the buffer if one was passed
      // when creating the object
      this.dataType = {};
      if(bytes) {
        this.fromBuffer(bytes);
      }
    }

    /**
     * Set up the WaveFile object based on the arguments passed.
     * @param {number} numChannels The number of channels
     *    (Integer numbers: 1 for mono, 2 stereo and so on).
     * @param {number} sampleRate The sample rate.
     *    Integer numbers like 8000, 44100, 48000, 96000, 192000.
     * @param {string} bitDepth The audio bit depth code.
     *    One of '4', '8', '8a', '8m', '16', '24', '32', '32f', '64'
     *    or any value between '8' and '32' (like '12').
     * @param {!Array<number>|!Array<!Array<number>>} samples Array of samples to be written.
     *    The samples must be in the correct range according to the
     *    bit depth.
     * @param {?Object} options Optional. Used to force the container
     *    as RIFX with {'container': 'RIFX'}
     * @throws {Error} If any argument does not meet the criteria.
     * @export
     */
    fromScratch(numChannels, sampleRate, bitDepth, samples, options={}) {
      if (!options['container']) {
        options['container'] = 'RIFF';
      }
      this.container = options['container'];
      this.bitDepth = bitDepth;
      if (samples.length > 0) {
        if (samples[0].constructor === Array) {
          let finalSamples = [];
          for (let i=0; i < samples[0].length; i++) {
            for (let j=0; j < samples.length; j++) {
              finalSamples.push(samples[j][i]);
            }
          }
          samples = finalSamples;
        }
      }
      /** @type {number} */
      let numBytes = (((parseInt(bitDepth, 10) - 1) | 7) + 1) / 8;
      // Turn the samples to bytes
      this.updateDataType_();
      this.data.samples = new Uint8Array(samples.length * numBytes);
      packArrayTo(samples, this.dataType, this.data.samples);
      // create headers
      this.createPCMHeader_(
        bitDepth, numChannels, sampleRate, numBytes, options);
      if (bitDepth == '4') {
        this.createADPCMHeader_(
          bitDepth, numChannels, sampleRate, numBytes, options);
      } else if (bitDepth == '8a' || bitDepth == '8m') {
        this.createALawMulawHeader_(
          bitDepth, numChannels, sampleRate, numBytes, options);
      } else if(Object.keys(this.audioFormats_).indexOf(bitDepth) == -1 ||
          this.fmt.numChannels > 2) {
        this.createExtensibleHeader_(
          bitDepth, numChannels, sampleRate, numBytes, options);
      }
      // the data chunk
      this.data.chunkId = 'data';
      this.data.chunkSize = this.data.samples.length;
      this.validateHeader_();
      this.LEorBE_();
    }

    updateDataType_() {
      let wordBitDepth = ((parseInt(this.bitDepth, 10) - 1) | 7) + 1;
      let isFloat = this.bitDepth == '32f' || this.bitDepth == '64';
      let isSigned = this.bitDepth != '8';
      let isBe = this.container == 'RIFX';
      this.dataType = {bits: wordBitDepth, float: isFloat, signed: isSigned, be: isBe};
      if (this.bitDepth == '4' || this.bitDepth == '8a' || this.bitDepth == '8m' ) {
        this.dataType.bits = 8;
        this.dataType.signed = false;
      }
    }

    /**
     * Set up the WaveFile object from a byte buffer.
     * @param {!Uint8Array} bytes The buffer.
     * @param {boolean=} samples True if the samples should be loaded.
     * @throws {Error} If container is not RIFF, RIFX or RF64.
     * @throws {Error} If no 'fmt ' chunk is found.
     * @throws {Error} If no 'data' chunk is found.
     * @export
     */
    fromBuffer(bytes, samples=true) {
      this.head_ = 0;
      this.clearHeader_();
      this.readRIFFChunk_(bytes);
      /** @type {!Object} */
      let chunk = riffChunks(bytes);
      this.readDs64Chunk_(bytes, chunk.subChunks);
      this.readFmtChunk_(bytes, chunk.subChunks);
      this.readFactChunk_(bytes, chunk.subChunks);
      this.readBextChunk_(bytes, chunk.subChunks);
      this.readCueChunk_(bytes, chunk.subChunks);
      this.readSmplChunk_(bytes, chunk.subChunks);
      this.readDataChunk_(bytes, chunk.subChunks, samples);
      this.readJunkChunk_(bytes, chunk.subChunks);
      this.readLISTChunk_(bytes, chunk.subChunks);
      this.bitDepthFromFmt_();
      this.updateDataType_();
    }

    /**
     * Return a byte buffer representig the WaveFile object as a .wav file.
     * The return value of this method can be written straight to disk.
     * @return {!Uint8Array} A .wav file.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    toBuffer() {
      this.validateHeader_();
      return this.createWaveFile_();
    }

    /**
     * Use a .wav file encoded as a base64 string to load the WaveFile object.
     * @param {string} base64String A .wav file as a base64 string.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    fromBase64(base64String) {
      this.fromBuffer(new Uint8Array(decode$3(base64String)));
    }

    /**
     * Return a base64 string representig the WaveFile object as a .wav file.
     * @return {string} A .wav file as a base64 string.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    toBase64() {
      let buffer = this.toBuffer();
      return encode$3(buffer, 0, buffer.length);
    }

    /**
     * Return a DataURI string representig the WaveFile object as a .wav file.
     * The return of this method can be used to load the audio in browsers.
     * @return {string} A .wav file as a DataURI.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    toDataURI() {
      return 'data:audio/wav;base64,' + this.toBase64();
    }

    /**
     * Use a .wav file encoded as a DataURI to load the WaveFile object.
     * @param {string} dataURI A .wav file as DataURI.
     * @throws {Error} If any property of the object appears invalid.
     * @export
     */
    fromDataURI(dataURI) {
      this.fromBase64(dataURI.replace('data:audio/wav;base64,', ''));
    }

    /**
     * Force a file as RIFF.
     * @export
     */
    toRIFF() {
      if (this.container == 'RF64') {
        this.fromScratch(
          this.fmt.numChannels,
          this.fmt.sampleRate,
          this.bitDepth,
          unpackArray(this.data.samples, this.dataType));
      } else {
        this.dataType.be = true;
        this.fromScratch(
          this.fmt.numChannels,
          this.fmt.sampleRate,
          this.bitDepth,
          unpackArray(this.data.samples, this.dataType));
      }
    }

    /**
     * Force a file as RIFX.
     * @export
     */
    toRIFX() {
      if (this.container == 'RF64') {
        this.fromScratch(
          this.fmt.numChannels,
          this.fmt.sampleRate,
          this.bitDepth,
          unpackArray(this.data.samples, this.dataType),
          {'container': 'RIFX'});
      } else {
        this.fromScratch(
          this.fmt.numChannels,
          this.fmt.sampleRate,
          this.bitDepth,
          unpackArray(this.data.samples, this.dataType),
          {'container': 'RIFX'});
      }
    }

    /**
     * Change the bit depth of the samples.
     * @param {string} bitDepth The new bit depth of the samples.
     *    One of '8' ... '32' (integers), '32f' or '64' (floats)
     * @param {boolean} changeResolution A boolean indicating if the
     *    resolution of samples should be actually changed or not.
     * @throws {Error} If the bit depth is not valid.
     * @export
     */
    toBitDepth(bitDepth, changeResolution=true) {
      let toBitDepth = bitDepth;
      let thisBitDepth = this.bitDepth;
      if (!changeResolution) {
        toBitDepth = this.realBitDepth_(bitDepth);
        thisBitDepth = this.realBitDepth_(this.bitDepth);
      }
      this.assureUncompressed_();
      let samples = unpackArray(this.data.samples, this.dataType);
      this.truncateSamples(samples);
      bitdepth(samples, thisBitDepth, toBitDepth);
      this.fromScratch(
        this.fmt.numChannels,
        this.fmt.sampleRate,
        bitDepth,
        samples,
        {'container': this.correctContainer_()});
    }

    /**
     * Encode a 16-bit wave file as 4-bit IMA ADPCM.
     * @throws {Error} If sample rate is not 8000.
     * @throws {Error} If number of channels is not 1.
     * @export
     */
    toIMAADPCM() {
      if (this.fmt.sampleRate != 8000) {
        throw new Error(
          'Only 8000 Hz files can be compressed as IMA-ADPCM.');
      } else if(this.fmt.numChannels != 1) {
        throw new Error(
          'Only mono files can be compressed as IMA-ADPCM.');
      } else {
        this.assure16Bit_();
        this.fromScratch(
          this.fmt.numChannels,
          this.fmt.sampleRate,
          '4',
          encode(unpackArray(this.data.samples, this.dataType)),
          {'container': this.correctContainer_()});
      }
    }

    /**
     * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
     * @param {string} bitDepth The new bit depth of the samples.
     *    One of '8' ... '32' (integers), '32f' or '64' (floats).
     *    Optional. Default is 16.
     * @export
     */
    fromIMAADPCM(bitDepth='16') {
      this.fromScratch(
        this.fmt.numChannels,
        this.fmt.sampleRate,
        '16',
        decode(this.data.samples, this.fmt.blockAlign),
        {'container': this.correctContainer_()});
      if (bitDepth != '16') {
        this.toBitDepth(bitDepth);
      }
    }

    /**
     * Encode 16-bit wave file as 8-bit A-Law.
     * @export
     */
    toALaw() {
      this.assure16Bit_();
      this.fromScratch(
        this.fmt.numChannels,
        this.fmt.sampleRate,
        '8a',
        alawmulaw.alaw.encode(unpackArray(this.data.samples, this.dataType)),
        {'container': this.correctContainer_()});
    }

    /**
     * Decode a 8-bit A-Law wave file into a 16-bit wave file.
     * @param {string} bitDepth The new bit depth of the samples.
     *    One of '8' ... '32' (integers), '32f' or '64' (floats).
     *    Optional. Default is 16.
     * @export
     */
    fromALaw(bitDepth='16') {
      this.fromScratch(
        this.fmt.numChannels,
        this.fmt.sampleRate,
        '16',
        alawmulaw.alaw.decode(this.data.samples),
        {'container': this.correctContainer_()});
      if (bitDepth != '16') {
        this.toBitDepth(bitDepth);
      }
    }

    /**
     * Encode 16-bit wave file as 8-bit mu-Law.
     * @export
     */
    toMuLaw() {
      this.assure16Bit_();
      let samples = unpackArray(this.data.samples, this.dataType);
      this.fromScratch(
        this.fmt.numChannels,
        this.fmt.sampleRate,
        '8m',
        alawmulaw.mulaw.encode(samples),
        {'container': this.correctContainer_()});
    }

    /**
     * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
     * @param {string} bitDepth The new bit depth of the samples.
     *    One of '8' ... '32' (integers), '32f' or '64' (floats).
     *    Optional. Default is 16.
     * @export
     */
    fromMuLaw(bitDepth='16') {
      this.fromScratch(
        this.fmt.numChannels,
        this.fmt.sampleRate,
        '16',
        alawmulaw.mulaw.decode(this.data.samples),
        {'container': this.correctContainer_()});
      if (bitDepth != '16') {
        this.toBitDepth(bitDepth);
      }
    }

    /**
     * Write a RIFF tag in the INFO chunk. If the tag do not exist,
     * then it is created. It if exists, it is overwritten.
     * @param {string} tag The tag name.
     * @param {string} value The tag value.
     * @throws {Error} If the tag name is not valid.
     * @export
     */
    setTag(tag, value) {
      tag = this.fixTagName_(tag);
      /** @type {!Object} */
      let index = this.getTagIndex_(tag);
      if (index.TAG !== null) {
        this.LIST[index.LIST]['subChunks'][index.TAG]['chunkSize'] =
          value.length + 1;
        this.LIST[index.LIST]['subChunks'][index.TAG]['value'] = value;
      } else if (index.LIST !== null) {
        this.LIST[index.LIST]['subChunks'].push({
          'chunkId': tag,
          'chunkSize': value.length + 1,
          'value': value});
      } else {
        this.LIST.push({
          'chunkId': 'LIST',
          'chunkSize': 8 + value.length + 1,
          'format': 'INFO',
          'subChunks': []});
        this.LIST[this.LIST.length - 1]['subChunks'].push({
          'chunkId': tag,
          'chunkSize': value.length + 1,
          'value': value});
      }
    }

    /**
     * Return the value of a RIFF tag in the INFO chunk.
     * @param {string} tag The tag name.
     * @return {?string} The value if the tag is found, null otherwise.
     * @export
     */
    getTag(tag) {
      /** @type {!Object} */
      let index = this.getTagIndex_(tag);
      if (index.TAG !== null) {
        return this.LIST[index.LIST]['subChunks'][index.TAG]['value'];
      }
      return null;
    }

    /**
     * Remove a RIFF tag in the INFO chunk.
     * @param {string} tag The tag name.
     * @return {boolean} True if a tag was deleted.
     * @export
     */
    deleteTag(tag) {
      /** @type {!Object} */
      let index = this.getTagIndex_(tag);
      if (index.TAG !== null) {
        this.LIST[index.LIST]['subChunks'].splice(index.TAG, 1);
        return true;
      }
      return false;
    }

    /**
     * Create a cue point in the wave file.
     * @param {number} position The cue point position in milliseconds.
     * @param {string} labl The LIST adtl labl text of the marker. Optional.
     * @export
     */
    setCuePoint(position, labl='') {
      this.cue.chunkId = 'cue ';
      position = (position * this.fmt.sampleRate) / 1000;
      /** @type {!Array<!Object>} */
      let existingPoints = this.getCuePoints_();
      this.clearLISTadtl_();
      /** @type {number} */
      let len = this.cue.points.length;
      this.cue.points = [];
      /** @type {boolean} */
      let hasSet = false;
      if (len == 0) {
        this.setCuePoint_(position, 1, labl);
      } else {
        for (let i=0; i<len; i++) {
          if (existingPoints[i]['dwPosition'] > position && !hasSet) {
            this.setCuePoint_(position, i + 1, labl);
            this.setCuePoint_(
              existingPoints[i]['dwPosition'],
              i + 2,
              existingPoints[i]['label']);
            hasSet = true;
          } else {
            this.setCuePoint_(
              existingPoints[i]['dwPosition'],
              i + 1,
              existingPoints[i]['label']);
          }
        }
        if (!hasSet) {
          this.setCuePoint_(position, this.cue.points.length + 1, labl);
        }
      }
      this.cue.dwCuePoints = this.cue.points.length;
    }

    /**
     * Remove a cue point from a wave file.
     * @param {number} index the index of the point. First is 1,
     *    second is 2, and so on.
     * @export
     */
    deleteCuePoint(index) {
      this.cue.chunkId = 'cue ';
      /** @type {!Array<!Object>} */
      let existingPoints = this.getCuePoints_();
      this.clearLISTadtl_();
      /** @type {number} */
      let len = this.cue.points.length;
      this.cue.points = [];
      for (let i=0; i<len; i++) {
        if (i + 1 != index) {
          this.setCuePoint_(
            existingPoints[i]['dwPosition'],
            i + 1,
            existingPoints[i]['label']);
        }
      }
      this.cue.dwCuePoints = this.cue.points.length;
      if (this.cue.dwCuePoints) {
        this.cue.chunkId = 'cue ';
      } else {
        this.cue.chunkId = '';
        this.clearLISTadtl_();
      }
    }

    /**
     * Update the label of a cue point.
     * @param {number} pointIndex The ID of the cue point.
     * @param {string} label The new text for the label.
     * @export
     */
    updateLabel(pointIndex, label) {
      /** @type {?number} */
      let adtlIndex = this.getAdtlChunk_();
      if (adtlIndex !== null) {
        for (let i=0; i<this.LIST[adtlIndex]['subChunks'].length; i++) {
          if (this.LIST[adtlIndex]['subChunks'][i]['dwName'] ==
              pointIndex) {
            this.LIST[adtlIndex]['subChunks'][i]['value'] = label;
          }
        }
      }
    }

    /**
     * Push a new cue point in this.cue.points.
     * @param {number} position The position in milliseconds.
     * @param {number} dwName the dwName of the cue point
     * @private
     */
    setCuePoint_(position, dwName, label) {
      this.cue.points.push({
        'dwName': dwName,
        'dwPosition': position,
        'fccChunk': 'data',
        'dwChunkStart': 0,
        'dwBlockStart': 0,
        'dwSampleOffset': position,
      });
      this.setLabl_(dwName, label);
    }

    /**
     * Return an array with the position of all cue points in the file.
     * @return {!Array<!Object>}
     * @private
     */
    getCuePoints_() {
      /** @type {!Array<!Object>} */
      let points = [];
      for (let i=0; i<this.cue.points.length; i++) {
        points.push({
          'dwPosition': this.cue.points[i]['dwPosition'],
          'label': this.getLabelForCuePoint_(
            this.cue.points[i]['dwName'])});
      }
      return points;
    }

    /**
     * Return the label of a cue point.
     * @param {number} pointDwName The ID of the cue point.
     * @return {string}
     * @private
     */
    getLabelForCuePoint_(pointDwName) {
      /** @type {?number} */
      let adtlIndex = this.getAdtlChunk_();
      if (adtlIndex !== null) {
        for (let i=0; i<this.LIST[adtlIndex]['subChunks'].length; i++) {
          if (this.LIST[adtlIndex]['subChunks'][i]['dwName'] ==
              pointDwName) {
            return this.LIST[adtlIndex]['subChunks'][i]['value'];
          }
        }
      }
      return '';
    }

    /**
     * Clear any LIST chunk labeled as 'adtl'.
     * @private
     */
    clearLISTadtl_() {
      for (let i=0; i<this.LIST.length; i++) {
        if (this.LIST[i]['format'] == 'adtl') {
          this.LIST.splice(i);
        }
      }
    }

    /**
     * Create a new 'labl' subchunk in a 'LIST' chunk of type 'adtl'.
     * @param {number} dwName The ID of the cue point.
     * @param {string} label The label for the cue point.
     * @private
     */
    setLabl_(dwName, label) {
      /** @type {?number} */
      let adtlIndex = this.getAdtlChunk_();
      if (adtlIndex === null) {
        this.LIST.push({
          'chunkId': 'LIST',
          'chunkSize': 4,
          'format': 'adtl',
          'subChunks': []});
        adtlIndex = this.LIST.length - 1;
      }
      this.setLabelText_(adtlIndex === null ? 0 : adtlIndex, dwName, label);
    }

    /**
     * Create a new 'labl' subchunk in a 'LIST' chunk of type 'adtl'.
     * @param {number} adtlIndex The index of the 'adtl' LIST in this.LIST.
     * @param {number} dwName The ID of the cue point.
     * @param {string} label The label for the cue point.
     * @private
     */
    setLabelText_(adtlIndex, dwName, label) {
      this.LIST[adtlIndex]['subChunks'].push({
        'chunkId': 'labl',
        'chunkSize': label.length,
        'dwName': dwName,
        'value': label
      });
      this.LIST[adtlIndex]['chunkSize'] += label.length + 4 + 4 + 4 + 1;
    }

    /**
     * Return the index of the 'adtl' LIST in this.LIST.
     * @return {?number}
     * @private
     */
    getAdtlChunk_() {
      for (let i=0; i<this.LIST.length; i++) {
        if(this.LIST[i]['format'] == 'adtl') {
          return i;
        }
      }
      return null;
    }

    /**
     * Return the index of a tag in a FILE chunk.
     * @param {string} tag The tag name.
     * @return {!Object<string, ?number>}
     *    Object.LIST is the INFO index in LIST
     *    Object.TAG is the tag index in the INFO
     * @private
     */
    getTagIndex_(tag) {
      /** @type {!Object<string, ?number>} */
      let index = {LIST: null, TAG: null};
      for (let i=0; i<this.LIST.length; i++) {
        if (this.LIST[i]['format'] == 'INFO') {
          index.LIST = i;
          for (let j=0; j<this.LIST[i]['subChunks'].length; j++) {
            if (this.LIST[i]['subChunks'][j]['chunkId'] == tag) {
              index.TAG = j;
              break;
            }
          }
          break;
        }
      }
      return index;
    }

    /**
     * Fix a RIFF tag format if possible, throw an error otherwise.
     * @param {string} tag The tag name.
     * @return {string} The tag name in proper fourCC format.
     * @private
     */
    fixTagName_(tag) {
      if (tag.constructor !== String) {
        throw new Error('Invalid tag name.');
      } else if(tag.length < 4) {
        for (let i=0; i<4-tag.length; i++) {
          tag += ' ';
        }
      }
      return tag;
    }

    /**
     * Create the header of a ADPCM wave file.
     * @param {string} bitDepth The audio bit depth
     * @param {number} numChannels The number of channels
     * @param {number} sampleRate The sample rate.
     * @param {number} numBytes The number of bytes each sample use.
     * @param {!Object} options The extra options, like container defintion.
     * @private
     */
    createADPCMHeader_(bitDepth, numChannels, sampleRate, numBytes, options) {
      this.createPCMHeader_(
        bitDepth, numChannels, sampleRate, numBytes, options);
      this.chunkSize = 40 + this.data.samples.length;
      this.fmt.chunkSize = 20;
      this.fmt.byteRate = 4055;
      this.fmt.blockAlign = 256;
      this.fmt.bitsPerSample = 4;
      this.fmt.cbSize = 2;
      this.fmt.validBitsPerSample = 505;
      this.fact.chunkId = 'fact';
      this.fact.chunkSize = 4;
      this.fact.dwSampleLength = this.data.samples.length * 2;
      this.data.chunkSize = this.data.samples.length;
    }

    /**
     * Create the header of WAVE_FORMAT_EXTENSIBLE file.
     * @param {string} bitDepth The audio bit depth
     * @param {number} numChannels The number of channels
     * @param {number} sampleRate The sample rate.
     * @param {number} numBytes The number of bytes each sample use.
     * @param {!Object} options The extra options, like container defintion.
     * @private
     */
    createExtensibleHeader_(
        bitDepth, numChannels, sampleRate, numBytes, options) {
      this.createPCMHeader_(
        bitDepth, numChannels, sampleRate, numBytes, options);
      //this.chunkSize = 36 + 24 + this.data.samples.length * numBytes;
      this.chunkSize = 36 + 24 + this.data.samples.length;
      this.fmt.chunkSize = 40;
      this.fmt.bitsPerSample = ((parseInt(bitDepth, 10) - 1) | 7) + 1;
      this.fmt.cbSize = 22;
      this.fmt.validBitsPerSample = parseInt(bitDepth, 10);
      this.fmt.dwChannelMask = this.getDwChannelMask_();
      // subformat 128-bit GUID as 4 32-bit values
      // only supports uncompressed integer PCM samples
      this.fmt.subformat = [1, 1048576, 2852126848, 1905997824];
    }

    /**
     * Get the value for dwChannelMask according to the number of channels.
     * @return {number} the dwChannelMask value.
     * @private
     */
    getDwChannelMask_() {
      /** @type {number} */
      let dwChannelMask = 0;
      // mono = FC
      if (this.fmt.numChannels == 1) {
        dwChannelMask = 0x4;
      // stereo = FL, FR
      } else if (this.fmt.numChannels == 2) {
        dwChannelMask = 0x3;
      // quad = FL, FR, BL, BR
      } else if (this.fmt.numChannels == 4) {
        dwChannelMask = 0x33;
      // 5.1 = FL, FR, FC, LF, BL, BR
      } else if (this.fmt.numChannels == 6) {
        dwChannelMask = 0x3F;
      // 7.1 = FL, FR, FC, LF, BL, BR, SL, SR
      } else if (this.fmt.numChannels == 8) {
        dwChannelMask = 0x63F;
      }
      return dwChannelMask;
    }

    /**
     * Create the header of mu-Law and A-Law wave files.
     * @param {string} bitDepth The audio bit depth
     * @param {number} numChannels The number of channels
     * @param {number} sampleRate The sample rate.
     * @param {number} numBytes The number of bytes each sample use.
     * @param {!Object} options The extra options, like container defintion.
     * @private
     */
    createALawMulawHeader_(
        bitDepth, numChannels, sampleRate, numBytes, options) {
      this.createPCMHeader_(
        bitDepth, numChannels, sampleRate, numBytes, options);
      this.chunkSize = 40 + this.data.samples.length;
      this.fmt.chunkSize = 20;
      this.fmt.cbSize = 2;
      this.fmt.validBitsPerSample = 8;
      this.fact.chunkId = 'fact';
      this.fact.chunkSize = 4;
      this.fact.dwSampleLength = this.data.samples.length;
    }

    /**
     * Create the header of a linear PCM wave file.
     * @param {string} bitDepth The audio bit depth
     * @param {number} numChannels The number of channels
     * @param {number} sampleRate The sample rate.
     * @param {number} numBytes The number of bytes each sample use.
     * @param {!Object} options The extra options, like container defintion.
     * @private
     */
    createPCMHeader_(bitDepth, numChannels, sampleRate, numBytes, options) {
      this.clearHeader_();
      this.container = options['container'];
      //this.chunkSize = 36 + this.data.samples.length * numBytes;
      this.chunkSize = 36 + this.data.samples.length;
      this.format = 'WAVE';
      this.fmt.chunkId = 'fmt ';
      this.fmt.chunkSize = 16;
      this.fmt.byteRate = (numChannels * numBytes) * sampleRate;
      this.fmt.blockAlign = numChannels * numBytes;
      this.fmt.audioFormat = this.audioFormats_[bitDepth] ?
        this.audioFormats_[bitDepth] : 65534;
      this.fmt.numChannels = numChannels;
      this.fmt.sampleRate = sampleRate;
      this.fmt.bitsPerSample = parseInt(bitDepth, 10);
      this.fmt.cbSize = 0;
      this.fmt.validBitsPerSample = 0;
    }

    /**
     * Return the closest greater number of bits for a number of bits that
     * do not fill a full sequence of bytes.
     * @param {string} bitDepth The bit depth.
     * @return {string}
     * @private
     */
    realBitDepth_(bitDepth) {
      if (bitDepth != '32f') {
        bitDepth = (((parseInt(bitDepth, 10) - 1) | 7) + 1).toString();
      }
      return bitDepth;
    }

    /**
     * Validate the header of the file.
     * @throws {Error} If any property of the object appears invalid.
     * @private
     */
    validateHeader_() {
      this.validateBitDepth_();
      this.validateNumChannels_();
      this.validateSampleRate_();
    }

    /**
     * Validate the bit depth.
     * @return {boolean} True is the bit depth is valid.
     * @throws {Error} If bit depth is invalid.
     * @private
     */
    validateBitDepth_() {
      if (!this.audioFormats_[this.bitDepth]) {
        if (parseInt(this.bitDepth, 10) > 8 &&
            parseInt(this.bitDepth, 10) < 54) {
          return true;
        }
        throw new Error('Invalid bit depth.');
      }
      return true;
    }

    /**
     * Validate the number of channels.
     * @return {boolean} True is the number of channels is valid.
     * @throws {Error} If the number of channels is invalid.
     * @private
     */
    validateNumChannels_() {
      /** @type {number} */
      let blockAlign = this.fmt.numChannels * this.fmt.bitsPerSample / 8;
      if (this.fmt.numChannels < 1 || blockAlign > 65535) {
        throw new Error('Invalid number of channels.');
      }
      return true;
    }

    /**
     * Validate the sample rate value.
     * @return {boolean} True is the sample rate is valid.
     * @throws {Error} If the sample rate is invalid.
     * @private
     */
    validateSampleRate_() {
      /** @type {number} */
      let byteRate = this.fmt.numChannels *
        (this.fmt.bitsPerSample / 8) * this.fmt.sampleRate;
      if (this.fmt.sampleRate < 1 || byteRate > 4294967295) {
        throw new Error('Invalid sample rate.');
      }
      return true;
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
     * Make the file 16-bit if it is not.
     * @private
     */
    assure16Bit_() {
      this.assureUncompressed_();
      if (this.bitDepth != '16') {
        this.toBitDepth('16');
      }
    }

    /**
     * Uncompress the samples in case of a compressed file.
     * @private
     */
    assureUncompressed_() {
      if (this.bitDepth == '8a') {
        this.fromALaw();
      } else if(this.bitDepth == '8m') {
        this.fromMuLaw();
      } else if (this.bitDepth == '4') {
        this.fromIMAADPCM();
      }
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
      uInt16_.be = bigEndian;
      uInt32_$1.be = bigEndian;
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
      this.chunkSize = this.read_(bytes, uInt32_$1);
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
        this.fmt.audioFormat = this.read_(buffer, uInt16_);
        this.fmt.numChannels = this.read_(buffer, uInt16_);
        this.fmt.sampleRate = this.read_(buffer, uInt32_$1);
        this.fmt.byteRate = this.read_(buffer, uInt32_$1);
        this.fmt.blockAlign = this.read_(buffer, uInt16_);
        this.fmt.bitsPerSample = this.read_(buffer, uInt16_);
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
        this.fmt.cbSize = this.read_(buffer, uInt16_);
        if (this.fmt.chunkSize > 18) {
          this.fmt.validBitsPerSample = this.read_(buffer, uInt16_);
          if (this.fmt.chunkSize > 20) {
            this.fmt.dwChannelMask = this.read_(buffer, uInt32_$1);
            this.fmt.subformat = [
              this.read_(buffer, uInt32_$1),
              this.read_(buffer, uInt32_$1),
              this.read_(buffer, uInt32_$1),
              this.read_(buffer, uInt32_$1)];
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
        this.fact.dwSampleLength = this.read_(buffer, uInt32_$1);
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
        this.cue.dwCuePoints = this.read_(buffer, uInt32_$1);
        for (let i=0; i<this.cue.dwCuePoints; i++) {
          this.cue.points.push({
            'dwName': this.read_(buffer, uInt32_$1),
            'dwPosition': this.read_(buffer, uInt32_$1),
            'fccChunk': this.readString_(buffer, 4),
            'dwChunkStart': this.read_(buffer, uInt32_$1),
            'dwBlockStart': this.read_(buffer, uInt32_$1),
            'dwSampleOffset': this.read_(buffer, uInt32_$1),
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
        this.smpl.dwManufacturer = this.read_(buffer, uInt32_$1);
        this.smpl.dwProduct = this.read_(buffer, uInt32_$1);
        this.smpl.dwSamplePeriod = this.read_(buffer, uInt32_$1);
        this.smpl.dwMIDIUnityNote = this.read_(buffer, uInt32_$1);
        this.smpl.dwMIDIPitchFraction = this.read_(buffer, uInt32_$1);
        this.smpl.dwSMPTEFormat = this.read_(buffer, uInt32_$1);
        this.smpl.dwSMPTEOffset = this.read_(buffer, uInt32_$1);
        this.smpl.dwNumSampleLoops = this.read_(buffer, uInt32_$1);
        this.smpl.dwSamplerData = this.read_(buffer, uInt32_$1);
        for (let i=0; i<this.smpl.dwNumSampleLoops; i++) {
          this.smpl.loops.push({
            'dwName': this.read_(buffer, uInt32_$1),
            'dwType': this.read_(buffer, uInt32_$1),
            'dwStart': this.read_(buffer, uInt32_$1),
            'dwEnd': this.read_(buffer, uInt32_$1),
            'dwFraction': this.read_(buffer, uInt32_$1),
            'dwPlayCount': this.read_(buffer, uInt32_$1),
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
          this.read_(buffer, uInt32_$1),
          this.read_(buffer, uInt32_$1)];
        this.bext.version = this.read_(buffer, uInt16_);
        this.bext.UMID = this.readString_(buffer, 64);
        this.bext.loudnessValue = this.read_(buffer, uInt16_);
        this.bext.loudnessRange = this.read_(buffer, uInt16_);
        this.bext.maxTruePeakLevel = this.read_(buffer, uInt16_);
        this.bext.maxMomentaryLoudness = this.read_(buffer, uInt16_);
        this.bext.maxShortTermLoudness = this.read_(buffer, uInt16_);
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
        this.ds64.riffSizeHigh = this.read_(buffer, uInt32_$1);
        this.ds64.riffSizeLow = this.read_(buffer, uInt32_$1);
        this.ds64.dataSizeHigh = this.read_(buffer, uInt32_$1);
        this.ds64.dataSizeLow = this.read_(buffer, uInt32_$1);
        this.ds64.originationTime = this.read_(buffer, uInt32_$1);
        this.ds64.sampleCountHigh = this.read_(buffer, uInt32_$1);
        this.ds64.sampleCountLow = this.read_(buffer, uInt32_$1);
        //if (this.ds64.chunkSize > 28) {
        //  this.ds64.tableLength = unpack(
        //    chunkData.slice(28, 32), uInt32_);
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
          'chunkId': subChunk.chunkId,
          'chunkSize': subChunk.chunkSize,
          'format': subChunk.format,
          'subChunks': []});
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
            'chunkId': subChunk.chunkId,
            'chunkSize': subChunk.chunkSize,
            'dwName': this.read_(buffer, uInt32_$1)
          };
          if (subChunk.chunkId == 'ltxt') {
            item['dwSampleLength'] = this.read_(buffer, uInt32_$1);
            item['dwPurposeID'] = this.read_(buffer, uInt32_$1);
            item['dwCountry'] = this.read_(buffer, uInt16_);
            item['dwLanguage'] = this.read_(buffer, uInt16_);
            item['dwDialect'] = this.read_(buffer, uInt16_);
            item['dwCodePage'] = this.read_(buffer, uInt16_);
          }
          item['value'] = this.readZSTR_(buffer, this.head_);
          this.LIST[this.LIST.length - 1]['subChunks'].push(item);
        }
      // RIFF INFO tags like ICRD, ISFT, ICMT
      } else if(format == 'INFO') {
        this.head_ = subChunk.chunkData.start;
        this.LIST[this.LIST.length - 1]['subChunks'].push({
          'chunkId': subChunk.chunkId,
          'chunkSize': subChunk.chunkSize,
          'value': this.readZSTR_(buffer,  this.head_)
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
          'chunkId': chunk.chunkId,
          'chunkSize': chunk.chunkSize,
          'chunkData': [].slice.call(buffer.slice(
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
     * Turn the samples to bytes.
     * @return {!Array<number>} The bytes.
     * @private
     */
    samplesToBytes_() {
      return packArray(
        this.data.samples, this.getSamplesType_());
    }

    /**
     * Truncate float samples on over and underflow.
     * @private
     */
    truncateSamples(samples) {
      if (this.fmt.audioFormat == 3) {
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

    /**
     * Get the data type definition for the samples.
     * @return {!Object<string, number|boolean>} The type definition.
     * @private
     */
    getSamplesType_() {
      /** @type {!Object<string, number|boolean>} */
      let bdType = {
        be: this.container === 'RIFX',
        bits: this.fmt.bitsPerSample == 4 ? 8 : this.fmt.bitsPerSample,
        float: this.fmt.audioFormat == 3 ? true : false
      };
      bdType.signed = bdType.bits == 8 ? false : true;
      return bdType;
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
        bytes = bytes.concat(
          packString(this.bext.chunkId),
          pack(602 + this.bext.codingHistory.length, uInt32_$1),
          this.writeString_(this.bext.description, 256),
          this.writeString_(this.bext.originator, 32),
          this.writeString_(this.bext.originatorReference, 32),
          this.writeString_(this.bext.originationDate, 10),
          this.writeString_(this.bext.originationTime, 8),
          pack(this.bext.timeReference[0], uInt32_$1),
          pack(this.bext.timeReference[1], uInt32_$1),
          pack(this.bext.version, uInt16_),
          this.writeString_(this.bext.UMID, 64),
          pack(this.bext.loudnessValue, uInt16_),
          pack(this.bext.loudnessRange, uInt16_),
          pack(this.bext.maxTruePeakLevel, uInt16_),
          pack(this.bext.maxMomentaryLoudness, uInt16_),
          pack(this.bext.maxShortTermLoudness, uInt16_),
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
          pack(this.ds64.chunkSize, uInt32_$1),
          pack(this.ds64.riffSizeHigh, uInt32_$1),
          pack(this.ds64.riffSizeLow, uInt32_$1),
          pack(this.ds64.dataSizeHigh, uInt32_$1),
          pack(this.ds64.dataSizeLow, uInt32_$1),
          pack(this.ds64.originationTime, uInt32_$1),
          pack(this.ds64.sampleCountHigh, uInt32_$1),
          pack(this.ds64.sampleCountLow, uInt32_$1));
      }
      //if (this.ds64.tableLength) {
      //  ds64Bytes = ds64Bytes.concat(
      //    pack(this.ds64.tableLength, uInt32_),
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
          pack(cuePointsBytes.length + 4, uInt32_$1),
          pack(this.cue.dwCuePoints, uInt32_$1),
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
          pack(this.cue.points[i]['dwName'], uInt32_$1),
          pack(this.cue.points[i]['dwPosition'], uInt32_$1),
          packString(this.cue.points[i]['fccChunk']),
          pack(this.cue.points[i]['dwChunkStart'], uInt32_$1),
          pack(this.cue.points[i]['dwBlockStart'], uInt32_$1),
          pack(this.cue.points[i]['dwSampleOffset'], uInt32_$1));
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
          pack(smplLoopsBytes.length + 36, uInt32_$1),
          pack(this.smpl.dwManufacturer, uInt32_$1),
          pack(this.smpl.dwProduct, uInt32_$1),
          pack(this.smpl.dwSamplePeriod, uInt32_$1),
          pack(this.smpl.dwMIDIUnityNote, uInt32_$1),
          pack(this.smpl.dwMIDIPitchFraction, uInt32_$1),
          pack(this.smpl.dwSMPTEFormat, uInt32_$1),
          pack(this.smpl.dwSMPTEOffset, uInt32_$1),
          pack(this.smpl.dwNumSampleLoops, uInt32_$1),
          pack(this.smpl.dwSamplerData, uInt32_$1),
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
          pack(this.smpl.loops[i]['dwName'], uInt32_$1),
          pack(this.smpl.loops[i]['dwType'], uInt32_$1),
          pack(this.smpl.loops[i]['dwStart'], uInt32_$1),
          pack(this.smpl.loops[i]['dwEnd'], uInt32_$1),
          pack(this.smpl.loops[i]['dwFraction'], uInt32_$1),
          pack(this.smpl.loops[i]['dwPlayCount'], uInt32_$1));
      }
      return loops;
    }

    /**
     * Return the bytes of the 'fact' chunk.
     * @return {!Array<number>} The 'fact' chunk bytes.
     * @private
     */
    getFactBytes_() {
      // @type {!Array<number>} 
      let bytes = [];
      if (this.fact.chunkId) {
        bytes = bytes.concat(
          packString(this.fact.chunkId),
          pack(this.fact.chunkSize, uInt32_$1),
          pack(this.fact.dwSampleLength, uInt32_$1));
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
      if (this.fmt.chunkId) {
        return [].concat(
          packString(this.fmt.chunkId),
          pack(this.fmt.chunkSize, uInt32_$1),
          pack(this.fmt.audioFormat, uInt16_),
          pack(this.fmt.numChannels, uInt16_),
          pack(this.fmt.sampleRate, uInt32_$1),
          pack(this.fmt.byteRate, uInt32_$1),
          pack(this.fmt.blockAlign, uInt16_),
          pack(this.fmt.bitsPerSample, uInt16_),
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
          pack(this.fmt.cbSize, uInt16_));
      }
      if (this.fmt.chunkSize > 18) {
        extension = extension.concat(
          pack(this.fmt.validBitsPerSample, uInt16_));
      }
      if (this.fmt.chunkSize > 20) {
        extension = extension.concat(
          pack(this.fmt.dwChannelMask, uInt32_$1));
      }
      if (this.fmt.chunkSize > 24) {
        extension = extension.concat(
          pack(this.fmt.subformat[0], uInt32_$1),
          pack(this.fmt.subformat[1], uInt32_$1),
          pack(this.fmt.subformat[2], uInt32_$1),
          pack(this.fmt.subformat[3], uInt32_$1));
      }
      return extension;
    }

    /**
     * Return the bytes of the 'LIST' chunk.
     * @return {!Array<number>} The 'LIST' chunk bytes.
     * @export for tests
     */
    getLISTBytes_() {
      /** @type {!Array<number>} */
      let bytes = [];
      for (let i=0; i<this.LIST.length; i++) {
        /** @type {!Array<number>} */
        let subChunksBytes = this.getLISTSubChunksBytes_(
            this.LIST[i]['subChunks'], this.LIST[i]['format']);
        bytes = bytes.concat(
          packString(this.LIST[i]['chunkId']),
          pack(subChunksBytes.length + 4, uInt32_$1),
          packString(this.LIST[i]['format']),
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
            packString(subChunks[i]['chunkId']),
            pack(subChunks[i]['value'].length + 1, uInt32_$1),
            this.writeString_(
              subChunks[i]['value'], subChunks[i]['value'].length));
          bytes.push(0);
        } else if (format == 'adtl') {
          if (['labl', 'note'].indexOf(subChunks[i]['chunkId']) > -1) {
            bytes = bytes.concat(
              packString(subChunks[i]['chunkId']),
              pack(
                subChunks[i]['value'].length + 4 + 1, uInt32_$1),
              pack(subChunks[i]['dwName'], uInt32_$1),
              this.writeString_(
                subChunks[i]['value'],
                subChunks[i]['value'].length));
            bytes.push(0);
          } else if (subChunks[i]['chunkId'] == 'ltxt') {
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
        packString(ltxt['chunkId']),
        pack(ltxt['value'].length + 20, uInt32_$1),
        pack(ltxt['dwName'], uInt32_$1),
        pack(ltxt['dwSampleLength'], uInt32_$1),
        pack(ltxt['dwPurposeID'], uInt32_$1),
        pack(ltxt['dwCountry'], uInt16_),
        pack(ltxt['dwLanguage'], uInt16_),
        pack(ltxt['dwLanguage'], uInt16_),
        pack(ltxt['dwCodePage'], uInt16_),
        this.writeString_(ltxt['value'], ltxt['value'].length));
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
          pack(this.junk.chunkData.length, uInt32_$1),
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
      if (this.fmt.audioFormat == 3 && this.fmt.bitsPerSample == 32) {
        this.bitDepth = '32f';
      } else if (this.fmt.audioFormat == 6) {
        this.bitDepth = '8a';
      } else if (this.fmt.audioFormat == 7) {
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
      let junkBytes = this.getJunkBytes_();
      let ds64Bytes = this.getDs64Bytes_();
      let bextBytes = this.getBextBytes_();
      let fmtBytes = this.getFmtBytes_();
      let factBytes = this.getFactBytes_();
      let dataChunkIdBytes = packString(this.data.chunkId);
      let dataChunkLengthBytes = pack(this.data.samples.length, uInt32_$1);
      let cueBytes = this.getCueBytes_();
      let smplBytes = this.getSmplBytes_();
      let LISTBytes = this.getLISTBytes_();
      let fileBodyLength = junkBytes.length + 
        ds64Bytes.length + 
        bextBytes.length + 
        fmtBytes.length + 
        factBytes.length + 
        dataChunkIdBytes.length + 
        dataChunkLengthBytes.length + 
        this.data.samples.length + 
        cueBytes.length + 
        smplBytes.length + 
        LISTBytes.length;
      let file = new Uint8Array(fileBodyLength + 12);
      let index = 0;
      packStringTo(this.container, file, index);
      index += 4;
      packTo(fileBodyLength + 4, uInt32_$1, file, index);
      index += 4;
      packStringTo(this.format, file, index);
      index += 4;
      file.set(junkBytes, index);
      index += junkBytes.length;
      file.set(ds64Bytes, index);
      index += ds64Bytes.length;
      file.set(bextBytes, index);
      index += bextBytes.length;
      file.set(fmtBytes, index);
      index += fmtBytes.length;
      file.set(factBytes, index);
      index += factBytes.length;
      file.set(dataChunkIdBytes, index);
      index += dataChunkIdBytes.length;
      file.set(dataChunkLengthBytes, index);
      index += dataChunkLengthBytes.length;
      file.set(this.data.samples, index);
      index += this.data.samples.length;
      file.set(cueBytes, index);
      index += cueBytes.length;
      file.set(smplBytes, index);
      index += smplBytes.length;
      file.set(LISTBytes, index);
      return file;
    }
  }

  return WaveFile;

})));
