/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test parsing "smpl" chunks.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

// Reaper file with regions defined in a "smpl" chunk
describe("read 16bit-8kHz-1c-reaper-region.wav and write " +
    "to new file", function() {
    
    // read the Reaper file (read only)
    let wavB = new WaveFile(
        fs.readFileSync(path + "16bit-8kHz-1c-reaper-region.wav"));
    // read the Reaper file (toBuffer() will be called on this one)
    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-8kHz-1c-reaper-region.wav"));

    // write it to /out
    fs.writeFileSync(
        path + "/out/16bit-8kHz-1c-reaper-region-out.wav", wav.toBuffer());

    // stats of both files
    let stats = fs.statSync(path + "16bit-8kHz-1c-reaper-region.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/16bit-8kHz-1c-reaper-region-out.wav");
    let fileSizeInBytes2 = stats["size"];

    // read the file from /out
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/16bit-8kHz-1c-reaper-region-out.wav"));
    
    // smpl
    it("wav2.smpl should be == wav.smpl", function() {
        assert.deepEqual(wav2.smpl, wavB.smpl);
    });
    
    // Other tests
    it("wav2.chunkSize should be == fileSizeInBytes2", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    //it("wav.LIST[0]['chunkSize'] == wav2.getLISTBytes_().length", function() {
    //    assert.equal(
    //        wavB.LIST[0]["chunkSize"], wavB.getLISTBytes_().length - 8);
    //});
    //it("wav.LIST[0]['chunkSize'] == wav2.getLISTBytes_().length", function() {
    //    assert.equal(
    //        wav2.LIST[0]["chunkSize"], wav2.getLISTBytes_().length - 8);
    //});
    it("wav2.cue should be == wav.cue", function() {
        assert.deepEqual(wav2.cue, wav.cue);
    });
    it("wav2.fmt should be == wav.fmt", function() {
        assert.deepEqual(wav2.fmt, wav.fmt);
    });
    it("wav2.fact should be == wav.fact", function() {
        assert.deepEqual(wav2.fact, wav.fact);
    });
    it("wav2.bext should be == wav.bext", function() {
        assert.deepEqual(wav2.bext, wav.bext);
    });
    it("wav2.junk should be == wav.junk", function() {
        assert.deepEqual(wav2.junk, wav.junk);
    });
});
