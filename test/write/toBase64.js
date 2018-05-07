/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('read 16bit file from disk and write to new file', function() {
    
    const fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    const path = "test/files/";
    let wav = new WaveFile(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    it("toBase64 should return a string",
            function() {
        assert.ok(wav.toBase64());
    });
    it("toDataURI should return a string",
            function() {
        assert.ok(wav.toDataURI());
    });
});
