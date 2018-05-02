/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 16-bit wave files from scratch', function() {
    
    const WaveFile = require("../../test/loader.js");
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/16-bit-48kHz-mono-fromScratch.wav", wav.toBuffer());

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
        assert.deepEqual(wav.data.samples, [0, 1, -32768, 32767]);
    });

    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });

    /*
    it('should return a 16-bit wave file', function() {
        let wav = rw64.writeWavBytes(1, 48000, '16',
            [0, 1, -32768, 32767]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.blockAlign, 2);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 16);
        assert.deepEqual(wavRead.samples, [0, 1, -32768, 32767]);
    });

    it('should return a 16-bit wave file with a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '16',
            [0, 1, -32768, 32767, 4]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.blockAlign, 2);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 16);
        assert.deepEqual(wavRead.samples, [0, 1, -32768, 32767, 4]);
    });

    it('should write a 16-bit stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '16', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.fmtChunkSize, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 4);
        assert.equal(read.bitsPerSample, 16);
    });
    */
});
