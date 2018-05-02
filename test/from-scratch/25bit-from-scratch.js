/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 25-bit wave files from scratch', function() {
    
    const WaveFile = require("../../test/loader.js");
    let wav = new WaveFile();

    let samples = [];
    for (let i=0; i<9000; i++) {
        samples.push(0);
    }

    wav.fromScratch(1, 8000, '25', samples);

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/25-bit-48kHz-mono-fromScratch.wav", wav.toBuffer());

    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 40', function() {
        assert.equal(wav.fmt.chunkSize, 40);
    });
    it('audioFormat should be 65534', function() {
        assert.equal(wav.fmt.audioFormat, 65534);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 8000', function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it('byteRate should be 32000', function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it('blockAlign should be 4', function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it('bitsPerSample should be 32', function() {
        assert.equal(wav.fmt.bitsPerSample, 32);
    });
    it('validBitsPerSample should be 25', function() {
        assert.equal(wav.fmt.validBitsPerSample, 25);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be samples.length * 4', function() {
        assert.equal(wav.data.chunkSize, samples.length * 4);
    });
    it('samples should be the same as the args', function() {
        assert.deepEqual(wav.data.samples, samples);
    });
    it('cbSize should be 22', function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it('dwChannelMask should be 0', function() {
        assert.equal(wav.fmt.dwChannelMask, 0);
    });
    it('bitDepth should be "25"', function() {
        assert.equal(wav.bitDepth, "25");
    });
    it('subformat should be [1, 1048576, 2852126848, 1905997824]', function() {
        assert.deepEqual(wav.fmt.subformat, [1, 1048576, 2852126848, 1905997824]);
    });
});
