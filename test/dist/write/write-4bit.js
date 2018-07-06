/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 4-bit ADPCM files.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('read 4-bit file from disk and write to new file', function() {
    
    let wBytes = fs.readFileSync(
        path + "4bit-imaadpcm-8kHz-noBext-mono.wav");
    let wav = new WaveFile(wBytes);
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/4bit-imaadpcm-8kHz-noBext-mono.wav", wav2.toBuffer());

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
    it("byteRate should be 4055", function() {
        assert.equal(wav2.fmt.byteRate, 4055);
    });
    it("blockAlign should be 256", function() {
        assert.equal(wav2.fmt.blockAlign, 256);
    });
    it("bitsPerSample should be 4", function() {
        assert.equal(wav2.fmt.bitsPerSample, 4);
    });
    it("factChunkId should be 'fact' on the original file", function() {
        assert.equal(wav.fact.chunkId, 'fact');
    });
    it("factChunkId should be 'fact' on the new file", function() {
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

describe('read 4-bit 22050kHz file from disk and write to new file',
    function() {
    
    const fs = require("fs");
    const WaveFile = require("../../../test/loader.js");
    const path = "./test/files/";
    
    let wBytes = fs.readFileSync(path + "ima22m.wav");
    let wav = new WaveFile(wBytes);
    fs.writeFileSync(path + "/out/ima22m-JUST-READ.wav", wav.toBuffer());
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/ima22m.wav", wav2.toBuffer());

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
    it("sampleRate should be 22050", function() {
        assert.equal(wav2.fmt.sampleRate, 22050);
    });
    it("byteRate should be 11100", function() {
        assert.equal(wav2.fmt.byteRate, 11100);
    });
    it("blockAlign should be 512", function() {
        assert.equal(wav2.fmt.blockAlign, 512);
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
    it("wav2.dwSampleLength should be > 0", function() {
        assert.ok(wav2.fact.dwSampleLength > 0);
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
