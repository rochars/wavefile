/*!
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");

describe("64-bit reading", function() {

    /*
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wBytes = fs.readFileSync(path + "RF64-64-bit-8kHz--mono-bext.wav");
    let wav = new WaveFile(wBytes);

    it("chunkId should be 'RF64'",
            function() {
        assert.equal(wav.container, "RF64");
    });
    it("chunkSize should be -1",
            function() {
        assert.equal(wav.chunkSize, -1);
    });

    // --------------------------------
    // ds64 fields
    it("ds64 chunk should not be null",
            function() {
        assert.ok(wav.ds64);
    });
    it("ds64.riffSizeHigh should not be null",
            function() {
        assert.ok(wav.ds64.riffSizeHigh);
    });
    it("ds64.riffSizeLow should not be null",
            function() {
        assert.ok(wav.ds64.riffSizeLow);
    });

    it("ds64.dataSizeHigh should not be null",
            function() {
        assert.ok(wav.ds64.dataSizeHigh);
    });
    it("ds64.dataSizeLow should not be null",
            function() {
        assert.ok(wav.ds64.dataSizeLow);
    });

    it("ds64.sampleCountHigh should not be null",
            function() {
        assert.ok(wav.ds64.sampleCountHigh);
    });
    it("ds64.sampleCountLow should not be null",
            function() {
        assert.ok(wav.ds64.sampleCountLow);
    });

    it("ds64.tableLength should not be null",
            function() {
        assert.ok(wav.ds64.tableLength);
    });
    it("ds64.table should not be null",
            function() {
        assert.ok(wav.ds64.table);
    });
    // --------------------------------


    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 3 (IEEE)",
            function() {
        assert.equal(wav.fmt.audioFormat, 3);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate should be 64000",
            function() {
        assert.equal(wav.fmt.byteRate, 64000);
    });
    it("blockAlign should be 8",
            function() {
        assert.equal(wav.fmt.blockAlign, 8);
    });
    it("bitsPerSample should be 64",
            function() {
        assert.equal(wav.fmt.bitsPerSample, 64);
    });
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav.data.samples.length > 0);
    });
    */
});
