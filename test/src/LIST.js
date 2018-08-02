/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * LIST tests.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('create 16-bit wave files with tags (LIST chunk)', function() {

    var wav = new WaveFile();
    var samples = [];
    for (var i=0; i<8000; i++) {
        samples.push(0);
    }
    wav.fromScratch(1, 8000, '16', samples);
    wav.setTag("WVFL", "true");
    wav.setTag("WVF", "fixed");
    
    it("Try to remove a tag that does not exist", function() {
        assert.ok(wav.deleteTag("INEX") === false);
    });
    it("Try to get a tag that does not exist should return null", function() {
        assert.ok(wav.getTag("INEX") === null);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav.LIST[0].chunkId, "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav.LIST[0].format, "INFO");
    });
    it("LISTChunks[0].subChunks.length 2", function() {
        assert.equal(wav.LIST[0].subChunks.length, 2);
    });
    // good tag
    it("LISTChunks[0].subChunks[0].chunkId should be 'WVFL'", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkId, "WVFL");
    });
    it("'WVFL' size", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkSize, 5);
    });
    it("'WVFL' value", function() {
        assert.equal(wav.LIST[0].subChunks[0].value, "true");
    });
    // fix tag
    it("LISTChunks[0].subChunks[0].chunkId should be 'WVF '", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkId, "WVF ");
    });
    it("'WVF ' size", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkSize, 6);
    });
    it("'WVF ' value", function() {
        assert.equal(wav.LIST[0].subChunks[1].value, "fixed");
    });
    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 8000', function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it('byteRate should be 16000', function() {
        assert.equal(wav.fmt.byteRate, 16000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 16000', function() {
        assert.equal(wav.data.chunkSize, 16000);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});
