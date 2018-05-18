/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Tests for the WaveFile public API.
 * 
 */

const assert = require('assert');
const fs = require("fs");
const WaveFile = require("../test/loader.js");
const path = "test/files/";

describe("interface", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    
    it("Should create a WaveFile object", function() {
        assert.ok(wav);
    });
    it("toBase64 should return a string", function() {
        assert.ok(wav.toBase64());
    });
    it("toDataURI should return a string", function() {
        assert.ok(wav.toDataURI());
    });
});
