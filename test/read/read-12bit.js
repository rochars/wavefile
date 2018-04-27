/*!
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("12-bit reading", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav.chunkId, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav.fmtChunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 40",
            function() {
        assert.equal(wav.fmtChunkSize, 40);
    });
    it("audioFormat should be 65534 (WAVE_FORMAT_EXTENSIBLE)",
            function() {
        assert.equal(wav.audioFormat, 65534);
    });
    it("numChannels should be 2",
            function() {
        assert.equal(wav.numChannels, 2);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it("byteRate be 32000", // 16 on a 16-bit, beacause of the block align 4?
            function() {
        assert.equal(wav.byteRate, 32000);
    });
    it("blockAlign should be 4 (stereo)",
            function() {
        assert.equal(wav.blockAlign, 4);
    });
    it("bitsPerSample should be 16", // make sure this is correct
            function() {
        assert.equal(wav.bitsPerSample, 16);
    });
    it("cbSize should be 22", // make sure this is correct
            function() {
        assert.equal(wav.cbSize, 22);
    });
    it("validBitsPerSample should be 12", // make sure this is correct
            function() {
        assert.equal(wav.validBitsPerSample, 12);
    });
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav.dataChunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.dataChunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.samples.length > 0);
    });

    it("dwChannelMask should be 0",
            function() {
        assert.equal(wav.dwChannelMask, 0);
    });
});
