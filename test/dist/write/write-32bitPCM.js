/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 32-bit (int) files.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('read 32bit PCM from disk and write to new file', function() {
    
    let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
    let wav = new WaveFile(wBytes);
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/32bit-48kHz-noBext-mono.wav", wav2.toBuffer());
    
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
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 48000", function() {
        assert.equal(wav2.fmt.sampleRate, 48000);
    });
    it("byteRate should be 192000", function() {
        assert.equal(wav2.fmt.byteRate, 192000);
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
