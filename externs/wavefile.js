/**
 * @fileoverview Externs for wavefile 8.3
 *
 * @see https://github.com/rochars/wavefile
 * @externs
 */

// WaveFile class
const WaveFile = {};

/**
 * The container identifier.
 * RIFF, RIFX and RF64 are supported.
 * @type {string}
 */
WaveFile.container = '';
/**
 * @type {number}
 */
WaveFile.chunkSize = 0;
/**
 * The format.
 * Always WAVE.
 * @type {string}
 */
WaveFile.format = '';
/**
 * The data of the fmt chunk.
 * @type {!Object<string, *>}
 */
WaveFile.fmt = {
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
WaveFile.fact = {
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
WaveFile.cue = {
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
    milliseconds: 0
  }],
};
/**
 * The data of the smpl chunk.
 * @type {!Object<string, *>}
 */
WaveFile.smpl = {
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
WaveFile.bext = {
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
 * The data of the ds64 chunk.
 * Used only with RF64 files.
 * @type {!Object<string, *>}
 */
WaveFile.ds64 = {
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
WaveFile.data = {
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
WaveFile.LIST = [
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
WaveFile.junk = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {!Array<number>} */
  chunkData: []
};
/**
 * The bit depth code according to the samples.
 * @type {string}
 */
WaveFile.bitDepth = '';

/**
 * Return the sample at a given index.
 * @param {number} index The sample index.
 * @return {number} The sample.
 * @throws {Error} If the sample index is off range.
 */
WaveFile.getSample = function(index) {};

/**
 * Set the sample at a given index.
 * @param {number} index The sample index.
 * @param {number} sample The sample.
 * @throws {Error} If the sample index is off range.
 */
WaveFile.setSample = function(index, sample) {};

/**
 * Set up the WaveFile object based on the arguments passed.
 * @param {number} numChannels The number of channels
 *      (Integer numbers: 1 for mono, 2 stereo and so on).
 * @param {number} sampleRate The sample rate.
 *      Integer numbers like 8000, 44100, 48000, 96000, 192000.
 * @param {string} bitDepthCode The audio bit depth code.
 *      One of 4, 8, 8a, 8m, 16, 24, 32, 32f, 64
 *      or any value between 8 and 32 (like 12).
 * @param {!Array<number>} samples Array of samples to be written.
 *      The samples must be in the correct range according to the
 *      bit depth.
 * @param {?Object} options Optional. Used to force the container
 *      as RIFX with {container: RIFX}
 * @throws {Error} If any argument does not meet the criteria.
 */
WaveFile.fromScratch = function(
  numChannels, sampleRate, bitDepthCode, samples, options={container:'RIFF'}) {};

/**
 * Set up the WaveFile object from a byte buffer.
 * @param {!Uint8Array} bytes The buffer.
 * @param {boolean=} samples True if the samples should be loaded.
 * @throws {Error} If container is not RIFF, RIFX or RF64.
 * @throws {Error} If no fmt  chunk is found.
 * @throws {Error} If no data chunk is found.
 */
WaveFile.fromBuffer = function(bytes, samples=true) {};

/**
 * Return a byte buffer representig the WaveFile object as a .wav file.
 * The return value of this method can be written straight to disk.
 * @return {!Uint8Array} A .wav file.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.toBuffer = function() {};

/**
 * Use a .wav file encoded as a base64 string to load the WaveFile object.
 * @param {string} base64String A .wav file as a base64 string.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.fromBase64 = function(base64String) {};

/**
 * Return a base64 string representig the WaveFile object as a .wav file.
 * @return {string} A .wav file as a base64 string.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.toBase64 = function() {};

/**
 * Return a DataURI string representig the WaveFile object as a .wav file.
 * The return of this method can be used to load the audio in browsers.
 * @return {string} A .wav file as a DataURI.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.toDataURI = function() {};

/**
 * Use a .wav file encoded as a DataURI to load the WaveFile object.
 * @param {string} dataURI A .wav file as DataURI.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.fromDataURI = function(dataURI) {};

/**
 * Force a file as RIFF.
 */
WaveFile.toRIFF = function() {};

/**
 * Force a file as RIFX.
 */
WaveFile.toRIFX = function() {};

/**
 * Change the bit depth of the samples.
 * @param {string} newBitDepth The new bit depth of the samples.
 *      One of 8 ... 32 (integers), 32f or 64 (floats)
 * @param {boolean} changeResolution A boolean indicating if the
 *      resolution of samples should be actually changed or not.
 * @throws {Error} If the bit depth is not valid.
 */
WaveFile.toBitDepth = function(newBitDepth, changeResolution=true) {};

/**
 * Encode a 16-bit wave file as 4-bit IMA ADPCM.
 * @throws {Error} If sample rate is not 8000.
 * @throws {Error} If number of channels is not 1.
 */
WaveFile.toIMAADPCM = function() {};

/**
 * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
 * @param {string} bitDepthCode The new bit depth of the samples.
 *      One of 8 ... 32 (integers), 32f or 64 (floats).
 *      Optional. Default is 16.
 */
WaveFile.fromIMAADPCM = function(bitDepthCode='16') {};

/**
 * Encode 16-bit wave file as 8-bit A-Law.
 */
WaveFile.toALaw = function() {};

/**
 * Decode a 8-bit A-Law wave file into a 16-bit wave file.
 * @param {string} bitDepthCode The new bit depth of the samples.
 *      One of 8 ... 32 (integers), 32f or 64 (floats).
 *      Optional. Default is 16.
 */
WaveFile.fromALaw = function(bitDepthCode='16') {};

/**
 * Encode 16-bit wave file as 8-bit mu-Law.
 */
WaveFile.toMuLaw = function() {};

/**
 * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
 * @param {string} bitDepthCode The new bit depth of the samples.
 *      One of 8 ... 32 (integers), 32f or 64 (floats).
 *      Optional. Default is 16.
 */
WaveFile.fromMuLaw = function(bitDepthCode='16') {};

/**
 * Write a RIFF tag in the INFO chunk. If the tag do not exist,
 * then it is created. It if exists, it is overwritten.
 * @param {string} tag The tag name.
 * @param {string} value The tag value.
 * @throws {Error} If the tag name is not valid.
 */
WaveFile.setTag = function(tag, value) {};

/**
 * Return the value of a RIFF tag in the INFO chunk.
 * @param {string} tag The tag name.
 * @return {?string} The value if the tag is found, null otherwise.
 */
WaveFile.getTag = function(tag) {};

/**
 * Remove a RIFF tag in the INFO chunk.
 * @param {string} tag The tag name.
 * @return {boolean} True if a tag was deleted.
 */
WaveFile.deleteTag = function(tag) {};

/**
 * Create a cue point in the wave file.
 * @param {number} position The cue point position in milliseconds.
 * @param {string} labl The LIST adtl labl text of the marker. Optional.
 */
WaveFile.setCuePoint = function(position, labl='') {};

/**
 * Remove a cue point from a wave file.
 * @param {number} index the index of the point. First is 1,
 *      second is 2, and so on.
 */
WaveFile.deleteCuePoint = function(index) {};

/**
 * Update the label of a cue point.
 * @param {number} pointIndex The ID of the cue point.
 * @param {string} label The new text for the label.
 */
WaveFile.updateLabel = function(pointIndex, label) {};

/**
 * Return a Object<tag, value> with the RIFF tags in the file.
 * @return {!Object<string, string>} The file tags.
 */
WaveFile.listTags = function() {};

/**
 * Return an array with all cue points in the file, in the order they appear
 * in the file.
 * The difference between this method and using the list in WaveFile.cue
 * is that the return value of this method includes the position in
 * milliseconds of each cue point (WaveFile.cue only have the sample offset)
 * @return {!Array<!Object>}
 * @private
 */
WaveFile.listCuePoints = function() {};
