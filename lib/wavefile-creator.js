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
 * @fileoverview The WaveFileCreator class.
 * @see https://github.com/rochars/wavefile
 */

import { WaveFileParser } from "./wavefile-parser";
import { interleave, deInterleave } from "./parsers/interleave";
import { validateNumChannels } from "./validators/validate-num-channels";
import { validateSampleRate } from "./validators/validate-sample-rate";
import { packArrayTo, unpackArrayTo, packTo, unpack } from "./parsers/binary";
import { MpegReader } from "./mpeg-reader";
/**
 * A class to read, write and create wav files.
 * @extends WaveFileParser
 * @ignore
 */
export class WaveFileCreator extends WaveFileParser {
  constructor() {
    super();
    /**
     * The bit depth code according to the samples.
     * @type {string}
     */
    this.bitDepth = "0";
    /**
     * @type {!{bits: number, be: boolean}}
     * @protected
     */
    this.dataType = { bits: 0, be: false };
    /**
     * Audio formats.
     * Formats not listed here should be set to 65534,
     * the code for WAVE_FORMAT_EXTENSIBLE
     * @enum {number}
     * @protected
     */
    this.WAV_AUDIO_FORMATS = {
      "4": 17,
      "8": 1,
      "8a": 6,
      "8m": 7,
      "16": 1,
      "24": 1,
      "32": 1,
      "32f": 3,
      "64": 3,
      "65535": 80 // mpeg == 80
    };
  }

  /**
   * Set up the WaveFileCreator object based on the arguments passed.
   * Existing chunks are reset.
   * @param {number} numChannels The number of channels.
   * @param {number} sampleRate The sample rate.
   *    Integers like 8000, 44100, 48000, 96000, 192000.
   * @param {string} bitDepthCode The audio bit depth code.
   *    One of '4', '8', '8a', '8m', '16', '24', '32', '32f', '64'
   *    or any value between '8' and '32' (like '12').
   * @param {!(Array|TypedArray)} samples The samples.
   * @param {Object=} options Optional. Used to force the container
   *    as RIFX with {'container': 'RIFX'}
   * @throws {Error} If any argument does not meet the criteria.
   */
  fromScratch(numChannels, sampleRate, bitDepthCode, samples, options) {
    options = options || {};
    // reset all chunks
    this.clearHeaders();
    this.newWavFile_(numChannels, sampleRate, bitDepthCode, samples, options);
  }

  /**
   * Set up the WaveFileCreator object from an mpeg buffer and metadata info.
   * @param {!Uint8Array} mpegBuffer The buffer.
   * @param {Object=} info Mpeg info such as version, layer, bitRate, etc.
   * Required mpeg info:
   * info.version
   * info.layer
   * info.errorProtection
   * info.bitRate
   * info.sampleRate
   * info.padding
   * info.privateBit
   * info.channelMode
   * info.modeExtension
   * info.copyright
   * info.original
   * info.emphasis
   * info.numChannels
   * info.frameSize
   * info.sampleLength
   * @throws {Error} If any argument does not meet the criteria.
   */
  fromMpeg(mpegBuffer, info = null) {
    this.clearHeaders();

    if (info == null) {
      info = new MpegReader(mpegBuffer);
    }

    let codingHistory = this.mpegCodingHistory_(info);

    // riff(4) + fmt(40+8) + mext(12+8) + bxt(602+8+codingHistory.length) + fact(4+8) + buffer.length
    // 4 + 48 + 20 + 610 + 12 + codingHistory.length + buffer.length
    this.container = "RIFF";
    this.chunkSize = 694 + codingHistory.length + mpegBuffer.length;
    this.format = "WAVE";
    this.bitDepth = "65535";

    this.fmt.chunkId = "fmt ";
    this.fmt.chunkSize = 40;
    this.fmt.audioFormat = 80;
    this.fmt.numChannels = info.numChannels;
    this.fmt.sampleRate = info.sampleRate;
    this.fmt.byteRate = (info.bitRate / 8) * 1000;
    this.fmt.blockAlign = info.frameSize;
    this.fmt.bitsPerSample = 65535;
    this.fmt.cbSize = 22;
    this.fmt.headLayer = Math.pow(2, info.layer - 1);
    this.fmt.headBitRate = info.bitRate * 1000;
    this.fmt.headMode = this.mpegHeadMode_(info);
    this.fmt.headModeExt = this.mpegHeadModeExt_(info);
    this.fmt.headEmphasis = info.emphasis + 1;
    this.fmt.headFlags = this.mpegHeadFlags_(info);
    this.fmt.ptsLow = 0;
    this.fmt.ptsHigh = 0;

    this.mext.chunkId = "mext";
    this.mext.chunkSize = 12;
    this.mext.soundInformation = this.mpegSoundInformation_(info);
    this.mext.frameSize = info.frameSize;
    this.mext.ancillaryDataLength = 0;
    this.mext.ancillaryDataDef = 0;
    this.mext.reserved = "";

    this.bext.chunkId = "bext";
    this.bext.chunkSize = 602 + codingHistory.length;
    this.bext.timeReference = [0, 0];
    this.bext.version = 1;
    this.bext.codingHistory = codingHistory;

    this.fact.chunkId = "fact";
    this.fact.chunkSize = 4;
    this.fact.dwSampleLength = info.sampleLength;

    this.data.chunkId = "data";
    this.data.samples = mpegBuffer;
    this.data.chunkSize = this.data.samples.length;
  }

