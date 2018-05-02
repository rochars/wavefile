/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 32-bit PCM wave files from scratch', function() {
    
    const WaveFile = require("../../test/loader.js");
    let wav = new WaveFile();
    wav.fromScratch(1, 44100, '32', [0, -2147483648, 2147483647, 4]);

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/32-bitPCM-441kHz-mono-fromScratch.wav", wav.toBuffer());

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

    it('sampleRate should be 44100', function() {
        assert.equal(wav.fmt.sampleRate, 44100);
    });

    it('byteRate should be 176400', function() {
        assert.equal(wav.fmt.byteRate, 176400);
    });

    it('blockAlign should be 4', function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });

    it('bitsPerSample should be 32', function() {
        assert.equal(wav.fmt.bitsPerSample, 32);
    });

    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });

    it('dataChunkSize should be 16', function() {
        assert.equal(wav.data.chunkSize, 16);
    });

    it('samples should be the same as the args', function() {
        assert.deepEqual(wav.data.samples, [0, -2147483648, 2147483647, 4]);
    });

    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "32");
    });

    /*
    it('should return a 32-bit PCM wave file', function() {
        let wav = rw64.writeWavBytes(1, 44100, '32',
            [0, -2147483648, 2147483647, 4]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 44100);
        assert.equal(wavRead.bitsPerSample, 32);
        assert.equal(wavRead.blockAlign, 4);
        assert.deepEqual(wavRead.samples, [0, -2147483648, 2147483647, 4]);
    });

    it('should return a 32-bit PCM wave file with a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 44100, '32',
            [0, -2147483648, 45, 0, 1]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 44100);
        assert.equal(wavRead.bitsPerSample, 32);
        assert.equal(wavRead.blockAlign, 4);
        assert.deepEqual(wavRead.samples, [0, -2147483648, 45, 0, 1]);
    });

    it('should return a 32-bit PCM wave file with 7 channels', function() {
        let wav = rw64.writeWavBytes(7, 48000, '32',
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.fmtChunkSize, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 7);
        assert.equal(read.sampleRate, 48000);
        assert.equal(read.blockAlign, 28);
        assert.equal(read.bitsPerSample, 32);
    });

    it('should write a 32-bit PCM stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '32', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.fmtChunkSize, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 8);
        assert.equal(read.bitsPerSample, 32);
    });

    it('should return a 32-bit PCM file with max possible sample value',
            function() {
        let wav = rw64.writeWavBytes(1, 16000, '32',
            [-2147483648, 2147483647, -1, 1, 0]);
        let wavRead = rw64.readWavBytes(wav);
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 16000);
        assert.equal(wavRead.blockAlign, 4);
        assert.equal(wavRead.bitsPerSample, 32);
        assert.deepEqual(wavRead.samples,
            [-2147483648, 2147483647, -1, 1, 0]);
    });
    */
});
