/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('read 32bit PCM from disk and write to new file', function() {
    
    let fs = require("fs");
    let wavefile = require("../index.js");
    let path = "test/files/";
    
    let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
    let wav = new wavefile.WaveFile(wBytes);
    let wav2 = new wavefile.WaveFile(wav.toBytes());
    fs.writeFileSync(path + "/out/32bit-48kHz-noBext-mono.wav", wav2.toBytes());
    
    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.chunkId, "RIFF");
    });
    it("subChunk1Id should be 'fmt '",
            function() {
        assert.equal(wav2.subChunk1Id, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("subChunk1Size should be 16",
            function() {
        assert.equal(wav2.subChunk1Size, 16);
    });
    it("audioFormat should be 1 (PCM)",
            function() {
        assert.equal(wav2.audioFormat, 1);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav2.numChannels, 1);
    });
    it("sampleRate should be 48000",
            function() {
        assert.equal(wav2.sampleRate, 48000);
    });
    it("byteRate should be 192000",
            function() {
        assert.equal(wav2.byteRate, 192000);
    });
    it("blockAlign should be 4",
            function() {
        assert.equal(wav2.blockAlign, 4);
    });
    it("bitsPerSample should be 32",
            function() {
        assert.equal(wav2.bitsPerSample, 32);
    });
    it("subChunk2Id should be 'data'",
            function() {
        assert.equal(wav2.subChunk2Id, 'data');
    });
    it("subChunk2Size should be > 0",
            function() {
        assert.ok(wav2.subChunk2Size > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.samples_.length > 0);
    });
    it("samples_ on the new file should have the same length as in the original file",
            function() {
        assert.equal(wav2.samples_.length, wav.samples_.length);
    });
    it("samples_ on the new file should be same as the original file",
            function() {
        assert.deepEqual(wav2.samples_, wav.samples_);
    });
});
