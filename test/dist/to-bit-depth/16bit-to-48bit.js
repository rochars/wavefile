/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the toBitDepth() method to convert an 16-bit file to 48-bit.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("16-bit from file to 48-bit", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("48");
    fs.writeFileSync(
        path + "/out/to-bit-depth/16-to-48.wav", wav.toBuffer());

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 40", function() {
        assert.equal(wav.fmt.chunkSize, 40);
    });
    it("audioFormat should be 65534", function() {
        assert.equal(wav.fmt.audioFormat, 65534);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 48000", function() {
        assert.equal(wav.fmt.byteRate, 48000);
    });
    it("blockAlign should be 6", function() {
        assert.equal(wav.fmt.blockAlign, 6);
    });
    it("bitsPerSample should be 48", function() {
        assert.equal(wav.fmt.bitsPerSample, 48);
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
