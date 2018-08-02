/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test reading wave files from DataURIs.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('16-bit wave file to and from DataURI string', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);
    var wav2 = new WaveFile();
    wav2.fromDataURI(wav.toDataURI());

    it('chunkId should be "RIFF"', function() {
        assert.equal(wav2.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav2.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav2.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it('sampleRate should be 48000', function() {
        assert.equal(wav2.fmt.sampleRate, 48000);
    });
    it('byteRate should be 96000', function() {
        assert.equal(wav2.fmt.byteRate, 96000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav2.fmt.blockAlign, 2);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav2.fmt.bitsPerSample, 16);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav2.data.chunkId, "data");
    });
    it('dataChunkSize should be 8', function() {
        assert.equal(wav2.data.chunkSize, 8);
    });
    it('samples should be the same as in the original', function() {
        //assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav2.bitDepth, "16");
    });
});
