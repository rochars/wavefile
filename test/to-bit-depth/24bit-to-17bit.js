/*!
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("24-bit mono from file to 17-bit", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "24bit-16kHz-bext-mono.wav"));
    wav.toBitDepth("17");
    fs.writeFileSync(path + "/out/to-bit-depth/24-to-17.wav", wav.toBuffer());

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
    it("sampleRate should be 16000",
            function() {
        assert.equal(wav.sampleRate, 16000);
    });
    it("byteRate be 48000",
            function() {
        assert.equal(wav.byteRate, 48000);
    });
    it("blockAlign should be 3",
            function() {
        assert.equal(wav.blockAlign, 3);
    });
    it("bitsPerSample should be 24",
            function() {
        assert.equal(wav.bitsPerSample, 24);
    });
    it("validBitsPerSample should be 17",
            function() {
        assert.equal(wav.validBitsPerSample, 17);
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
