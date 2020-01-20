/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * wavefile.toSampleRate() interface tests.
 * 
 */

const assert = require('assert');
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "./test/files/";

describe('Resampling interface tests', function() {

  it("Throws Error if resampling a ADPCM file'", function() {
    assert.throws(function() {
        let wav = new WaveFile(
          fs.readFileSync(path + "4bit-imaadpcm-8kHz-noBext-mono.wav"));
        wav.toSampleRate(16000);
     }, Error);
  });

  it("Throws Error if sample rate is zero when resampling'", function() {
    assert.throws(function() {
        let wav = new WaveFile(
          fs.readFileSync(path + "4bit-imaadpcm-8kHz-noBext-mono.wav"));
        wav.toSampleRate(0);
     }, Error);
  });

	// byteRate cant be > 4294967295;
	// byteRate = channels * (bits / 8) * sampleRate;
	// so max sample rate for 16 bit 1 channel = 2147483647
  it("Resample a file to its limits'", function() {
    let wav = new WaveFile();
    wav.fromScratch(1, 16000, '16', [1,2])
    wav.toSampleRate(2147483647);
  });
  it("Throws Error if sample rate > than allowed'", function() {
    assert.throws(function() {
        let wav = new WaveFile();
        wav.fromScratch(1, 16000, '16', [1,2])
        wav.toSampleRate(2147483648);
     }, Error);
  });
  it("Throws Error if sample rate == 0'", function() {
    assert.throws(function() {
        let wav = new WaveFile();
        wav.fromScratch(1, 16000, '8', [1,2])
        wav.toSampleRate(0);
     }, Error);
  });
  it("Throws Error if sample rate < 0'", function() {
    assert.throws(function() {
        let wav = new WaveFile();
        wav.fromScratch(1, 16000, '8', [1,2])
        wav.toSampleRate(-1);
     }, Error);
  });

  it("Throws Error if resampling a A-Law file", function() {
    assert.throws(function() {
        let wav = new WaveFile(
          fs.readFileSync(path + "8bit-alaw-8kHz-noBext-mono-encoded.wav"));
        wav.toSampleRate(16000);
     }, Error);
  });

  it("Throws Error if resampling a mu-Law file", function() {
    assert.throws(function() {
        let wav = new WaveFile(
          fs.readFileSync(path + "8bit-mulaw-8kHz-noBext-mono-encoded.wav"));
        wav.toSampleRate(16000);
     }, Error);
  });

  // Configuration 
  it("Use no LPF on upsample", function() {
    let wav = new WaveFile();
    wav.fromScratch(1, 16000, '16', [1,2])
    wav.toSampleRate(32000, {LPF: false});
  });
  it("Use no LPF on donwnsample", function() {
    let wav = new WaveFile();
    wav.fromScratch(1, 16000, '16', [1,2])
    wav.toSampleRate(8000, {LPF: false});
  });
});
