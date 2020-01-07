/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test the listTags method of the WaveFile class.
 * @see https://github.com/rochars/wavefile
 */

var assert = assert || require('assert');
var WaveFile = WaveFile || require('../loader.js');

describe('listCuePoints() of a 16-bit wave files from scratch', function() {
    
    it('should list the cue points of a file created from scratch',
        function() {
        var wav = new WaveFile();
        var samples = [];
        for (var i=0; i<128000; i++)  {
            samples.push(0);
        }
        var deInterleaved = [samples, samples];
        wav.fromScratch(2, 8000, '24', deInterleaved);
        wav.setCuePoint({position: 1500, label: "cue marker 1"});
        wav.setCuePoint({position: 1000, label: "cue marker 2"}); //
        wav.setCuePoint({position: 1250, label: "cue marker 3"}); //
        wav.setCuePoint({position: 2000, label: "cue marker 4"}); //

        assert.deepEqual(wav.listCuePoints()[0].dwPosition, 0);
        assert.deepEqual(wav.listCuePoints()[0].position, 1000);
        assert.deepEqual(wav.listCuePoints()[0].dwSampleOffset, 8000);
        assert.deepEqual(wav.listCuePoints()[0].label, "cue marker 2");

        assert.deepEqual(wav.listCuePoints()[1].dwPosition, 0);
        assert.deepEqual(wav.listCuePoints()[1].position, 1250);
        assert.deepEqual(wav.listCuePoints()[1].dwSampleOffset, 10000);
        assert.deepEqual(wav.listCuePoints()[1].label, "cue marker 3");
        
        assert.deepEqual(wav.listCuePoints()[2].dwPosition, 0);
        assert.deepEqual(wav.listCuePoints()[2].position, 1500);
        assert.deepEqual(wav.listCuePoints()[2].dwSampleOffset, 12000);
        assert.deepEqual(wav.listCuePoints()[2].label, "cue marker 1");
        
        assert.deepEqual(wav.listCuePoints()[3].dwPosition, 0);
        assert.deepEqual(wav.listCuePoints()[3].position, 2000);
        assert.deepEqual(wav.listCuePoints()[3].dwSampleOffset, 16000);
        assert.deepEqual(wav.listCuePoints()[3].label, "cue marker 4");        
    });
    it('should return a empty array if the file have no cue points',
        function() {
        var wav = new WaveFile();
        wav.fromScratch(1, 8000, '16', []);
        assert.deepEqual(wav.listCuePoints(), []);
    });
});
