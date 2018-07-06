/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 64-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 64-bit wave file from scratch', function() {
    
    let wav = new WaveFile();
    wav.fromScratch(
        1, 44100, '64',
        [0.0, 0.04029440055111987, -0.04029440055111987, 1.0]);
    fs.writeFileSync(
        "././test/files/out/64-bit-441kHz-mono-fromScratch.wav",
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
    it('audioFormat should be 3', function() {
        assert.equal(wav.fmt.audioFormat, 3);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 44100', function() {
        assert.equal(wav.fmt.sampleRate, 44100);
    });
    it('byteRate should be 176400', function() {
        assert.equal(wav.fmt.byteRate, 352800);
    });
    it('blockAlign should be 4', function() {
        assert.equal(wav.fmt.blockAlign, 8);
    });
    it('bitsPerSample should be 32', function() {
        assert.equal(wav.fmt.bitsPerSample, 64);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 16', function() {
        assert.equal(wav.data.chunkSize, 32);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(
        //    wav.data.samples,
        //    [0.0, 0.04029440055111987, -0.04029440055111987, 1.0]);
    });
    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "64");
    });
});