  mpegSoundInformation_(info) {
    let soundInformation = 0;
    if (info.homogeneous) {
      soundInformation += 1;
    }
    if (!info.padding) {
      soundInformation += 2;
    }
    if (
      (info.sampleRate == 44100 || info.sampleRate == 22050) &&
      info.padding
    ) {
      soundInformation += 4;
    }
    if (info.freeForm) {
      soundInformation += 8;
    }
    return soundInformation;
  }

  /**
   * Returns the mode value based on the channel mode of the mpeg file
   * @param {Object=} info Mpeg info such as version, layer, bitRate, etc.
   * @throws {Error} If any argument does not meet the criteria.
   */
  // prettier-ignore
  mpegHeadMode_(info) {
    return {
      "stereo": 1,
      "joint-stereo": 2,
      "dual-mono": 4,
      "mono": 8
    }[info.channelMode];
  }

  /**
   * Contains extra parameters for joint–stereo coding; not used for other modes.
   * @param {Object=} info Mpeg info such as version, layer, bitRate, etc.
   * @throws {Error} If any argument does not meet the criteria.
   */
  mpegHeadModeExt_(info) {
    if (info.channelMode == "joint-stereo") {
      return Math.pow(2, info.modeExtension);
    } else {
      return 0;
    }
  }

  /**
   * Follows EBU established standards for CodingHistory for MPEG
   * EBU Technical Recommendation R98-1999, https://tech.ebu.ch/docs/r/r098.pdf
   * @param {Object=} info Mpeg info such as version, layer, bitRate, etc.
   * @throws {Error} If any argument does not meet the criteria.
   **/
  mpegCodingHistory_(info) {
    return (
      "A=MPEG" +
      info.version +
      "L" +
      info.layer +
      ",F=" +
      info.sampleRate +
      ",B=" +
      info.bitRate +
      ",M=" +
      info.channelMode +
      ",T=wavefile\r\n\0\0"
    );
  }

  /**
   * Follows EBU standards for `fmt` chunk `fwHeadFlags` for MPEG in BWF
   * EBU Tech. 3285–E – Supplement 1, 1997
   * https://tech.ebu.ch/docs/tech/tech3285s1.pdf
   * @param {Object=} info Mpeg info such as version, layer, bitRate, etc.
   * @throws {Error} If any argument does not meet the criteria.
   **/
  mpegHeadFlags_(info) {
    let flags = 0;
    if (info.privateBit) {
      flags += 1;
    }
    if (info.copyright) {
      flags += 2;
    }
    if (info.original) {
      flags += 4;
    }
    if (info.errorProtection) {
      flags += 8;
    }
    if (info.version > 0) {
      flags += 16;
    }
    return flags;
  }

