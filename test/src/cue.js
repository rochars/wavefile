/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Cue tests.
 * 
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('Create and delete cue points', function() {

    var wav = new WaveFile();
    var samples = [];
    for (var i=0; i<128000; i++)  {
        samples.push(0);
    }
    var deInterleaved = [
        samples,
        samples
    ];
    wav.fromScratch(2, 44100, '24', deInterleaved);

    wav.setCuePoint({position: 1500, label: "cue marker 5"});
    wav.setCuePoint({position: 1000, label: "cue marker 3"});
    wav.setCuePoint({position: 1250, label: "cue marker 4"});
    wav.setCuePoint({position: 500, label: "cue marker 1"});
    wav.setCuePoint({position: 750, label: "cue marker 2"});
    wav.setCuePoint({position: 1750, label: "cue marker 6"});

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