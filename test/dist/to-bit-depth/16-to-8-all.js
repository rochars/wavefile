/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the toBitDepth() method to convert an 16-bit file to
 * 15, 14, 13, 12, 11, 10, 9 and 8-bit.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("16-bit mono from file to 15-bit", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("15");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-15.wav", wav.toBuffer());
});

describe("16-bit mono from file to 14-bit", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("14");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-14.wav", wav.toBuffer());
});

describe("16-bit mono from file to 13-bit", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    let wavB = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("13");
    wav.LISTChunks = [];
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-13.wav", wav.toBuffer());

    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/to-bit-depth/16-to-13.wav"));

    let stats = fs.statSync(path + "16-bit-8kHz-noBext-mono.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/to-bit-depth/16-to-13.wav");
    let fileSizeInBytes2 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavB.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });

});

describe("16-bit mono from file to 12-bit", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("12");
    fs.writeFileSync(
        path + "/out/to-bit-depth/16-to-12.wav", wav.toBuffer());
});

describe("16-bit mono from file to 11-bit", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("11");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-11.wav", wav.toBuffer());
});

describe("16-bit mono from file to 10-bit", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("10");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-10.wav", wav.toBuffer());
});

describe("16-bit mono from file to 9-bit", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("9");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-9.wav", wav.toBuffer());
});

describe("16-bit mono from file to 9-bit without re-scaling", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    wav.toBitDepth("9");
    fs.writeFileSync(path + "/out/to-bit-depth/16-to-9.wav", wav.toBuffer());
});
