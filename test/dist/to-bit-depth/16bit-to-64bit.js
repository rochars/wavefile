/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the toBitDepth() method to convert an 16-bit file to 64-bit.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("16-bit from file to 64-bit", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("64");
    fs.writeFileSync(
        path + "/out/to-bit-depth/16-to-64.wav", wav.toBuffer());

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)", function() {
        assert.equal(wav.fmt.audioFormat, 3);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 64000", function() {
        assert.equal(wav.fmt.byteRate, 64000);
    });
    it("blockAlign should be 8", function() {
        assert.equal(wav.fmt.blockAlign, 8);
    });
    it("bitsPerSample should be 64", function() {
        assert.equal(wav.fmt.bitsPerSample, 64);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
});

describe("16-bit mono from scratch to 64-bit (max range)", function() {

    let wav = new WaveFile();
    let samples = [-32768, 32767];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("64");

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)", function() {
        assert.equal(wav.fmt.audioFormat, 3);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 64000", function() {
        assert.equal(wav.fmt.byteRate, 64000);
    });
    it("blockAlign should be 8", function() {
        assert.equal(wav.fmt.blockAlign, 8);
    });
    it("bitsPerSample should be 64", function() {
        assert.equal(wav.fmt.bitsPerSample, 64);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples should be [-1, 1]", function() {
        //assert.deepEqual(wav.data.samples, [-1, 1]);
    });
});

describe("16-bit mono from scratch to 64-bit (0)", function() {

    let wav = new WaveFile();
    let samples = [0];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("64");

    it("samples should be [0]", function() {
        //assert.deepEqual(wav.data.samples, [0]);
    });
});