  /**
   * Set up the WaveFileParser object from a byte buffer.
   * @param {!Uint8Array} wavBuffer The buffer.
   * @param {boolean=} [samples=true] True if the samples should be loaded.
   * @throws {Error} If container is not RIFF, RIFX or RF64.
   * @throws {Error} If format is not WAVE.
   * @throws {Error} If no 'fmt ' chunk is found.
   * @throws {Error} If no 'data' chunk is found.
   */
  fromBuffer(wavBuffer, samples = true) {
    super.fromBuffer(wavBuffer, samples);
    this.bitDepthFromFmt_();
    this.updateDataType_();
  }

  /**
   * Return a byte buffer representig the WaveFileParser object as a .wav file.
   * The return value of this method can be written straight to disk.
   * @return {!Uint8Array} A wav file.
   * @throws {Error} If bit depth is invalid.
   * @throws {Error} If the number of channels is invalid.
   * @throws {Error} If the sample rate is invalid.
   */
  toBuffer() {
    this.validateWavHeader_();
    return super.toBuffer();
  }

  /**
   * Return the samples packed in a Float64Array.
   * @param {boolean=} [interleaved=false] True to return interleaved samples,
   *   false to return the samples de-interleaved.
   * @param {Function=} [OutputObject=Float64Array] The sample container.
   * @return {!(Array|TypedArray)} the samples.
   */
  getSamples(interleaved = false, OutputObject = Float64Array) {
    /**
     * A Float64Array created with a size to match the
     * the length of the samples.
     * @type {!(Array|TypedArray)}
     */
    let samples = new OutputObject(
      this.data.samples.length / (this.dataType.bits / 8)
    );
    // Unpack all the samples
    unpackArrayTo(
      this.data.samples,
      this.dataType,
      samples,
      0,
      this.data.samples.length
    );
    if (!interleaved && this.fmt.numChannels > 1) {
      return deInterleave(samples, this.fmt.numChannels, OutputObject);
    }
    return samples;
  }

  /**
   * Return the sample at a given index.
   * @param {number} index The sample index.
   * @return {number} The sample.
   * @throws {Error} If the sample index is off range.
   */
  getSample(index) {
    index = index * (this.dataType.bits / 8);
    if (index + this.dataType.bits / 8 > this.data.samples.length) {
      throw new Error("Range error");
    }
    return unpack(
      this.data.samples.slice(index, index + this.dataType.bits / 8),
      this.dataType
    );
  }

  /**
   * Set the sample at a given index.
   * @param {number} index The sample index.
   * @param {number} sample The sample.
   * @throws {Error} If the sample index is off range.
   */
  setSample(index, sample) {
    index = index * (this.dataType.bits / 8);
    if (index + this.dataType.bits / 8 > this.data.samples.length) {
      throw new Error("Range error");
    }
    packTo(sample, this.dataType, this.data.samples, index, true);
  }

  /**
   * Return the value of the iXML chunk.
   * @return {string} The contents of the iXML chunk.
   */
  getiXML() {
    return this.iXML.value;
  }

  /**
   * Set the value of the iXML chunk.
   * @param {string} iXMLValue The value for the iXML chunk.
   * @throws {TypeError} If the value is not a string.
   */
  setiXML(iXMLValue) {
    if (typeof iXMLValue !== "string") {
      throw new TypeError("iXML value must be a string.");
    }
    this.iXML.value = iXMLValue;
    this.iXML.chunkId = "iXML";
  }

  /**
   * Get the value of the _PMX chunk.
   * @return {string} The contents of the _PMX chunk.
   */
  get_PMX() {
    return this._PMX.value;
  }

  /**
   * Set the value of the _PMX chunk.
   * @param {string} _PMXValue The value for the _PMX chunk.
   * @throws {TypeError} If the value is not a string.
   */
  set_PMX(_PMXValue) {
    if (typeof _PMXValue !== "string") {
      throw new TypeError("_PMX value must be a string.");
    }
    this._PMX.value = _PMXValue;
    this._PMX.chunkId = "_PMX";
  }

