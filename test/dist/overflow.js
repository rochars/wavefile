/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the toBitDepth() method to convert an 64-bit file to 8-bit.
 * The 64-bit file have values > 1, so after the conversion the
 * values will cause overflow when packed to 8-bit. WaveFile should
 * truncate the values.
 *
 */


const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../loader.js");
const path = "./test/files/";
describe("32-bit IEEE from file to 8-bit", function() {
    let wav = new WaveFile(
        fs.readFileSync(path + "64bit-48kHz-noBext-mono-overflow.wav"));
    wav.data.samples[0] = 0;
    wav.data.samples[1] = 0;
    wav.data.samples[2] = 0;
    wav.data.samples[3] = 0;
    wav.data.samples[4] = 0;
    wav.data.samples[5] = 0;
    wav.data.samples[6] = 248;
    wav.data.samples[7] = 191;
    wav.toBitDepth("8");
    fs.writeFileSync(
        path + "/out/to-bit-depth/64-to-8-overflow.wav", wav.toBuffer());

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
    it("byteRate be 48000", function() {
        assert.equal(wav.fmt.byteRate, 48000);
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
