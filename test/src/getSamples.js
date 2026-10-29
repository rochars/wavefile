/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 8-bit files with the fromScratch() method.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('getSamples(), 8 bit file', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

    it('Should return the samples in the file', function() {
        assert.deepEqual(wav.getSamples(), new Float64Array([0, 255, 2, 3]));
    });
});

describe('getSamples(outputObject=Uint8Array), 8 bit file', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

    it('Should return the samples in the file', function() {
        assert.deepEqual(wav.getSamples(
            interleaved=true, outputObject=Uint8Array),
        new Uint8Array([0, 255, 2, 3]));
    });

    it('Should return a Uint8Array', function() {
        assert.equal(wav.getSamples(
            interleaved=true, outputObject=Uint8Array).constructor,
        Uint8Array);
    });
});

describe('getSamples(outputObject=Uint8Array), 16 bit file, stereo', function() {
    
    var wav = new WaveFile();
    var samples = [
        [0, 255, 2, 3],
        [1, 676, 33, 21]
    ];
    wav.fromScratch(1, 48000, '16', samples);

    it('Should return the samples in the file', function() {
        assert.deepEqual(wav.getSamples(
            interleaved=true, outputObject=Int16Array),
        new Int16Array([0, 1, 255, 676, 2, 33, 3, 21]));
    });

    it('Should return a Uint8Array', function() {
        assert.equal(wav.getSamples(
            interleaved=true, outputObject=Int16Array).constructor,
        Int16Array);
    });
});

describe('getSamples(), 8 bit file with an odd-sized "data" chunk', function() {
    
    // 7 samples in the "data" chunk, followed by a pad byte
    var wav = new WaveFile(new Uint8Array([
        82, 73, 70, 70, 44, 0, 0, 0, 87, 65, 86, 69,
        102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0,
        174, 72, 3, 0, 174, 72, 3, 0, 1, 0, 8, 0,
        100, 97, 116, 97, 7, 0, 0, 0,
        23, 131, 16, 235, 218, 29, 30, 0]));

    it('Should not return the pad byte as a sample', function() {
        assert.deepEqual(wav.getSamples(),
            new Float64Array([23, 131, 16, 235, 218, 29, 30]));
    });

    it('Should keep the size of the "data" chunk in toBuffer()', function() {
        assert.equal(new WaveFile(wav.toBuffer()).data.chunkSize, 7);
    });
});