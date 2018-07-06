/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test reading 32-bit (int) files.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("32-bit PCM reading", function() {

    let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
    let wav = new WaveFile(wBytes);

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
    it("sampleRate should be 48000", function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it("byteRate should be 192000", function() {
        assert.equal(wav.fmt.byteRate, 192000);
    });
    it("blockAlign should be 4", function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 32", function() {
        assert.equal(wav.fmt.bitsPerSample, 32);
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
