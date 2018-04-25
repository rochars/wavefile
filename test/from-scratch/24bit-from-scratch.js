/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 24-bit wave files from scratch', function() {
    
    const WaveFile = require("../../test/loader.js");
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '24', [0, 1, -8388608, 8388607]);

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/24-bit-48kHz-mono-fromScratch.wav", wav.toBuffer());

    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.chunkId, "RIFF");
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

    it('byteRate should be 144000', function() {
        assert.equal(wav.byteRate, 144000);
    });

    it('blockAlign should be 3', function() {
        assert.equal(wav.blockAlign, 3);
    });

    it('bitsPerSample should be 24', function() {
        assert.equal(wav.bitsPerSample, 24);
    });

    it('dataChunkId should be "data"', function() {
        assert.equal(wav.dataChunkId, "data");
    });

    it('dataChunkSize should be 12', function() {
        assert.equal(wav.dataChunkSize, 12);
    });

    it('samples should be the same as the args', function() {
        assert.deepEqual(wav.samples, [0, 1, -8388608, 8388607]);
    });

    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "24");
    });

    /*
    it('should return a 24-bit wave file', function() {
        let wav = rw64.writeWavBytes(1, 48000, '24',
            [0, 1, -8388608, 8388607]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.blockAlign, 3);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 24);
        assert.equal(wavRead.dataChunkSize, 12); // 4 x 3
        assert.deepEqual(wavRead.samples, [0, 1, -8388608, 8388607]);
    });

    it('should return a 24-bit wave file with a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '24',
            [0, 1, -8388608, 8388607, 4]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 24);
        assert.equal(wavRead.blockAlign, 3);
        assert.equal(wavRead.dataChunkSize, 15); // 5 x 3
        assert.deepEqual(wavRead.samples, [0, 1, -8388608, 8388607, 4]);
    });

    it('should return a 24-bit wave file with 8 channels', function() {
        let wav = rw64.writeWavBytes(8, 48000, '24',
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.fmtChunkSize, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 8);
        assert.equal(read.sampleRate, 48000);
        assert.equal(read.blockAlign, 24);
        assert.equal(read.bitsPerSample, 24);
    });

    it('should return a 24-bit wave file encoded as a base 64 string',
            function() {
        assert.ok(rw64.writeWavBase64(1, 48000, '24',
            [0, 0.5, -0.5]));
    });

    it('should return a 24-bit wave file encoded as a Data URI',
            function() {
        assert.ok(rw64.writeWavDataURI(1, 48000, '24',
            [0, 0.5, -0.5]));
    });

    it('should write a 24-bit stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '24', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.fmtChunkSize, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 6);
        assert.equal(read.bitsPerSample, 24);
    });

    it('should write a 24-bit stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '24', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.fmtChunkSize, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 6);
        assert.equal(read.bitsPerSample, 24);
    });
    */
});
