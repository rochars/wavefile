/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * bext chunk tests.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('Add BWF to a file with no BWF (just the timeReference field on bext)',
        function() {
    
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

    // Add BWF timeReference
    wav.bext.timeReference = [1, 0];
    wav.toBuffer();
    
    it("bextChunkId should be 'bext'", function() {
        assert.equal(wav.bext.chunkId, 'bext');
    });
    it("bext.chunkSize should be 602", function() {
        assert.equal(wav.bext.chunkSize, 602);
    });
    it("'timeReference' field should be [1, 0]", function() {
        assert.deepEqual(wav.bext.timeReference, [1, 0]);
    });
});