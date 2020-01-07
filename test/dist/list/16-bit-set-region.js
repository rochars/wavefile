/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing a region.
 * A region is a cue point with associated data in the LIST chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('create 44100 kHz 24-bit stereo wave file with one region',
        function() {

    // create a file from scratch
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<128000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wav.fromScratch(2, 44100, '24', deInterleaved);

    // Set cue points in the file
    wav.setCuePoint({position: 1250, label: "Region 7", end: 1900});

    // cue point label in the written file
    let cuePoints = wav.listCuePoints();
    it("fromScratch-REGION1, memory, region 1 name", function() {
        assert.equal(cuePoints[0].label, 'Region 7');
    });

    // write the file
    fs.writeFileSync(
        "././test/files/out/fromScratch-REGION1.wav", wav.toBuffer());

    // Open the written file
    let newWav = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-REGION1.wav"));

    // cue chunk in the written file
    it("newWav.cue.chunkId should be 'cue '", function() {
        assert.equal(newWav.cue.chunkId, "cue ");
    });
    it("newWav.cue.points.length should be 1", function() {
        assert.equal(newWav.cue.points.length, 1);
    });
    it("newWav.cue.points.length should be 1", function() {
        assert.equal(newWav.cue.points.length, 1);
    });

    // cue point label in the written file
    cuePoints = newWav.listCuePoints();
    it("fromScratch-REGION1, written, region 1 name", function() {
        assert.equal(cuePoints[0].label, 'Region 7');
    });
});