  /**
   * Set up the WaveFileCreator object based on the arguments passed.
   * @param {number} numChannels The number of channels.
   * @param {number} sampleRate The sample rate.
   *   Integers like 8000, 44100, 48000, 96000, 192000.
   * @param {string} bitDepthCode The audio bit depth code.
   *   One of '4', '8', '8a', '8m', '16', '24', '32', '32f', '64'
   *   or any value between '8' and '32' (like '12').
   * @param {!(Array|TypedArray)} samples The samples.
   * @param {Object} options Used to define the container.
   * @throws {Error} If any argument does not meet the criteria.
   * @private
   */
  newWavFile_(numChannels, sampleRate, bitDepthCode, samples, options) {
    if (!options.container) {
      options.container = "RIFF";
    }
    this.container = options.container;
    this.bitDepth = bitDepthCode;
    samples = interleave(samples);
    this.updateDataType_();
    /** @type {number} */
    let numBytes = this.dataType.bits / 8;
    this.data.samples = new Uint8Array(samples.length * numBytes);
    packArrayTo(samples, this.dataType, this.data.samples, 0, true);
    this.makeWavHeader_(
      bitDepthCode,
      numChannels,
      sampleRate,
      numBytes,
      this.data.samples.length,
      options
    );
    this.data.chunkId = "data";
    this.data.chunkSize = this.data.samples.length;
    this.validateWavHeader_();
  }

  /**
   * Define the header of a wav file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  makeWavHeader_(
    bitDepthCode,
    numChannels,
    sampleRate,
    numBytes,
    samplesLength,
    options
  ) {
    if (bitDepthCode == "4") {
      this.createADPCMHeader_(
        bitDepthCode,
        numChannels,
        sampleRate,
        numBytes,
        samplesLength,
        options
      );
    } else if (bitDepthCode == "8a" || bitDepthCode == "8m") {
      this.createALawMulawHeader_(
        bitDepthCode,
        numChannels,
        sampleRate,
        numBytes,
        samplesLength,
        options
      );
    } else if (
      Object.keys(this.WAV_AUDIO_FORMATS).indexOf(bitDepthCode) == -1 ||
      numChannels > 2
    ) {
      this.createExtensibleHeader_(
        bitDepthCode,
        numChannels,
        sampleRate,
        numBytes,
        samplesLength,
        options
      );
    } else {
      this.createPCMHeader_(
        bitDepthCode,
        numChannels,
        sampleRate,
        numBytes,
        samplesLength,
        options
      );
    }
  }

  /**
   * Create the header of a linear PCM wave file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  createPCMHeader_(
    bitDepthCode,
    numChannels,
    sampleRate,
    numBytes,
    samplesLength,
    options
  ) {
    this.container = options.container;
    this.chunkSize = 36 + samplesLength;
    this.format = "WAVE";
    this.bitDepth = bitDepthCode;
    this.fmt = {
      chunkId: "fmt ",
      chunkSize: 16,
      audioFormat: this.WAV_AUDIO_FORMATS[bitDepthCode] || 65534,
      numChannels: numChannels,
      sampleRate: sampleRate,
      byteRate: numChannels * numBytes * sampleRate,
      blockAlign: numChannels * numBytes,
      bitsPerSample: parseInt(bitDepthCode, 10),
      cbSize: 0,
      validBitsPerSample: 0,
      dwChannelMask: 0,
      subformat: []
    };
  }

  /**
   * Create the header of a ADPCM wave file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  createADPCMHeader_(
    bitDepthCode,
    numChannels,
    sampleRate,
    numBytes,
    samplesLength,
    options
  ) {
    this.createPCMHeader_(
      bitDepthCode,
      numChannels,
      sampleRate,
      numBytes,
      samplesLength,
      options
    );
    this.chunkSize = 40 + samplesLength;
    this.fmt.chunkSize = 20;
    this.fmt.byteRate = 4055;
    this.fmt.blockAlign = 256;
    this.fmt.bitsPerSample = 4;
    this.fmt.cbSize = 2;
    this.fmt.validBitsPerSample = 505;
    this.fact = {
      chunkId: "fact",
      chunkSize: 4,
      dwSampleLength: samplesLength * 2
    };
  }

  /**
   * Create the header of WAVE_FORMAT_EXTENSIBLE file.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  createExtensibleHeader_(
    bitDepthCode,
    numChannels,
    sampleRate,
    numBytes,
    samplesLength,
    options
  ) {
    this.createPCMHeader_(
      bitDepthCode,
      numChannels,
      sampleRate,
      numBytes,
      samplesLength,
      options
    );
    this.chunkSize = 36 + 24 + samplesLength;
    this.fmt.chunkSize = 40;
    this.fmt.bitsPerSample = ((parseInt(bitDepthCode, 10) - 1) | 7) + 1;
    this.fmt.cbSize = 22;
    this.fmt.validBitsPerSample = parseInt(bitDepthCode, 10);
    this.fmt.dwChannelMask = dwChannelMask_(numChannels);
    // subformat 128-bit GUID as 4 32-bit values
    // only supports uncompressed integer PCM samples
    this.fmt.subformat = [1, 1048576, 2852126848, 1905997824];
  }

  /**
   * Create the header of mu-Law and A-Law wave files.
   * @param {string} bitDepthCode The audio bit depth
   * @param {number} numChannels The number of channels
   * @param {number} sampleRate The sample rate.
   * @param {number} numBytes The number of bytes each sample use.
   * @param {number} samplesLength The length of the samples in bytes.
   * @param {!Object} options The extra options, like container defintion.
   * @private
   */
  createALawMulawHeader_(
    bitDepthCode,
    numChannels,
    sampleRate,
    numBytes,
    samplesLength,
    options
  ) {
    this.createPCMHeader_(
      bitDepthCode,
      numChannels,
      sampleRate,
      numBytes,
      samplesLength,
      options
    );
    this.chunkSize = 40 + samplesLength;
    this.fmt.chunkSize = 20;
    this.fmt.cbSize = 2;
    this.fmt.validBitsPerSample = 8;
    this.fact = {
      chunkId: "fact",
      chunkSize: 4,
      dwSampleLength: samplesLength
    };
  }

