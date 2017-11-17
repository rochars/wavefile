# wavefile
Handle wave files with 4, 8, 16, 24, 32 PCM, 32 IEEE & 64-bit data.  
Copyright (c) 2017 Rafael da Silva Rocha.  
https://github.com/rochars/wavefile

[![Build Status](https://travis-ci.org/rochars/wavefile.svg?branch=master)](https://travis-ci.org/rochars/wavefile) [![Build status](https://ci.appveyor.com/api/projects/status/kgaqhpahfgsta50s?svg=true)](https://ci.appveyor.com/project/rochars/wavefile) [![codecov](https://codecov.io/gh/rochars/wavefile/branch/master/graph/badge.svg)](https://codecov.io/gh/rochars/wavefile) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/rochars/wavefile/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/rochars/wavefile/?branch=master) [![NPM version](https://img.shields.io/npm/v/wavefile.svg?style=flat)](https://www.npmjs.com/package/wavefile) [![NPM downloads](https://img.shields.io/npm/dm/wavefile.svg?style=flat)](https://www.npmjs.com/package/wavefile)

## Install
```
npm install wavefile
```

## Use
```javascript
let fs = require("fs");
let wavefile = require("wavefile");

let wav = new wavefile.Wavefile(fs.readFileSync("file.wav"));
console.log(wav.chunkId);
console.log(wav.chunkSize);
console.log(wav.subChunk1Id);
fs.writeFileSync(path, wav.toBytes());
```

## Create wave files from scratch
```
let wav = new wavefile.WaveFile();
wav.fromScratch(1, 44100, '32', [0, -2147483648, 2147483647, 4]);
fs.writeFileSync(path, wav.toBytes());
```

### The properties
```javascript
console.log(wav.chunkId);
console.log(wav.chunkSize);
console.log(wav.subChunk1Id);

// "fmt "
console.log(wav.format);
console.log(wav.subChunk1Size);
console.log(wav.audioFormat);
console.log(wav.numChannels);
console.log(wav.sampleRate);
console.log(wav.byteRate);
console.log(wav.blockAlign);
console.log(wav.bitsPerSample);

// "data"
console.log(wav.subChunk2Id);
console.log(wav.subChunk2Size);

// array of numbers
console.log(wav.samples);
```

### The samples
Range:
- 0 to 255 for 8-bit
- -32768 to 32767 for 16-bit
- -8388608 to 8388607 for 24-bit
- -2147483648 to 2147483647 for 32-bit PCM
- -1.0 to 1.0 for 32-bit IEEE
- -1.0 to 1.0 for 64-bit

4-bit is IMA ADPCM. You must decode the samples before working with them.

## LICENSE
Copyright (c) 2017 Rafael da Silva Rocha.

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
