/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2019 Rafael da Silva Rocha. MIT License.
 *
 * Test reading the "cue " chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "./test/files/";

describe("Read regions created in Adobe Audition", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "24bit-48kHz-1c-mixpre6-hiser_interview.WAV"));

    //fs.writeFileSync(
    //    path + "/out/24bit-48kHz-1c-mixpre6-hiser_interview.WAV", wav.toBuffer());
    
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 48000", function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it("byteRate be 144000", function() {
        assert.equal(wav.fmt.byteRate, 144000);
    });
    it("blockAlign should be 3", function() {
        assert.equal(wav.fmt.blockAlign, 3);
    });
    it("bitsPerSample should be 24", function() {
        assert.equal(wav.fmt.bitsPerSample, 24);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("cueChunkId should be 'cue '", function() {
        assert.equal(wav.cue.chunkId, 'cue ');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });

    // _PMX chunk
    it("should find the '_PMX' chunk", function() {
        assert.equal(wav._PMX.chunkId, "_PMX");
    });
    it("'_PMX' chunkSize should be 10087", function() {
        assert.equal(wav._PMX.chunkSize, 10087);
    });
    it("'_PMX' value should be a string with length = 10085", function() {
        assert.equal(wav._PMX.value.length, 10085);
    });
});

describe("Read regions created in Adobe Audition, write to file, read again", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "24bit-48kHz-1c-mixpre6-hiser_interview.WAV"));
    // Write the file to disk, then read the new file
    fs.writeFileSync(
        path + "/out/24bit-48kHz-1c-mixpre6-hiser_interview.WAV", wav.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/24bit-48kHz-1c-mixpre6-hiser_interview.WAV"));

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
    it("byteRate be 144000", function() {
        assert.equal(wav2.fmt.byteRate, 144000);
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
    it("cueChunkId should be 'cue '", function() {
        assert.equal(wav2.cue.chunkId, 'cue ');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav2.data.samples.length > 0);
    });

    // new file should still have the iXML chunk
    it("should find the 'iXML' chunk", function() {
        assert.equal(wav2.iXML.chunkId, "iXML");
    });
    it("'iXML' chunkSize should be", function() {
        assert.equal(wav2.iXML.chunkSize, 2976);
    });
    it("'iXML' value should be a string with length = 2976", function() {
        assert.equal(wav2.iXML.value.length, 2976);
    });
    it("'iXML' value in new file should be equal to the one in the original file", function() {
        assert.equal(wav2.iXML.value, wav.iXML.value);
    });

    // new file should still have the _PMX chunk
    it("should find the '_PMX' chunk", function() {
        assert.equal(wav2._PMX.chunkId, "_PMX");
    });
    it("'_PMX' chunkSize should be 10087", function() {
        assert.equal(wav2._PMX.chunkSize, 10087);
    });
    it("'_PMX' value should be a string with length 10085", function() {
        assert.equal(wav2._PMX.value.length, 10085);
    });
    it("'_PMX' value in new file should be equal to the one in the original file", function() {
        assert.equal(wav2._PMX.value, wav._PMX.value);
    });
});
