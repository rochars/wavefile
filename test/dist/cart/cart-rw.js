/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2020 Andrew Kuklewicz. MIT License.
 *
 * Test reading and writing the "cart" chunk.
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

function cl(str) {
  return str.replace(/\0+$/, "");
}

describe("Read and write cart chunk PCM wav file", function() {
  let wav = new WaveFile(fs.readFileSync(path + "cc_0101.wav"));
  fs.writeFileSync(path + "out/cc_0101.wav", wav.toBuffer());
  wav = new WaveFile(fs.readFileSync(path + "out/cc_0101.wav"));

  assert.equal(wav.fmt.audioFormat, 1);
  assert.equal(wav.fmt.numChannels, 2);
  assert.equal(wav.fmt.sampleRate, 32000);
  assert.equal(wav.fmt.byteRate, 128000);

  assert.equal(wav.cart.chunkId, "cart");
  assert.equal(wav.cart.chunkSize, 2568);
  assert.equal(wav.cart.version, "0101");
  assert.equal(
    cl(wav.cart.title),
    "Cart Chunk: the traffic data file format for the Radio Industry"
  );
  assert.equal(cl(wav.cart.artist), "Jay Rose, dplay.com");
  assert.equal(cl(wav.cart.cutId), "DEMO-0101");
  assert.equal(cl(wav.cart.clientId), "CartChunk.org");
  assert.equal(cl(wav.cart.category), "DEMO");
  assert.equal(cl(wav.cart.classification), "Demo and sample files");
  assert.equal(cl(wav.cart.outCue), "the Radio Industry");
  assert.equal(cl(wav.cart.startDate), "1900/01/01");
  assert.equal(cl(wav.cart.startTime), "00:00:00");
  assert.equal(cl(wav.cart.endDate), "2099/12/31");
  assert.equal(cl(wav.cart.endTime), "23:59:59");
  assert.equal(cl(wav.cart.producerAppId), "AUDICY");
  assert.equal(cl(wav.cart.producerAppVersion), "3.10/623");
  assert.equal(
    cl(wav.cart.userDef),
    "Demo ID showing basic 'cart' chunk attributes"
  );
  assert.equal(wav.cart.levelReference, 32768);
  assert.equal(wav.cart.postTimer[0].usage, "MRK ");
  assert.equal(wav.cart.postTimer[0].value, 112000);
  assert.equal(wav.cart.postTimer[6].usage, "\u0000\u0000\u0000\u0000");
  assert.equal(wav.cart.postTimer[6].value, 4294967295);
  assert.equal(wav.cart.postTimer[7].usage, "EOD ");
  assert.equal(wav.cart.postTimer[7].value, 201024);
  assert.equal(cl(wav.cart.reserved), "");
  assert.equal(cl(wav.cart.url), "http://www.cartchunk.org");

  assert.equal(
    wav.cart.tagText,
    "The radio traffic data, or 'cart' format utilizes a widely\r\nused standard audio file format (wave and broadcast wave file).\r\nIt incorporates the common broadcast-specific cart labeling\r\ninformation into a specialized chunk within the file itself.\r\nAs a result, the burden of linking multiple systems is reduced\r\nto producer applications writing a single file, and the consumer\r\napplications reading it. The destination application can extract\r\ninformation and insert it into the native database application\r\nas needed.\r\n"
  );
});

