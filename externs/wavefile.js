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
 * @fileoverview Externs for wavefile 11.0
 * @see https://github.com/rochars/wavefile
 * @externs
 */

// wavefile module
var wavefile = {};

// WaveFile class
var WaveFile = {};

/**
 * The container identifier.
 * RIFF, RIFX and RF64 are supported.
 * @type {string}
 */
WaveFile.prototype.container = '';
/**
 * @type {number}
 */
WaveFile.prototype.chunkSize = 0;
/**
 * The format.
 * Always WAVE.
 * @type {string}
 */
WaveFile.prototype.format = '';
/**
 * The data of the fmt chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.fmt = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {number} */
  audioFormat: 0,
  /** @type {number} */
  numChannels: 0,
  /** @type {number} */
  sampleRate: 0,
  /** @type {number} */
  byteRate: 0,
  /** @type {number} */
  blockAlign: 0,
  /** @type {number} */
  bitsPerSample: 0,
  /** @type {number} */
  cbSize: 0,
  /** @type {number} */
  validBitsPerSample: 0,
  /** @type {number} */
  dwChannelMask: 0,
  /**
   * 4 32-bit values representing a 128-bit ID
   * @type {!Array<number>}
   */
  subformat: []
};
/**
 * The data of the fact chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.fact = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {number} */
  dwSampleLength: 0
};
/**
 * The data of the cue  chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.cue = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {number} */
  dwCuePoints: 0,
  /** @type {!Array<!Object>} */
  points: [{
    dwName: 0, // a cue point ID
    dwPosition: 0,
    fccChunk: 0,
    dwChunkStart: 0,
    dwBlockStart: 0,
    dwSampleOffset: 0,
    position: 0
  }],
};
/**
 * The data of the smpl chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.smpl = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {number} */
  dwManufacturer: 0,
  /** @type {number} */
  dwProduct: 0,
  /** @type {number} */
  dwSamplePeriod: 0,
  /** @type {number} */
  dwMIDIUnityNote: 0,
  /** @type {number} */
  dwMIDIPitchFraction: 0,
  /** @type {number} */
  dwSMPTEFormat: 0,
  /** @type {number} */
  dwSMPTEOffset: 0,
  /** @type {number} */
  dwNumSampleLoops: 0,
  /** @type {number} */
  dwSamplerData: 0,
  /** @type {!Array<!Object>} */
  loops: [
    {
      dwName: '', // a cue point ID
      dwType: 0,
      dwStart: 0,
      dwEnd: 0,
      dwFraction: 0,
      dwPlayCount: 0
    }
  ],
};
/**
 * The data of the bext chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.bext = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {string} */
  description: '',
  /** @type {string} */
  originator: '',
  /** @type {string} */
  originatorReference: '',
  /** @type {string} */
  originationDate: '',
  /** @type {string} */
  originationTime: '',
  /**
   * 2 32-bit values, timeReference high and low
   * @type {!Array<number>}
   */
  timeReference: [0, 0],
  /** @type {number} */
  version: 0,
  /** @type {string} */
  UMID: '',
  /** @type {number} */
  loudnessValue: 0,
  /** @type {number} */
  loudnessRange: 0,
  /** @type {number} */
  maxTruePeakLevel: 0,
  /** @type {number} */
  maxMomentaryLoudness: 0,
  /** @type {number} */
  maxShortTermLoudness: 0,
  /** @type {string} */
  reserved: '',
  /** @type {string} */
  codingHistory: ''
};
/**
 * The data of the iXML chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.iXML = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {number} */
  value: 0
};
/**
 * The data of the ds64 chunk.
 * Used only with RF64 files.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.ds64 = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {number} */
  riffSizeHigh: 0,
  /** @type {number} */
  riffSizeLow: 0,
  /** @type {number} */
  dataSizeHigh: 0,
  /** @type {number} */
  dataSizeLow: 0,
  /** @type {number} */
  originationTime: 0,
  /** @type {number} */
  sampleCountHigh: 0,
  /** @type {number} */
  sampleCountLow: 0
};
/**
 * The data of the data chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.data = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {!Uint8Array} */
  samples: null //
};
/**
 * The data of the LIST chunks.
 * @type {!Array<!Object>}
 */
