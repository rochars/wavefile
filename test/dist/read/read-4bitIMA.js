/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test 4-bit ADPCM files.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("4-bit IMA ADPCM reading", function() {

    let wBytes = fs.readFileSync(path + '4bit-imaadpcm-8kHz-noBext-mono.wav');
    let wav = new WaveFile(wBytes);

    var stats = fs.statSync(path + '4bit-imaadpcm-8kHz-noBext-mono.wav');
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes2);
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
    it("fmtChunkSize should be 20", function() {
        assert.equal(wav.fmt.chunkSize, 20);
    });
    it("audioFormat should be 17 (IMA ADPCM)", function() {
        assert.equal(wav.fmt.audioFormat, 17);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("bitsPerSample should be 4", function() {
        assert.equal(wav.fmt.bitsPerSample, 4);
    });
    it("factChunkId should be 'fact'", function() {
        assert.equal(wav.fact.chunkId, 'fact');
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
