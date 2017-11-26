/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("32-bit IEEE from file to 8-bit", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile(
        fs.readFileSync(path + "64bit-48kHz-noBext-mono.wav"));
    wav.toBitDepth("8");
    fs.writeFileSync(path + "/out/to-bit-depth/64-to-8.wav", wav.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav.chunkId, "RIFF");
    });
    it("subChunk1Id should be 'fmt '",
            function() {
        assert.equal(wav.subChunk1Id, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("subChunk1Size should be 16",
            function() {
        assert.equal(wav.subChunk1Size, 16);
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
    it("byteRate be 48000",
            function() {
        assert.equal(wav.byteRate, 48000);
    });
    it("blockAlign should be 1",
            function() {
        assert.equal(wav.blockAlign, 1);
    });
    it("bitsPerSample should be 8",
            function() {
        assert.equal(wav.bitsPerSample, 8);
    });
    it("subChunk2Id should be 'data'",
            function() {
        assert.equal(wav.subChunk2Id, 'data');
    });
    it("subChunk2Size should be > 0",
            function() {
        assert.ok(wav.subChunk2Size > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.samples_.length > 0);
    });
});

describe("64-bit mono from scratch to 8-bit (max range)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [-1, 1];
    wav.fromScratch(1, 8000, "64", samples);
    wav.toBitDepth("8");

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav.chunkId, "RIFF");
    });
    it("subChunk1Id should be 'fmt '",
            function() {
        assert.equal(wav.subChunk1Id, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("subChunk1Size should be 16",
            function() {
        assert.equal(wav.subChunk1Size, 16);
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
    it("byteRate be 8000",
            function() {
        assert.equal(wav.byteRate,8000);
    });
    it("blockAlign should be 1",
            function() {
        assert.equal(wav.blockAlign, 1);
    });
    it("bitsPerSample should be 8",
            function() {
        assert.equal(wav.bitsPerSample, 8);
    });
    it("subChunk2Id should be 'data'",
            function() {
        assert.equal(wav.subChunk2Id, 'data');
    });
    it("subChunk2Size should be > 0",
            function() {
        assert.ok(wav.subChunk2Size > 0);
    });
    it("samples_ should be [0, 255]",
            function() {
        assert.deepEqual(wav.samples_, [0, 255]);
    });
});

describe("64-bit mono from scratch to 8-bit (0)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [0];
    wav.fromScratch(1, 8000, "64", samples);
    wav.toBitDepth("8");

    it("samples_ should be [0]",
            function() {
        assert.deepEqual(wav.samples_, [128]);
    });
});
