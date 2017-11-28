/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("16-bit from file to 32-bit", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("32");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-32.wav", wav.toBuffer());

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

describe("16-bit mono from scratch to 32-bit (max range)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [-32768, 32767];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("32");

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
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav.dataChunkId, 'data');
    });
    it("samples_ should be [-2147483648, 2147483647]",
            function() {
        assert.deepEqual(wav.samples_, [-2147483648, 2147483647]);
    });
});


describe("16-bit mono from scratch to 32-bit (0)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [0];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("32");

    it("samples_ should be [0]",
            function() {
        assert.deepEqual(wav.samples_, [0]);
    });
});
