/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

let wavefile = require('../index.js');

if (process.argv[3] == '--dist') {
    require('browser-env')();let assert = require('assert');
    require('../dist/wavefile-min.js');
    wavefile = window.WaveFile;
}

module.exports = wavefile;
