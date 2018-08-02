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

// UMD
if (process.argv[4] == '--umd') {
	console.log('umd tests');
	wavefile = require('../dist/wavefile.umd.js');
	if (wavefile.toString().slice(0, 5) === "class") {
		throw new Error('WaveFile in UMD dist should not be a ES6 class.');
	}

// ESM
} else if (process.argv[4] == '--esm') {
	console.log('esm tests');
	require = require("esm")(module);
	global.module = module;
	wavefile = require('../dist/wavefile.js').default;

// Min
} else if (process.argv[4] == '--min') {
	console.log('min tests');
	global.window = {};
	require('../dist/wavefile.min.js');
	wavefile = window.WaveFile;
// CJS
} else if (process.argv[4] == '--cjs') {
	console.log('cjs tests');
	require = require("esm")(module);
	global.module = module;
	wavefile = require('../dist/wavefile.cjs.js');

// Source
} else {
	console.log('Source tests');
	require = require("esm")(module);
	global.module = module;
	wavefile = require('../index.js').default;
}

module.exports = wavefile;
