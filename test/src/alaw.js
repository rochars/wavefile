/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * A-Law tests.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('16-bit to 8-bit A-Law', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);
    wav.toALaw();

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
    it("audioFormat should be 6 (a-law)", function() {
        assert.equal(wav.fmt.audioFormat, 6);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 48000", function() {
        assert.equal(wav.fmt.sampleRate, 48000);
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
