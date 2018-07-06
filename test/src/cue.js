/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Cue tests.
 * 
 */

var chai = chai || require('chai');
var WaveFile = WaveFile || require('../loader.js');
var assert = chai.assert;

describe('Create and delete cue points', function() {
    
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<128000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wav.fromScratch(2, 44100, '24', deInterleaved);
    wav.setCuePoint(1500, "cue marker 5");
    wav.setCuePoint(1000, "cue marker 3"); //
    wav.setCuePoint(1250, "cue marker 4"); //
    wav.setCuePoint(500, "cue marker 1"); //
    wav.setCuePoint(750, "cue marker 2"); //
    wav.setCuePoint(1750, "cue marker 6"); //
    wav.deleteCuePoint(2); // point in 750
    wav.deleteCuePoint(3); // point 1250

    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wav.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 4", function() {
        assert.equal(wav.cue.points.length, 4);
    });
});