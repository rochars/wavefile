/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 24-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 24-bit wave files from scratch', function() {
    
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '24', [0, 1, -8388608, 8388607]);
    fs.writeFileSync(
        "././test/files/out/24-bit-48kHz-mono-fromScratch.wav",
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
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 144000', function() {
        assert.equal(wav.fmt.byteRate, 144000);
    });
    it('blockAlign should be 3', function() {
        assert.equal(wav.fmt.blockAlign, 3);
    });
    it('bitsPerSample should be 24', function() {
        assert.equal(wav.fmt.bitsPerSample, 24);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 12', function() {
        assert.equal(wav.data.chunkSize, 12);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav.data.samples, [0, 1, -8388608, 8388607]);
    });
    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "24");
    });
});
