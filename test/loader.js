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
	wavefile = require('../dist/wavefile.js').WaveFile;
	if (wavefile.toString().slice(0, 5) === "class") {
		throw new Error('WaveFile in UMD dist should not be a ES6 class.');
	}

// Source
} else {
	console.log('Source tests');
	require = require("esm")(module);
	global.module = module;
	wavefile = require('../index.js').WaveFile;
}

module.exports = wavefile;
