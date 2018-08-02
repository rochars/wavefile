/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * ADPCM tests.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('16-bit to ADPCM', function() {

    var wav = new WaveFile();
    var samples = new Int16Array(1024);
    wav.fromScratch(1, 8000, '16', samples);
    wav.toIMAADPCM();

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
    it("blockAlign should be 256", function() {
        assert.equal(wav.fmt.blockAlign, 256);
    });
    it("bitsPerSample should be 4", function() {
        assert.equal(wav.fmt.bitsPerSample, 4);
    });
    it("factChunkId should be 'fact' on the new file", function() {
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
