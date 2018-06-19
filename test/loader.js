/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Load WaveFile according to the context of the tests.
 * To test the sources: npm test
 * To the test the browser dist: npm run test-browser
 * To the test the UMD: npm run test-umd
 */

let WaveFile;

// Browser dist
if (process.argv[3] == '--browser') {
	require('browser-env')();
	require('../dist/wavefile.min.js');
	WaveFile = window.WaveFile;

// UMD dist
} else if (process.argv[3] == '--umd') {
    WaveFile = require('../dist/wavefile.umd.js');
	
// Source
} else {
	WaveFile = require('../index.js');
}

module.exports = WaveFile;