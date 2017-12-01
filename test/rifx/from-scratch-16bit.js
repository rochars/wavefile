/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 16-bit wave files from scratch', function() {
    
    let WaveFile = require('../../index.js');
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767], {"container": "RIFX"});

    it('chunkId should be "RIFX"', function() {
        assert.equal(wav.chunkId, "RIFX");
    });

    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });

    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmtChunkId, "fmt ");
    });

    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmtChunkSize, 16);
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

    it('dataChunkId should be "data"', function() {
        assert.equal(wav.dataChunkId, "data");
    });

    it('dataChunkSize should be 8', function() {
        assert.equal(wav.dataChunkSize, 8);
    });

    it('samples_ should be the same as the args', function() {
        assert.deepEqual(wav.samples_, [0, 1, -32768, 32767]);
    });

    it('bitDepth_ should be "16"', function() {
        assert.equal(wav.bitDepth_, "16");
    });
});

describe('create 16-bit wave files from scratch, write and read the file', function() {
    
    let WaveFile = require('../../index.js');
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767], {"container": "RIFX"});

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/16-bit-48kHz-mono-RIFX-fromScratch.wav", wav.toBuffer());
    wav = new WaveFile(
            fs.readFileSync("./test/files/out/16-bit-48kHz-mono-RIFX-fromScratch.wav")
        );

    it('chunkId should be "RIFX"', function() {
        assert.equal(wav.chunkId, "RIFX");
    });

    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });

    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmtChunkId, "fmt ");
    });

    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmtChunkSize, 16);
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

    it('dataChunkId should be "data"', function() {
        assert.equal(wav.dataChunkId, "data");
    });

    it('dataChunkSize should be 8', function() {
        assert.equal(wav.dataChunkSize, 8);
    });

    it('samples_ should be the same as the args', function() {
        assert.deepEqual(wav.samples_, [0, 1, -32768, 32767]);
    });

    it('bitDepth_ should be "16"', function() {
        assert.equal(wav.bitDepth_, "16");
    });
});
