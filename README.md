# wavefile
Read & write wave files with 4, 8, 16, 24, 32 & 64-bit data.  
Copyright (c) 2017-2018 Rafael da Silva Rocha.  
https://github.com/rochars/wavefile

[![NPM version](https://img.shields.io/npm/v/wavefile.svg?style=for-the-badge)](https://www.npmjs.com/package/wavefile) [![Docs](https://img.shields.io/badge/docs-online-blue.svg?style=for-the-badge)](https://rochars.github.io/wavefile/index.html)

## Install
```
npm install wavefile
```

## See it in action
https://tr2099.github.io/

Hit "Load in player" to generate wave files.

## Use
```javascript
let fs = require("fs");
let Wavefile = require("wavefile");

let wav = new Wavefile(fs.readFileSync("file.wav"));
console.log(wav.chunkId);
console.log(wav.chunkSize);
console.log(wav.fmtChunkId);
fs.writeFileSync(path, wav.toBuffer());
```

## Create wave files from scratch
You must inform the number of channels, the sample rate, the bit depth and the samples (in this order). The samples are arrays of numbers, and may be multi-dimensional if the there is more than one channel.

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

```javascript
let wav = new WaveFile();

// Create a mono wave file, 44.1 kHz, 32-bit and 4 samples
wav.fromScratch(1, 44100, '32', [0, -2147483648, 2147483647, 4]);
fs.writeFileSync(path, wav.toBuffer());

// stereo, 48 kHz, 8-bit
// samples are de-interleaved
wav.fromScratch(2, 48000, '8', [
    [0, -2, 4, 3],
    [0, -1, 4, 3]
]);
// Interleaving the samples
wav.interleave();
fs.writeFileSync(path, wav.toBuffer());

// Default is RIFF. To create RIFX files:
wav.fromScratch(1, 44100, '32', samples, {"container": "RIFX"});
fs.writeFileSync(path, wav.toBuffer());
```

## Interleave and de-interleave stereo samples
```javascript
// Interleave stereo samples
wav.interleave();

// De-interleave the samples into multiple channels
wav.deInterleave();
```

## RIFF to RIFX and RIFX to RIFF
```javascript
// Turn a RIFF file to a RIFX file
wav.toRIFX();

// Turn a RIFX file to a RIFF file
wav.toRIFF();
```

## IMA-ADPCM
16-bit 8000 Hz wave files can be compressed as IMA-ADPCM:
```javascript
// Encode a 16-bit wave file as 4-bit IMA-ADPCM:
wav.toIMAADPCM();
```

To decode 4-bit IMA-ADPCM as 16-bit PCM:
```javascript
// Decode 4-bit IMA-ADPCM as 16-bit:
wav.fromIMAADPCM();
```

The decoder assumes a 256 block align. To use a different block align:
```javascript
// Decode 4-bit IMA-ADPCM, 1024 blockalign:
wav.fromIMAADPCM(1024);
```

## A-Law
16-bit wave files can be encoded as A-Law:
```javascript
// Encode a 16-bit wave file as 8-bit A-law:
wav.toALaw();
```

To decode 8-bit A-Law as 16-bit PCM:
```javascript
// Decode 8-bit A-Law as 16-bit:
wav.fromALaw();
```

## mu-Law
16-bit wave files can be encoded as mu-Law:
```javascript
// Encode a 16-bit wave file as 8-bit mu-law:
wav.toMuLaw();
```

To decode 8-bit mu-Law as 16-bit PCM:
```javascript
// Decode 8-bit mu-Law as 16-bit:
wav.fromMuLaw();
```

## Change the bit depth
Currently there is **no dithering** when changing the bit depth.

If the samples are stereo they need to be interleaved before changing the bit depth.

Notice that you **can't** change to and from 4-bit ADPCM, 8-bit A-Law and 8-bit mu-Law. To encode/decode files as ADPCM, A-Law and mu-Law you must use the *toIMAADPCM()*, *fromIMAADPCM()*, *toALaw()*, *fromALaw()*, *toMuLaw()* and *fromMuLaw()* methods. Only 16-bit samples can be encoded, and decoding always result in 16-bit samples.

```javascript
let wav = new Wavefile(fs.readFileSync("file.wav"));

// Possible values are:
//  "8", "16", "24", "32", "32f", "64"
wav.toBitDepth("24");
```

### The properties
```javascript
let wav = new Wavefile(fs.readFileSync("file.wav"));

// The container, "RIFF" or "RIFX"
console.log(wav.chunkId);
console.log(wav.chunkSize);
console.log(wav.format); // WAVE

// "fmt "
console.log(wav.fmtChunkId);
console.log(wav.fmtChunkSize);
console.log(wav.audioFormat);
console.log(wav.numChannels);
console.log(wav.sampleRate);
console.log(wav.byteRate);
console.log(wav.blockAlign);
console.log(wav.bitsPerSample);
console.log(wav.cbSize);
console.log(wav.validBitsPerSample);

// "fact"
console.log(wav.factChunkId);
console.log(wav.factChunkSize);
console.log(wav.dwSampleLength);

// "data"
console.log(wav.dataChunkId);
console.log(wav.dataChunkSize);

// array of numbers
console.log(wav.samples);
```

### The samples
Range:
- 0 to 255 for 8-bit
- -32768 to 32767 for 16-bit
- -8388608 to 8388607 for 24-bit
- -2147483648 to 2147483647 for 32-bit
- -1.0 to 1.0 for 32-bit (float)
- -1.0 to 1.0 for 64-bit (float)

## LICENSE
Copyright (c) 2017-2018 Rafael da Silva Rocha.

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