describe("Read and write a cart bwf mpeg file", function() {
  let wav = new WaveFile(fs.readFileSync(path + "60315.wav"));
  fs.writeFileSync(path + "out/60315.wav", wav.toBuffer());
  wav = new WaveFile(fs.readFileSync(path + "out/60315.wav"));

  it("fmt should have extended mpeg info", function() {
    assert.equal(wav.fmt.audioFormat, 80);
    assert.equal(wav.fmt.byteRate, 32000);
    assert.equal(wav.fmt.headLayer, 2);
    assert.equal(wav.fmt.headBitRate, 256000);
    assert.equal(wav.fmt.headMode, 1);
    assert.equal(wav.fmt.headModeExt, 1);
    assert.equal(wav.fmt.headEmphasis, 0);
    assert.equal(wav.fmt.headFlags, 28);
    assert.equal(wav.fmt.ptsLow, 0);
    assert.equal(wav.fmt.ptsHigh, 0);
  });

  it("cart chunkId should be 'cart' when read or written", function() {
    assert.equal(wav.cart.chunkId, "cart");
    assert.equal(wav.cart.version, "0101");
    assert.equal(cl(wav.cart.cutId), "60315");
  });

  it("mext chunkId should be 'mext' when read or written", function() {
    assert.equal(wav.mext.chunkId, "mext");
    assert.equal(wav.mext.frameSize, 835);
    assert.equal(wav.mext.soundInformation, 7);
  });

  it("should have MPEG audio format and bit depth", function() {
    assert.equal(wav.bitDepth, 65535);
    assert.equal(wav.fmt.audioFormat, 80);
  });
});

describe("Create an bwf mpeg cart file from info and an mp2 file", function() {
  let info = {
    version: 1,
    layer: 2,
    sampleRate: 44100,
    bitRate: 128,
    channelMode: "stereo",
    padding: 1,
    modeExtension: 0,
    emphasis: 0,
    privateBit: 1,
    copyright: true,
    original: true,
    errorProtection: true,
    numChannels: 2,
    frameSize: 768,
    sampleLength: 269568,
    freeForm: true
  };

  let wav = new WaveFile();
  wav.fromMpeg(fs.readFileSync(path + "test.mp2"), info);
  wav.cart.chunkId = "cart";
  wav.cart.cutId = "30000";
  wav.cart.title = "Title";
  wav.cart.artist = "Artist";

  fs.writeFileSync(path + "out/test-mp2-i.wav", wav.toBuffer());
  wav = new WaveFile(fs.readFileSync(path + "out/test-mp2-i.wav"));

  assert.equal(wav.fmt.sampleRate, 44100);
  assert.equal(wav.fmt.byteRate, 16000);
  assert.equal(wav.fmt.numChannels, 2);
  assert.equal(wav.fmt.blockAlign, 768);
  assert.equal(wav.fmt.numChannels, 2);
  assert.equal(wav.fmt.headBitRate, 128000);
  assert.equal(wav.fmt.headLayer, 2);

  assert.equal(wav.fact.dwSampleLength, 269568);

  assert.equal(
    wav.bext.codingHistory,
    "A=MPEG1L2,F=44100,B=128,M=stereo,T=wavefile\r\n\u0000\u0000"
  );

  assert.equal(wav.mext.frameSize, 768);
  assert.equal(wav.mext.soundInformation, 8);
});

describe("Create a bwf mpeg cart file from an mp2 file", function() {
  let wav = new WaveFile();

  wav.fromMpeg(fs.readFileSync(path + "44100_test.mp2"));
  fs.writeFileSync(path + "out/test-mp2.wav", wav.toBuffer());
  wav = new WaveFile(fs.readFileSync(path + "out/test-mp2.wav"));

  assert.equal(wav.fmt.sampleRate, 44100);
  assert.equal(wav.fmt.byteRate, 32000);
  assert.equal(wav.fmt.numChannels, 2);
  assert.equal(wav.fmt.blockAlign, 835);
  assert.equal(wav.fmt.numChannels, 2);
  assert.equal(wav.fmt.headBitRate, 256000);
  assert.equal(wav.fmt.headLayer, 2);

  assert.equal(wav.fact.dwSampleLength, 1323648);

  assert.equal(
    wav.bext.codingHistory,
    "A=MPEG1L2,F=44100,B=256,M=stereo,T=wavefile\r\n\u0000\u0000"
  );

  assert.equal(wav.mext.frameSize, 835);
  assert.equal(wav.mext.soundInformation, 7);
});
