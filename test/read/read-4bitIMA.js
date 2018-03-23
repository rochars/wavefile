/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("4-bit IMA ADPCM reading", function() {

    let fs = require("fs");
    let WaveFile = require("../../index.js");
    let path = "test/files/";

    let wBytes = fs.readFileSync(path + '4bit-imaadpcm-8kHz-noBext-mono.wav');
    let wav = new WaveFile(wBytes);

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
    it("fmtChunkSize should be 20",
            function() {
        assert.equal(wav.fmtChunkSize, 20);
    });
    it("audioFormat should be 17 (IMA ADPCM)",
            function() {
        assert.equal(wav.audioFormat, 17);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it("bitsPerSample should be 4",
            function() {
        assert.equal(wav.bitsPerSample, 4);
    });
    it("factChunkId should be 'fact'",
            function() {
        assert.equal(wav.factChunkId, 'fact');
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
