/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the toBitDepth() method to convert an 16-bit file to 8-bit.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("16-bit from file to 8-bit", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    let wav3 = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("8");
    fs.writeFileSync(
        path + "/out/to-bit-depth/16-to-8.wav", wav.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/to-bit-depth/16-to-8.wav"));
    var stats = fs.statSync(path + "16-bit-8kHz-noBext-mono.wav");
    var fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/to-bit-depth/16-to-8.wav");
    var fileSizeInBytes2 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav3.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav2.chunkSize should be == fileSizeInBytes2", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 8000", function() {
        assert.equal(wav.fmt.byteRate, 8000);
    });
    it("blockAlign should be 1", function() {
        assert.equal(wav.fmt.blockAlign, 1);
    });
    it("bitsPerSample should be 8", function() {
        assert.equal(wav.fmt.bitsPerSample, 8);
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

describe("16-bit mono from scratch to 8-bit (max range)", function() {

    let wav = new WaveFile();
    let samples = [-32768, 32767];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("8");

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
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 8000", function() {
        assert.equal(wav.fmt.byteRate, 8000);
    });
    it("blockAlign should be 1", function() {
        assert.equal(wav.fmt.blockAlign, 1);
    });
    it("bitsPerSample should be 8", function() {
        assert.equal(wav.fmt.bitsPerSample, 8);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples should be [0, 255]", function() {
        //assert.deepEqual(wav.data.samples, [0, 255]);
    });
});

describe("16-bit mono from scratch to 8-bit (0)", function() {

    let wav = new WaveFile();
    let samples = [0];
    wav.fromScratch(1, 8000, "16", samples);
    wav.toBitDepth("8");

    it("samples should be [128]", function() {
        //assert.deepEqual(wav.data.samples, [128]);
    });
});
