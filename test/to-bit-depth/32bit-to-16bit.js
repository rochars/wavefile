/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("32-bit mono from file to 16-bit", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile(
        fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav"));
    wav.toBitDepth("16");
    fs.writeFileSync(path + "/out/to-bit-depth/32-to-16.wav", wav.toBuffer());

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
    it("sampleRate should be 48000",
            function() {
        assert.equal(wav.sampleRate, 48000);
    });
    it("byteRate be 96000",
            function() {
        assert.equal(wav.byteRate, 96000);
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
});

describe("32-bit mono from scratch to 16-bit (max range)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [-2147483648, 2147483647];
    wav.fromScratch(1, 8000, "32", samples);
    wav.toBitDepth("16");

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
    it("samples_ should be [-32768, 32767]",
            function() {
        assert.deepEqual(wav.samples_, [-32768, 32767]);
    });
});

describe("32-bit mono from scratch to 16-bit (0)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [0];
    wav.fromScratch(1, 8000, "32", samples);
    wav.toBitDepth("16");

    it("samples_ should be [0]",
            function() {
        assert.deepEqual(wav.samples_, [0]);
    });
});
