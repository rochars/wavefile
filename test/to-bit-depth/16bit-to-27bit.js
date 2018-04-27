/*!
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("16-bit from file to 27-bit", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("27");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-27.wav", wav.toBuffer());

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
    it("audioFormat should be 65534",
            function() {
        assert.equal(wav.audioFormat, 65534);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it("byteRate be 32000",
            function() {
        assert.equal(wav.byteRate, 32000);
    });
    it("blockAlign should be 4",
            function() {
        assert.equal(wav.blockAlign, 4);
    });
    it("bitsPerSample should be 32",
            function() {
        assert.equal(wav.bitsPerSample, 32);
    });
    it("validBitsPerSample should be 27",
            function() {
        assert.equal(wav.validBitsPerSample, 27);
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
});
