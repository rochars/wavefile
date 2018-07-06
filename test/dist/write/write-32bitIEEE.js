/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 32-bit FP files.
 * 
 */

const assert = require('assert');
const path = "./test/files/";
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");

describe('read 32bit IEEE from disk and write to new file', function() {
    
    let wBytes = fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav");
    let wav = new WaveFile(wBytes);
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/32bitIEEE-16kHz-bext-mono.wav", wav2.toBuffer());
    
    it("toBuffer should return a array of bytes", function() {
        assert.ok(wav.toBuffer());
    });
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav2.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)", function() {
        assert.equal(wav2.fmt.audioFormat, 3);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 16000", function() {
        assert.equal(wav2.fmt.sampleRate, 16000);
    });
    it("byteRate should be 64000", function() {
        assert.equal(wav2.fmt.byteRate, 64000);
    });
    it("blockAlign should be 4", function() {
        assert.equal(wav2.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 32", function() {
        assert.equal(wav2.fmt.bitsPerSample, 32);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav2.data.samples.length > 0);
    });
    it("samples on the new file should have the same length as in the " +
        "original file", function() {
        assert.equal(wav2.data.samples.length, wav.data.samples.length);
    });
    it("samples on the new file should be same as the original file",
            function() {
        assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
});

describe('read 32bit IEEE with markers and regions and write to new file',
    function() {
    
    let wBytes = fs.readFileSync(path + "32IEEE-meta.wav");
    let wav = new WaveFile(wBytes);
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/32IEEE-meta.wav", wav2.toBuffer());
    
    it("toBuffer should return a array of bytes", function() {
        assert.ok(wav.toBuffer());
    });
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav2.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)", function() {
        assert.equal(wav2.fmt.audioFormat, 3);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 16000", function() {
        assert.equal(wav2.fmt.sampleRate, 44100);
    });
    it("byteRate should be 64000", function() {
        assert.equal(wav2.fmt.byteRate, 176400);
    });
    it("blockAlign should be 4", function() {
        assert.equal(wav2.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 32", function() {
        assert.equal(wav2.fmt.bitsPerSample, 32);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav2.data.samples.length > 0);
    });
    it("samples on the new file should have the same length as in " +
        "the original file", function() {
        assert.equal(wav2.data.samples.length, wav.data.samples.length);
    });
    it("samples on the new file should be same as the original file",
            function() {
        assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
});