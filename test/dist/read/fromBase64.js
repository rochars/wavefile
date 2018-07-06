/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test loading a WaveFile object from a DataURI with the
 * fromDataURI() method.
 * 
 */

const assert = require("assert");
const WaveFile = require("../../../test/loader.js");

describe('create 16-bit wave file from DataURI string', function() {
    
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);
    let wav2 = new WaveFile();
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
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav2.data.samples, [0, 1, -32768, 32767]);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav2.bitDepth, "16");
    });
});
