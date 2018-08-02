/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Tests for the WaveFile API.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('API properties', function() {

    wav = new WaveFile();
    
    // WaveFile
    it('should create a WaveFile object', function() {
        assert.ok(wav);
    });

    // properties
    it('should have a fmt chunk property', function() {
        assert.ok(wav.fmt);
    });
    it('should have a fact chunk property', function() {
        assert.ok(wav.fact);
    });
    it('should have a cue chunk property', function() {
        assert.ok(wav.cue);
    });
    it('should have a smpl chunk property', function() {
        assert.ok(wav.smpl);
    });
    it('should have a bext chunk property', function() {
        assert.ok(wav.bext);
    });
    it('should have a ds64 chunk property', function() {
        assert.ok(wav.ds64);
    });
    it('should have a data chunk property', function() {
        assert.ok(wav.data);
    });
    it('should have a LIST chunk property', function() {
        assert.ok(wav.LIST);
    });
    it('should have a junk chunk property', function() {
        assert.ok(wav.junk);
    });
});


describe('API Methods', function() {

    wav = new WaveFile();

    // methods
    it('should return a Uint8Array', function() {
        wav.fromScratch(1, 8000, '8', [0,0], {container: 'RIFX'});
        var buffer = wav.toBuffer();
        assert.equal(
        	buffer.constructor,
        	new Uint8Array().constructor);
    });
});