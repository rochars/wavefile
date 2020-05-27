/*
 * Copyright (c) 2020 Andrew Kuklewicz
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
 * @fileoverview The MpegReader class.
 * @see https://github.com/rochars/wavefile
 */

import { unpackString, unpack } from "./parsers/binary";

/**
 * A class to perform low-level reading of mpeg audio files.
 */
export class MpegReader {
  constructor(mpegBuffer) {
    /**
     * @type {number}
     * @protected
     */
    this.head = 0;

    // Header values
    /**
     * @type {number}
     */
    this.version = 0;
    /**
     * @type {number}
     */
    this.layer = 0;
    /**
     * @type {boolean}
     */
    this.errorProtection = false;
    /**
     * @type {number}
     */
    this.bitRate = 0;
    /**
     * @type {number}
     */
    this.sampleRate = 0;
    /**
     * @type {boolean}
     */
    this.padding = false;
    /**
     * @type {boolean}
     */
    this.privateBit = false;
    /**
     * @type {string}
     */
    this.channelMode = "";
    /**
     * @type {number}
     */
    this.modeExtension = 0;
    /**
     * @type {boolean}
     */
    this.copyright = false;
    /**
     * @type {boolean}
     */
    this.original = false;
    /**
     * @type {number}
     */
    this.emphasis = 0;

    // Calculated
    /**
     * @type {number}
     */
    this.numChannels = 0;
    /**
     * @type {number}
     */
    this.id3v2Offset = 0;
    /**
     * @type {number}
     */
    this.samplesPerFrame = 0;
    /**
     * @type {number}
     */
    this.frameSize = 0;
    /**
     * @type {number}
     */
    this.sampleLength = 0;
    /**
     * @type {number}
     */
    this.durationEstimate = 0.0;
    /**
     * @type {boolean}
     */
    this.homogeneous = true;
    /**
     * @type {boolean}
     */
    this.freeForm = false;

    this.uInt32BE = { bits: 32, be: true };

    // Constants & Lookups
    /** MPEG Versions
     00: MPEG Version 2.5 (unofficial)
     01: (reserved)
     10: MPEG Version 2 (ISO/IEC 13818-3)
     11: MPEG Version 1 (ISO/IEC 11172-3)
    */
    this.VERSIONS = [2.5, null, 2, 1];

    /** MPEG Layers
     00: (reserved)
     01: Layer III (i.e. mp3 files)
     10: Layer II (i.e. mp2 files)
     11: Layer I
    */
    this.LAYERS = [0, 3, 2, 1];

    /**
     * Sample rate table:
     * the sample rate value is calculated based on the mpeg version
     */
    this.CHANNEL_MODES = ["stereo", "joint-stereo", "dual-mono", "mono"];

    /**
     * Samples per frame table:
     * the number of samples per frame is calculated based on the mpeg version and layer
     */
    this.SAMPLES_PER_FRAME = {
      1: { 0: 0, 1: 384, 2: 1152, 3: 1152 },
      2: { 0: 0, 1: 384, 2: 1152, 3: 576 }
    };

    /**
     * Bitrates table:
     * the bitRate value is calculated based on the mpeg version and layer
     */
    // prettier-ignore
    this.BITRATES = {
      1: {
        1: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0],
        2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 0],
        3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
        4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      2: {
        1: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0],
        2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
        3: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
        4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    };

    /**
     * Sample rate table:
     * the sample rate value is calculated based on the mpeg version
     */
    this.SAMPLE_RATES = {
      1: [44100, 48000, 32000, 0],
      2: [22050, 24000, 16000, 0]
    };

