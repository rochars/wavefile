/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Tests with the M1F1-int12WE-AFsp.wav file from
 * http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/Samples.html 
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("M1F1-int12WE-AFsp.wav test suite", function() {

    let path = "./test/files/";
    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    let wavB = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-out.wav", wavB.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/M1F1-int12WE-AFsp-out.wav"));
    let wav3 = new WaveFile(wav2.toBuffer());
    wav3.LIST[0].subChunks.push({
        "chunkId": "IENG",
        "chunkSize": 0,
        "value": "1"});
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-out-wav3.wav", wav3.toBuffer());
    wav3 = new WaveFile(
        fs.readFileSync(path + "/out/M1F1-int12WE-AFsp-out-wav3.wav"));
    let stats = fs.statSync(path + "M1F1-int12WE-AFsp.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/M1F1-int12WE-AFsp-out.wav");
    let fileSizeInBytes2 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav.chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wavB.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav.chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    //it("wav2.getLISTChunkBytes_ == wav2.LIST[0].chunkSize", function() {
    //    assert.equal(wav.getLISTBytes_().length - 8, wav.LIST[0].chunkSize);
    //});
    //it("wav2.getLISTChunkBytes_ == wav2.LIST[0].chunkSize", function() {
    //    assert.equal(wav2.getLISTBytes_().length - 8, wav2.LIST[0].chunkSize);
    //});
    //it("wav3.getLISTChunkBytes_ == wav3.LIST[0].chunkSize", function() {
    //    let wav3 = new WaveFile(wav2.toBuffer());
    //    assert.equal(wav3.getLISTBytes_().length - 8, wav3.LIST[0].chunkSize);
    //});
    //it("wav3 create tag", function() {
    //    assert.equal(
    //        wav3.getLISTBytes_().length, wav2.getLISTBytes_().length + 10);
    //});
    //it("wav3 create tag, save file, read file", function() {
    //    assert.equal(
    //        wav3.getLISTBytes_().length, wav2.getLISTBytes_().length + 10);
    //});
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

describe("M1F1-int12WE-AFsp.wav test suite", function() {

    let path = "./test/files/";
    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    let wav2 = new WaveFile(wav.toBuffer());
    let wav3 = new WaveFile(wav2.toBuffer());
    wav3.LIST[0].subChunks.push({
        "chunkId": "IENG",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE01",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE02",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE03",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE04",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE05",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE06",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE07",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE08",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE09",
        "chunkSize": 0,
        "value": "1"});
    wav3.LIST[0].subChunks.push({
        "chunkId": "IE10",
        "chunkSize": 0,
        "value": "1"});
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-out-14TAGS.wav", wav3.toBuffer());
    wav3 = new WaveFile(
        fs.readFileSync(path + "/out/M1F1-int12WE-AFsp-out-14TAGS.wav"));
    let stats = fs.statSync(path + "M1F1-int12WE-AFsp.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/M1F1-int12WE-AFsp-out-14TAGS.wav");
    let fileSizeInBytes2 = stats["size"];
    it("wav3.chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav3.chunkSize + 8, fileSizeInBytes2);
    });
});
