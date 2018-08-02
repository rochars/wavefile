/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 8-bit files with the fromScratch() method.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('getSample(): 8-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(0), 0);
    });
    it('sample at 1 should be 255', function() {
        assert.equal(wav.getSample(1), 255);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
});

describe('getSample(): 16-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(0), 0);
    });
    it('sample at 1 should be 1', function() {
        assert.equal(wav.getSample(1), 1);
    });
    it('sample at 2 should be -32768', function() {
        assert.equal(wav.getSample(2), -32768);
    });
    it('sample at 3 should be 32767', function() {
        assert.equal(wav.getSample(3), 32767);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
});

describe('getSample(): 24-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '24', [0, 1, -8388608, 8388607]);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(0), 0);
    });
    it('sample at 1 should be 1', function() {
        assert.equal(wav.getSample(1), 1);
    });
    it('sample at 2 should be -8388608', function() {
        assert.equal(wav.getSample(2), -8388608);
    });
    it('sample at 3 should be 8388607', function() {
        assert.equal(wav.getSample(3), 8388607);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
});

describe('getSample(): 32-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 44100, '32', [0, 1, -2147483648, 2147483647]);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(0), 0);
    });
    it('sample at 1 should be 1', function() {
        assert.equal(wav.getSample(1), 1);
    });
    it('sample at 2 should be -2147483648', function() {
        assert.equal(wav.getSample(2), -2147483648);
    });
    it('sample at 3 should be 2147483647', function() {
        assert.equal(wav.getSample(3), 2147483647);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
});

describe('getSample(): 32-bit fp wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 44100, '32f', [0, 1, 0.04029441, -0.04029440]);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(0), 0);
    });
    it('sample at 1 should be 1', function() {
        assert.equal(wav.getSample(1), 1);
    });
    it('sample at 2 should be 0.04029441', function() {
        assert.equal(wav.getSample(2).toFixed(8), '0.04029441');
    });
    it('sample at 3 should be -0.04029440', function() {
        assert.equal(wav.getSample(3).toFixed(8), -'0.04029440');
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
});

describe('getSample(): 64-bit wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(
        1, 44100, '64',
        [0.0, 1, 0.04029440055111987, -0.04029440055111987]);

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(0), 0);
    });
    it('sample at 1 should be 1', function() {
        assert.equal(wav.getSample(1), 1);
    });
    it('sample at 2 should be 0.04029440055111987', function() {
        assert.equal(wav.getSample(2), 0.04029440055111987);
    });
    it('sample at 3 should be -0.04029440055111987', function() {
        assert.equal(wav.getSample(3), -0.04029440055111987);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
});

describe('getSample(): 8-bit RIFX wave file from scratch', function() {
    
    var wav = new WaveFile();
    wav.fromScratch(
        1, 48000, '16', [0, 1, -32768, 32767], {container: "RIFX"});

    it('sample at 0 should be 0', function() {
        assert.equal(wav.getSample(0), 0);
    });
    it('sample at 1 should be 1', function() {
        assert.equal(wav.getSample(1), 1);
    });
    it('sample at 2 should be -32768', function() {
        assert.equal(wav.getSample(2), -32768);
    });
    it('sample at 3 should be 32767', function() {
        assert.equal(wav.getSample(3), 32767);
    });
    it('sample at 4 should throw error', function() {
        assert.throws(function() {wav.getSample(4);}, Error);
    });
});
