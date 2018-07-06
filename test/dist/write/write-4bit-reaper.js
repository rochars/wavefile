/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 4-bit ADPCM files encoded with REAPER.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("read 4-bit file from disk and write to new file " +
    "(different APDCM source)", function() {
    
    let wBytes = fs.readFileSync(
        path + "4-bit-imaadpcm-8kHz-noBext-mono-reaper.wav");
    let wav = new WaveFile(wBytes);
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/4-bit-imaadpcm-8kHz-noBext-mono-reaper.wav",
        wav2.toBuffer());

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 20", function() {
        assert.equal(wav2.fmt.chunkSize, 20);
    });
    it("audioFormat should be 17 (IMA ADPCM)", function() {
        assert.equal(wav2.fmt.audioFormat, 17);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("byteRate should be 4000", function() {
        assert.equal(wav2.fmt.byteRate, 4000);
    });
    it("blockAlign should be 1024", function() {
        assert.equal(wav2.fmt.blockAlign, 1024);
    });
    it("bitsPerSample should be 4", function() {
        assert.equal(wav2.fmt.bitsPerSample, 4);
    });
    it("factChunkId should be 'fact'", function() {
        assert.equal(wav2.fact.chunkId, 'fact');
    });
    it("wav.factChunkSize should == wav2.factChunkSize", function() {
        assert.equal(wav2.fact.chunkSize, wav.fact.chunkSize);
    });
    it("wav.dwSampleLength should == wav2.dwSampleLength", function() {
        assert.deepEqual(wav2.fact.dwSampleLength, wav.fact.dwSampleLength);
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
