/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("4-bit IMA ADPCM reading", function() {

    let fs = require("fs");
    let wavefile = require("../index.js");
    let path = "test/files/";

    let wBytes = fs.readFileSync(path + '4bit-imaadpcm-8kHz-noBext-mono.wav');
    let wav = new wavefile.Wavefile(wBytes);

    it("chunkId in a 4-bit 8kHz mono wave file should be 'RIFF'",
            function() {
        assert.equal(wav.chunkId, "RIFF");
    });
    it("subChunk1Id in a 4-bit 8kHz mono wave file should be 'WAVE'",
            function() {
        assert.equal(wav.subChunk1Id, "WAVE");
    });
    it("format in a 4-bit 8kHz mono wave file should be 'fmt '",
            function() {
        assert.equal(wav.format, "fmt ");
    });
    it("subChunk1Size in a 4-bit 8kHz mono wave file should be 20",
            function() {
        assert.equal(wav.subChunk1Size, 20);
    });
    it("audioFormat in a 4-bit 8kHz mono wave file should be 17 (IMA ADPCM)",
            function() {
        assert.equal(wav.audioFormat, 17);
    });
    it("numChannels in a 4-bit 8kHz mono wave file should be 1",
            function() {
        assert.equal(wav.numChannels, 1);
    });
    it("sampleRate in a 4-bit 8kHz mono wave file should be 8000",
            function() {
        assert.equal(wav.sampleRate, 8000);
    });
    it("bitsPerSample in a 4-bit 8kHz mono wave file should be 4",
            function() {
        assert.equal(wav.bitsPerSample, 4);
    });
    it("subChunk2Id in a 4-bit 8kHz mono wave file should be 'data'",
            function() {
        assert.equal(wav.subChunk2Id, 'data');
    });
    it("subChunk2Size in a 4-bit 8kHz mono wave file with contents " +
        "should be > 0",
            function() {
        assert.ok(wav.subChunk2Size > 0);
    });
    it("samples.length in a 4-bit 8kHz mono wave file with contents " +
        "should be > 0",
            function() {
        assert.ok(wav.samples.length > 0);
    });
});
