/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Tests for sample rate conversion, lanczos method.
 * 
 */

const assert = require('assert');
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "./test/files/";

console.log('lanczos');

// Test file integrity

describe('Upsample a 16bit 8kHz file', function() {
    
  // Read a 8kHz wav 
  let wav = new WaveFile(
      fs.readFileSync(path + "song1.wav"));

  // Convert to another sample rate
  wav.toSampleRate(16000, {method: 'lanczos', clip: 'mirror'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/lanczos-song1-mirror.wav",
    wav.toBuffer());

  // Read the written 16kHz file 
  let wav2 = new WaveFile(
    fs.readFileSync(
      path +"/out/to-sample-rate/lanczos-song1-mirror.wav"));

  // Check the attributes of the resampled file
  it("chunkId should be 'RIFF'", function() {
    assert.equal(wav2.container, "RIFF");
  });
  it("fmtChunkId should be 'fmt '", function() {
    assert.equal(wav2.fmt.chunkId, "fmt ");
  });
  it("format should be 'WAVE'", function() {
    assert.equal(wav2.format, "WAVE");
  });
  it("fmtChunkSize should be 16", function() {
    assert.equal(wav2.fmt.chunkSize, 16);
  });
  it("audioFormat should be 1 (PCM)", function() {
    assert.equal(wav2.fmt.audioFormat, 1);
  });
  it("numChannels should be 1", function() {
    assert.equal(wav2.fmt.numChannels, 2);
  });
  it("sampleRate should be 16000", function() {
    assert.equal(wav2.fmt.sampleRate, 16000);
  });
  it("byteRate should be 64000", function() {
    assert.equal(wav2.fmt.byteRate, 64000);
  });
  it("blockAlign should be 4", function() {
    assert.equal(wav2.fmt.blockAlign, 4);
  });
  it("bitsPerSample should be 16", function() {
    assert.equal(wav2.fmt.bitsPerSample, 16);
  });
  it("dataChunkId should be 'data'", function() {
    assert.equal(wav2.data.chunkId, 'data');
  });
  it("dataChunkSize should be > 0", function() {
    assert.ok(wav2.data.chunkSize > 0);
  });
  it("samples.length should be > 0", function() {
    assert.ok(wav2.data.samples.length > 0);
  });
});