  /**
   * Set the string code of the bit depth based on the 'fmt ' chunk.
   * @private
   */
  bitDepthFromFmt_() {
    if (this.fmt.audioFormat === 3 && this.fmt.bitsPerSample === 32) {
      this.bitDepth = "32f";
    } else if (this.fmt.audioFormat === 6) {
      this.bitDepth = "8a";
    } else if (this.fmt.audioFormat === 7) {
      this.bitDepth = "8m";
    } else if (this.fmt.audioFormat === 80) {
      this.bitDepth = "65535";
    } else {
      this.bitDepth = this.fmt.bitsPerSample.toString();
    }
  }

  /**
   * Validate the bit depth.
   * @return {boolean} True is the bit depth is valid.
   * @throws {Error} If bit depth is invalid.
   * @private
   */
  validateBitDepth_() {
    if (!this.WAV_AUDIO_FORMATS[this.bitDepth]) {
      if (parseInt(this.bitDepth, 10) > 8 && parseInt(this.bitDepth, 10) < 54) {
        return true;
      }
      throw new Error("Invalid bit depth.");
    }
    return true;
  }

  /**
   * Update the type definition used to read and write the samples.
   * @private
   */
  updateDataType_() {
    this.dataType = {
      bits: ((parseInt(this.bitDepth, 10) - 1) | 7) + 1,
      fp: this.bitDepth == "32f" || this.bitDepth == "64",
      signed: this.bitDepth != "8",
      be: this.container == "RIFX"
    };
    if (["4", "8a", "8m"].indexOf(this.bitDepth) > -1) {
      this.dataType.bits = 8;
      this.dataType.signed = false;
    }
  }

  /**
   * Validate the header of the file.
   * @throws {Error} If bit depth is invalid.
   * @throws {Error} If the number of channels is invalid.
   * @throws {Error} If the sample rate is invalid.
   * @ignore
   * @private
   */
  validateWavHeader_() {
    this.validateBitDepth_();
    if (!validateNumChannels(this.fmt.numChannels, this.fmt.bitsPerSample)) {
      throw new Error("Invalid number of channels.");
    }
    if (
      !validateSampleRate(
        this.fmt.numChannels,
        this.fmt.bitsPerSample,
        this.fmt.sampleRate
      )
    ) {
      throw new Error("Invalid sample rate.");
    }
  }
}

/**
 * Return the value for dwChannelMask according to the number of channels.
 * @param {number} numChannels the number of channels.
 * @return {number} the dwChannelMask value.
 * @private
 */
function dwChannelMask_(numChannels) {
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
    mask = 0x3f;
    // 7.1 = FL, FR, FC, LF, BL, BR, SL, SR
  } else if (numChannels === 8) {
    mask = 0x63f;
  }
  return mask;
}
