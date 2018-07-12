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
        let wav = new WaveFile();
        let samples = [];
        for (let i=0; i<128000; i++)  {
            samples.push(0);
        }
        let deInterleaved = [samples, samples];
        wav.fromScratch(2, 8000, '24', deInterleaved);
        wav.setCuePoint(1500, "cue marker 1");
        wav.setCuePoint(1000, "cue marker 2"); //
        wav.setCuePoint(1250, "cue marker 3"); //
        wav.setCuePoint(2000, "cue marker 4"); //
        assert.deepEqual(wav.listCuePoints(), [
            {
                milliseconds: 1000,
                dwPosition: 8000,
                label: "cue marker 2"
            },
            {
                milliseconds: 1250,
                dwPosition: 10000,
                label: "cue marker 3"
            },
            {
                milliseconds: 1500,
                dwPosition: 12000,
                label: "cue marker 1"
            },
            {
                milliseconds: 2000,
                dwPosition: 16000,
                label: "cue marker 4"
            },
        ]);
    });
    it('should return a empty array if the file have no cue points',
        function() {
        let wav = new WaveFile();
        wav.fromScratch(1, 8000, '16', []);
        assert.deepEqual(wav.listCuePoints(), []);
    });
});
