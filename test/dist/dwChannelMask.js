/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 16-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../loader.js");
const path = "./test/files/";

describe('4-channel 16-bit wave file', function() {
    let channel = [];
    for (let i=0; i<9000; i++) {
        channel.push(0);
    }
    let samples = [
        channel,
        channel,
        channel,
        channel
    ];
    let wav = new WaveFile();
    wav.fromScratch(4, 48000, '16', samples);
    fs.writeFileSync(
        "././test/files/out/4-channel-16-bit-48kHz-mono-fromScratch.wav",
        wav.toBuffer());
    var stats = fs.statSync(
        "././test/files/out/4-channel-16-bit-48kHz-mono-fromScratch.wav");
    var fileSizeInBytes1 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 40', function() {
        assert.equal(wav.fmt.chunkSize, 40);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 4', function() {
        assert.equal(wav.fmt.numChannels, 4);
    });
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 288000', function() {
        assert.equal(wav.fmt.byteRate, 384000);
    });
    it('blockAlign should be 8', function() {
        assert.equal(wav.fmt.blockAlign, 8);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    // extension
    it('cbSize should be 22', function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it('validBitsPerSample should be 16', function() {
        assert.equal(wav.fmt.validBitsPerSample, 16);
    });
    it('dwChannelMask should be 0x33', function() {
        assert.equal(wav.fmt.dwChannelMask, 0x33); //4 channels
    });

    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});

describe('6-channel 16-bit wave file', function() {
    let channel = [];
    for (let i=0; i<9000; i++) {
        channel.push(0);
    }
    let samples = [
        channel,
        channel,
        channel,
        channel,
        channel,
        channel
    ];
    let wav = new WaveFile();
    wav.fromScratch(6, 48000, '16', samples);
    fs.writeFileSync(
        "././test/files/out/6-channel-16-bit-48kHz-mono-fromScratch.wav",
        wav.toBuffer());
    var stats = fs.statSync(
        "././test/files/out/6-channel-16-bit-48kHz-mono-fromScratch.wav");
    var fileSizeInBytes1 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 40', function() {
        assert.equal(wav.fmt.chunkSize, 40);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 6', function() {
        assert.equal(wav.fmt.numChannels, 6);
    });
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 576000', function() {
        assert.equal(wav.fmt.byteRate, 576000);
    });
    it('blockAlign should be 12', function() {
        assert.equal(wav.fmt.blockAlign, 12);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    // extension
    it('cbSize should be 22', function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it('validBitsPerSample should be 16', function() {
        assert.equal(wav.fmt.validBitsPerSample, 16);
    });
    it('dwChannelMask should be 0x3F', function() {
        assert.equal(wav.fmt.dwChannelMask, 0x3F);
    });

    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});

describe('8-channel 16-bit wave file', function() {
    let channel = [];
    for (let i=0; i<9000; i++) {
        channel.push(0);
    }
    let samples = [
        channel,
        channel,
        channel,
        channel,
        channel,
        channel,
        channel,
        channel
    ];
    let wav = new WaveFile();
    wav.fromScratch(8, 48000, '16', samples);
    fs.writeFileSync(
        "././test/files/out/8-channel-16-bit-48kHz-mono-fromScratch.wav",
        wav.toBuffer());
    var stats = fs.statSync(
        "././test/files/out/8-channel-16-bit-48kHz-mono-fromScratch.wav");
    var fileSizeInBytes1 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 40', function() {
        assert.equal(wav.fmt.chunkSize, 40);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 8', function() {
        assert.equal(wav.fmt.numChannels, 8);
    });
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 768000', function() {
        assert.equal(wav.fmt.byteRate, 768000);
    });
    it('blockAlign should be 16', function() {
        assert.equal(wav.fmt.blockAlign, 16);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    // extension
    it('cbSize should be 22', function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it('validBitsPerSample should be 16', function() {
        assert.equal(wav.fmt.validBitsPerSample, 16);
    });
    it('dwChannelMask should be 0x63F', function() {
        assert.equal(wav.fmt.dwChannelMask, 0x63F);
    });

    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});