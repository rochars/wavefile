/**
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefiles
 *
 */

let wavefile;

// Browser
if (process.argv[3] == '--min') {
    require('browser-env')();
    require('../dist/wavefile.min.js');
    wavefile = window.wavefile.WaveFile;
    //wavefile = require('../dist/wavefile.min.js').WaveFile;

// UMD
} else if (process.argv[3] == '--umd') {
	wavefile = require('../dist/wavefile.umd.js').WaveFile;

// CommonJS
} else if (process.argv[3] == '--cjs') {
	wavefile = require('../dist/wavefile.cjs.js').WaveFile;

// ESM
} else {
	wavefile = require('../index.js').WaveFile;
}

module.exports = wavefile;
