/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Load the WaveFile class as a Node module when testing the
 * sources or as a window property when testing the minified
 * version.
 *
 * To test the sources:
 * npm test
 *
 * To the test the minified version:
 * npm run test-dist
 * 
 */

let WaveFile = require('../index.js');

if (process.argv[3] == '--dist') {
    require('browser-env')();
    require('../dist/wavefile.min.js');
    WaveFile = window.WaveFile;
}

module.exports = WaveFile;
