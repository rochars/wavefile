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
 * @fileoverview A function to swap endianness in byte buffers.
 * @see https://github.com/rochars/endianness
 */

/**
 * Swap the byte ordering in a buffer. The buffer is modified in place.
 * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
 * @param {number} offset The byte offset.
 * @param {number=} index The start index. Assumes 0.
 * @param {number=} end The end index. Assumes the buffer length.
 * @throws {Error} If the buffer length is not valid.
 */
function endianness(bytes, offset, index=0, end=bytes.length) {
  if (end % offset) {
    throw new Error("Bad buffer length.");
  }
  for (; index < end; index += offset) {
    swap(bytes, offset, index);
  }
}

/**
 * Swap the byte order of a value in a buffer. The buffer is modified in place.
 * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
 * @param {number} offset The byte offset.
 * @param {number} index The start index.
 * @private
 */
function swap(bytes, offset, index) {
  offset--;
  for(let x = 0; x < offset; x++) {
    /** @type {number|string} */
    let theByte = bytes[index + x];
    bytes[index + x] = bytes[index + offset];
    bytes[index + offset] = theByte;
    offset--;
  }
}

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
 * @fileoverview Pack and unpack two's complement ints and unsigned ints.
 * @see https://github.com/rochars/byte-data
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
     * @private
     */
    this.bits = bits;
    /**
     * If this type it is signed or not.
     * @type {boolean}
     * @private
     */
    this.signed = signed;
    /**
     * The number of bytes used by the data.
     * @type {number}
     * @private
     */
    this.offset = 0;
    /**
     * Min value for numbers of this type.
     * @type {number}
     * @private
     */
    this.min = -Infinity;
    /**
     * Max value for numbers of this type.
     * @type {number}
     * @private
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
 * @see https://github.com/rochars/byte-data
 */

/**
 * Validate that the code is a valid ASCII code.
 * @param {number} code The code.
 * @throws {Error} If the code is not a valid ASCII code.
 */
function validateASCIICode(code) {
  if (code > 127) {
    throw new Error ('Bad ASCII code.');
  }
}

/**
 * Validate that the value is not null or undefined.
 * @param {number} value The value.
 * @throws {Error} If the value is of type undefined.
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
 * Use a Typed Array to check if the host is BE or LE. This will impact
 * on how 64-bit floating point numbers are handled.
 * @type {boolean}
 * @private
 */
const BE_ENV = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
const HIGH = BE_ENV ? 1 : 0;
const LOW = BE_ENV ? 0 : 1;

/**
 * @type {!Int8Array}
 * @private
 */
let int8_ = new Int8Array(8);
/**
 * @type {!Uint32Array}
 * @private
 */
let ui32_ = new Uint32Array(int8_.buffer);
/**
 * @type {!Float32Array}
 * @private
 */
let f32_ = new Float32Array(int8_.buffer);
/**
 * @type {!Float64Array}
 * @private
 */
let f64_ = new Float64Array(int8_.buffer);
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
 * Validate the type and set up the packing/unpacking functions.
 * @param {!Object} theType The type definition.
 * @throws {Error} If the type definition is not valid.
 * @private
 */
function setUp_(theType) {
  validateType(theType);
  theType.offset = theType.bits < 8 ? 1 : Math.ceil(theType.bits / 8);
  theType.be = theType.be || false;
  setReader(theType);
  setWriter(theType);
  gInt_ = new Integer(
    theType.bits == 64 ? 32 : theType.bits,
    theType.float ? false : theType.signed);
}

/**
 * Turn numbers to bytes.
 * @param {number} value The value to be packed.
 * @param {!Object} theType The type definition.
 * @param {!Uint8Array|!Array<number>} buffer The buffer to write the bytes to.
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
  /** @type {number} */
  let int = gInt_.read(bytes, i);
  /** @type {number} */
  let exponent = (int & 0x7C00) >> 10;
  /** @type {number} */
  let fraction = int & 0x03FF;
  /** @type {number} */
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
  ui32_[HIGH] = gInt_.read(bytes, i);
  ui32_[LOW] = gInt_.read(bytes, i + 4);
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
  /** @type {number} */
  let x = ui32_[0];
  /** @type {number} */
  let bits = (x >> 16) & 0x8000;
  /** @type {number} */
  let m = (x >> 12) & 0x07ff;
  /** @type {number} */
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
  j = gInt_.write(bytes, ui32_[HIGH], j);
  return gInt_.write(bytes, ui32_[LOW], j);
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

