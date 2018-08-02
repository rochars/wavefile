/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 8-bit files with the fromScratch() method.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('setSample(): 8-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);
    var byteCount = wav.data.samples.length;
    wav.setSample(1, 2);

    it('sample at 1 should be 2', function() {
        assert.equal(wav.getSample(1), 2);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.setSample(4, 0);}, Error);
    });
    it('number of bytes in data.samples should be the same', function() {
        assert.equal(wav.data.samples.length, byteCount);
    });
});

describe('setSample(): 16-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);
    var byteCount = wav.data.samples.length;
    wav.setSample(1, -32768);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(1), -32768);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.setSample(4, 1);}, Error);
    });
    it('number of bytes in data.samples should be the same', function() {
        assert.equal(wav.data.samples.length, byteCount);
    });
});

describe('setSample(): 24-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '24', [0, 1, -8388608, 8388607]);
    var byteCount = wav.data.samples.length;
    wav.setSample(1, -83886);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(1), -83886);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
    it('number of bytes in data.samples should be the same', function() {
        assert.equal(wav.data.samples.length, byteCount);
    });
});

describe('setSample(): 32-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 44100, '32', [0, 1, -2147483648, 2147483647]);
    var byteCount = wav.data.samples.length;
    wav.setSample(1, -21474);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(1), -21474);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
    it('number of bytes in data.samples should be the same', function() {
        assert.equal(wav.data.samples.length, byteCount);
    });
});

describe('setSample(): 32-bit fp wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 44100, '32f', [0, 1, 0.04029441, -0.04029440]);
    var byteCount = wav.data.samples.length;
    wav.setSample(1, 2);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(1), 2);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
    it('number of bytes in data.samples should be the same', function() {
        assert.equal(wav.data.samples.length, byteCount);
    });
});

describe('setSample(): 64-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(
        1, 44100, '64',
        [0.0, 1, 0.04029440055111987, -0.04029440055111987]);
    var byteCount = wav.data.samples.length;
    wav.setSample(1, 2);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(1), 2);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
    it('number of bytes in data.samples should be the same', function() {
        assert.equal(wav.data.samples.length, byteCount);
    });
});

describe('setSample(): 16-bit RIFX wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(
        1, 48000, '16', [0, 1, -32768, 32767], {container: "RIFX"});
    var byteCount = wav.data.samples.length;
    wav.setSample(1, -32768);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(1), -32768);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
    it('number of bytes in data.samples should be the same', function() {
        assert.equal(wav.data.samples.length, byteCount);
    });
});
