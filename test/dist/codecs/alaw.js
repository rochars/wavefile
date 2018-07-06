/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test encoding and decoding A-Law files.
 * 
 */


const assert = require('assert');
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('8-bit a-law to 24-bit (a-law encoded with WaveFile)', function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "/8bit-alaw-8kHz-noBext-mono-encoded.wav"));
    wav.fromALaw("24");
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/24bit-8kHz-noBext-mono-decoded-alaw.wav",
        wav2.toBuffer());
    var stats = fs.statSync(
        path + "/out/24bit-8kHz-noBext-mono-decoded-alaw.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("blockAlign should be 3", function() {
        assert.equal(wav2.fmt.blockAlign, 3);
    });
    it("bitsPerSample should be 24", function() {
        assert.equal(wav2.fmt.bitsPerSample, 24);
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
});

describe('16-bit to 8-bit a-law', function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toALaw();
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/8bit-alaw-8kHz-noBext-mono-encoded.wav",
        wav2.toBuffer());
    var stats = fs.statSync(
        path + "/out/8bit-alaw-8kHz-noBext-mono-encoded.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("audioFormat should be 6 (a-law)", function() {
        assert.equal(wav2.fmt.audioFormat, 6);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("blockAlign should be 1", function() {
        assert.equal(wav2.fmt.blockAlign, 1);
    });
    it("bitsPerSample should be 8", function() {
        assert.equal(wav2.fmt.bitsPerSample, 8);
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
});

describe('16-bit stereo to 8-bit A-Law', function() {
    
    let wav = new WaveFile(fs.readFileSync(path + "16bit-8kHz-stereo.wav"));
    wav.toALaw();
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/8bit-alaw-8kHz-stereo-encoded.wav", wav2.toBuffer());
    var stats = fs.statSync(
        path + "/out/8bit-alaw-8kHz-stereo-encoded.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("audioFormat should be 6 (A-Law)", function() {
        assert.equal(wav2.fmt.audioFormat, 6);
    });
    it("numChannels should be 2", function() {
        assert.equal(wav2.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav2.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 8", function() {
        assert.equal(wav2.fmt.bitsPerSample, 8);
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
});

describe('8-bit a-law to 16-bit (a-law encoded with WaveFile)', function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "/8bit-alaw-8kHz-noBext-mono-encoded.wav"));
    wav.fromALaw();
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/16bit-8kHz-noBext-mono-decoded-alaw.wav",
        wav2.toBuffer());
    var stats = fs.statSync(
        path + "/out/16bit-8kHz-noBext-mono-decoded-alaw.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
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
});

describe('8-bit mu-Law to 8-bit A-Law', function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "/8bit-mulaw-8kHz-noBext-mono-encoded.wav"));
    wav.toALaw();
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/8bit-8kHz-mono-alaw-encoded-from-mulaw.wav",
        wav2.toBuffer());
    var stats = fs.statSync(
        path + "/out/8bit-8kHz-mono-alaw-encoded-from-mulaw.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("audioFormat should be 6 (A-Law)", function() {
        assert.equal(wav2.fmt.audioFormat, 6);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("blockAlign should be 1", function() {
        assert.equal(wav2.fmt.blockAlign, 1);
    });
    it("bitsPerSample should be 8", function() {
        assert.equal(wav2.fmt.bitsPerSample, 8);
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
});

describe('4-bit ADPCM to 8-bit A-Law', function() {
    
    let wav = new WaveFile(
        fs.readFileSync(
            path + "/4bit-imaadpcm-8kHz-noBext-mono-encoded.wav"));
    wav.toALaw();
    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(
        path + "/out/8bit-8kHz-mono-alaw-encoded-from-ADPCM.wav",
        wav2.toBuffer());
    var stats = fs.statSync(
        path + "/out/8bit-8kHz-mono-alaw-encoded-from-ADPCM.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("audioFormat should be 6 (A-Law)", function() {
        assert.equal(wav2.fmt.audioFormat, 6);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("blockAlign should be 1", function() {
        assert.equal(wav2.fmt.blockAlign, 1);
    });
    it("bitsPerSample should be 8", function() {
        assert.equal(wav2.fmt.bitsPerSample, 8);
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
});
