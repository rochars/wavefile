/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("16-bit RIFF to RIFX", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let riffwav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    riffwav.toRIFX();
    fs.writeFileSync(path + "/out/RIFF-to-RIFX-16bit-mono.wav", riffwav.toBuffer());
    let wav = new WaveFile(
        fs.readFileSync(path + "/out/RIFF-to-RIFX-16bit-mono.wav"));

    it("chunkId should be 'RIFX'",
            function() {
        assert.equal(wav.container, "RIFX");
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
    it("numChannels should be 1",
            function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 16000",
            function() {
        assert.equal(wav.fmt.byteRate, 16000);
    });
    it("blockAlign should be 2",
            function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
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
    it("samples in RIFF-to-RIFX file should be the same as in the RIFF file",
            function() {
        assert.deepEqual(wav.data.samples, riffwav.data.samples);
    });
});

describe("RIFX cbSize and validBitsPerSample", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let riffwav = new WaveFile(
        fs.readFileSync(path + "4bit-imaadpcm-8kHz-noBext-mono.wav"));
    riffwav.toRIFX();
    fs.writeFileSync(path + "/out/RIFF-to-RIFX-4bit-imaadpcm-8kHz-noBext-mono.wav", riffwav.toBuffer());
    let wav = new WaveFile(
        fs.readFileSync(path + "/out/RIFF-to-RIFX-4bit-imaadpcm-8kHz-noBext-mono.wav"));

    it("cbSize should be 2 in the original file",
            function() {
        assert.equal(riffwav.fmt.cbSize, 2);
    });
    it("validBitsPerSample should be 505 in the original file",
            function() {
        assert.equal(riffwav.fmt.validBitsPerSample, 505);
    });
    it("cbSize should be 2 in the RIFX file",
            function() {
        assert.equal(wav.fmt.cbSize, 2);
    });
    it("validBitsPerSample should be 505 in the RIFX file",
            function() {
        assert.equal(wav.fmt.validBitsPerSample, 505);
    });
});


describe("RF64 to RIFX", function() {

    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    let wav2 = new WaveFile(fs.readFileSync(path + "RF64-16bit-8kHz-stereo-reaper.wav"));
    wav2.toRIFX();
    fs.writeFileSync(path + "/out/RIFX-16bit-8kHz-stereo-fromRF64.wav", wav2.toBuffer());
    let wav = new WaveFile(fs.readFileSync(path + "/out/RIFX-16bit-8kHz-stereo-fromRF64.wav"));

    it("chunkId should be 'RIFX'",
            function() {
        assert.equal(wav.container, "RIFX");
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
    it("audioFormat should be 1",
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
    it("byteRate should be 32000",
            function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4",
            function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
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
