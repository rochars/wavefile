/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the getTag() and setTag() methods.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "test/files/";

describe("Set 1 new tag", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    let wavB = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    wav.setTag("IENG", "1");
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-1.wav",
        wav.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(
            path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-1.wav"));

    // WAV1
    // 'INFO'
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav.LIST[0]["chunkId"], "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav.LIST[0]["format"], "INFO");
    });
    // tags
    // ICRD
    it("LISTChunks[0].subChunks[0].chunkId should be 'ICRD'", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkId, "ICRD");
    });
    it("'ICRD' size", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkSize, "24");
    });
    it("'ICRD' value", function() {
        assert.equal(
            wav.LIST[0].subChunks[0].value, "2003-01-30 03:28:46 UTC");
    });
    // ISFT
    it("LISTChunks[0].subChunks[1].chunkId should be 'ISFT'", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkId, "ISFT");
    });
    it("'ISFT' size", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkSize, "10");
    });
    it("'ISFT' value", function() {
        assert.equal(wav.LIST[0].subChunks[1].value, "CopyAudio");
    });
    // ICMT
    it("LISTChunks[0].subChunks[2].chunkId should be 'ICMT'", function() {
        assert.equal(wav.LIST[0].subChunks[2].chunkId, "ICMT");
    });it("'ICMT' size", function() {
        assert.equal(wav.LIST[0].subChunks[2].chunkSize, "14");
    });
    it("'ICMT' value", function() {
        assert.equal(wav.LIST[0].subChunks[2].value, "kabal@CAPELLA");
    });
    // WAV2
    it("wav2.getLISTChunkBytes_ == wav2.LIST[0].chunkSize", function() {
        assert.equal(
            wav2.getLISTBytes_().length - 8, wav2.LIST[0].chunkSize);
    });
    it("wav3.getLISTChunkBytes_ == wav3.LIST[0].chunkSize", function() {
        let wav3 = new WaveFile(wav2.toBuffer());
        assert.equal(wav2.chunkSize, wav3.chunkSize);
    });
    it("wav3 create tag", function() {
        assert.equal(
            wav2.getLISTBytes_().length, wavB.getLISTBytes_().length + 10);
    });
    it("wav3 create tag, save file, read file", function() {
        assert.equal(
            wav2.getLISTBytes_().length, wavB.getLISTBytes_().length + 10);
    });
    // 'INFO'
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0]["chunkId"], "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0]["format"], "INFO");
    });
    // tags
    // ICRD
    it("LISTChunks[0].subChunks[0].chunkId should be 'ICRD'", function() {
        assert.equal(wav2.LIST[0].subChunks[0].chunkId, "ICRD");
    });
    it("'ICRD' size", function() {
        assert.equal(wav2.LIST[0].subChunks[0].chunkSize, "24");
    });
    it("'ICRD' value", function() {
        assert.equal(
            wav2.LIST[0].subChunks[0].value, "2003-01-30 03:28:46 UTC");
    });
    // ISFT
    it("LISTChunks[0].subChunks[1].chunkId should be 'ISFT'", function() {
        assert.equal(wav2.LIST[0].subChunks[1].chunkId, "ISFT");
    });
    it("'ISFT' size", function() {
        assert.equal(wav2.LIST[0].subChunks[1].chunkSize, "10");
    });
    it("'ISFT' value", function() {
        assert.equal(wav2.LIST[0].subChunks[1].value, "CopyAudio");
    });
    // ICMT
    it("LISTChunks[0].subChunks[2].chunkId should be 'ICMT'", function() {
        assert.equal(wav2.LIST[0].subChunks[2].chunkId, "ICMT");
    });it("'ICMT' size", function() {
        assert.equal(wav2.LIST[0].subChunks[2].chunkSize, "14");
    });
    it("'ICMT' value", function() {
        assert.equal(wav2.LIST[0].subChunks[2].value, "kabal@CAPELLA");
    });
});

