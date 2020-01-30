# CHANGELOG

## version 11.0.0 - 2020-01-30

### API changes
- clamp int samples on overflow instead of throwing RangeError

### Other changes
- Zero dependencies


## version 10.4.3 - 2020-01-27
- Fix: large files RIFF/RIFX conversion

## version 10.4.2 - 2020-01-22
Better sinc resampling.

## version 10.4.1 - 2020-01-21
Faster sinc resampling.

## version 10.4.0 - 2020-01-20
- Default LPF for resample is IIR 
- Use FIR or IIR LPFs to resample:
```javascript
// Will use 'linear' method with a FIR LPF
wav.toSampleRate(44100, {method: "linear", LPF: true, LPFType: 'FIR'});

// Will use 'linear' method with a IIR LPF, the default
wav.toSampleRate(44100, {method: "linear", LPF: true});
```

## version 10.3.0 - 2020-01-20

### Features
- New resample methods: *linear* for linear interpolation and *point* for nearest point interpolation. Both methods use no LPF by default; others methods use LPF by default.

- Resample with or without LPF using any interpolation method:
```javascript
// Resample using cubic without LPF
wav.toSampleRate(44100, {method: 'cubic', LPF: false});
// Resample using cubic with LPF:
wav.toSampleRate(44100, {method: 'cubic', LPF: true});
// cubic and sinc use LPF by default
wav.toSampleRate(44100, {method: 'cubic'}); // will use LPF
```

- You can now use any Typed Array as the output for ```getSamples()```:
```javascript
// Will return the samples de-interleaved,
// packed in a array of Int32Array objects, one for each channel
samples = wav.getSamples(false, Int32Array);
// will return the samples de-interleaved,
// packed in a array of Int16Array objects, one for each channel
let samples = getSamples(false, Int16Array);
// will return the samples interleaved, packed in a Int16Array
let samples = getSamples(true, Int16Array);
```

## version 10.2.0 - 2020-01-16
Change the sample rate.

### New Features:
Change the sample rate with ```wav.toSampleRate();```

### Fixes:
- Bug that prevented creating multi channel files using a array of typed arrays for samples
- Type declaration for sample arrays now use more generic types to ease integration


## version 10.1.0 - 2020-01-08
Add *getSamples()* to the API. It returns the samples packed in a Float64Array.
If the file have more than one channel, samples will be returned de-interleaved
in a Array of Float64Array objects, one for each channel. The method takes a
optional boolean param *interleaved*, set to **false** by default. If set to
**true**, samples will be returned interleaved. **Default is de-interleaved**.
```javascript
// Both will return de-interleaved samples
samples = wav.getSamples();
samples = wav.getSamples(false);

// To get interleaved samples
samples = wav.getSamples(true);
```

## version 10.0.0 - 2020-01-07
Better handling of cue points and regions.

### API Changes:
- *listCuePoints()* now returns a list of objects with more information about each cue point:
```javascript
[
	{
		position: 500, // the position in milliseconds
		label: 'cue marker 1',
		end: 1500, // the end position in milliseconds
		dwName: 1,
		dwPosition: 0,
		fccChunk: 'data',
		dwChunkStart: 0,
		dwBlockStart: 0,
		dwSampleOffset: 22050, // the position as a sample offset
		dwSampleLength: 3646827, // the region length as a sample count
		dwPurposeID: 544106354,
		dwCountry: 0,
		dwLanguage: 0,
		dwDialect: 0,
		dwCodePage: 0,
	},
	//...
];
```
- *setCuePoint()* param is now a object with the cue point data:
```javascript
// to create a cue point the position in milliseconds
// is the only required attribute
wav.setCuePoint({position: 1500});

// to create a cue point with a label
wav.setCuePoint({position: 1500, label: 'some label'});

// to create a cue region with a label:
wav.setCuePoint({position: 1500, end: 2500, label: 'some label'});
```
Objects that define regions can also define the following optional properties:
- dwPurposeID
- dwCountry
- dwLanguage
- dwDialect
- dwCodePage

### New Features:
- setCuePoint() now can create both cue points and regions.

### Fixes:
- Fix setCuePoint() bug that caused some labels to display the wrong text


## version 9.1.1 - 2020-01-04
- Smaller dist file

## version 9.1.0 - 2020-01-03
- Read and write iXML chunks
- Read and write \_PMX chunks
To change the value of iXML of \_PMX chunks:
```javascript
wav.setiXML(iXMLValue);
wav.set_PMX(_PMXValue);
```
Fix: chunkSize of LIST subChunks that have string values

## version 9.0.3 - 2020-01-03
- Fix: remove extra field from ltxt chunks to fix wav regions labels

## version 9.0.2 - 2020-01-03
- Fix: add padding byte on bext when byte number is odd to avoid writing currupted files

## version 9.0.1 - 2020-01-02
- Update byte-data@18 for performance improvement

## version 9.0.0 - 2019-12-31
- New package structure:
	* dist file is "./dist/wavefile.js", a UMD served as "main"
	* ES6 source is "./index.js", served as "module"
- WaveFile class is no longer a default export. You should use like this:
	- Node.js:
```javascript
const WaveFile = require('uint-buffer').WaveFile;
```
	- Browser:
```html
<script src="wavefile.js"></script>
<script>
	var WaveFile = wavefile.WaveFile;
	var wav = new WaveFile();
</script>
```

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
