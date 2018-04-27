/*!
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('read 16bit file from disk and write to new file', function() {
    
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    
    let wav2 = new WaveFile(
        wav.toBuffer());
    
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-out.wav",
        wav2.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.chunkId, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav2.fmtChunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 40",
            function() {
        assert.equal(wav2.fmtChunkSize, 40);
    });
    it("audioFormat should be 65534 (WAVE_FORMAT_EXTENSIBLE)",
            function() {
        assert.equal(wav2.audioFormat, 65534);
    });
    it("numChannels should be 2",
            function() {
        assert.equal(wav2.numChannels, 2);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav2.sampleRate, 8000);
    });
    it("byteRate should be 32000",
            function() {
        assert.equal(wav2.byteRate, 32000);
    });
    it("blockAlign should be 4 (stereo)",
            function() {
        assert.equal(wav2.blockAlign, 4);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav2.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav2.dataChunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav2.dataChunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.samples.length > 0);
    });
    it("samples on the new file should have the same length as in the original file",
            function() {
        assert.equal(wav2.samples.length, wav.samples.length);
    });
    it("samples on the new file should be same as the original file",
            function() {
        assert.deepEqual(wav2.samples, wav.samples);
    });

    it("dwChannelMask should be 0",
            function() {
        assert.equal(wav2.dwChannelMask, 0);
    });
    
});
