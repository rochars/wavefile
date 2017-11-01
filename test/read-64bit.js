/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("64-bit reading", function() {

    let fs = require("fs");
    let wavefile = require("../index.js");
    let path = "test/files/";
    
    let wBytes = fs.readFileSync(path + "64bit-48kHz-noBext-mono.wav");
    let wav = new wavefile.Wavefile(wBytes);

    it("chunkId in a 64-bit 48kHz mono wave file should be 'RIFF'",
            function() {
        assert.equal(wav.chunkId, "RIFF");
    });
    it("subChunk1Id in a 64-bit 48kHz mono wave file should be 'WAVE'",
            function() {
        assert.equal(wav.subChunk1Id, "WAVE");
    });
    it("format in a 64-bit 48kHz mono wave file should be 'fmt '",
            function() {
        assert.equal(wav.format, "fmt ");
    });
    it("subChunk1Size in a 64-bit 48kHz mono wave file should be 16",
            function() {
        assert.equal(wav.subChunk1Size, 16);
    });
    it("audioFormat in a 64-bit 48kHz mono wave file should be 3 (IEEE)",
            function() {
        assert.equal(wav.audioFormat, 3);
    });
    it("numChannels in a 64-bit 48kHz mono wave file should be 1",
            function() {
        assert.equal(wav.numChannels, 1);
    });
    it("sampleRate in a 64-bit 48kHz mono wave file should be 48000",
            function() {
        assert.equal(wav.sampleRate, 48000);
    });
    it("byteRate in a 64-bit 48kHz mono wave file should be 384000",
            function() {
        assert.equal(wav.byteRate, 384000);
    });
    it("blockAlign in a 64-bit 48kHz mono wave file should be 8",
            function() {
        assert.equal(wav.blockAlign, 8);
    });
    it("bitsPerSample in a 64-bit 48kHz mono wave file should be 64",
            function() {
        assert.equal(wav.bitsPerSample, 64);
    });
    it("subChunk2Id in a 64-bit 48kHz mono wave file should be 'data'",
            function() {
        assert.equal(wav.subChunk2Id, 'data');
    });
    it("subChunk2Size in a 64-bit 48kHz mono wave file with contents " +
        "should be > 0",
            function() {
        assert.ok(wav.subChunk2Size > 0);
    });
    it("samples.length in a 64-bit 48kHz mono wave file with contents " +
        "should be > 0",
            function() {
        assert.ok(wav.samples.length > 0);
    });
});
