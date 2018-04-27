/*!
 * Wavefile
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 12-bit wave files from scratch', function() {
    
    const WaveFile = require("../../test/loader.js");
    let wav = new WaveFile();

    let samples = [];
    for (let i=0; i<9000; i++) {
        let num = (Math.floor(Math.random() * (32767 / 2)) + 1) *
            (Math.floor(Math.random()*2) == 1 ? 1 : -1);
        samples.push(num);
    }

    wav.fromScratch(1, 8000, '12', samples);

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/12-bit-48kHz-mono-fromScratch.wav", wav.toBuffer());

    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.chunkId, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmtChunkId, "fmt ");
    });
    it('fmtChunkSize should be 40', function() {
        assert.equal(wav.fmtChunkSize, 40);
    });
    it('audioFormat should be 65534', function() {
        assert.equal(wav.audioFormat, 65534);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.numChannels, 1);
    });
    it('sampleRate should be 8000', function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it('byteRate should be 16000', function() {
        assert.equal(wav.byteRate, 16000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav.blockAlign, 2);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.bitsPerSample, 16);
    });
    it('validBitsPerSample should be 12', function() {
        assert.equal(wav.validBitsPerSample, 12);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.dataChunkId, "data");
    });
    it('dataChunkSize should be samples.length * 2', function() {
        assert.equal(wav.dataChunkSize, samples.length * 2);
    });
    it('samples should be the same as the args', function() {
        assert.deepEqual(wav.samples, samples);
    });
    it('cbSize should be 22', function() {
        assert.equal(wav.cbSize, 22);
    });
    it('dwChannelMask should be 0', function() {
        assert.equal(wav.dwChannelMask, 0);
    });
    it('bitDepth should be "12"', function() {
        assert.equal(wav.bitDepth, "12");
    });
});

describe('create 12-bit wav with samples from a existing 12-bit wav', function() {
    
    const WaveFile = require("../../test/loader.js");
    let fs = require('fs');
    let path = "test/files/";

    let sourceWav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));

    let wav = new WaveFile();
    wav.fromScratch(2, 8000, '12', sourceWav.samples);

    fs.writeFileSync("./test/files/out/M1F1-int12WE-AFsp-recreated.wav", wav.toBuffer());

    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.chunkId, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmtChunkId, "fmt ");
    });
    it('fmtChunkSize should be 40', function() {
        assert.equal(wav.fmtChunkSize, 40);
    });
    it('audioFormat should be 65534', function() {
        assert.equal(wav.audioFormat, 65534);
    });
    it('numChannels should be 2', function() {
        assert.equal(wav.numChannels, 2);
    });
    it('sampleRate should be 8000', function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it('byteRate should be 16000', function() {
        assert.equal(wav.byteRate, 32000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav.blockAlign, 4);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.bitsPerSample, 16);
    });
    it('validBitsPerSample should be 12', function() {
        assert.equal(wav.validBitsPerSample, 12);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.dataChunkId, "data");
    });
    it('dataChunkSize should be samples.length * 2', function() {
        assert.equal(wav.dataChunkSize, sourceWav.samples.length * 2);
    });
    it('samples should be the same as the args', function() {
        assert.deepEqual(wav.samples, sourceWav.samples);
    });
    it('cbSize should be 22', function() {
        assert.equal(wav.cbSize, 22);
    });
    it('dwChannelMask should be 0', function() {
        assert.equal(wav.dwChannelMask, 0);
    });
    it('bitDepth should be "12"', function() {
        assert.equal(wav.bitDepth, "12");
    });
});

