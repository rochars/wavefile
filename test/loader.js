/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * To test the sources:
 * npm test
 *
 * To the test the minified version:
 * npm run test-dist
 */

let WaveFile;

// test the dist
if (process.argv[3] == '--dist') {
    WaveFile = require('../dist/wavefile.min.js');
// test the source
} else {
	WaveFile = require('../index.js');
}

module.exports = WaveFile;