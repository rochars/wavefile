/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 8-bit files with the fromScratch() method.
 * 
 */

import WaveFile from '../loader.js';
import assert from 'node:assert';

describe('getSamples(), 8 bit file', function () {

    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

    it('Should return the samples in the file', function () {
        assert.deepEqual(wav.getSamples(), new Float64Array([0, 255, 2, 3]));
    });
});

describe('getSamples(outputObject=Uint8Array), 8 bit file', function () {

    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '8', [0, 255, 2, 3]);

    it('Should return the samples in the file', function () {
        assert.deepEqual(wav.getSamples(
            true, Uint8Array),
            new Uint8Array([0, 255, 2, 3]));
    });

    it('Should return a Uint8Array', function () {
        assert.equal(wav.getSamples(
            true, Uint8Array).constructor,
            Uint8Array);
    });
});

describe('getSamples(outputObject=Uint8Array), 16 bit file, stereo', function () {

    var wav = new WaveFile();
    var samples = [
        [0, 255, 2, 3],
        [1, 676, 33, 21]
    ];
    wav.fromScratch(1, 48000, '16', samples);

    it('Should return the samples in the file', function () {
        assert.deepEqual(wav.getSamples(
            true, Int16Array),
            new Int16Array([0, 1, 255, 676, 2, 33, 3, 21]));
    });

    it('Should return a Uint8Array', function () {
        assert.equal(wav.getSamples(
            true, Int16Array).constructor,
            Int16Array);
    });
});