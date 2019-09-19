/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha, Andreas Geissinger. MIT License.
 *
 * Test writing 8-bit files with the fromScratch() method.
 *
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('getSamples(): 8-bit wave file from scratch', function() {

    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

    it('samples from 0 - 1 should be 0, 255', function() {
        assert.equal(wav.getSamples(0,1), [0,255]);
    });
    
    it('samples from 0 - 4 should throw error', function() {
        assert.throws(function() {wav.getSamples(0,4);}, Error);
    });
});

describe('getSamples(): 16-bit wave file from scratch', function() {

    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);

    it('samples from 0 - 1 should be 0, 255', function() {
        assert.equal(wav.getSamples(0, 1), [0, 255]);
    });
    
    it('sample from 0 - 4 should throw error', function() {
        assert.throws(function() {wav.getSamples(0, 4);}, Error);
    });
});

describe('getSamples(): 24-bit wave file from scratch', function() {

    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '24', [0, 1, -8388608, 8388607]);

    it('samples from 0 - 1 should be 0, 1', function() {
        assert.equal(wav.getSamples(0, 1), [0, 1]);
    });
    
    it('samples from 0 - 4 should throw error', function() {
        assert.throws(function() {wav.getSamples(0, 4);}, Error);
    });
});

describe('getSamples(): 32-bit wave file from scratch', function() {

    var wav = new WaveFile();
    wav.fromScratch(1, 44100, '32', [0, 1, -2147483648, 2147483647]);

    it('samples from 0 - 1 should be 0, 1', function() {
        assert.equal(wav.getSamples(0, 1), [0, 1]);
    });
    
    it('sample from 0 - 4 should throw error', function() {
        assert.throws(function() {wav.getSamples(0, 4);}, Error);
    });
    
});
