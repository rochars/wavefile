/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the toBitDepth() method to convert an 24-bit file to 17-bit.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("24-bit mono from file to 17-bit", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "24bit-16kHz-bext-mono.wav"));
    wav.toBitDepth("17");
    fs.writeFileSync(
        path + "/out/to-bit-depth/24-to-17.wav", wav.toBuffer());

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
    it("sampleRate should be 16000", function() {
        assert.equal(wav.fmt.sampleRate, 16000);
    });
    it("byteRate be 48000", function() {
        assert.equal(wav.fmt.byteRate, 48000);
    });
    it("blockAlign should be 3", function() {
        assert.equal(wav.fmt.blockAlign, 3);
    });
    it("bitsPerSample should be 24", function() {
        assert.equal(wav.fmt.bitsPerSample, 24);
    });
    it("validBitsPerSample should be 17", function() {
        assert.equal(wav.fmt.validBitsPerSample, 17);
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
    it('subformat should be [1, 1048576, 2852126848, 1905997824]',
        function() {
        assert.deepEqual(
            wav.fmt.subformat, [1, 1048576, 2852126848, 1905997824]);
    });
});
