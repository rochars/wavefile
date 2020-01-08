/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2019 Rafael da Silva Rocha. MIT License.
 *
 * Test the getSamples() method.
 * 
 */

const assert = require("assert");
const WaveFile = require("../../test/loader.js");

describe('getSamples() with a mono 16-bit file', function() {
    let samples = [0, 1, -32768, 32767, 12];
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', samples);

    it("getSamples method should be available", function() {
        assert.equal(typeof wav.getSamples, 'function');
    });

    it("getSamples() should return a Float64Array", function() {
        assert.ok(wav.getSamples() instanceof Float64Array);
    });

    it("getSamples() should return the samples", function() {
        assert.deepEqual(wav.getSamples(), new Float64Array(samples));
    });
});

describe('getSamples() with a 11-bit file', function() {
    let samples = [0, 1, 67, 89, 12];
    let wav = new WaveFile();
    wav.fromScratch(1, 48000, '11', samples);

    it("getSamples method should be available", function() {
        assert.equal(typeof wav.getSamples, 'function');
    });

    it("getSamples() should return a Float64Array", function() {
        assert.ok(wav.getSamples() instanceof Float64Array);
    });

    it("getSamples() should return the samples", function() {
        assert.deepEqual(wav.getSamples(), new Float64Array(samples));
    });
});

describe('getSamples() with a stereo 16-bit file', function() {
    let wav = new WaveFile();
    let samples = [
        [0, 1, 67, 89, 12],
        [33, 34, 35, 36, 37]
    ];
    wav.fromScratch(2, 48000, '11', samples);

    it("getSamples method should be available", function() {
        assert.equal(typeof wav.getSamples, 'function');
    });

    it("getSamples() should return a Array", function() {
        assert.ok(wav.getSamples() instanceof Array);
    });

    it("getSamples() should return the samples de-interleaved", function() {
        assert.deepEqual(wav.getSamples()[0], new Float64Array(samples[0]));
        assert.deepEqual(wav.getSamples()[1], new Float64Array(samples[1]));
    });
});

describe('getSamples() with a stereo 16-bit file, interleaved', function() {
    let wav = new WaveFile();
    let samples = [
        [0, 1, 67, 89, 12],
        [33, 34, 35, 36, 37]
    ];
    let interleavedSamples = [0, 33, 1, 34, 67, 35, 89, 36, 12, 37];
    wav.fromScratch(2, 48000, '11', samples);

    it("getSamples method should be available", function() {
        assert.equal(typeof wav.getSamples, 'function');
    });

    it("getSamples(true) should return a Float64Array", function() {
        assert.ok(wav.getSamples(true) instanceof Float64Array);
    });

    it("getSamples(true) should return the samples de-interleaved", function() {
        assert.deepEqual(
            wav.getSamples(true),
            new Float64Array(interleavedSamples));
    });
});
