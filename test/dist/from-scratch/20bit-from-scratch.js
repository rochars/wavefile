/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 20-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 20-bit wave files from scratch', function() {
    
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<9000; i++) {
        samples.push(0);
    }
    wav.fromScratch(1, 8000, '20', samples);
    fs.writeFileSync(
        "././test/files/out/20-bit-48kHz-mono-fromScratch.wav",
        wav.toBuffer());

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
    it('byteRate should be 24000', function() {
        assert.equal(wav.fmt.byteRate, 24000);
    });
    it('blockAlign should be 3', function() {
        assert.equal(wav.fmt.blockAlign, 3);
    });
    it('bitsPerSample should be 24', function() {
        assert.equal(wav.fmt.bitsPerSample, 24);
    });
    it('validBitsPerSample should be 20', function() {
        assert.equal(wav.fmt.validBitsPerSample, 20);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be samples.length * 3', function() {
        assert.equal(wav.data.chunkSize, samples.length * 3);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav.data.samples, samples);
    });
    it('cbSize should be 22', function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it('dwChannelMask should be 0x4', function() {
        assert.equal(wav.fmt.dwChannelMask, 0x4);
    });
    it('bitDepth should be "20"', function() {
        assert.equal(wav.bitDepth, "20");
    });
    it('subformat',
        function() {
        assert.deepEqual(
            wav.fmt.subformat,
            [1, 1048576, 2852126848, 1905997824]);
    });
});
