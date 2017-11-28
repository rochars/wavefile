/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("16-bit RIFX reading", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wBytes = fs.readFileSync(path + "RIFX-16bit-mono.wav");
    let wav = new wavefile.WaveFile(wBytes);

    // The same contents in a RIFF file
    let riffWav = new wavefile.WaveFile(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    it("chunkId should be 'RIFX'",
            function() {
        assert.equal(wav.chunkId, "RIFX");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav.fmtChunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav.fmtChunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)",
            function() {
        assert.equal(wav.audioFormat, 1);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it("byteRate be 16000",
            function() {
        assert.equal(wav.byteRate, 16000);
    });
    it("blockAlign should be 2",
            function() {
        assert.equal(wav.blockAlign, 2);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav.bitsPerSample, 16);
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
        assert.ok(wav.samples_.length > 0);
    });
    it("samples_ in RIFX file should be the same as in the RIFF file",
            function() {
        assert.deepEqual(wav.samples_, riffWav.samples_);
    });
});
