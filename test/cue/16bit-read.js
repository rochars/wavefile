/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("16-bit cue reading", function() {

    let fs = require("fs");
    let WaveFile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
            fs.readFileSync(path + "16bit-16kHz-markers-mono.wav")
        );
    fs.writeFileSync(path + "/out/16bit-16kHz-markers-mono.wav", wav.toBuffer());
    wav = new WaveFile(
            fs.readFileSync(path + "/out/16bit-16kHz-markers-mono.wav")
        );

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
    it("sampleRate should be 16000",
            function() {
        assert.equal(wav.sampleRate, 16000);
    });
    it("byteRate be 32000",
            function() {
        assert.equal(wav.byteRate, 32000);
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
    it("cueChunkId should be 'cue '",
            function() {
        assert.equal(wav.cueChunkId, 'cue ');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.dataChunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.samples_.length > 0);
    });
});

describe("16-bit cue reading (file with 2 markers)", function() {

    let fs = require("fs");
    let WaveFile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
            fs.readFileSync(path + "16bit-16kHz-2markers-mono.wav")
        );
    fs.writeFileSync(path + "/out/16bit-16kHz-2markers-mono.wav", wav.toBuffer());
    wav = new WaveFile(
            fs.readFileSync(path + "/out/16bit-16kHz-2markers-mono.wav")
        );

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
    it("sampleRate should be 16000",
            function() {
        assert.equal(wav.sampleRate, 16000);
    });
    it("byteRate be 32000",
            function() {
        assert.equal(wav.byteRate, 32000);
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
    it("cueChunkId should be 'cue '",
            function() {
        assert.equal(wav.cueChunkId, 'cue ');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.dataChunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.samples_.length > 0);
    });
});