/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the interleave() and deInterleave() methods.
 * 
 */

const assert = require('assert');
const WaveFile = require("../test/loader.js");

describe('fromScratch with interleaved stereo samples', function() {
    
    let wav = new WaveFile();
    let stereoSamples = [
        [0, -2, 4, 3],
        [0, -1, 4, 3]
    ];
    wav.fromScratch(2, 8000, '16', stereoSamples); 
    it('byteRate should be 16000',
            function() {
        assert.deepEqual(wav.fmt.byteRate, 32000);
    });
    it('chunkSize should be 44',
            function() {
        assert.deepEqual(wav.chunkSize, 52);
    });
    it('data.chunkSize should be 8',
            function() {
        assert.deepEqual(wav.data.chunkSize, 16);
    });
});

describe('interleave', function() {

    it('should interleave the samples of a 2-channel wave file on load',
            function() {
        let wav = new WaveFile();
        wav.fromScratch(2, 48000, '16', [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ]);
        let expected = [0, 0, -2, -1, 4, 4, 3, 3];
        assert.deepEqual(wav.data.samples, expected);
    });
    it('should interleave the samples of a 3-channel wave file on load',
            function() {
        let wav = new WaveFile();
        wav.fromScratch(2, 48000, '16', [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ]);
        let expected = [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3];
        assert.deepEqual(wav.data.samples, expected);
    });
    it('should automatically interleave the samples when writing to buffer',
            function() {
        let wav = new WaveFile();
        wav.fromScratch(
            1, 48000, '16', [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3]);
        wav.fmt.numChannels = 3;
        wav.deInterleave();
        wav.toBuffer();        
        assert.deepEqual(
            wav.data.samples, [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3]);
    });
});

describe('deInterleave', function() {

    it('should de-interleave the samples of a 2-channel wave file',
            function() {
        let wav = new WaveFile();
        wav.fromScratch(1, 48000, '16', [0, 0, -2, -1, 4, 4, 3, 3]);
        wav.fmt.numChannels = 2;
        wav.deInterleave();
        assert.deepEqual(wav.data.samples, [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ]);
    });
    it('should de-interleave the samples of a 3-channel wave file according ' +
        'to the updated value of fmt.numChannels',
            function() {
        let wav = new WaveFile();
        wav.fromScratch(
            1, 48000, '16', [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3]);
        wav.fmt.numChannels = 3;
        wav.deInterleave();
        assert.deepEqual(wav.data.samples, [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ]);
    });
    it('should de-interleave the samples of a 3-channel file',
            function() {
        let wav = new WaveFile();
        wav.fromScratch(
            1, 48000, '16', [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3]);
        wav.fmt.numChannels = 3;
        wav.deInterleave();
        assert.deepEqual(wav.data.samples, [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ]);
    });
});