WaveFile.prototype.LIST = [
  {
    chunkId: '',
    chunkSize: 0,
    format: '',
    subChunks: [
      // For format 'INFO'
      {
        chunkId: '',
        chunkSize: 0,
        value: ''
      },
      // For format 'adtl' types 'labl' or 'note'
      {
        chunkId: '',
        chunkSize: 0,
        dwName: 0,
        value: ''
      },
      // For format 'adtl' type 'ltxt'
      {
        chunkId: '',
        value: 0,
        dwName: 0,
        dwSampleLength: 0,
        dwPurposeID: 0,
        dwCountry: 0,
        dwLanguage: 0,
        dwDialect: 0,
        dwCodePage: 0
      }
    ]
  }
];
/**
 * The data of the junk chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype.junk = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {!Array<number>} */
  chunkData: []
};
/**
 * The data of the _PMX chunk.
 * @type {!Object<string, *>}
 */
WaveFile.prototype._PMX = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {number} */
  value: 0
};
/**
 * The bit depth code according to the samples.
 * @type {string}
 */
WaveFile.prototype.bitDepth = '';

/**
 * Return the samples packed in a Float64Array.
 * @param {boolean=} [interleaved=false] True to return interleaved samples,
 *   false to return the samples de-interleaved.
 * @param {Function=} [OutputObject=Float64Array] The sample container.
 * @return {!(Array|TypedArray)} the samples.
 */
WaveFile.prototype.getSamples = function(
  interleaved=false,
  OutputObject=Float64Array) {};

/**
 * Return the sample at a given index.
 * @param {number} index The sample index.
 * @return {number} The sample.
 * @throws {Error} If the sample index is off range.
 */
WaveFile.prototype.getSample = function(index) {};

/**
 * Set the sample at a given index.
 * @param {number} index The sample index.
 * @param {number} sample The sample.
 * @throws {Error} If the sample index is off range.
 */
WaveFile.prototype.setSample = function(index, sample) {};

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
WaveFile.prototype.fromScratch = function(
  numChannels, sampleRate, bitDepthCode, samples, options={
    container:'RIFF'}) {};

/**
 * Set up the WaveFileParser object from a byte buffer.
 * @param {!Uint8Array} wavBuffer The buffer.
 * @param {boolean=} [samples=true] True if the samples should be loaded.
 * @throws {Error} If container is not RIFF, RIFX or RF64.
 * @throws {Error} If format is not WAVE.
 * @throws {Error} If no 'fmt ' chunk is found.
 * @throws {Error} If no 'data' chunk is found.
 */
WaveFile.prototype.fromBuffer = function(wavBuffer, samples=true) {};

/**
 * Return a byte buffer representig the WaveFileParser object as a .wav file.
 * The return value of this method can be written straight to disk.
 * @return {!Uint8Array} A wav file.
 * @throws {Error} If bit depth is invalid.
 * @throws {Error} If the number of channels is invalid.
 * @throws {Error} If the sample rate is invalid.
 */
WaveFile.prototype.toBuffer = function() {};

/**
 * Use a .wav file encoded as a base64 string to load the WaveFile object.
 * @param {string} base64String A .wav file as a base64 string.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.prototype.fromBase64 = function(base64String) {};

/**
 * Return a base64 string representig the WaveFile object as a .wav file.
 * @return {string} A .wav file as a base64 string.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.prototype.toBase64 = function() {};

/**
 * Return a DataURI string representig the WaveFile object as a .wav file.
 * The return of this method can be used to load the audio in browsers.
 * @return {string} A .wav file as a DataURI.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.prototype.toDataURI = function() {};

/**
 * Use a .wav file encoded as a DataURI to load the WaveFile object.
 * @param {string} dataURI A .wav file as DataURI.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.prototype.fromDataURI = function(dataURI) {};

/**
 * Force a file as RIFF.
 */
WaveFile.prototype.toRIFF = function() {};

/**
 * Force a file as RIFX.
 */
WaveFile.prototype.toRIFX = function() {};

/**
 * Change the bit depth of the samples.
 * @param {string} newBitDepth The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats)
 * @param {boolean=} [changeResolution=true] A boolean indicating if the
 *    resolution of samples should be actually changed or not.
 * @throws {Error} If the bit depth is not valid.
 */
WaveFile.prototype.toBitDepth = function(newBitDepth, changeResolution=true) {};

/**
 * Convert the sample rate of the file.
 * @param {number} sampleRate The target sample rate.
 * @param {Object=} options The extra configuration, if needed.
 */
WaveFile.prototype.toSampleRate = function(
  sampleRate, options= {
    method: 'cubic',
    clip: 'mirror',
    tension: 0,
    sincFilterSize: 32,
    lanczosFilterSize: 24,
    sincWindow: function(x){},
    LPF: true,
    LPFType: 'IIR',
    LPForder: 1}) {};

