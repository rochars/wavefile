/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

var assert = require('assert');

describe('interleave', function() {
    
    const WaveFile = require("../test/loader.js");   

    it('should interleave the samples of a 2-channel wave file',
            function() {
        let wav = new WaveFile();
        let stereoSamples = [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ];
        wav.fromScratch(2, 48000, '8', stereoSamples);
        //wav.interleave();
        let expected = [0, 0, -2, -1, 4, 4, 3, 3];
        assert.deepEqual(wav.data.samples, expected);
    });

    it('should de-interleave the samples of a 2-channel wave file',
            function() {
        let wav = new WaveFile();
        let samples = [0, 0, -2, -1, 4, 4, 3, 3];
        wav.fromScratch(1, 48000, '8', samples);
        wav.fmt.numChannels = 2;
        wav.deInterleave();
        let expected = [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ];
        assert.deepEqual(wav.data.samples, expected);
    });

    it('should interleave the samples of a 3-channel wave file',
            function() {
        let wav = new WaveFile();
        let stereoSamples = [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ];
        wav.fromScratch(2, 48000, '8', stereoSamples);
        //wav.interleave();
        let expected = [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3];
        assert.deepEqual(wav.data.samples, expected);
    });

    it('should de-interleave the samples of a 3-channel wave file',
            function() {
        let wav = new WaveFile();
        let samples = [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3];
        wav.fromScratch(1, 48000, '8', samples);
        wav.fmt.numChannels = 3;
        wav.deInterleave();
        let expected = [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ];
        assert.deepEqual(wav.data.samples, expected);
    });

    it('should de-interleave the samples of a 3-channel file',
            function() {
        let wav = new WaveFile();
        let samples = [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3];
        wav.fromScratch(1, 48000, '8', samples);
        wav.fmt.numChannels = 3;
        wav.deInterleave();
        let expected = [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ];
        assert.deepEqual(wav.data.samples, expected);
    });

    it('should automatically interleave the samples when writing to buffer',
            function() {
        let wav = new WaveFile();
        let samples = [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3];
        wav.fromScratch(1, 48000, '8', samples);
        wav.fmt.numChannels = 3;
        wav.deInterleave();
        wav.toBuffer();        
        assert.deepEqual(wav.data.samples, samples);
    });
});
