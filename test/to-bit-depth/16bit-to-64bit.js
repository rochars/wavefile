/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("16-bit from file to 64-bit", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("64");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-64.wav", wav.toBuffer());

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

describe("16-bit mono from scratch to 64-bit (max range)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [-32768, 32767];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("64");

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
    it("subChunk2Id should be 'data'",
            function() {
        assert.equal(wav.subChunk2Id, 'data');
    });
    it("subChunk2Size should be > 0",
            function() {
        assert.ok(wav.subChunk2Size > 0);
    });
});

describe("16-bit mono from scratch to 64-bit (0)", function() {

    let fs = require("fs");
    let wavefile = require("../../index.js");
    let path = "test/files/";
    
    let wav = new wavefile.WaveFile();
    let samples = [0];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("64");

    it("samples_ should be [0]",
            function() {
        assert.deepEqual(wav.samples_, [0]);
    });
});