/**
 * Encode a 16-bit wave file as 4-bit IMA ADPCM.
 * @throws {Error} If sample rate is not 8000.
 * @throws {Error} If number of channels is not 1.
 */
WaveFile.prototype.toIMAADPCM = function() {};

/**
 * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
 * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats).
 */
WaveFile.prototype.fromIMAADPCM = function(bitDepthCode='16') {};

/**
 * Encode 16-bit wave file as 8-bit A-Law.
 */
WaveFile.prototype.toALaw = function() {};

/**
 * Decode a 8-bit A-Law wave file into a 16-bit wave file.
 * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats).
 */
WaveFile.prototype.fromALaw = function(bitDepthCode='16') {};

/**
 * Encode 16-bit wave file as 8-bit mu-Law.
 */
WaveFile.prototype.toMuLaw = function() {};

/**
 * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
 * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats).
 */
WaveFile.prototype.fromMuLaw = function(bitDepthCode='16') {};

/**
 * Write a RIFF tag in the INFO chunk. If the tag do not exist,
 * then it is created. It if exists, it is overwritten.
 * @param {string} tag The tag name.
 * @param {string} value The tag value.
 * @throws {Error} If the tag name is not valid.
 */
WaveFile.prototype.setTag = function(tag, value) {};

/**
 * Return the value of a RIFF tag in the INFO chunk.
 * @param {string} tag The tag name.
 * @return {?string} The value if the tag is found, null otherwise.
 */
WaveFile.prototype.getTag = function(tag) {};

/**
 * Remove a RIFF tag in the INFO chunk.
 * @param {string} tag The tag name.
 * @return {boolean} True if a tag was deleted.
 */
WaveFile.prototype.deleteTag = function(tag) {};

/**
 * Create a cue point in the wave file.
 * @param {!{
 *   position: number,
 *   label: ?string,
 *   end: ?number,
 *   dwPurposeID: ?number,
 *   dwCountry: ?number,
 *   dwLanguage: ?number,
 *   dwDialect: ?number,
 *   dwCodePage: ?number
 * }} pointData A object with the data of the cue point.
 */
WaveFile.prototype.setCuePoint = function(pointData) {};

/**
 * Remove a cue point from a wave file.
 * @param {number} index the index of the point. First is 1,
 *      second is 2, and so on.
 */
WaveFile.prototype.deleteCuePoint = function(index) {};

/**
 * Update the label of a cue point.
 * @param {number} pointIndex The ID of the cue point.
 * @param {string} label The new text for the label.
 */
WaveFile.prototype.updateLabel = function(pointIndex, label) {};

/**
 * Return a Object<tag, value> with the RIFF tags in the file.
 * @return {!Object<string, string>} The file tags.
 */
WaveFile.prototype.listTags = function() {};

/**
 * Return an array with all cue points in the file, in the order they appear
 * in the file.
 * Objects representing cue points/regions look like this:
 *   {
 *     position: 500, // the position in milliseconds
 *     label: 'cue marker 1',
 *     end: 1500, // the end position in milliseconds
 *     dwName: 1,
 *     dwPosition: 0,
 *     fccChunk: 'data',
 *     dwChunkStart: 0,
 *     dwBlockStart: 0,
 *     dwSampleOffset: 22050, // the position as a sample offset
 *     dwSampleLength: 3646827, // the region length as a sample count
 *     dwPurposeID: 544106354,
 *     dwCountry: 0,
 *     dwLanguage: 0,
 *     dwDialect: 0,
 *     dwCodePage: 0,
 *   }
 * @return {!Array<Object>}
 */
WaveFile.prototype.listCuePoints = function() {};

/**
 * Return the value of the iXML chunk.
 * @return {string} The contents of the iXML chunk.
 */
WaveFile.prototype.getiXML = function() {};

/**
 * Set the value of the iXML chunk.
 * @param {string} iXMLValue The value for the iXML chunk.
 * @throws {TypeError} If the value is not a string.
 */
WaveFile.prototype.setiXML = function(iXMLValue) {};

/**
 * Get the value of the _PMX chunk.
 * @return {string} The contents of the _PMX chunk.
 */
WaveFile.prototype.get_PMX = function() {};

/**
 * Set the value of the _PMX chunk.
 * @param {string} _PMXValue The value for the _PMX chunk.
 * @throws {TypeError} If the value is not a string.
 */
WaveFile.prototype.set_PMX = function(_PMXValue) {};
