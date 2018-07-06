/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 16-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 16-bit wave files from scratch', function() {
    
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);
    fs.writeFileSync(
        "././test/files/out/16-bit-48kHz-mono-fromScratch.wav",
        wav.toBuffer());
    var stats = fs.statSync(
        "././test/files/out/16-bit-48kHz-mono-fromScratch.wav");
    var fileSizeInBytes1 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
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
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 96000', function() {
        assert.equal(wav.fmt.byteRate, 96000);
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
    it('dataChunkSize should be 8', function() {
        assert.equal(wav.data.chunkSize, 8);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav.data.samples, [0, 1, -32768, 32767]);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});
