/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('read a file with bext from disk and write to new file',
    function() {
    
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    let wav = new WaveFile(
        fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav"));
    let wav2 = new WaveFile(wav.toBuffer());
    
    it("bextChunkId should be 'bext'",
            function() {
        assert.equal(wav2.bext.chunkId, 'bext');
    });

});

describe('bext field with less bytes than the field size ' +
    'should be filled with null chars',
    function() {
    
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    let wav = new WaveFile(
        fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav"));
    wav.bext.originator = "test";
    let wav2 = new WaveFile(wav.toBuffer());
    
    it("bextChunkId should be 'bext'",
            function() {
        assert.equal(wav2.bext.chunkId, 'bext');
    });

    it("bext.chunkSize should be 0",
            function() {
        assert.equal(wav2.bext.chunkSize, 602);
    });

    it("'originator' field should be 'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            function() {
        assert.equal(wav2.bext.originator,
            'test\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000');
    });

});
