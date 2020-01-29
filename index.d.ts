// Type definitions for wavefile 11.0
// Project: https://github.com/rochars/wavefile
// Definitions by: Rafael da Silva Rocha <https://github.com/rochars>
// Definitions: https://github.com/rochars/wavefile

export = wavefile;

declare module wavefile {

  class WaveFile {

    /**
     * The bit depth code according to the samples.
     * @type {string}
     */
    bitDepth: string;
    /**
     * The container identifier.
     * 'RIFF', 'RIFX' and 'RF64' are supported.
     * @type {string}
     */
    container: string;
    /**
     * @type {number}
     */
    chunkSize: number;
    /**
     * The format.
     * Always 'WAVE'.
     * @type {string}
     */
    format: string;
    /**
     * The data of the 'fmt' chunk.
     * @type {!Object<string, *>}
     */
    fmt: object;
    /**
     * The data of the 'fact' chunk.
     * @type {!Object<string, *>}
     */
    fact: object;
    /**
     * The data of the 'cue ' chunk.
     * @type {!Object<string, *>}
     */
    cue: object;
    /**
     * The data of the 'smpl' chunk.
     * @type {!Object<string, *>}
     */
    smpl: object;
    /**
     * The data of the 'bext' chunk.
     * @type {!Object<string, *>}
     */
    bext: object;
    /**
     * The data of the 'iXML' chunk.
     * @type {!Object<string, *>}
     */
    iXML: object;
    /**
     * The data of the 'ds64' chunk.
     * Used only with RF64 files.
     * @type {!Object<string, *>}
     */
    ds64: object;
    /**
     * The data of the 'data' chunk.
     * @type {!Object<string, *>}
     */
    data: object;
    /**
     * The data of the 'LIST' chunks.
     * Each item in this list look like this:
     *  {
     *    chunkId: '',
     *    chunkSize: 0,
     *    format: '',
     *    subChunks: []
     *   }
     * @type {!Array<!Object>}
     */
    LIST: object[];
    /**
     * The data of the 'junk' chunk.
     * @type {!Object<string, *>}
     */
    junk: object;
    /**
     * The data of the '_PMX' chunk.
     * @type {!Object<string, *>}
     */
    _PMX: object;

    /**
     * @param {Uint8Array=} [wavBuffer=null] A wave file buffer.
     * @throws {Error} If no 'RIFF' chunk is found.
     * @throws {Error} If no 'fmt ' chunk is found.
     * @throws {Error} If no 'data' chunk is found.
     */
    constructor(wavBuffer?: Uint8Array);

    /**
     * Return the samples packed in a Float64Array.
     * @param {boolean=} [interleaved=false] True to return interleaved samples,
     *   false to return the samples de-interleaved.
     * @param {Function=} [OutputObject=Float64Array] The sample container.
     * @return {!(Array|TypedArray)} the samples.
     */
    getSamples(interleaved?:boolean, OutputObject?: Function): Float64Array;

    /**
     * Return the sample at a given index.
     * @param {number} index The sample index.
     * @return {number} The sample.
     * @throws {Error} If the sample index is off range.
     */
    getSample(index: number): number;

    /**
     * Set the sample at a given index.
     * @param {number} index The sample index.
     * @param {number} sample The sample.
     * @throws {Error} If the sample index is off range.
     */
    setSample(index: number, sample: number): void;

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
    fromScratch(
      numChannels: number,
      sampleRate: number,
      bitDepthCode: string,
      samples: Array<number>|Array<Array<number>>|ArrayLike<any>|Array<ArrayLike<any>>,
      options?: object): void;

    /**
     * Set up the WaveFileParser object from a byte buffer.
     * @param {!Uint8Array} wavBuffer The buffer.
     * @param {boolean=} [samples=true] True if the samples should be loaded.
     * @throws {Error} If container is not RIFF, RIFX or RF64.
     * @throws {Error} If format is not WAVE.
     * @throws {Error} If no 'fmt ' chunk is found.
     * @throws {Error} If no 'data' chunk is found.
     */
    fromBuffer(bytes: Uint8Array, samples?:boolean): void;

    /**
     * Return a byte buffer representig the WaveFileParser object as a .wav file.
     * The return value of this method can be written straight to disk.
     * @return {!Uint8Array} A wav file.
     * @throws {Error} If bit depth is invalid.
     * @throws {Error} If the number of channels is invalid.
     * @throws {Error} If the sample rate is invalid.
     */
    toBuffer(): Uint8Array;

    /**
     * Use a .wav file encoded as a base64 string to load the WaveFile object.
     * @param {string} base64String A .wav file as a base64 string.
     * @throws {Error} If any property of the object appears invalid.
     */
    fromBase64(base64String: string): void;

