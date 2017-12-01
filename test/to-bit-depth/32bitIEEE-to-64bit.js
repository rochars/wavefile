/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("32-bit IEEE from file to 64-bit", function() {

    let fs = require("fs");
    let WaveFile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav"));
    wav.toBitDepth("64");
    fs.writeFileSync(path + "/out/to-bit-depth/32IEEE-to-64.wav", wav.toBuffer());

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
    it("audioFormat should be 3 (IEEE)",
            function() {
        assert.equal(wav.audioFormat, 3);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav.numChannels, 1);
    });
    it("sampleRate should be 16000",
            function() {
        assert.equal(wav.sampleRate, 16000);
    });
    it("byteRate be 128000",
            function() {
        assert.equal(wav.byteRate, 128000);
    });
    it("blockAlign should be 8",
            function() {
        assert.equal(wav.blockAlign, 8);
    });
    it("bitsPerSample should be 64",
            function() {
        assert.equal(wav.bitsPerSample, 64);
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
});

describe("32-bit IEEE mono from scratch to 64-bit (max range)", function() {

    let fs = require("fs");
    let WaveFile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new WaveFile();
    let samples = [-1, 1];
    wav.fromScratch(1, 8000, "32f", samples);
    wav.toBitDepth("64");

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
    it("audioFormat should be 3 (IEEE)",
            function() {
        assert.equal(wav.audioFormat, 3);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it("byteRate be 64000",
            function() {
        assert.equal(wav.byteRate, 64000);
    });
    it("blockAlign should be 8",
            function() {
        assert.equal(wav.blockAlign, 8);
    });
    it("bitsPerSample should be 64",
            function() {
        assert.equal(wav.bitsPerSample, 64);
    });
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav.dataChunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.dataChunkSize > 0);
    });
    it("samples_ should be [-1, 1]",
            function() {
        assert.deepEqual(wav.samples_, [-1, 1]);
    });
});

describe("32-bit IEEE mono from scratch to 64-bit (128)", function() {

    let fs = require("fs");
    let WaveFile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new WaveFile();
    let samples = [0];
    wav.fromScratch(1, 8000, "32f", samples);
    wav.toBitDepth("64");

    it("samples_ should be [0]",
            function() {
        assert.deepEqual(wav.samples_, [0]);
    });
});
