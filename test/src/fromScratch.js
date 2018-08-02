/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 8-bit files with the fromScratch() method.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('create a 8-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

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
    it('byteRate should be 48000', function() {
        assert.equal(wav.fmt.byteRate, 48000);
    });
    it('blockAlign should be 1', function() {
        assert.equal(wav.fmt.blockAlign, 1);
    });
    it('bitsPerSample should be 8', function() {
        assert.equal(wav.fmt.bitsPerSample, 8);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 4', function() {
        assert.equal(wav.data.chunkSize, 4);
    });
    it('bitDepth should be "8"', function() {
        assert.equal(wav.bitDepth, "8");
    });
});

describe('create a 16-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);

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
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});

describe('create a 24-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '24', [0, 1, -8388608, 8388607]);

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
    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "24");
    });
});

describe('create a 32-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 44100, '32', [0, -2147483648, 2147483647, 4]);

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
    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "32");
    });
});

describe('create a 32-bit FP wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 44100, '32f', [0, 0.04029441, -0.04029440, 1]);

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
    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "32f");
    });
});

describe('create a 64-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(
        1, 44100, '64',
        [0.0, 0.04029440055111987, -0.04029440055111987, 1.0]);

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
    it('bitDepth should be "24"', function() {
        assert.equal(wav.bitDepth, "64");
    });
});

describe('create 16-bit RIFX file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(
        1, 48000, '16', [0, 1, -32768, 32767], {container: "RIFX"});

    it('chunkId should be "RIFX"', function() {
        assert.equal(wav.container, "RIFX");
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
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});
