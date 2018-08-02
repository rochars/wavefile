/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test the listTags method of the WaveFile class.
 * @see https://github.com/rochars/wavefile
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('listTags() of a 16-bit wave files from scratch', function() {
    
    it('should list the tags of a file created from scratch', function() {
        var wav = new WaveFile();
        var samples = [];
        for (var i=0; i<8000; i++) {
            samples.push(0);
        }
        wav.fromScratch(1, 8000, '16', samples);
        wav.setTag("WVFL", "true");
        wav.setTag("WVF", "fixed");
        assert.deepEqual(wav.listTags(), {
            'WVFL': 'true',
            'WVF ': 'fixed'
        });
    });
    it('should return a empty object if the file have no tags', function() {
        var wav = new WaveFile();
        wav.fromScratch(1, 8000, '16', []);
        assert.deepEqual(wav.listTags(), {});
    });
});
