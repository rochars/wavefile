/**
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefiles
 *
 */

let wavefile;

// Browser
if (process.argv[3] == '--min') {
    console.log('browser tests');
    require('browser-env')();
    require('../dist/wavefile.min.js');
    wavefile = window.WaveFile;

// UMD
} else if (process.argv[3] == '--umd') {
	console.log('umd tests');
	wavefile = require('../dist/wavefile.umd.js');

// CommonJS
} else if (process.argv[3] == '--cjs') {
	console.log('cjs tests');
	wavefile = require('../dist/wavefile.cjs.js');

// ESM
} else if (process.argv[3] == '--esm') {
	console.log('esm tests');
	wavefile = require('../dist/wavefile.js').default;

// Source
} else {
	console.log('Source tests');
	wavefile = require('../index.js').default;
}

module.exports = wavefile;