// ASCII characters
/**
 * Read a string of ASCII characters from a byte buffer.
 * @param {!Uint8Array} bytes A byte buffer.
 * @param {number=} index The index to read.
 * @param {?number=} len The number of bytes to read.
 * @return {string}
 * @throws {Error} If a character in the string is not valid ASCII.
 */
function unpackString(bytes, index=0, len=null) {
  let chrs = '';
  len = len ? index + len : bytes.length;
  while (index < len) {
    validateASCIICode(bytes[index]);
    chrs += String.fromCharCode(bytes[index]);
    index++;
  }
  return chrs;
}

/**
 * Write a string of ASCII characters as a byte buffer.
 * @param {string} str The string to pack.
 * @return {!Array<number>} The next index to write on the buffer.
 * @throws {Error} If a character in the string is not valid ASCII.
 */
function packString(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    validateASCIICode(code);
    bytes[i] = code;
  }
  return bytes;
}

/**
 * Write a string of ASCII characters to a byte buffer.
 * @param {string} str The string to pack.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The index to write in the buffer.
 * @return {number} The next index to write in the buffer.
 * @throws {Error} If a character in the string is not valid ASCII.
 */
function packStringTo(str, buffer, index=0) {
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    validateASCIICode(code);
    buffer[index] = code;
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
  let output = [];
  packTo(value, theType, output);
  return output;
}

/**
 * Pack an array of numbers as a byte buffer.
 * @param {!Array<number>|!TypedArray} values The values.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>} The packed values.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If any of the values are not valid.
 */
function packArray(values, theType) {
  let output = [];
  packArrayTo(values, theType, output);
  return output;
}

/**
 * Pack a number to a byte buffer.
 * @param {number} value The value.
 * @param {!Object} theType The type definition.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
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
 * @param {!Array<number>|!TypedArray} values The value.
 * @param {!Object} theType The type definition.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The buffer index to write.
 * @return {number} The next index to write.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If the value is not valid.
 */
function packArrayTo(values, theType, buffer, index=0) {
  setUp_(theType);
  let be = theType.be;
  let offset = theType.offset;
  let len = values.length;
  for (let i=0; i<len; i++) {
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
 * Unpack a number from a byte buffer.
 * @param {!Uint8Array} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @return {number}
 * @throws {Error} If the type definition is not valid
 */
function unpack(buffer, theType) {
  setUp_(theType);
  let values = unpackArrayFrom(buffer.slice(0, theType.offset), theType);
  return values[0];
}

/**
 * Unpack an array of numbers from a byte buffer.
 * @param {!Uint8Array} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>}
 * @throws {Error} If the type definition is not valid.
 */
function unpackArray(buffer, theType) {
  return unpackArrayFrom(buffer, theType);
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
 * Unpack a array of numbers from a byte buffer by index.
 * @param {!Uint8Array} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} index The start index. Assumes 0.
 * @param {?number=} end The end index. Assumes the buffer length.
 * @return {!Array<number>}
 * @throws {Error} If the type definition is not valid
 */
function unpackArrayFrom(buffer, theType, index=0, end=null) {
  setUp_(theType);
  let len = end || buffer.length;
  while ((len - index) % theType.offset) {
    len--;
  }
  if (theType.be) {
    endianness(buffer, theType.offset, index, len);
  }
  let values = [];
  let step = theType.offset;
  for (let i = index; i < len; i += step) {
    values.push(reader_(buffer, i));
  }
  if (theType.be) {
    endianness(buffer, theType.offset, index, len);
  }
  return values;
}

/**
 * Unpack a array of numbers to a typed array.
 * @param {!Uint8Array} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {!TypedArray} output The output array.
 * @param {number=} index The start index. Assumes 0.
 * @param {?number=} end The end index. Assumes the buffer length.
 * @throws {Error} If the type definition is not valid
 */
function unpackArrayTo(buffer, theType, output, index=0, end=null) {
  setUp_(theType);
  let len = end || buffer.length;
  while ((len - index) % theType.offset) {
    len--;
  }
  if (theType.be) {
    endianness(buffer, theType.offset, index, len);
  }
  let outputIndex = 0;
  let step = theType.offset;
  for (let i = index; i < len; i += step) {
    output.set([reader_(buffer, i)], outputIndex);
    outputIndex++;
  }
  if (theType.be) {
    endianness(buffer, theType.offset, index, len);
  }
}

export { unpackString, packString, packStringTo, pack, packArray, packTo, packArrayTo, unpack, unpackArray, unpackFrom, unpackArrayFrom, unpackArrayTo };
