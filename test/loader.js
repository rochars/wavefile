/**
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefiles
 *
 */

/**
 * @fileoverview wavefile test loader.
 *
 * Run the tests against the dist files or source
 * according to the args.
 *
 */

/** @type {Object} */
let wavefile;

// Browser
if (process.argv[3] == '--min') {
    console.log('browser tests');
    global.window = global;
    require('../dist/wavefile.min.js');
    wavefile = window.WaveFile;

// UMD
} else if (process.argv[3] == '--umd') {
	console.log('umd tests');
	wavefile = require('../dist/wavefile.umd.js');
	if (wavefile.toString().slice(0, 5) === "class") {
		throw new Error('WaveFile in UMD dist should not be a ES6 class.');
	}

// CommonJS
} else if (process.argv[3] == '--cjs') {
	console.log('cjs tests');
	wavefile = require('../dist/wavefile.cjs.js');
	wavefileDefault = require('../dist/wavefile.cjs.js').default;
	if (wavefile != wavefileDefault) {
		throw new Error('CommonJS dist should export as default and as .default.');
	}

// ESM
} else if (process.argv[3] == '--esm') {
	console.log('esm tests');
	require = require("esm")(module);
	global.module = module;
	wavefile = require('../dist/wavefile.js').default;

// Source
} else {
	console.log('Source tests');
	require = require("esm")(module);
	global.module = module;
	wavefile = require('../index.js').default;
}

module.exports = wavefile;
