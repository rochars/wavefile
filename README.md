# wavefile
Copyright (c) 2017-2018 Rafael da Silva Rocha.  
https://github.com/rochars/wavefile

[![NPM version](https://img.shields.io/npm/v/wavefile.svg?style=for-the-badge)](https://www.npmjs.com/package/wavefile) [![Docs](https://img.shields.io/badge/API-docs-blue.svg?style=for-the-badge)](https://rochars.github.io/wavefile/api/) [![Manual](https://img.shields.io/badge/manual-online-blue.svg?style=for-the-badge)](https://rochars.github.io/wavefile/) [![Tests](https://img.shields.io/badge/tests-online-blue.svg?style=for-the-badge)](https://rawgit.com/rochars/wavefile/master/test/browser.html)  
[![Codecov](https://img.shields.io/codecov/c/github/rochars/wavefile.svg?style=flat-square)](https://codecov.io/gh/rochars/wavefile) [![Unix Build](https://img.shields.io/travis/rochars/wavefile.svg?style=flat-square)](https://travis-ci.org/rochars/wavefile) [![Windows Build](https://img.shields.io/appveyor/ci/rochars/wavefile.svg?style=flat-square&logo=appveyor)](https://ci.appveyor.com/project/rochars/wavefile) [![Scrutinizer](https://img.shields.io/scrutinizer/g/rochars/wavefile.svg?style=flat-square&logo=scrutinizer)](https://scrutinizer-ci.com/g/rochars/wavefile/) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1880/badge)](https://bestpractices.coreinfrastructure.org/projects/1880)

Create, read and write wav files according to the specs.

- **All MIT licensed**
- **Use it out of the box in the browser**
- **Use it out of the box in Node**
- **Use it out of the box with [TypeScript](https://www.typescriptlang.org/)**
- **Handle files up to 2GB**
- **Use it as a command line tool**
- **Less than 10kb minified + compressed, less than 32kb minified**
- Made with **[Closure Compiler](https://github.com/google/closure-compiler)** in mind (works great with others, too)

With **wavefile** you can:

- Create wav files
- Read wav files
- Change the bit depth of the audio
- Read and write RIFF tags
- Set and delete cue points and their labels
- Encode/decode files as ADPCM, A-Law and μ-Law
- Turn RIFF files to RIFX and RIFX to RIFF
- Create or edit BWF metadata ("bext" chunk)

And more.

## Install

### NPM
To use it in your programs:
```
npm install wavefile
```

To use it from the [command line](https://github.com/rochars/wavefile/blob/master/docs/README.md#cli-usage), install it globally:
```
npm install wavefile -g
```

### Yarn
To use it in your programs:
```
yarn add wavefile
```

To use it from the [command line](https://github.com/rochars/wavefile/blob/master/docs/README.md#cli-usage), install it globally:
```
yarn global add wavefile
```

### GitHub
This is not recommended as it will also include test and build assets in your installation. If this is what you want, you can:
```
git clone https://github.com/rochars/wavefile
```

And then import/require what you want from the *wavefile* folder:
```
const WaveFile = require('./wavefile/dist/wavefile.umd.js');
```

You can also download one of the files in the *./dist* folder:  
https://github.com/rochars/wavefile/tree/master/dist

## Use

### Node
If you installed via [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com), **import WaveFile from wavefile**:
```javascript
import WaveFile from 'wavefile';
let wav = new WaveFile();
```

Or:
```javascript
const WaveFile = require('wavefile');
let wav = new WaveFile();
```

### Browser
Use the compiled file in the */dist* folder of this package:
```html
<script src="./dist/wavefile.min.js"></script>
<script>
  var WaveFile = new WaveFile();
</script>
```

Or get it from the [jsDelivr](https://cdn.jsdelivr.net/npm/wavefile) CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/wavefile"></script>
```

Or get it from [unpkg](https://unpkg.com/wavefile):
```html
<script src="https://unpkg.com/wavefile"></script>
```

Or load it as a module using [jspm](https://jspm.io):
```html
<script type="module">
  import WaveFile from 'https://dev.jspm.io/wavefile';
  console.log(new WaveFile());
</script>
```

#### Browser Compatibility
**wavefile** need IE10+ to run. All moderns browsers should work fine. Cross-browser tests are on the [ROADMAP](https://github.com/rochars/wavefile/blob/master/docs/ROADMAP.md).

### ES bundle
Import WaveFile from **wavefile.js** in the *./dist* folder of this package:
```javascript
import WaveFile from './dist/wavefile.js';
let wav = new WaveFile();
```

## Manual
Learn how to use **[wavefile](https://github.com/rochars/wavefile/blob/master/docs/README.md)**

## API
Read the **[wavefile API docs](https://rochars.github.io/wavefile/api/)**

## Contributing to wavefile
**wavefile** welcomes all contributions from anyone willing to work in good faith with other contributors and the community. No contribution is too small and all contributions are valued.

See [CONTRIBUTING.md](https://github.com/rochars/wavefile/blob/master/docs/CONTRIBUTING.md) for details.

### Style guide
**wavefile** code should follow the Google JavaScript Style Guide:  
https://google.github.io/styleguide/jsguide.html

### Code of conduct
This project is bound by a Code of Conduct: The [Contributor Covenant, version 1.4](https://github.com/rochars/wavefile/blob/master/docs/CODE_OF_CONDUCT.md), also available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

## Legal
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frochars%2Fwavefile.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Frochars%2Fwavefile?ref=badge_large)

### LICENSE
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
