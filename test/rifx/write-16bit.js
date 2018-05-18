/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test reading a RIFX file and writing it back to disk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "test/files/";

describe('read RIFX file from disk and write to new RIFX file', function() {
    
    let wBytes = fs.readFileSync(path + "RIFX-16bit-mono.wav");
    let wav = new WaveFile();
    wav.fromBuffer(wBytes);
    let wav2 = new WaveFile();
    let bytes3 = wav.toBuffer();
    wav2.fromBuffer(bytes3);
    let bytes4 = wav2.toBuffer();
    fs.writeFileSync(path + "/out/RIFX-16bit-mono.wav", bytes4);

    it("chunkId should be 'RIFX'", function() {
        assert.equal(wav2.container, "RIFX");
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
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("byteRate should be 16000", function() {
        assert.equal(wav2.fmt.byteRate, 16000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav2.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav2.fmt.bitsPerSample, 16);
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
    it("samples on the new file should have the same length as " +
        "in the original file", function() {
        assert.equal(wav2.data.samples.length, wav.data.samples.length);
    });
    it("samples on the new file should be same as the original " +
        " file", function() {
        assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
});
