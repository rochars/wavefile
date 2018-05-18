/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test reading and writing the "bext" chunk.
 * 
 */

const assert = require('assert');
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "test/files/";

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
    it("bext.chunkSize should be 0", function() {
        assert.equal(wav2.bext.chunkSize, 602);
    });
    it("'originator' field should be 'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            function() {
        assert.equal(wav2.bext.originator,
            'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000');
    });

});
