/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test reading 12-bit files.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("12-bit reading", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 40",
            function() {
        assert.equal(wav.fmt.chunkSize, 40);
    });
    it("audioFormat should be 65534 (WAVE_FORMAT_EXTENSIBLE)",
            function() {
        assert.equal(wav.fmt.audioFormat, 65534);
    });
    it("numChannels should be 2",
            function() {
        assert.equal(wav.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 32000",
            function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4 (stereo)",
            function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("cbSize should be 22",
            function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it("validBitsPerSample should be 12",
            function() {
        assert.equal(wav.fmt.validBitsPerSample, 12);
    });
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.data.samples.length > 0);
    });

    it("dwChannelMask should be 0",
            function() {
        assert.equal(wav.fmt.dwChannelMask, 0);
    });
    it('subformat', function() {
        assert.deepEqual(
            wav.fmt.subformat,
            [1, 1048576, 2852126848, 1905997824]);
    });
});
