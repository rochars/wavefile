/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test reading and writing the "bext" chunk.
 * 
 */

const assert = require('assert');
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('read a file with bext from disk and write to new file',
    function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav"));
    wav = new WaveFile(wav.toBuffer());
    
    it("bextChunkId should be 'bext'", function() {
        assert.equal(wav.bext.chunkId, 'bext');
    });
});

describe('bext field with less bytes than the field size ' +
    'should be filled with null chars',
    function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav"));
    wav.bext.originator = "test";
    let wav2 = new WaveFile(wav.toBuffer());
    var stats = fs.statSync(path + "32bitIEEE-16kHz-bext-mono.wav");
    var fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    it("bextChunkId should be 'bext'", function() {
        assert.equal(wav2.bext.chunkId, 'bext');
    });
    it("bext.chunkSize should be 602", function() {
        assert.equal(wav2.bext.chunkSize, 602);
    });
    it("'originator' field should be 'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            function() {
        assert.equal(wav2.bext.originator,
            'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000');
    });
});

describe('Add bext to a file with no bext',function() {
    
    // Load a file with no "bext" chunk
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    // Add BWF data
    wav.bext.originator = "test";
    
    // Write to a new file    
    fs.writeFileSync(path + '/out/16-bit-8kHz-noBext-mono-add-bext.wav', wav.toBuffer());

    // Load the new file; it is expected to have BWF data
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/16-bit-8kHz-noBext-mono-add-bext.wav"));
    it("bextChunkId should be 'bext'", function() {
        assert.equal(wav2.bext.chunkId, 'bext');
    });
    it("bext.chunkSize should be 602", function() {
        assert.equal(wav2.bext.chunkSize, 602);
    });
    it("'originator' field should be 'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            function() {
        assert.equal(wav2.bext.originator,
            'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000');
    });
});

describe('Add bext to a file with no bext (just the timeReference field)',function() {
    
    // Load a file with no "bext" chunk
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    // Add BWF timeReference
    wav.bext.timeReference = [1, 0];
    
    // Write to a new file    
    fs.writeFileSync(path + '/out/16-bit-8kHz-noBext-mono-add-bext-timeReference.wav', wav.toBuffer());

    // Load the new file; it is expected to have BWF data
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/16-bit-8kHz-noBext-mono-add-bext-timeReference.wav"));
    it("bextChunkId should be 'bext'", function() {
        assert.equal(wav2.bext.chunkId, 'bext');
    });
    it("bext.chunkSize should be 602", function() {
        assert.equal(wav2.bext.chunkSize, 602);
    });
    it("'timeReference' field should be [1, 0]",
            function() {
        assert.deepEqual(wav2.bext.timeReference, [1, 0]);
    });
});

describe('Add bext to a file with no bext (just the loudnessValue field)',function() {
    
    // Load a file with no "bext" chunk
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    // Add BWF loudnessValue
    wav.bext.loudnessValue = 1;
    
    // Write to a new file    
    fs.writeFileSync(path + '/out/16-bit-8kHz-noBext-mono-add-bext-loudnessValue.wav', wav.toBuffer());

    // Load the new file; it is expected to have BWF data
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/16-bit-8kHz-noBext-mono-add-bext-loudnessValue.wav"));
    it("bextChunkId should be 'bext'", function() {
        assert.equal(wav2.bext.chunkId, 'bext');
    });
    it("bext.chunkSize should be 602", function() {
        assert.equal(wav2.bext.chunkSize, 602);
    });
    it("'loudnessValue' field should be 1",
            function() {
        assert.deepEqual(wav2.bext.loudnessValue, 1);
    });
});
