# CHANGELOG

## version 8.4.6 (2019-09-12)
- Fix: clicks and time changes in ADPCM compression/decompression
- Fix: Range error bug when converting some files to ADPCM
- Fix: The length of the output array when converting to ADPCM
- Fix: properly reset chunks in WaveFile objects when using the same object to read multiple files or performing conversions.
- Fix: keep metadata when performing bit depth conversions or applying compression

## version 8.4.5 (2019-07-25)
- Fix: read UTF8 chars in cue points (https://github.com/rochars/wavefile/issues/13)

## version 8.4.4 (2018-08-09)
- Fix: browser directive in package.json

## version 8.4.3 (2018-08-07)
- Fix: Stop adding a extra sample when changing the bit depth
- Fix: Add padding byte if sample buffer lenght is odd

## version 8.4.2 (2018-08-06)
- Use ArrayBufferView to represent TypedArray in index.d.ts
- Use WaveFile.prototype in externs/wavefile.js

## version 8.4.1 (2018-08-06)
- Update dependencies.

## version 8.4.0 (2018-08-02)
- Compatible with IE10+

## version 8.3.2 (2018-07-13)
- Fix misssing properties in TypeScript declaration file.
- Fix documentation issues.

## version 8.3.1 (2018-07-13)
- Add external dependencies.

## version 8.3.0 (2018-07-13)
- Add getSample(index) to the API; return the sample at a given index.
- Add setSample(index, sample) to the API; set the sample at a given index.

## version 8.2.0 (2018-07-12)
- Add listTags() method to the API. It return a Object<tag, value> with the RIFF tags in the file.
- Add listCuePoints() method to the API. It return a object similar to in WaveFile.cue, but with the position of each point in milliseconds.

## version 8.1.5 (2018-07-10)
- Fix: Remove unecessary files from the dist.
- Update documentation.

## version 8.1.4 (2018-07-09)
- No dependencies.

## version 8.1.3 (2018-07-08)
- Fix: UMD dist transpiled to ES5.
- Use updated alawmulaw module to avoid license issues

## version 8.1.2 (2018-07-06)
- Fix: update bext.chunkSize on object after toBuffer() is called.

## version 8.1.1 (2018-07-04)
- Fix documentation issues.

## version 8.1.0 (2018-07-04)
- Add CLI to manipulate wave files from the command line.

## version 8.0.3 (2018-07-03)
- Fix: Change the bit depth and apply compression to huge files.

## version 8.0.2 (2018-06-29)
- Fix: Handle multiple instances of RIFX and RIFF.

## version 8.0.1 (2018-06-29)
- Remove @export tags
- Add externs file for the Closure Compiler
- Update TypeScript declaration with fromBuffer() optional argument

## version 8.0.0 (2018-06-29)
- Read and write huge files.
- Fix: CommonJS dist to be compatible with TypeScript declaration file.
- Remove interleave() and deInterleave() from the API.

## version 7.0.1 (2018-06-27)
- Add TypeScript declaration file.

## version 7.0.0 (2018-06-27)
- ES6 module.
- Better memory use.
- Smaller dist files.

## version 6.13.0 (2018-06-13)
- feature: Add BWF data to files.

## version 6.12.7 (2018-06-12)
- update: byte-data to version 9 and riff-chunks to version 5.

## version 6.12.6 (2018-06-11)
- fix: remove dist from npm in v6 to avoid breaking dependents.

## version 6.12.5 (2018-06-11)
- fix: webpack.config so no dependency dist is used in the bundle.

## version 6.12.4 (2018-06-11)
- browser version on npm.

## version 6.12.3 (2018-06-11)
- Removed /dist from .npmignore.

## version 6.12.2 (2018-06-11)
- Add 'browser' to package.json.

## version 6.12.1 (2018-06-11)
- Update riff-chunks to 4.0.6 to fix odd numbers on chunkSize.

## version 6.12.0 (2018-06-10)
- Add support for 'ltxt' chunks.

## version 6.11.0 (2018-06-10)
- Reading and writing the "smpl" chunk.

## version 6.10.4 (2018-06-01)
- fix: listChunks var JSDoc type definition in readLISTChunk_().
- Better documentation.

## version 6.10.3 (2018-05-25)
- fix: dwChannelMask for 1, 2, 4, 6 and 8 channels.

## version 6.10.2 (2018-05-18)
- Better implementation of interleave() and deInterleave() methods.

## version 6.10.1 (2018-05-14)
- fix: JSDoc tags and documentation.

## version 6.10.0 (2018-05-13)
- fromBase64() and fromDataURI() added to the API to load WaveFile objects from base64 strings and DataURIs.

## version 6.9.0 (2018-05-12)
- Update labels with updateLabel(labelIndex, labelText)

## version 6.8.0 (2018-05-12)
- Reading and writing the "adtl" LIST subchunk. Labels ("labl") can be created with cue points using setCuePoint(timeInMs, labelText)

## version 6.7.0 (2018-05-11)
- Set and delete cue points with setCuePoint() and deleteCuePoint().

## version 6.6.1 (2018-05-11)
- Set, get and delete tags on files with setTag(), getTag() and deleteTag().

## version 6.5.1 (2018-05-10)
- Safer estimation of chunkSizes.
- Fix: data.chunkSize calculated when writing the file.

## version 6.5.0 (2018-05-10)
- Reading and writing tags from "LIST" chunks of type "INFO".
- Reading and writing cue points.
- BWF data is kept when changing bit depth, using compression or when re-creating an existing WaveFile object with the fromScratch() or fromBuffer() method.
- Reading the "junk" chunk. The chunk is kept when changing bit depth, using compression or when re-creating an existing WaveFile object with the fromScratch() or fromBuffer() method.
- Fix: all chunkSize fields are calculated when writing the file.
- Fix: calling clearHeader_() on fromBuffer(), not just fromScratch(). The method is used to clear data in the file header that might lead to corrupt files, like the "fact" chunk.
- Fix: assure samples are de-interleaved on fromScratch() before using the array.

## version 6.4.1 (2018-05-07)
- Using compilationLevel: ADVANCED with Closure Compiler.

## version 6.4.0 (2018-05-07)
- WaveFile.toBase64() and WaveFile.toDataURI() to export the file as a Base64 string or a DataURI.

## version 6.3.0 (2018-05-06)
- fromIMAADPCM, fromALaw and fromMuLaw can receive an optional parameter: the bit depth of the output. If ommited, defaults to "16".
- Fix: argument validation in fromScratch

## version 6.2.0 (2018-05-04)
- Limited support of RF64. Need to be tested with files > 4gb in size.

## version 6.1.1 (2018-05-03)
- Using byte-data^7.0.0 and riff-chunks^4.0.1.

## version 6.1.0 (2018-05-02)
- Reading and writing the data in the "cue " chunk.

## version 6.0.0 (2018-05-02)
- New API. Methods have the same name, but properties have changed.
	- The samples are now under WaveFile.data.samples, not WaveFile.samples.
	- "fmt " data is now an object under WaveFile.fmt
	- "data" data is now under WaveFile.data
	- "fact" data is now under WaveFile.fact
	- "bext" data is now under WaveFile.bext
- Support for direct conversion of any bith depth to any compression type.
- Samples are automatically interleaved when reading/writing files