    /**
     * Return a base64 string representig the WaveFile object as a .wav file.
     * @return {string} A .wav file as a base64 string.
     * @throws {Error} If any property of the object appears invalid.
     */
    toBase64(): string;

    /**
     * Return a DataURI string representig the WaveFile object as a .wav file.
     * The return of this method can be used to load the audio in browsers.
     * @return {string} A .wav file as a DataURI.
     * @throws {Error} If any property of the object appears invalid.
     */
    toDataURI(): string;

    /**
     * Use a .wav file encoded as a DataURI to load the WaveFile object.
     * @param {string} dataURI A .wav file as DataURI.
     * @throws {Error} If any property of the object appears invalid.
     */
    fromDataURI(dataURI: string): void;

    /**
     * Force a file as RIFF.
     */
    toRIFF(): void;

    /**
     * Force a file as RIFX.
     */
    toRIFX(): void;

    /**
     * Change the bit depth of the samples.
     * @param {string} newBitDepth The new bit depth of the samples.
     *    One of '8' ... '32' (integers), '32f' or '64' (floats)
     * @param {boolean=} [changeResolution=true] A boolean indicating if the
     *    resolution of samples should be actually changed or not.
     * @throws {Error} If the bit depth is not valid.
     */
    toBitDepth(newBitDepth: string, changeResolution?: boolean): void;

    /**
     * Convert the sample rate of the file.
     * @param {number} sampleRate The target sample rate.
     * @param {Object=} options The extra configuration, if needed.
     */
    toSampleRate(samples: number, options?:object): void;

    /**
     * Encode a 16-bit wave file as 4-bit IMA ADPCM.
     * @throws {Error} If sample rate is not 8000.
     * @throws {Error} If number of channels is not 1.
     */
    toIMAADPCM(): void;

    /**
     * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
     * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
     *  One of '8' ... '32' (integers), '32f' or '64' (floats).
     */
    fromIMAADPCM(bitDepthCode?: string): void;

    /**
     * Encode a 16-bit wave file as 8-bit A-Law.
     */
    toALaw(): void;

    /**
     * Decode a 8-bit A-Law wave file into a 16-bit wave file.
     * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
     *  One of '8' ... '32' (integers), '32f' or '64' (floats).
     */
    fromALaw(bitDepthCode?: string): void;

    /**
     * Encode 16-bit wave file as 8-bit mu-Law.
     */
    toMuLaw(): void;

    /**
     * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
     * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
     *  One of '8' ... '32' (integers), '32f' or '64' (floats).
     */
    fromMuLaw(bitDepthCode?: string): void;

    /**
     * Write a RIFF tag in the INFO chunk. If the tag do not exist,
     * then it is created. It if exists, it is overwritten.
     * @param {string} tag The tag name.
     * @param {string} value The tag value.
     * @throws {Error} If the tag name is not valid.
     */
    setTag(tag: string, value: string): void;

    /**
     * Return the value of a RIFF tag in the INFO chunk.
     * @param {string} tag The tag name.
     * @return {?string} The value if the tag is found, null otherwise.
     */
    getTag(tag: string): string|null;

    /**
     * Return a Object<tag, value> with the RIFF tags in the file.
     * @return {!Object<string, string>} The file tags.
     */
    listTags(): object;

    /**
     * Remove a RIFF tag in the INFO chunk.
     * @param {string} tag The tag name.
     * @return {boolean} True if a tag was deleted.
     */
    deleteTag(tag: string): boolean;

    /**
     * Create a cue point in the wave file.
     * @param {!Object<string, *>} pointData The data of the cue point.
     */
    setCuePoint(pointData: object): void;

    /**
     * Remove a cue point from a wave file.
     * @param {number} index the index of the point. First is 1,
     *  second is 2, and so on.
     */
    deleteCuePoint(index: number): void;

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
    listCuePoints(): Array<object>;

    /**
     * Update the label of a cue point.
     * @param {number} pointIndex The ID of the cue point.
     * @param {string} label The new text for the label.
     */
    updateLabel(pointIndex: number, label: string): void;

    /**
     * Set the value of the iXML chunk.
     * @param {string} iXMLValue The value for the iXML chunk.
     * @throws {TypeError} If the value is not a string.
     */
    setiXML(iXMLValue: string): void;

    /**
     * Return the value of the iXML chunk.
     * @return {string} The contents of the iXML chunk.
     */
    getiXML(): string;

    /**
     * Set the value of the _PMX chunk.
     * @param {string} _PMXValue The value for the _PMX chunk.
     * @throws {TypeError} If the value is not a string.
     */
    set_PMX(_PMXValue: string): void;

    /**
     * Get the value of the _PMX chunk.
     * @return {string} The contents of the _PMX chunk.
     */
    get_PMX(): string;
  }
}
