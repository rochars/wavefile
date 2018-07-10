/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test parsing "LIST" chunks of type "INFO".
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('read M1F1-int12WE-AFsp-NEW-TAGS.wav', function() {
    
    let wav2 = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav"));
    let stats = fs.statSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav");
    let fileSizeInBytes2 = stats["size"];

    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    it("chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0].chunkId, "LIST");
    });
    it("chunkSize should be > 0", function() {
        assert.ok(wav2.LIST[0].chunkSize > 0);
    });
    it("LISTChunks.length should be 1", function() {
        assert.equal(wav2.LIST.length, 1);
    });
    it("subChunks.length should be 6", function() {
        assert.equal(wav2.LIST[0].subChunks.length, 6);
    });
    it("format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0].format, "INFO");
    });
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 40", function() {
        assert.equal(wav2.fmt.chunkSize, 40);
    });
    it("audioFormat should be 65534 (WAVE_FORMAT_EXTENSIBLE)",
            function() {
        assert.equal(wav2.fmt.audioFormat, 65534);
    });
    it("numChannels should be 2", function() {
        assert.equal(wav2.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("byteRate should be 32000", function() {
        assert.equal(wav2.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4 (stereo)", function() {
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
    it("dwChannelMask should be 0", function() {
        assert.equal(wav2.fmt.dwChannelMask, 0);
    });
});

describe('read M1F1-int12WE-AFsp-NEW-TAGS.wav and write to new file', function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav"));
    let wavB = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav"));
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-LIST-NEW-TAGS.wav", wavB.toBuffer());
    let stats = fs.statSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/M1F1-int12WE-AFsp-LIST-NEW-TAGS.wav");
    let fileSizeInBytes2 = stats["size"];

    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/M1F1-int12WE-AFsp-LIST-NEW-TAGS.wav"));
    
    // Reading tags from the original file
    it("RIFF tag IART", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["chunkId"], "IART");
    });
    it("RIFF tag IART", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["chunkSize"], 4);
    });
    it("RIFF tag IART", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["value"], "3cc");
    });
    it("RIFF tag ICMT", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["chunkId"], "ICMT");
    });
    it("RIFF tag ICMT", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["chunkSize"], 21);
    });
    it("RIFF tag ICMT", function() {
        assert.equal(
            wav.LIST[0]["subChunks"][1]["value"], "kabal@CAPELLA edited");
    });
    it("RIFF tag ICRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["chunkId"], "ICRD");
    });
    it("RIFF tag ICRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["chunkSize"], 24);
    });
    it("RIFF tag ICRD", function() {
        assert.equal(
            wav.LIST[0]["subChunks"][2]["value"], "2003-01-30 03:28:46 UTC");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav.LIST[0]["subChunks"][3]["chunkId"], "IENG");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav.LIST[0]["subChunks"][3]["chunkSize"], 11);
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav.LIST[0]["subChunks"][3]["value"], "WaveFile 1");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][4]["chunkId"], "IPRD");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][4]["chunkSize"], 3);
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][4]["value"], "2c");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav.LIST[0]["subChunks"][5]["chunkId"], "ISFT");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav.LIST[0]["subChunks"][5]["chunkSize"], 10);
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav.LIST[0]["subChunks"][5]["value"], "CopyAudio");
    });
    //it("wav.LIST[0]['chunkSize'] == wav.getLISTSize_()", function() {
    //    assert.equal(wav.LIST[0]["chunkSize"], wav.getLISTBytes_().length - 8);
    //});
    // Reading tags from the file written with WaveFile
    it("RIFF tag IART", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["chunkId"], "IART");
    });
    it("RIFF tag IART", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["chunkSize"], 4);
    });
    it("RIFF tag IART", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["value"], "3cc");
    });
    it("RIFF tag ICMT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["chunkId"], "ICMT");
    });
    it("RIFF tag ICMT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["chunkSize"], 21);
    });
    it("RIFF tag ICMT", function() {
        assert.equal(
            wav2.LIST[0]["subChunks"][1]["value"], "kabal@CAPELLA edited");
    });
    it("RIFF tag ICRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["chunkId"], "ICRD");
    });
    it("RIFF tag ICRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["chunkSize"], 24);
    });
    it("RIFF tag ICRD", function() {
        assert.equal(
            wav2.LIST[0]["subChunks"][2]["value"], "2003-01-30 03:28:46 UTC");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav2.LIST[0]["subChunks"][3]["chunkId"], "IENG");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav2.LIST[0]["subChunks"][3]["chunkSize"], 11);
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav2.LIST[0]["subChunks"][3]["value"], "WaveFile 1");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][4]["chunkId"], "IPRD");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][4]["chunkSize"], 3);
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][4]["value"], "2c");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][5]["chunkId"], "ISFT");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][5]["chunkSize"], 10);
    });
    it("RIFF tag ISFT", function() {
        assert.equal(
            wav2.LIST[0]["subChunks"][5]["value"], "CopyAudio");
    });
    //it("wav.LIST[0]['chunkSize'] == wav.getLISTSize_()",
    //    function() {
    //    assert.equal(
    //        wav2.LIST[0]["chunkSize"], wav.getLISTBytes_().length - 8);
    //});
    // Other tests
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
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
    it("chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0].chunkId, "LIST");
    });
    it("chunkSize should be > 0", function() {
        assert.ok(wav2.LIST[0].chunkSize > 0);
    });
    it("LISTChunks.length should be 1", function() {
        assert.equal(wav2.LIST.length, 1);
    });
    it("subChunks.length should be 6", function() {
        assert.equal(wav2.LIST[0].subChunks.length, 6);
    });
    it("format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0].format, "INFO");
    });
    it("wav2.cue should be == wav.cue", function() {
        assert.deepEqual(wav2.cue, wav.cue);
    });
    it("wav2.junk should be == wav.junk", function() {
        assert.deepEqual(wav2.junk, wav.junk);
    });
    it("wav2.bext should be == wav.bext", function() {
        assert.deepEqual(wav2.bext, wav.bext);
    });
    it("wav2.fmt should be == wav.fmt", function() {
        assert.deepEqual(wav2.fmt, wav.fmt);
    });
    it("wav2.ds64 should be == wav.ds64", function() {
        assert.deepEqual(wav2.ds64, wav.ds64);
    });
    it("wav2.ds64 should be == wav.ds64", function() {
        assert.deepEqual(wav2.ds64, wav.ds64);
    });
    it("wav2.fact should be == wav.fact", function() {
        assert.deepEqual(wav2.fact, wav.fact);
    });
    // rest of the file
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 40", function() {
        assert.equal(wav2.fmt.chunkSize, 40);
    });
    it("audioFormat should be 65534 (WAVE_FORMAT_EXTENSIBLE)",
            function() {
        assert.equal(wav2.fmt.audioFormat, 65534);
    });
    it("numChannels should be 2", function() {
        assert.equal(wav2.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("byteRate should be 32000", function() {
        assert.equal(wav2.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4 (stereo)", function() {
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
    it("samples on the new file should have the same length",
            function() {
        assert.equal(wav2.data.samples.length, wav.data.samples.length);
    });
    it("samples on the new file should be same", function() {
        assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
    it("dwChannelMask should be 0", function() {
        assert.equal(wav2.fmt.dwChannelMask, 0);
    });

});

// Audacity file
describe('read Audacity-16bit.wav and write to new file', function() {
    
    let wav = new WaveFile(fs.readFileSync(path + "Audacity-16bit.wav"));
    let wavB = new WaveFile(fs.readFileSync(path + "Audacity-16bit.wav"));
    fs.writeFileSync(path + "/out/Audacity-16bit.wav", wavB.toBuffer());
    let stats = fs.statSync(path + "Audacity-16bit.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/Audacity-16bit.wav");
    let fileSizeInBytes2 = stats["size"];
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/Audacity-16bit.wav"));
    
    // Reading tags from the original file
    it("RIFF tag INAM", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["chunkId"], "INAM");
    });
    it("RIFF tag INAM", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["chunkSize"], 10);
    });
    it("RIFF tag INAM", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["value"], "test tags");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["chunkId"], "IPRD");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["chunkSize"], 12);
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["value"], "test suite");
    });
    it("RIFF tag IART", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["chunkId"], "IART");
    });
    it("RIFF tag IART", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["chunkSize"], 10);
    });
    it("RIFF tag IART", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["value"], "WaveFile");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav.LIST[0]["subChunks"][3]["chunkId"], "ICRD");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav.LIST[0]["subChunks"][3]["chunkSize"], 6);
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav.LIST[0]["subChunks"][3]["value"], "2018");
    });
    it("RIFF tag ITRK", function() {
        assert.equal(wav.LIST[0]["subChunks"][4]["chunkId"], "ITRK");
    });
    it("RIFF tag ITRK", function() {
        assert.equal(wav.LIST[0]["subChunks"][4]["chunkSize"], 2);
    });
    it("RIFF tag ITRK", function() {
        assert.equal(wav.LIST[0]["subChunks"][4]["value"], "1");
    });
    // Reading tags from the output
    it("RIFF tag INAM", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["chunkId"], "INAM");
    });
    it("RIFF tag INAM", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["chunkSize"], 10);
    });
    it("RIFF tag INAM", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["value"], "test tags");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["chunkId"], "IPRD");
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["chunkSize"], 11);
    });
    it("RIFF tag IPRD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["value"], "test suite");
    });
    it("RIFF tag IART", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["chunkId"], "IART");
    });
    it("RIFF tag IART", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["chunkSize"], 9);
    });
    it("RIFF tag IART", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["value"], "WaveFile");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav2.LIST[0]["subChunks"][3]["chunkId"], "ICRD");
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav2.LIST[0]["subChunks"][3]["chunkSize"], 5);
    });
    it("RIFF tag IENG", function() {
        assert.equal(wav2.LIST[0]["subChunks"][3]["value"], "2018");
    });
    it("RIFF tag ITRK", function() {
        assert.equal(wav2.LIST[0]["subChunks"][4]["chunkId"], "ITRK");
    });
    it("RIFF tag ITRK", function() {
        assert.equal(wav2.LIST[0]["subChunks"][4]["chunkSize"], 2);
    });
    it("RIFF tag ITRK", function() {
        assert.equal(wav2.LIST[0]["subChunks"][4]["value"], "1");
    });
    // Other tests
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav2.chunkSize should be == fileSizeInBytes2", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    //it("wav.LIST[0]['chunkSize'] == wav.getLISTSize_()", function() {
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
    it("chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0].chunkId, "LIST");
    });
    it("chunkSize should be > 0", function() {
        assert.ok(wav2.LIST[0].chunkSize > 0);
    });
    it("LISTChunks.length should be 1", function() {
        assert.equal(wav2.LIST.length, 1);
    });
    it("subChunks.length should be 6", function() {
        assert.equal(wav2.LIST[0].subChunks.length, 6);
    });
    it("format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0].format, "INFO");
    });
    it("wav2.cue should be == wav.cue", function() {
        assert.deepEqual(wav2.cue, wav.cue);
    });
    it("wav2.junk should be == wav.junk", function() {
        assert.deepEqual(wav2.junk, wav.junk);
    });
    it("wav2.bext should be == wav.bext", function() {
        assert.deepEqual(wav2.bext, wav.bext);
    });
    it("wav2.fmt should be == wav.fmt", function() {
        assert.deepEqual(wav2.fmt, wav.fmt);
    });
    it("wav2.ds64 should be == wav.ds64", function() {
        assert.deepEqual(wav2.ds64, wav.ds64);
    });
    it("wav2.ds64 should be == wav.ds64", function() {
        assert.deepEqual(wav2.ds64, wav.ds64);
    });
    it("wav2.fact should be == wav.fact", function() {
        assert.deepEqual(wav2.fact, wav.fact);
    });
    // rest of the file
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
    it("audioFormat should be 1",
            function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it("numChannels should be 2", function() {
        assert.equal(wav2.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("byteRate should be 32000", function() {
        assert.equal(wav2.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4 (stereo)", function() {
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
    it("samples on the new file should have the same length",
            function() {
        assert.equal(wav2.data.samples.length, wav.data.samples.length);
    });
    it("samples on the new file should be same", function() {
        assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
    it("dwChannelMask should be 0", function() {
        assert.equal(wav2.fmt.dwChannelMask, 0);
    });
});

describe('read M1F1-int12WE-AFsp.wav and write to new file', function() {
    
    let fs = require("fs");
    const WaveFile = require("../../../test/loader.js");
    let path = "./test/files/";
    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-LIST.wav", wav.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/M1F1-int12WE-AFsp-LIST.wav"));
    let stats = fs.statSync(path + "M1F1-int12WE-AFsp.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/M1F1-int12WE-AFsp-LIST.wav");
    let fileSizeInBytes2 = stats["size"];

    it("RIFF tag ICRT", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["chunkId"], "ICRD");
    });
    it("RIFF tag ICRT", function() {
        assert.equal(wav.LIST[0]["subChunks"][0]["chunkSize"], 24);
    });
    it("RIFF tag ICRT", function() {
        assert.equal(
            wav.LIST[0]["subChunks"][0]["value"], "2003-01-30 03:28:46 UTC");
    });
    it("RIFF tag ICMD", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["chunkId"], "ICMT");
    });
    it("RIFF tag ICMD", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["chunkSize"], 14);
    });
    it("RIFF tag ICMD", function() {
        assert.equal(wav.LIST[0]["subChunks"][2]["value"], "kabal@CAPELLA");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["chunkId"], "ISFT");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["chunkSize"], 10);
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav.LIST[0]["subChunks"][1]["value"], "CopyAudio");
    });
    // wav2
    it("RIFF tag ICRT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["chunkId"], "ICRD");
    });
    it("RIFF tag ICRT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][0]["chunkSize"], 24);
    });
    it("RIFF tag ICRT", function() {
        assert.equal(
            wav2.LIST[0]["subChunks"][0]["value"], "2003-01-30 03:28:46 UTC");
    });
    it("RIFF tag ICMD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["chunkId"], "ICMT");
    });
    it("RIFF tag ICMD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["chunkSize"], 14);
    });
    it("RIFF tag ICMD", function() {
        assert.equal(wav2.LIST[0]["subChunks"][2]["value"], "kabal@CAPELLA");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["chunkId"], "ISFT");
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["chunkSize"], 10);
    });
    it("RIFF tag ISFT", function() {
        assert.equal(wav2.LIST[0]["subChunks"][1]["value"], "CopyAudio");
    });
    // other tests
    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    it("chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0].chunkId, "LIST");
    });
    it("chunkSize should be > 0", function() {
        assert.ok(wav2.LIST[0].chunkSize > 0);
    });
    it("LISTChunks.length should be 1", function() {
        assert.equal(wav2.LIST.length, 1);
    });
     it("wav.subChunks.length should be 3", function() {
        assert.equal(wav.LIST[0].subChunks.length, 3);
    });
    it("wav2.subChunks.length should be 3", function() {
        assert.equal(wav2.LIST[0].subChunks.length, 3);
    });
    it("format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0].format, "INFO");
    });
    // rest of the file
    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 40", function() {
        assert.equal(wav2.fmt.chunkSize, 40);
    });
    it("audioFormat should be 65534 (WAVE_FORMAT_EXTENSIBLE)", function() {
        assert.equal(wav2.fmt.audioFormat, 65534);
    });
    it("numChannels should be 2", function() {
        assert.equal(wav2.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("byteRate should be 32000", function() {
        assert.equal(wav2.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4 (stereo)", function() {
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
    it("samples on the new file should have the same length",
            function() {
        assert.equal(wav2.data.samples.length, wav.data.samples.length);
    });
    it("samples on the new file should be same", function() {
        assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
    it("dwChannelMask should be 0", function() {
        assert.equal(wav2.fmt.dwChannelMask, 0);
    });
});
