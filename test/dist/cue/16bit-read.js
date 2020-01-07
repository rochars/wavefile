/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2019 Rafael da Silva Rocha. MIT License.
 *
 * Test reading the "cue " chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("16-bit cue reading", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-16kHz-markers-mono.wav"));
    wav.LISTChunks = [];
    fs.writeFileSync(
        path + "/out/16bit-16kHz-markers-mono.wav", wav.toBuffer());
    wav = new WaveFile(
        fs.readFileSync(path + "/out/16bit-16kHz-markers-mono.wav"));
    var stats = fs.statSync(
        path + "/out/16bit-16kHz-markers-mono.wav");
    var fileSizeInBytes1 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 16000", function() {
        assert.equal(wav.fmt.sampleRate, 16000);
    });
    it("byteRate be 32000", function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("cueChunkId should be 'cue '", function() {
        assert.equal(wav.cue.chunkId, 'cue ');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
});

describe("16-bit cue reading (file with 2 markers)", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-16kHz-2markers-mono.wav"));
    wav.LISTChunks = [];
    fs.writeFileSync(
        path + "/out/16bit-16kHz-2markers-mono.wav", wav.toBuffer());
    wav = new WaveFile(
        fs.readFileSync(path + "/out/16bit-16kHz-2markers-mono.wav"));
    var stats = fs.statSync(path + "/out/16bit-16kHz-2markers-mono.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes2);
    });
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 16000", function() {
        assert.equal(wav.fmt.sampleRate, 16000);
    });
    it("byteRate be 32000", function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("cueChunkId should be 'cue '", function() {
        assert.equal(wav.cue.chunkId, 'cue ');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
    // the cue points [0]
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].dwSampleOffset, 24000);
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].label, "wave1");
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].position, 1500);
    });
    // the cue points [1]
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[1].dwSampleOffset, 72000);
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[1].label, "wave2");
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[1].position, 4500);
    });
});

describe("16-bit cue reading (file with 1 UTF8 marker)", function() {
    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
    wav.LISTChunks = [];
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].dwSampleOffset, 4000);
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].label, "\u03A9");
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].position, 500);
    });
});

describe("16-bit cue reading (https://github.com/rochars/wavefile/issues/13)", function() {
    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue-issue13.wav"));
    wav.LISTChunks = [];
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].dwSampleOffset, 4000);
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].label, "Marker 01 abcäöüß");
    });
    it("read UTF8 in cue point markers", function() {
        assert.equal(wav.listCuePoints()[0].position, 500);
    });
});