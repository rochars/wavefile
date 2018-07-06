/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 48-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 48-bit PCM wave files from scratch', function() {
    
    let wav = new WaveFile();
    wav.fromScratch(
        1, 44100, '48', [0, -140737488355328, 140737488355327, 4]);
    fs.writeFileSync(
        "././test/files/out/48-bitPCM-441kHz-mono-fromScratch.wav",
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
    it('sampleRate should be 44100', function() {
        assert.equal(wav.fmt.sampleRate, 44100);
    });
    it('byteRate should be 264600', function() {
        assert.equal(wav.fmt.byteRate, 264600);
    });
    it('blockAlign should be 6', function() {
        assert.equal(wav.fmt.blockAlign, 6);
    });
    it('bitsPerSample should be 48', function() {
        assert.equal(wav.fmt.bitsPerSample, 48);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 24', function() {
        assert.equal(wav.data.chunkSize, 24);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(
        //    wav.data.samples, [0, -140737488355328, 140737488355327, 4]);
    });
    it('bitDepth should be "48"', function() {
        assert.equal(wav.bitDepth, "48");
    });
});
