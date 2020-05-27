const assert = require("assert");
const fs = require("fs");
const path = "./test/files/";
const MpegReader = require("../../lib/mpeg-reader.js").MpegReader;

describe("Test the mpeg file class", function() {
  let mpeg = new MpegReader(fs.readFileSync(path + "test.mp2"));
  let mpegId3 = new MpegReader(fs.readFileSync(path + "test-id3.mp2"));

  it("should parse an mp2 file", function() {
    assert.equal(mpeg.head, 4);
    assert.equal(mpeg.version, 1);
    assert.equal(mpeg.layer, 2);
    assert.equal(mpeg.errorProtection, false);
    assert.equal(mpeg.bitRate, 256);
    assert.equal(mpeg.sampleRate, 48000);
    assert.equal(mpeg.padding, false);
    assert.equal(mpeg.privateBit, false);
    assert.equal(mpeg.channelMode, "stereo");
    assert.equal(mpeg.modeExtension, 0);
    assert.equal(mpeg.copyright, false);
    assert.equal(mpeg.original, false);
    assert.equal(mpeg.emphasis, 0);
    assert.equal(mpeg.numChannels, 2);
    assert.equal(mpeg.id3v2Offset, 0);
    assert.equal(mpeg.samplesPerFrame, 1152);
    assert.equal(mpeg.frameSize, 768);
    assert.equal(mpeg.sampleLength, 269568);
    assert.equal(mpeg.durationEstimate | 0, 5);
    assert.equal(mpeg.homogeneous, true);
    assert.equal(mpeg.freeForm, false);
  });

  it("should parse the same mp3 with id3 tags", function() {
    assert.equal(mpegId3.id3v2Offset, 315);
    assert.equal(mpeg.version, mpegId3.version);
    assert.equal(mpeg.layer, mpegId3.layer);
    assert.equal(mpeg.bitRate, mpegId3.bitRate);
    assert.equal(mpeg.sampleRate, mpegId3.sampleRate);
    assert.equal(mpeg.channelMode, mpegId3.channelMode);
  });

  it("should fail to parse a bad mp2", function() {
    assert.throws(function() {
      let mpegBad = new MpegReader(fs.readFileSync(path + "test-bad.mp2"));
    }, /Invalid frame/);
  });
});
