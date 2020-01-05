/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2020 Rafael da Silva Rocha. MIT License.
 *
 * Write files with iXML chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "./test/files/";

describe("Read files with iXML chunk", function() {
    let wav = new WaveFile(
        fs.readFileSync(path + "24bit-48kHz-1c-mixpre6-hiser_interview.WAV"));

    it("iXML bytes should be a even number", function() {
        assert.equal(wav.get_PMXBytes_().length % 2, false);
    });

    it("iXML bytes should be a even number on written file", function() {
    	let wav2 = new WaveFile(wav.toBuffer());
        assert.equal(wav2.get_PMXBytes_().length % 2, false);
    });
});