    if (mpegBuffer) {
      this.fromBuffer(mpegBuffer);
    }
  }

  /**
   * Set up the MpegReader object from an mpeg byte buffer.
   * @param {!Uint8Array} mpegBuffer The buffer.
   * @throws {Error} If format is not mpeg.
   */
  fromBuffer(mpegBuffer) {
    this.findFirstFrame_(mpegBuffer);
    this.parseFrame_(mpegBuffer);
  }

  /**
   * Find the first mpeg frame, skipping id3 and other garbage, looking for 11111111 111
   * @param {!Uint8Array} buffer The buffer.
   * @throws {Error} If format is not mpeg.
   */
  findFirstFrame_(buffer) {
    this.id3v2Offset = this.skipId3_(buffer);
    this.head += this.id3v2Offset;

    // b[0] should be 11111111 == 255 (0xff)
    // b[1] should be 111????? >  128 + 64 + 32 > 224 (0xe0)
    while (this.head + 4 < buffer.length) {
      let b = [buffer[this.head], buffer[this.head + 1]];
      if (b[0] == 0xff && (b[1] & 0xe0) == 0xe0) {
        break;
      } else {
        this.head += b[1] == 0xff ? 1 : 2;
      }
    }
    return this.head;
  }

  /**
   * Skip any id3 or other data at the start of the file
   * @param {!Uint8Array} buffer The buffer.
   * @throws {Error} If format is not mpeg.
   */
  skipId3_(buffer) {
    let offset = 0;
    // http://id3.org/d3v2.3.0
    if (unpackString(buffer, 0, 3) == "ID3") {
      // Decode bytes 6-9 as a 32-bit "synchsafe int" (refer to any ID3v2 spec).
      let tagSizeBuffer = buffer.subarray(6, 10);
      let tagSize = unsynchsafe(unpack(tagSizeBuffer, this.uInt32BE, 0));

      offset = 10 + tagSize;
      // If the 0x10 bit of byte 5 is set, let OFFSET = OFFSET + 10 (for the footer).
      if (isBitSet(buffer[5], 2)) {
        offset += 10;
      }
    }
    return offset;
  }

  /**
   * Parse the header and calculate derived values
   * @param {!Uint8Array} buffer The buffer.
   * @throws {Error} If format is not mpeg.
   */
  parseFrame_(buffer) {
    this.parseHeader_(buffer);
    this.numChannels = this.channelMode == "mono" ? 1 : 2;
    this.samplesPerFrame = this.SAMPLES_PER_FRAME[this.version][this.layer];
    this.frameSize = this.frameSizeCalc_();
    this.sampleLength = this.sampleLengthCalc_(buffer);
    this.durationEstimate = this.durationEstimateCalc_(buffer);
  }

  durationEstimateCalc_(buffer) {
    return (buffer.length - this.id3v2Offset) / ((this.bitRate * 1000) / 8);
  }

  sampleLengthCalc_(buffer) {
    let fs = Math.floor((buffer.length - this.id3v2Offset) / this.frameSize);
    return fs * this.samplesPerFrame;
  }

  frameSizeCalc_() {
    return this.mpegFrameSizeCalc(
      this.samplesPerFrame,
      this.layer,
      this.bitRate,
      this.sampleRate,
      this.padding
    );
  }

  // version from ruby code
  mpegFrameSizeCalc(samplesPerFrame, layer, bitRate, sampleRate, padding) {
    var byteRate = (bitRate * 1000) / 8;
    var pad = (padding ? 1 : 0) * (layer == 1 ? 4 : 1);
    return ((samplesPerFrame * byteRate) / sampleRate + pad) | 0;
  }

  // http://mpgedit.org/mpgedit/mpeg_format/mpeghdr.htm
  parseHeader_(buffer) {
    let h = [];
    for (let i = 0; i < 4; i++) {
      h[i] = this.readUInt8(buffer);
    }

    // Validate the frane sync
    if (h[0] !== 0xff || (h[1] & 0xe0) !== 0xe0) {
      throw new Error(`Invalid frame header: [255, 224] != [${h[0]}, ${h[1]}]`);
    }

    // Byte 0: `AAAAAAAA`
    // `AAAAAAAA` | 8 | (32-24) | Frame sync, part I (all bits set)

    // Byte 1: `AAABBCCD`
    // `AAA.....` | 3 | (23,21)	| Frame sync part II (3 bits set)
    // `...BB...` | 2 | (20,19)	| MPEG Audio version ID (11 -> MPEG Version 1 (ISO/IEC 11172-3))
    // `.....CC.` | 2	| (18,17)	| Layer description
    // `.......D` | 1 |    (16) | Protection bit | 0 - Protected by CRC, 1 - Not protected
    this.version = this.VERSIONS[(h[1] >> 3) & 0x03];
    this.layer = this.LAYERS[(h[1] >> 1) & 0x03];
    this.errorProtection = !isBitSet(h[1], 1);

    // Byte 2: `EEEEFFGH`
    // `EEEE....` | 4 | (15,12) | Bitrate index
    // `....FF..` | 2 | (11,10) | Sampling rate frequency index (values are in Hz)
    // `......G.` | 1 |     (9) | Padding bit, 0 - frame is not padded, 1 - frame is padded with one extra slot
    // `.......H` | 1 |     (8) | Private bit. This is informative
    this.bitRate = this.BITRATES[this.version][this.layer][(h[2] >> 4) & 0x0f];
    this.sampleRate = this.SAMPLE_RATES[this.version][(h[2] >> 2) & 0x03];
    this.padding = isBitSet(h[2], 2);
    this.privateBit = isBitSet(h[2], 1);

    // Byte 3: `IIJJKLMM`
    // `II......` | 2 |   (7,6) | Channel Mode
    // `..JJ....` | 2 |   (5,4) | Mode extension (Only if Joint stereo)
    // `....K...` | 1 |     (3) | Copyright
    // `.....L..` | 1 |     (2) | Original
    // `......MM` | 2 |   (1,0) | Emphasis
    this.channelMode = this.CHANNEL_MODES[(h[3] >> 6) & 0x03];
    this.modeExtension = (h[3] >> 6) & 0x03;
    this.copyright = isBitSet(h[3], 4);
    this.original = isBitSet(h[3], 3);
    this.emphasis = h[3] & 0x03;
  }

  /**
   * Read a number from a chunk.
   * @param {!Uint8Array} bytes The chunk bytes.
   * @return {number} The number.
   * @protected
   */
  readUInt8(bytes) {
    let value = bytes[this.head];
    this.head += 1;
    return value;
  }
}

/**
 * Decodes a sync-safe integer
 * @param {number} i sync-safe integer
 * @return {number} un-sync-safe integer
 */
export function unsynchsafe(i) {
  let mask = 0x7f000000;
  let out = 0;

  while (mask) {
    out >>= 1;
    out |= i & mask;
    mask >>= 8;
  }
  return out;
}

/**
 * Returns
 * @param {number} n integer to look for a bit set
 * @param {number} b position of the bit to check
 * @return {boolean} True if the bit is set
 */
function isBitSet(n, b) {
  return n & (1 << (b - 1)) ? true : false;
}
