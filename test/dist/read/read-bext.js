/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test reading the "bext" chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("BWF data reading", function() {

    let wav = new WaveFile(fs.readFileSync(path + "24bit-16kHz-bext-mono.wav"));

    var stats = fs.statSync(path + "24bit-16kHz-bext-mono.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes2);
    });
    it("should find the 'bext' chunk", function() {
        assert.equal(wav.bext.chunkId, "bext");
    });
    it("bextChunkSize should be > 0", function() {
        assert.ok(wav.bext.chunkSize > 0);
    });
});