describe("Set multiple new tags, one existing tag", function() {

    let wav = new WaveFile(fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    let wavB = new WaveFile(fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    // set 4 new tags and rewrite the value
    // of a existing tag
    wav.setTag("ICMT", "1");
    wav.setTag("IENG", "ab");
    wav.setTag("NEW0", "b");
    wav.setTag("NEW1", "1");
    wav.setTag("NEW2", "1");
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-2.wav",
        wav.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(
            path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-2.wav"));
    let stats = fs.statSync(path + "M1F1-int12WE-AFsp.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(
        path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-2.wav");
    let fileSizeInBytes2 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavB.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav.LIST[0]["chunkId"], "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav.LIST[0]["format"], "INFO");
    });
    it("LISTChunks[0].subChunks[0].chunkId should be 'ICRD'", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkId, "ICRD");
    });
    it("'ICRD' size", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkSize, "24");
    });
    it("'ICRD' value", function() {
        assert.equal(
            wav.LIST[0].subChunks[0].value, "2003-01-30 03:28:46 UTC");
    });
    it("LISTChunks[0].subChunks[1].chunkId should be 'ISFT'", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkId, "ISFT");
    });
    it("'ISFT' size", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkSize, "10");
    });
    it("'ISFT' value", function() {
        assert.equal(wav.LIST[0].subChunks[1].value, "CopyAudio");
    });
    it("LISTChunks[0].subChunks[2].chunkId should be 'ICMT'", function() {
        assert.equal(wav.LIST[0].subChunks[2].chunkId, "ICMT");
    });it("'ICMT' size", function() {
        assert.equal(wav.LIST[0].subChunks[2].chunkSize, "2");
    });
    it("'ICMT' value", function() {
        assert.equal(wav.LIST[0].subChunks[2].value, "1");
    });
    it("wav2.getLISTChunkBytes_ == wav2.LIST[0].chunkSize", function() {
        assert.equal(wav2.getLISTBytes_().length - 8, wav2.LIST[0].chunkSize);
    });
    it("wav3.getLISTChunkBytes_ == wav3.LIST[0].chunkSize", function() {
        let wav3 = new WaveFile(wav2.toBuffer());
        assert.equal(wav2.chunkSize, wav3.chunkSize);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0]["chunkId"], "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0]["format"], "INFO");
    });
    it("LISTChunks[0].subChunks[0].chunkId should be 'ICRD'", function() {
        assert.equal(wav2.LIST[0].subChunks[0].chunkId, "ICRD");
    });
    it("'ICRD' size", function() {
        assert.equal(wav2.LIST[0].subChunks[0].chunkSize, "24");
    });
    it("'ICRD' value", function() {
        assert.equal(
            wav2.LIST[0].subChunks[0].value, "2003-01-30 03:28:46 UTC");
    });
    it("LISTChunks[0].subChunks[1].chunkId should be 'ISFT'", function() {
        assert.equal(wav2.LIST[0].subChunks[1].chunkId, "ISFT");
    });
    it("'ISFT' size", function() {
        assert.equal(wav2.LIST[0].subChunks[1].chunkSize, "10");
    });
    it("'ISFT' value", function() {
        assert.equal(wav2.LIST[0].subChunks[1].value, "CopyAudio");
    });
    it("LISTChunks[0].subChunks[2].chunkId should be 'ICMT'", function() {
        assert.equal(wav2.LIST[0].subChunks[2].chunkId, "ICMT");
    });it("'ICMT' size", function() {
        assert.equal(wav2.LIST[0].subChunks[2].chunkSize, "2");
    });
    it("'ICMT' value", function() {
        assert.equal(wav2.LIST[0].subChunks[2].value, "1");
    });
});

