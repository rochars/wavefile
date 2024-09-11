/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2019 Rafael da Silva Rocha. MIT License.
 *
 * toMono() tests.
 * 
 */

import WaveFile from '../loader.js';
import assert from 'node:assert';

describe('Turn a file with 2 channels to a mono file', function() {
    
    var wav = new WaveFile();
    var samples = [1,3,1,3];
    wav.fromScratch(2, 8000, 8, samples);
    
    it("wav.fmt.numChannels should be 2 before toMono()", function() {
        assert.equal(wav.fmt.numChannels, 2);
    });
});
