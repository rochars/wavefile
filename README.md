# wavefile
Copyright (c) 2017-2019 Rafael da Silva Rocha.  
https://github.com/rochars/wavefile

[![NPM version](https://img.shields.io/npm/v/wavefile.svg?style=for-the-badge)](https://www.npmjs.com/package/wavefile) [![Docs](https://img.shields.io/badge/API-docs-blue.svg?style=for-the-badge)](https://rochars.github.io/wavefile/docs) [![Tests](https://img.shields.io/badge/tests-online-blue.svg?style=for-the-badge)](https://rochars.github.io/wavefile/test/browser.html)  
[![Codecov](https://img.shields.io/codecov/c/github/rochars/wavefile.svg?style=flat-square)](https://codecov.io/gh/rochars/wavefile) [![Unix Build](https://img.shields.io/travis/rochars/wavefile.svg?style=flat-square)](https://travis-ci.org/rochars/wavefile) [![Windows Build](https://img.shields.io/appveyor/ci/rochars/wavefile.svg?style=flat-square&logo=appveyor)](https://ci.appveyor.com/project/rochars/wavefile) [![Scrutinizer](https://img.shields.io/scrutinizer/g/rochars/wavefile.svg?style=flat-square&logo=scrutinizer)](https://scrutinizer-ci.com/g/rochars/wavefile/) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1880/badge)](https://bestpractices.coreinfrastructure.org/projects/1880)

## NOTICE (2020-09-02)
My part in the development of this software has unfortunately ended. There are many **wavefile forks**; I welcome them all and wish them the best.

Thank you all very much. Working on **wavefile** was a lot of fun for me. I am happy to see that it was useful for so many people.

## MOVING AWAY FROM GITHUB (2020-03-08)
Microsoft, owner of GitHub, was one of the main backers of the current fascist regime in Brazil and also of the coup d'etat that led to the present situation of my country.

It paid well: The brazilian government was required to run all its systems on open-source software. After the coup d'etat this changed, the goverment began purchasing Microsoft licenses and migrating all their systems to Windows.

It is not just a case of business malpractice - there is a genocide going on in Brazil and many people, including myself, have lived under constant death threats for the past couple years bacause of our positions against the current fascist regime. Many have been murdered or incarcerated. Poverty and violence skyrocketed.

**This software will keep being released in NPM as always - only the repository will be moved. Projects depending on this software will not be affected.**

For Microsoft owners and collaborators: you have a lot of blood in your hands. I will not share my work with people of your kind.

---

# wavefile

Create, read and write wav files according to the specs.

- **MIT licensed**
- **Use it in the browser (IE10+)**
- **Use it in Node.js**
- **Use it as a command line tool**
- **Handle files up to 2GB**
- **Zero dependencies**

With **wavefile** you can:

- [Create wav files](#create-wave-files-from-scratch)
- [Read wav files](#read-wave-files)
- [Change the bit depth of the audio](#change-the-bit-depth)
- [Change the sample rate of the audio](#change-the-sample-rate)
- [Read and write RIFF tags](#add-riff-tags-to-files)
- [Set and delete cue points and their labels](#add-cue-points-to-files)
- [Create regions in wav files](#create-regions-in-files)
- [Encode/decode files as ADPCM, A-Law and μ-Law](#ima-adpcm)
- [Turn RIFF files to RIFX and RIFX to RIFF](#rifx)
- [Create or edit BWF metadata ("bext" chunk)](#add-bwf-metadata)

And more.

## Install
```
npm install wavefile
```

To use it from the [command line](#command-line), install it globally:
```
npm install wavefile -g
```

## Use

### Node
```javascript
const wavefile = require('wavefile');
let wav = new wavefile.WaveFile();
```
or 
```javascript
const WaveFile = require('wavefile').WaveFile;
let wav = new WaveFile();
```
or
```javascript
import { WaveFile } from 'wavefile';
let wav = new WaveFile();
```

### Browser
Use the **wavefile.js** file in the *dist* folder:
```html
<script src="wavefile.js"></script>
<script>
  var wav = new wavefile.WaveFile();
</script>
```

Or load it from the [jsDelivr](https://cdn.jsdelivr.net/npm/wavefile) CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/wavefile"></script>
```

Or load it from [unpkg](https://unpkg.com/wavefile):
```html
<script src="https://unpkg.com/wavefile"></script>
```

#### Browser compatibility
IE10+. Should work in all modern browsers.

Cross-browser tests powered by  
<a href="https://www.browserstack.com"><img src="https://rochars.github.io/wavefile/docs/Browserstack-logo@2x.png" width="150px"/></a>


### Command line use
To see the available options:
```
wavefile --help
```

## Node.js Example
```javascript
const WaveFile = require('wavefile').WaveFile;

// Load a wav file buffer as a WaveFile object
let wav = new WaveFile(buffer);

// Check some of the file properties
console.log(wav.container);
console.log(wav.chunkSize);
console.log(wav.fmt.chunkId);

// Call toBuffer() to get the bytes of the file.
// You can write the output straight to disk:
let wavBuffer = wav.toBuffer();

// Call toDataURI() to get the file as a DataURI:
let wavDataURI = wav.toDataURI();
```

## Table of Contents
- [Install](#install)
- [Use](#use)
- [Operation Manual](#operation-manual)
  * [Create wave files from scratch](#create-wave-files-from-scratch)
  * [Read wave files](#read-wave-files)
  * [Add RIFF tags to files](#add-riff-tags-to-files)
  * [Add cue points to files](#add-cue-points-to-files)
  * [Create regions in files](#create-regions-in-files)
  * [RIFX](#rifx)
  * [IMA-ADPCM](#ima-adpcm)
  * [A-Law](#a-law)
  * [mu-Law](#mu-law)
  * [Change the bit depth](#change-the-bit-depth)
  * [Change the sample rate](#change-the-sample-rate)
  * [Add BWF metadata](#add-bwf-metadata)
  * [RF64](#rf64)
  * [XML Chunks](#xml-chunks)
  * [The samples](#the-samples)
  * [Command line](#command-line)
- [API](#api)
  * [The WaveFile methods:](#the-wavefile-methods-)
  * [The WaveFile properties](#the-wavefile-properties)
    + [Cue points](#cue-points)
    + [Sample loops](#sample-loops)
    + [LIST chunk](#list-chunk)
- [Contributing to wavefile](#contributing-to-wavefile)
- [References](#references)
- [Legal](#legal)

## Operation Manual

### Create wave files from scratch
Use the ```fromScratch(numChannels, sampleRate, bitDepth, samples)``` method.

#### Mono:
```javascript
let wav = new WaveFile();

// Create a mono wave file, 44.1 kHz, 32-bit and 4 samples
wav.fromScratch(1, 44100, '32', [0, -2147483, 2147483, 4]);
fs.writeFileSync(path, wav.toBuffer());
```

#### Stereo:
Samples can be informed interleaved or de-interleaved. If they are de-interleaved, WaveFile will interleave them. In this example they are de-interleaved.
```javascript
// Stereo, 48 kHz, 8-bit, de-interleaved samples
// WaveFile interleave the samples automatically
wav.fromScratch(2, 48000, '8', [
    [0, 2, 4, 3],
    [0, 1, 4, 3]
]);
fs.writeFileSync(path, wav.toBuffer());
```
Possible values for the bit depth are:  
"4" - 4-bit IMA-ADPCM  
"8" - 8-bit  
"8a" - 8-bit A-Law  
"8m" - 8-bit mu-Law  
"16" - 16-bit  
"24" - 24-bit  
"32" - 32-bit  
"32f" - 32-bit floating point  
"64" - 64-bit floating point

You can also use any bit depth between "8" and "53", like **"11", "12", "17", "20" and so on**.

#### A word on bit depth
Resolutions other than 4-bit, 8-bit, 16-bit, 24-bit, 32-bit (integer), 32-bit (fp) and 64-bit (fp) are implemented as WAVE_FORMAT_EXTENSIBLE and may not be supported by some players.

### Read wave files
```javascript
const WaveFile = require('wavefile').WaveFile;
wav = new WaveFile();
// Read a wav file from a buffer
wav.fromBuffer(buffer);
// Read a wav file from a base64 string
wav.fromBase64(base64);
// Read a wav file from a data URI
wav.fromDataURI(dataURI);
```

### Add RIFF tags to files
You can create (or overwrite) tags on files with the **WaveFile.setTag()** method.
```javascript
// Write the ICMT tag with some comments to the file
wav.setTag("ICMT", "some comments");
```

To get the value of a tag (if it exists), use **WaveFile.getTag()**:
```javascript
console.log(wav.getTag("ICMT"));
// some comments
```

You can delete a tag with **WaveFile.deleteTag()**:
```javascript
wav.deleteTag("ICMT");
```

### Add cue points to files
You can create cue points using the **WaveFile.setCuePoint()** method. The method takes a object with the cue point data and creates a cue point in the corresponding position of the file. The only required attribute of the object is *position*, a number representing the position of the point in milliseconds:
```javascript
// to create a cue point
wav.setCuePoint({position: 1500});
```

You can also create cue points with labels by defining a *label* attribute:
```javascript
// to create a cue point with a label
wav.setCuePoint({position: 1500, label: 'some label'});
```

To delete a cue point use **WaveFile.deleteCuePoint()** informing the index of the point. Points are ordered according to their position. **The first point is indexed as 1.**
```javascript
wav.deleteCuePoint(1);
```

Mind that creating or deleting cue points will change the index of other points if they exist.

To list all the cue points in a file, in the order they appear:
```javascript
let cuePoints = wav.listCuePoints();
```
This method will return a list with cue points ordered as they appear in the file.
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

### Create regions in files
You can create regions using the **WaveFile.setCuePoint()** method. Regions are cue points with extra data.

If you define a not null *end* attribute in the object describing the cue point, the point will be created as a region. The *end* attribute should be the end of the region, in milliseconds, counting from the start of the file, and always greater than the *position* of the point:
```javascript
// to create a region with a label:
wav.setCuePoint({position: 1500, end: 2500, label: 'some label'});
```
You can also define the following optional properties when creating a region:
- dwPurposeID
- dwCountry
- dwLanguage
- dwDialect
- dwCodePage

### RIFX
**wavefile** can handle existing RIFX files and create RIFX files from scratch. Files created from scratch will default to RIFF; to create a file as RIFX you must define the container:
```javascript
wav.fromScratch(1, 48000, '16', [0, 1, -3278, 327], {"container": "RIFX"});
```

RIFX to RIFF and RIFF to RIFX:
```javascript
// Turn a RIFF file to a RIFX file
wav.toRIFX();

// Turn a RIFX file to a RIFF file
wav.toRIFF();
```

### IMA-ADPCM
16-bit 8000 Hz mono wave files can be compressed as IMA-ADPCM:
```javascript
// Encode a 16-bit wave file as 4-bit IMA-ADPCM:
wav.toIMAADPCM();
```
IMA-ADPCM files compressed with **wavefile** will have a block align of 256 bytes.

If the audio is not 16-bit it will be converted to 16-bit before compressing. Compressing audio with sample rate different from 8000 Hz or more than one channel is not supported and will throw errors.

To decode 4-bit IMA-ADPCM as 16-bit linear PCM:
```javascript
// Decode 4-bit IMA-ADPCM as 16-bit:
wav.fromIMAADPCM();
```

Decoding always result in 16-bit audio. To decode to another bit depth:
```javascript
// Decode 4-bit IMA-ADPCM as 24-bit:
wav.fromIMAADPCM("24");
```

### A-Law
16-bit wave files (mono or stereo) can be encoded as A-Law:
```javascript
// Encode a 16-bit wave file as 8-bit A-law:
wav.toALaw();
```
If the audio is not 16-bit it will be converted to 16-bit before compressing.

To decode 8-bit A-Law as 16-bit linear PCM:
```javascript
// Decode 8-bit A-Law as 16-bit:
wav.fromALaw();
```

Decoding always result in 16-bit audio. To decode to another bit depth:
```javascript
// Decode 8-bit A-Law as 24-bit:
wav.fromALaw("24");
```

### mu-Law
16-bit wave files (mono or stereo) can be encoded as mu-Law:
```javascript
// Encode a 16-bit wave file as 8-bit mu-law:
wav.toMuLaw();
```
If the audio is not 16-bit it will be converted to 16-bit before compressing.

To decode 8-bit mu-Law as 16-bit linear PCM:
```javascript
// Decode 8-bit mu-Law as 16-bit:
wav.fromMuLaw();
```

Decoding always result in 16-bit audio. To decode to another bit depth:
```javascript
// Decode 8-bit mu-Law as 24-bit:
wav.fromMuLaw("24");
```

### Change the bit depth
You can change the bit depth of the audio with the **toBitDepth(bitDepth)** method. WaveFile only change the bit depth of the samples; no dithering is done.
```javascript
// Load a wav file with 32-bit audio
let wav = new WaveFile(fs.readFileSync("32bit-file.wav"));

// Change the bit depth to 24-bit
wav.toBitDepth("24");

// Write the new 24-bit file
fs.writeFileSync("24bit-file.wav", wav.toBuffer());
```

### Change the sample rate
You can change the sample rate of the audio with the **toSampleRate()** method. By default, **cubic interpolation** is used to resample the data. You can choose between **cubic**, **sinc**, **point** and **linear**.
```javascript
// Load a wav file with 16kHz audio
let wav = new WaveFile(fs.readFileSync("16kHz-file.wav"));

// Change the sample rate to 44.1kHz
// using the default configuration
wav.toSampleRate(44100);
// this is the same as:
// wav.toSampleRate(44100, {method: "cubic"});

// Write the new 44.1kHz file
fs.writeFileSync("44100Hz-file.wav", wav.toBuffer());
```

To use another method:
```javascript
// Change the sample rate to 44.1kHz using sinc
wav.toSampleRate(44100, {method: "sinc"});
```

#### Resampling methods
- **point**: Nearest point interpolation, lowest quality, no LPF by default, fastest
- **linear**: Linear interpolation, low quality, no LPF by default, fast
- **cubic**: Cubic interpolation, use LPF by default **(default method)**
- **sinc**: Windowed sinc interpolation, use LPF by default, slowest

You can turn the LPF on and off for any resampling method:
```javascript
// Will use 'sinc' method with no LPF
wav.toSampleRate(44100, {method: "sinc", LPF: false});

// Will use 'linear' method with LPF
wav.toSampleRate(44100, {method: "linear", LPF: true});
```

The default LPF is a IIR LPF. You may define what type of LPF will be used by changing the LPFType attribute on the *toSampleRate()* param. You can use **IIR** or **FIR**:
```javascript
// Will use 'linear' method with a FIR LPF
wav.toSampleRate(44100, {method: "linear", LPF: true, LPFType: 'FIR'});

// Will use 'linear' method with a IIR LPF, the default
wav.toSampleRate(44100, {method: "linear", LPF: true});
```

#### Changing the sample rate of ADPCM, mu-Law or A-Law
You need to convert compressed files to standard PCM before resampling:

To resample a mu-Law file:
```javascript
// convert the file to PCM
wav.fromMuLaw();
// resample
wav.toSampleRate(44100, {method: "sinc"});
// back to mu-Law
wav.toMuLaw();
```

### Add BWF metadata
To add BWF data to a file you can use the **bext** property:
```javascript
// Load a wav file with no "bext"
let wav = new WaveFile(fs.readFileSync("32bit-file.wav"));

// Add some BWF metadata
wav.bext.originator = "wavefile";

// Write the new BWF file
fs.writeFileSync("32bit-file-with-bext.wav", wav.toBuffer());
```

By default **wavefile** will not insert a "bext" chunk in new files or in files that do not already have a "bext" chunk unless a property of **WaveFile.bext** is changed from it's default value. See below the full list of properties in **WaveFile.bext**.

### RF64
**wavefile** have limited support of RF64 files. It possible to read (at least some) RF64 files, but changing the bit depth or applying compression to the samples will result in a RIFF file.

### XML Chunks
**wavefile** support reading and writing **iXML** and **\_PMX** chunks.

To get the value of iXML or \_PMX chunks:
```javascript
/** @type {string} */
let iXMLValue = wav.getiXML();
/** @type {string} */
let _PMXValue = wav.get_PMX();
```

To set the value of iXML or \_PMX chunks:
```javascript
wav.setiXML(iXMLValue);
wav.set_PMX(_PMXValue);
```

The value for XML chunks must always be a string.

the *chunkSize* of the XML chunks will be adjusted when *toBuffer()* is called.

### The samples
Samples are stored in *data.samples* as a Uint8Array.

To get the samples as a Float64Array you should use the *getSamples()* method:
```javascript
let samples = wav.getSamples();
```
If the file is stereo or have more than one channel then the samples will be returned de-interleaved in a *Array* of *Float64Array* objects, one Float64Array for each channel. The method takes a optional boolean param *interleaved*, set to **false** by default. If set to **true**, samples will be returned interleaved. **Default is de-interleaved**.
```javascript
// Both will return de-interleaved samples
samples = wav.getSamples();
samples = wav.getSamples(false);

// To get interleaved samples
samples = wav.getSamples(true);
```

You can use any typed array as the output of *getSamples()*:
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

To get and set samples in a WaveFile instance you should use WaveFile.getSample(index) and WaveFile.setSample(index, sample). The 'index' is the index of the sample in the sample array, not the index of the bytes in data.samples.

Example:
```javascript
wav = new WaveFile();

// some samples
let samples = [561, 1200, 423];

// Create a WaveFile using the samples
wav.fromScratch(1, 8000, "16", samples);

// Getting and setting a sample in the WaveFile instance:
wav.getSample(1); // return 1200, the value of the second sample
wav.setSample(1, 10); // change the second sample to 10
wav.getSample(1); // return 10, the new value of the second sample
```

### Range:
- 0 to 255 for 8-bit
- -32768 to 32767 for 16-bit
- -8388608 to 8388607 for 24-bit
- -2147483648 to 2147483647 for 32-bit
- -1.0 to 1.0 for 32-bit (float)
- -1.0 to 1.0 for 64-bit (float)

Floating point samples may be defined out of range. Integer samples will be clamped on overflow.

### Command line
To use **wavefile** from the command line, install it globally:
```
$ npm install wavefile -g
```

To see the available options:
```
$ wavefile --help
```

The available options:
```
  --resample   Ex: wavefile input.wav --resample=44100 output.wav
               Change the sample rate. The input file is not affected.
               Use with --method to change the interpolation method:
               Ex: wavefile in.wav --resample=8000 --method=sinc out.wav
               If --method is ommited, cubic interpolation will be used.

  --bitdepth   Ex: wavefile input.wav --bitdepth=32f output.wav
               Change the bit depth.
               The input file is not affected.
               Possible values: 8, 16, 24, 32, 32f, 64

  --compress   Ex: wavefile input.wav --compress=adpcm output.wav
               Apply compression to the file.
               The input file is not affected.
               Possible values: adpcm, alaw, mulaw

  --tag        Ex: wavefile input.wav --tag=ICRD
               Print the value of tag if the tag exists.

  --list-tags  Ex: wavefile input.wav --list-tags
               Print all tags of the file.

  --list-cue   Ex: wavefile input.wav --list-cue
               Print all the cue points of the file.

  --bits       Ex: wavefile input.wav --bits
               Print the bit depth of the file.

  --rate       Ex: wavefile input.wav --rate
               Print the sample rate of the file.

  --help       Ex: --help
               Show this help page.
```

The **--resample** command performs resampling using *cubic interpolation* by default. Use it with the **--method** option to change the interpolation method:
```
$ wavefile input.wav --resample=44100 method=sinc output.wav
```
You can use *point*,*linear*,*cubic* and *sinc*.

## API
To create a WaveFile object:
```javascript
// Create a empty WaveFile object
WaveFile();

// Create a WaveFile object with the contents of a wav file buffer
WaveFile(wav);

/**
 * @param {Uint8Array=} wav A wave file buffer.
 * @throws {Error} If no "RIFF" chunk is found.
 * @throws {Error} If no "fmt " chunk is found.
 * @throws {Error} If no "data" chunk is found.
 */
WaveFile(wav);
```

### The WaveFile methods
```javascript
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
WaveFile.fromScratch(numChannels, sampleRate, bitDepth, samples, options) {}

/**
 * Set up the WaveFileParser object from a byte buffer.
 * @param {!Uint8Array} wavBuffer The buffer.
 * @param {boolean=} [samples=true] True if the samples should be loaded.
 * @throws {Error} If container is not RIFF, RIFX or RF64.
 * @throws {Error} If format is not WAVE.
 * @throws {Error} If no 'fmt ' chunk is found.
 * @throws {Error} If no 'data' chunk is found.
 */
WaveFile.fromBuffer(bytes, samples=true) {}

/**
 * Return a byte buffer representig the WaveFile object as a .wav file.
 * The return value of this method can be written straight to disk.
 * @return {!Uint8Array} A .wav file.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.toBuffer() {}

/**
 * Use a .wav file encoded as a base64 string to load the WaveFile object.
 * @param {string} base64String A .wav file as a base64 string.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.fromBase64(base64String) {}

/**
 * Return a base64 string representig the WaveFile object as a .wav file.
 * @return {string} A .wav file as a base64 string.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.toBase64() {}

/**
 * Return a DataURI string representig the WaveFile object as a .wav file.
 * The return of this method can be used to load the audio in browsers.
 * @return {string} A .wav file as a DataURI.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.toDataURI() {}

/**
 * Use a .wav file encoded as a DataURI to load the WaveFile object.
 * @param {string} dataURI A .wav file as DataURI.
 * @throws {Error} If any property of the object appears invalid.
 */
WaveFile.fromDataURI(dataURI) {}

/**
 * Force a file as RIFF.
 */
WaveFile.toRIFF() {}

/**
 * Force a file as RIFX.
 */
WaveFile.toRIFX() {}

/**
 * Change the bit depth of the samples.
 * @param {string} newBitDepth The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats)
 * @param {boolean=} [changeResolution=true] A boolean indicating if the
 *    resolution of samples should be actually changed or not.
 * @throws {Error} If the bit depth is not valid.
 */
WaveFile.toBitDepth(bitDepth, changeResolution=true) {}

/**
 * Convert the sample rate of the file.
 * @param {number} sampleRate The target sample rate.
 * @param {Object=} options The extra configuration, if needed.
 */
WaveFile.toSampleRate(sampleRate, options=null) {};

/**
 * Encode a 16-bit wave file as 4-bit IMA ADPCM.
 * @throws {Error} If sample rate is not 8000.
 * @throws {Error} If number of channels is not 1.
 */
WaveFile.toIMAADPCM() {}

/**
 * Decode a 4-bit IMA ADPCM wave file as a 16-bit wave file.
 * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats).
 */
WaveFile.fromIMAADPCM(bitDepth='16') {}

/**
 * Encode 16-bit wave file as 8-bit A-Law.
 */
WaveFile.toALaw() {}

/**
 * Decode a 8-bit A-Law wave file into a 16-bit wave file.
 * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats).
 */
WaveFile.fromALaw(bitDepth='16') {}

/**
 * Encode 16-bit wave file as 8-bit mu-Law.
 */
WaveFile.toMuLaw() {}

/**
 * Decode a 8-bit mu-Law wave file into a 16-bit wave file.
 * @param {string=} [bitDepthCode='16'] The new bit depth of the samples.
 *    One of '8' ... '32' (integers), '32f' or '64' (floats).
 */
WaveFile.fromMuLaw(bitDepth='16') {}

/**
 * Write a RIFF tag in the INFO chunk. If the tag do not exist,
 * then it is created. It if exists, it is overwritten.
 * @param {string} tag The tag name.
 * @param {string} value The tag value.
 * @throws {Error} If the tag name is not valid.
 */
WaveFile.setTag(tag, value) {}

/**
 * Return the value of a RIFF tag in the INFO chunk.
 * @param {string} tag The tag name.
 * @return {?string} The value if the tag is found, null otherwise.
 */
WaveFile.getTag(tag) {}

/**
 * Remove a RIFF tag in the INFO chunk.
 * @param {string} tag The tag name.
 * @return {boolean} True if a tag was deleted.
 */
WaveFile.deleteTag(tag) {}

/**
 * Return a Object<tag, value> with the RIFF tags in the file.
 * @return {!Object<string, string>} The file tags.
 */
WaveFile.listTags() {}

/**
 * Create a cue point in the wave file.
 * @param {!Object} pointData A object with the data of the cue point.
 *
 * # Only required attribute to create a cue point:
 * pointData.position: The position of the point in milliseconds
 *
 * # Optional attribute for cue points:
 * pointData.label: A string label for the cue point
 *
 * # Extra data used for regions
 * pointData.end: A number representing the end of the region,
 *   in milliseconds, counting from the start of the file. If
 *   no end attr is specified then no region is created.
 *
 * # You may also specify the following attrs for regions, all optional:
 * pointData.dwPurposeID
 * pointData.dwCountry
 * pointData.dwLanguage
 * pointData.dwDialect
 * pointData.dwCodePage
 * 
 * # This is what a complete pointData object look like:
 * {
 *   position: number,
 *   label: ?string,
 *   end: ?number,
 *   dwPurposeID: ?number,
 *   dwCountry: ?number,
 *   dwLanguage: ?number,
 *   dwDialect: ?number,
 *   dwCodePage: ?number
 * }
 */
WaveFile.setCuePoint(pointData) {}

/**
 * Remove a cue point from a wave file.
 * @param {number} index the index of the point. First is 1,
 *      second is 2, and so on.
 */
WaveFile.deleteCuePoint(index) {}

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
WaveFile.listCuePoints() {}

/**
 * Update the label of a cue point.
 * @param {number} pointIndex The ID of the cue point.
 * @param {string} label The new text for the label.
 */
WaveFile.updateLabel(pointIndex, label) {}

/**
 * Return the samples packed in a Float64Array.
 * @param {boolean=} [interleaved=false] True to return interleaved samples,
 *   false to return the samples de-interleaved.
 * @param {Function=} [OutputObject=Float64Array] The sample container.
 * @return {!(Array|TypedArray)} the samples.
 */
WaveFile.getSamples(interleaved=false, OutputObject=Float64Array) {};

/**
 * Return the sample at a given index.
 * @param {number} index The sample index.
 * @return {number} The sample.
 * @throws {Error} If the sample index is off range.
 */
WaveFile.getSample(index) {};

/**
 * Set the sample at a given index.
 * @param {number} index The sample index.
 * @param {number} sample The sample.
 * @throws {Error} If the sample index is off range.
 */
WaveFile.setSample(index, sample) {};


/**
 * Return the value of the iXML chunk.
 * @return {string} The contents of the iXML chunk.
 */
WaveFile.getiXML() {};

/**
 * Set the value of the iXML chunk.
 * @param {string} iXMLValue The value for the iXML chunk.
 * @throws {TypeError} If the value is not a string.
 */
WaveFile.setiXML(iXMLValue) {};

/**
 * Get the value of the _PMX chunk.
 * @return {string} The contents of the _PMX chunk.
 */
WaveFile.get_PMX() {};

/**
 * Set the value of the _PMX chunk.
 * @param {string} _PMXValue The value for the _PMX chunk.
 * @throws {TypeError} If the value is not a string.
 */
WaveFile.set_PMX(_PMXValue) {};

```

#### WaveFile.listCuePoints()
This method returns a list of objects, each object representing a cue point or region. The list looks like this:
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
    dwCodePage: 0
  },
  // ...
]
```
The list order reflects the order of the points in the file.

### The WaveFile properties
```javascript
/**
 * The container identifier.
 * "RIFF", "RIFX" and "RF64" are supported.
 * @type {string}
 */
WaveFile.container = '';
/**
 * @type {number}
 */
WaveFile.chunkSize = 0;
/**
 * The format.
 * Always 'WAVE'.
 * @type {string}
 */
WaveFile.format = '';
/**
 * The data of the "fmt" chunk.
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
 * The data of the "fact" chunk.
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
 * The data of the "cue " chunk.
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
    points: [],
};
/**
 * The data of the "smpl" chunk.
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
    loops: [],
};
/**
 * The data of the "bext" chunk.
 * @type {!Object<string, *>}
 */
WaveFile.bext = {
    /** @type {string} */
    chunkId: '',
    /** @type {number} */
    chunkSize: 0,
    /** @type {string} */
    description: '', //256
    /** @type {string} */
    originator: '', //32
    /** @type {string} */
    originatorReference: '', //32
    /** @type {string} */
    originationDate: '', //10
    /** @type {string} */
    originationTime: '', //8
    /**
     * 2 32-bit values, timeReference high and low
     * @type {!Array<number>}
     */
    timeReference: [0, 0],
    /** @type {number} */
    version: 0, //WORD
    /** @type {string} */
    UMID: '', // 64 chars
    /** @type {number} */
    loudnessValue: 0, //WORD
    /** @type {number} */
    loudnessRange: 0, //WORD
    /** @type {number} */
    maxTruePeakLevel: 0, //WORD
    /** @type {number} */
    maxMomentaryLoudness: 0, //WORD
    /** @type {number} */
    maxShortTermLoudness: 0, //WORD
    /** @type {string} */
    reserved: '', //180
    /** @type {string} */
    codingHistory: '' // string, unlimited
};
/**
 * The data of the 'iXML' chunk.
 * @type {!Object<string, *>}
 */
WaveFile.iXML = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {string} */
  value: ''
};
/**
 * The data of the "ds64" chunk.
 * Used only with RF64 files.
 * @type {!Object<string, *>}
 */
WaveFile.ds64 = {
    /** @type {string} */
    chunkId: '',
    /** @type {number} */
    chunkSize: 0,
    /** @type {number} */
    riffSizeHigh: 0, // DWORD
    /** @type {number} */
    riffSizeLow: 0, // DWORD
    /** @type {number} */
    dataSizeHigh: 0, // DWORD
    /** @type {number} */
    dataSizeLow: 0, // DWORD
    /** @type {number} */
    originationTime: 0, // DWORD
    /** @type {number} */
    sampleCountHigh: 0, // DWORD
    /** @type {number} */
    sampleCountLow: 0, // DWORD
    /** @type {number} */
    //"tableLength": 0, // DWORD
    /** @type {!Array<number>} */
    //"table": []
};
/**
 * The data of the "data" chunk.
 * @type {!Object<string, *>}
 */
WaveFile.data = {
    /** @type {string} */
    chunkId: '',
    /** @type {number} */
    chunkSize: 0,
    /** @type {!Uint8Array} */
    samples: new Uint8Array(0)
};
/**
 * The data of the "LIST" chunks.
 * Each item in this list look like this:
 *  {
 *      chunkId: '',
 *      chunkSize: 0,
 *      format: '',
 *      subChunks: []
 *   }
 * @type {!Array<!Object>}
 */
WaveFile.LIST = [];
/**
 * The data of the "junk" chunk.
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
 * The data of the '_PMX' chunk.
 * @type {!Object<string, *>}
 */
WaveFile._PMX = {
  /** @type {string} */
  chunkId: '',
  /** @type {number} */
  chunkSize: 0,
  /** @type {string} */
  value: ''
};
/**
 * The bit depth code according to the samples.
 * @type {string}
 */
WaveFile.bitDepth =  '';
```

#### Cue points
Items in *cue.points* are objects like this:
```javascript
{
    /** @type {number} */
    dwName: 0, // a cue point ID
    /** @type {number} */
    dwPosition: 0,
    /** @type {number} */
    fccChunk: 0,
    /** @type {number} */
    dwChunkStart: 0,
    /** @type {number} */
    dwBlockStart: 0,
    /** @type {number} */
    dwSampleOffset: 0
}
```

#### Sample loops
Items in *smpl.loops* are objects like this:
```javascript
{
    /** @type {string} */
    dwName: '', // a cue point ID
    /** @type {number} */
    dwType: 0,
    /** @type {number} */
    dwStart: 0,
    /** @type {number} */
    dwEnd: 0,
    /** @type {number} */
    dwFraction: 0,
    /** @type {number} */
    dwPlayCount: 0
}
```

#### LIST chunk
"LIST" chunk data is stored as follows:
```javascript
/**
 * An array of the "LIST" chunks present in the file.
 * @type {!Array<!Object>}
 */
WaveFile.LIST = [];
```

Items in *WaveFile.LIST* are objects like this:
```javascript
{
    /** @type {string} */
    chunkId: '', // always 'LIST'
    /** @type {number} */
    chunkSize: 0,
    /** @type {string} */
    format: '', // 'adtl' or 'INFO'
    /** @type {!Array<!Object>} */
    subChunks: []
};
```
Where "subChunks" are the subChunks of the "LIST" chunk. A single file may have many "LIST" chunks as long as their formats ("INFO", "adtl", etc) are not the same. **wavefile** can read and write "LIST" chunks of format "INFO" and "adtl".

For "LIST" chunks with the "INFO" format, "subChunks" will be an array of objects like this:
```javascript
{
    /** @type {string} */
    chunkId: '', // some RIFF tag
    /** @type {number} */
    chunkSize 0,
    /** @type {string} */
    value: ''
}
```
Where "chunkId" may be any RIFF tag:  
https://sno.phy.queensu.ca/~phil/exiftool/TagNames/RIFF.html#Info

## Contributing to wavefile
**wavefile** welcomes all contributions from anyone willing to work in good faith with other contributors and the community. No contribution is too small and all contributions are valued.

See [CONTRIBUTING.md](https://github.com/rochars/wavefile/blob/master/CONTRIBUTING.md) for details.

### Style guide
**wavefile** code should follow the Google JavaScript Style Guide:  
https://google.github.io/styleguide/jsguide.html

### Code of conduct
This project is bound by a Code of Conduct: The [Contributor Covenant, version 1.4](https://github.com/rochars/wavefile/blob/master/CODE_OF_CONDUCT.md), also available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

## References

### Papers
https://tech.ebu.ch/docs/tech/tech3285.pdf  
https://tech.ebu.ch/docs/tech/tech3306-2009.pdf  
http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html  
https://www.loc.gov/preservation/digital/formats/fdd/fdd000356.shtml  
http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/Docs/riffmci.pdf  
https://sites.google.com/site/musicgapi/technical-documents/wav-file-format  
http://www.neurophys.wisc.edu/auditory/riff-format.txt  
https://sno.phy.queensu.ca/~phil/exiftool/TagNames/RIFF.html#Info

### Software
https://github.com/erikd/libsndfile  
https://gist.github.com/hackNightly/3776503  
https://github.com/chirlu/sox/blob/master/src/wav.c

### Other
https://developercertificate.org/  
https://www.contributor-covenant.org/version/1/4/code-of-conduct.html  
https://google.github.io/styleguide/jsguide.html

## Legal
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frochars%2Fwavefile.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Frochars%2Fwavefile?ref=badge_large)

### LICENSE
Copyright (c) 2017-2019 Rafael da Silva Rocha.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
