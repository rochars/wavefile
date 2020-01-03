/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2020 Rafael da Silva Rocha. MIT License.
 *
 * Read files with iXML chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("Read files with iXML chunk", function() {
    let wav = new WaveFile(
        fs.readFileSync(path + "24bit-48kHz-1c-mixpre6-hiser_interview.WAV"));

    it("should find the 'iXML' chunk", function() {
        assert.equal(wav.iXML.chunkId, "iXML");
    });
    it("'iXML' chunkSize should be", function() {
        assert.equal(wav.iXML.chunkSize, 2976);
    });
    it("'iXML' value should be a string with length = 2976", function() {
        assert.equal(wav.iXML.value.length, 2976);
    });
});
