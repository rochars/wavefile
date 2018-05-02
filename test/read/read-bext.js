/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("BWF data reading", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wBytes = fs.readFileSync(path + "24bit-16kHz-bext-mono.wav");
    let wav = new WaveFile(wBytes);

    wav.fromBuffer(wBytes);

    it("should find the 'bext' chunk",
            function() {
        assert.equal(wav.bext.chunkId, "bext");
    });
    it("bextChunkSize should be > 0",
            function() {
        assert.ok(wav.bext.chunkSize > 0);
    });
});
