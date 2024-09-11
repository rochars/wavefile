/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * A-Law tests.
 * 
 */


import WaveFile from '../loader.js';
import assert from 'node:assert';

describe('16-bit to 8-bit A-Law', function () {
    var wav = new WaveFile();
    wav.fromScratch(1, 48000, '16', [0, 1, -32768, 32767]);
    wav.toALaw();

    test("chunkId should be 'RIFF'", function () {
        assert.equal(wav.container, "RIFF");
    });
    test("fmtChunkId should be 'fmt '", function () {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    test("format should be 'WAVE'", function () {
        assert.equal(wav.format, "WAVE");
    });
    test("fmtChunkSize should be 20", function () {
        assert.equal(wav.fmt.chunkSize, 20);
    });
    test("audioFormat should be 6 (a-law)", function () {
        assert.equal(wav.fmt.audioFormat, 6);
    });
    test("numChannels should be 1", function () {
        assert.equal(wav.fmt.numChannels, 1);
    });
    test("sampleRate should be 48000", function () {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    test("blockAlign should be 1", function () {
        assert.equal(wav.fmt.blockAlign, 1);
    });
    test("bitsPerSample should be 8", function () {
        assert.equal(wav.fmt.bitsPerSample, 8);
    });
    test("dataChunkId should be 'data'", function () {
        assert.equal(wav.data.chunkId, 'data');
    });
    test("dataChunkSize should be > 0", function () {
        assert.ok(wav.data.chunkSize > 0);
    });
    test("samples.length should be > 0", function () {
        assert.ok(wav.data.samples.length > 0);
    });
});