describe("Remove a tag", function() {

    let wav = new WaveFile(fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    let wavB = new WaveFile(fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    wav.setTag("ICMT", "1");
    wav.deleteTag("ISFT");
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-3.wav",
        wav.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(
            path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-3.wav"));
    let stats = fs.statSync(path + "M1F1-int12WE-AFsp.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(
        path + "/out/M1F1-int12WE-AFsp-out-set-get-tag-3.wav");
    let fileSizeInBytes2 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavB.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav.LIST[0]["chunkId"], "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav.LIST[0]["format"], "INFO");
    });
    it("LISTChunks[0].subChunks[0].chunkId should be 'ICRD'", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkId, "ICRD");
    });
    it("'ICRD' size", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkSize, "24");
    });
    it("'ICRD' value", function() {
        assert.equal(
            wav.LIST[0].subChunks[0].value, "2003-01-30 03:28:46 UTC");
    });
    it("LISTChunks[0].subChunks[2].chunkId should be 'ICMT'", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkId, "ICMT");
    });it("'ICMT' size", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkSize, "2");
    });
    it("'ICMT' value", function() {
        assert.equal(wav.LIST[0].subChunks[1].value, "1");
    });

    it("wav2.getLISTChunkBytes_ == wav2.LIST[0].chunkSize", function() {
        assert.equal(wav2.getLISTBytes_().length - 8, wav2.LIST[0].chunkSize);
    });
    it("wav3.getLISTChunkBytes_ == wav3.LIST[0].chunkSize", function() {
        let wav3 = new WaveFile(wav2.toBuffer());
        assert.equal(wav2.chunkSize, wav3.chunkSize);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0]["chunkId"], "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0]["format"], "INFO");
    });
    it("LISTChunks[0].subChunks[0].chunkId should be 'ICRD'", function() {
        assert.equal(wav2.LIST[0].subChunks[0].chunkId, "ICRD");
    });
    it("'ICRD' size", function() {
        assert.equal(wav2.LIST[0].subChunks[0].chunkSize, "24");
    });
    it("'ICRD' value", function() {
        assert.equal(
            wav2.LIST[0].subChunks[0].value, "2003-01-30 03:28:46 UTC");
    });
    it("LISTChunks[0].subChunks[2].chunkId should be 'ICMT'", function() {
        assert.equal(wav2.LIST[0].subChunks[1].chunkId, "ICMT");
    });it("'ICMT' size", function() {
        assert.equal(wav2.LIST[0].subChunks[1].chunkSize, "2");
    });
    it("'ICMT' value", function() {
        assert.equal(wav2.LIST[0].subChunks[1].value, "1");
    });
    it("'ICMT' value by getTag() on the output file", function() {
        assert.equal(wav2.getTag("ICMT"), "1");
    });
    it("'ICMT' value by getTag() on the original file", function() {
        assert.equal(wavB.getTag("ICMT"), "kabal@CAPELLA");
    });
});

describe('create 16-bit wave files from scratch with tags', function() {

    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<8000; i++) {
        samples.push(0);
    }
    wav.fromScratch(1, 8000, '16', samples);
    wav.setTag("WVFL", "true");
    wav.setTag("WVF", "fixed");
    fs.writeFileSync(
        "./test/files/out/16-bit-8kHz-mono-fromScratch-WITH-TAGS.wav",
        wav.toBuffer());
    wav = new WaveFile(
        fs.readFileSync(
            "./test/files/out/16-bit-8kHz-mono-fromScratch-WITH-TAGS.wav"));
    var stats = fs.statSync(
        "./test/files/out/16-bit-8kHz-mono-fromScratch-WITH-TAGS.wav");
    var fileSizeInBytes1 = stats["size"];
    
    it("Try to remove a tag that does not exist", function() {
        assert.ok(wav.deleteTag("INEX") === false);
    });
    it("Try to get a tag that does not exist should return null", function() {
        assert.ok(wav.getTag("INEX") === null);
    });
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav.LIST[0]["chunkId"], "LIST");
    });
    it("LISTChunks[0].format should be 'INFO'", function() {
        assert.equal(wav.LIST[0]["format"], "INFO");
    });
    it("LISTChunks[0].subChunks.length 2", function() {
        assert.equal(wav.LIST[0]["subChunks"].length, 2);
    });
    // good tag
    it("LISTChunks[0].subChunks[0].chunkId should be 'WVFL'", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkId, "WVFL");
    });
    it("'WVFL' size", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkSize, "5");
    });
    it("'WVFL' value", function() {
        assert.equal(wav.LIST[0].subChunks[0].value, "true");
    });
    // fix tag
    it("LISTChunks[0].subChunks[0].chunkId should be 'WVF '", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkId, "WVF ");
    });
    it("'WVF ' size", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkSize, "6");
    });
    it("'WVF ' value", function() {
        assert.equal(wav.LIST[0].subChunks[1].value, "fixed");
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
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
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
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 16000', function() {
        assert.equal(wav.data.chunkSize, 16000);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});
