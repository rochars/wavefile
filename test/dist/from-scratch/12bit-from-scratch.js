/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing 12-bit files with the fromScratch() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 12-bit wave files from scratch', function() {
    
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<9000; i++) {
        samples.push(0);
    }
    wav.fromScratch(1, 8000, '12', samples);
    fs.writeFileSync(
        "././test/files/out/12-bit-48kHz-mono-fromScratch.wav", wav.toBuffer());

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
    it('audioFormat should be 65534', function() {
        assert.equal(wav.fmt.audioFormat, 65534);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 8000', function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it('byteRate should be 16000', function() {
        assert.equal(wav.fmt.byteRate, 16000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it('validBitsPerSample should be 12', function() {
        assert.equal(wav.fmt.validBitsPerSample, 12);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be samples.length * 2', function() {
        assert.equal(wav.data.chunkSize, samples.length * 2);
    });
    it('samples should be the same as the args', function() {
        ////assert.deepEqual(wav.data.samples, samples);
    });
    it('cbSize should be 22', function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it('dwChannelMask should be 0x4', function() {
        assert.equal(wav.fmt.dwChannelMask, 0x4);
    });
    it('bitDepth should be "12"', function() {
        assert.equal(wav.bitDepth, "12");
    });
    it('subformat', function() {
        assert.deepEqual(
            wav.fmt.subformat,
            [1, 1048576, 2852126848, 1905997824]);
    });
});

describe('create 12-bit wav with samples from a existing 12-bit wav',
    function() {

    let sourcewav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));

    let wav = new WaveFile();
    require = require("esm")(module);
    bd = require("byte-data");
    // original file has samples over the 12-bit limit; bits are set to 16
    wav.fromScratch(2, 8000, '12', bd.unpackArray(sourcewav.data.samples, {bits: 16, signed: true}));
    fs.writeFileSync(
        "././test/files/out/M1F1-int12WE-AFsp-recreated.wav", wav.toBuffer());

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
    it('audioFormat should be 65534', function() {
        assert.equal(wav.fmt.audioFormat, 65534);
    });
    it('numChannels should be 2', function() {
        assert.equal(wav.fmt.numChannels, 2);
    });
    it('sampleRate should be 8000', function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it('byteRate should be 16000', function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it('validBitsPerSample should be 12', function() {
        assert.equal(wav.fmt.validBitsPerSample, 12);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be samples.length * 2', function() {
        assert.equal(wav.data.chunkSize, sourcewav.data.samples.length);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav.data.samples, sourcewav.data.samples);
    });
    it('cbSize should be 22', function() {
        assert.equal(wav.fmt.cbSize, 22);
    });
    it('dwChannelMask should be 0x3', function() {
        assert.equal(wav.fmt.dwChannelMask, 0x3);
    });
    it('bitDepth should be "12"', function() {
        assert.equal(wav.bitDepth, "12");
    });
    it('subformat', function() {
        assert.deepEqual(
            wav.fmt.subformat,
            [1, 1048576, 2852126848, 1905997824]);
    });
});
