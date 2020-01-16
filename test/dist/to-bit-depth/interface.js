/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * toBitDepth interface tests
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("toBitDepth interface tests", function() {

  it("Throws error for negative bit depths", function() {
    assert.throws(function() {
      let wav = new WaveFile(
      fs.readFileSync(path + "16bit-8kHz-stereo.wav"));
      wav.toBitDepth("-1");
    }, Error);
  });

  it("Throws error if bit depth == 0", function() {
    assert.throws(function() {
      let wav = new WaveFile(
      fs.readFileSync(path + "16bit-8kHz-stereo.wav"));
      wav.toBitDepth("0");
    }, Error);
  });

  it("Throws error if bit depth > 53", function() {
    assert.throws(function() {
      let wav = new WaveFile(
      fs.readFileSync(path + "16bit-8kHz-stereo.wav"));
      wav.toBitDepth("54");
    }, Error);
  });
});
