/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("16-bit stereo to 24-bit", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-8kHz-stereo.wav"));
    wav.toBitDepth("24");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-24-stereo.wav", wav.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)",
            function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 2",
            function() {
        assert.equal(wav.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 24000",
            function() {
        assert.equal(wav.fmt.byteRate, 48000);
    });
    it("blockAlign should be 6",
            function() {
        assert.equal(wav.fmt.blockAlign, 6);
    });
    it("bitsPerSample should be 24",
            function() {
        assert.equal(wav.fmt.bitsPerSample, 24);
    });
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.data.samples.length > 0);
    });
});
