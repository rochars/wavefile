/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 16-bit wave files from scratch', function() {
    
    let wavefile = require('../../index.js');
    let wav = new wavefile.WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767], {"container": "RIFX"});

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/16-bit-48kHz-mono-RIFX-fromScratch.wav", wav.toBuffer());

    it('chunkId should be "RIFX"', function() {
        assert.equal(wav.chunkId, "RIFX");
    });

    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });

    it('subChunk1Id should be "fmt "', function() {
        assert.equal(wav.subChunk1Id, "fmt ");
    });

    it('subChunk1Size should be 16', function() {
        assert.equal(wav.subChunk1Size, 16);
    });

    it('audioFormat should be 1', function() {
        assert.equal(wav.audioFormat, 1);
    });

    it('numChannels should be 1', function() {
        assert.equal(wav.numChannels, 1);
    });

    it('sampleRate should be 48000', function() {
        assert.equal(wav.sampleRate, 48000);
    });

    it('byteRate should be 96000', function() {
        assert.equal(wav.byteRate, 96000);
    });

    it('blockAlign should be 2', function() {
        assert.equal(wav.blockAlign, 2);
    });

    it('bitsPerSample should be 16', function() {
        assert.equal(wav.bitsPerSample, 16);
    });

    it('subChunk2Id should be "data"', function() {
        assert.equal(wav.subChunk2Id, "data");
    });

    it('subChunk2Size should be 8', function() {
        assert.equal(wav.subChunk2Size, 8);
    });

    it('samples_ should be the same as the args', function() {
        assert.deepEqual(wav.samples_, [0, 1, -32768, 32767]);
    });

    it('bitDepth_ should be "16"', function() {
        assert.equal(wav.bitDepth_, "16");
    });
});
