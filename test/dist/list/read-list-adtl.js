/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test parsing "LIST" chunks of type "adtl".
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

function getLtxt_(wav) {
    for (let i=0; i<wav.LIST.length; i++) {
            if (wav.LIST[i]["format"] == "adtl") {
            for (let j=0; j<wav.LIST[i]["subChunks"].length; j++) {
                if (wav.LIST[i]["subChunks"][j]["chunkId"] == "ltxt") {
                    return wav.LIST[i]["subChunks"][j];
                }
            }
        }
    }
}

// File with "ltxt" chunk
describe("read smpl_cue.wav and write to a new file", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "smpl_cue.wav"));

    //ltxt
    it("ltxt chunks should have empty 'value' field", function() {
        wavLtxt = getLtxt_(wav);
        wav2Ltxt = getLtxt_(wav2);
        assert.equal(wav2Ltxt.value, '');
    });

    let wavB = new WaveFile(
        fs.readFileSync(path + "smpl_cue.wav"));

    fs.writeFileSync(
        path + "/out/smpl_cue-out.wav", wavB.toBuffer());
    let stats = fs.statSync(
        path + "smpl_cue.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/smpl_cue-out.wav");
    let fileSizeInBytes2 = stats["size"];
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/smpl_cue-out.wav"));

    //ltxt
    it("ltxt in wav should not same ltxt in wav2 (original was broken)" + 
        " with chunkSize = 20 (should be 25)", function() {
        wavLtxt = getLtxt_(wav);
        wav2Ltxt = getLtxt_(wav2);
        assert.ok(wav2Ltxt.chunkSize = 25);
    });
    // Other tests
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav2.chunkSize should be == fileSizeInBytes2", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    //it("wav2.LIST[0]['chunkSize'] == wav2.getLISTBytes_().length", function() {
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

describe("'cue ' reading (M1F1-int12WE-AFsp-2-MARKERS-LIST) ", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp-2-MARKERS-LIST.wav"));
    let wavB = new WaveFile(
        fs.readFileSync(path + "M1F1-int12WE-AFsp-2-MARKERS-LIST.wav"));
    fs.writeFileSync(
        path + "/out/M1F1-int12WE-AFsp-2-MARKERS-LIST.wav", wavB.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/M1F1-int12WE-AFsp-2-MARKERS-LIST.wav"));

    let stats = fs.statSync(path + "M1F1-int12WE-AFsp-2-MARKERS-LIST.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/M1F1-int12WE-AFsp-2-MARKERS-LIST.wav");
    let fileSizeInBytes2 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    // should be the same size
    //it("wav.getLISTChunkBytes_ == wav.LIST[0].chunkSize", function() {
    //    assert.equal(wav.getLISTBytes_().length - 8, wav.LIST[0].chunkSize);
    //});
    //it("wav2.getLISTChunkBytes_ == wav2.LIST[0].chunkSize", function() {
    //    assert.equal(wav2.getLISTBytes_().length - 8, wav2.LIST[0].chunkSize);
    //});
    // Reading the original file
    it("file should have 2 cue points", function() {
        assert.equal(wav.cue.points.length, 2);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav.LIST[0].chunkId, "LIST");
    });
    it("LISTChunks[0].chunkSize should be > 0", function() {
        assert.ok(wav.LIST[0].chunkSize > 0);
    });
    it("LISTChunks[0].format should be 'adtl'", function() {
        assert.equal(wav.LIST[0].format, "adtl");
    });
    it("file should have 2 subchunks in the LIST", function() {
        assert.equal(wav.LIST[0].subChunks.length, 2);
    });
    // labl 1
    it("subChunk[0] chunkId should be 'labl'", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkId, 'labl');
    });
    it("subChunk[0] should point to cue.points[0]", function() {
        assert.equal(
            wav.LIST[0].subChunks[0].dwName, wav.cue.points[0].dwName);
    });
    // labl2
    it("subChunk[1] chunkId should be 'labl'", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkId, 'labl');
    });
});

describe("16-bit LIST reading (file with 2 markers) ", function() {

    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-16kHz-2markers-mono.wav"));
    let stats = fs.statSync(path + "16bit-16kHz-2markers-mono.wav");
    let fileSizeInBytes1 = stats["size"];

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    // cue + LIST
    it("file should have 2 cue points", function() {
        assert.equal(wav.cue.points.length, 2);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav.LIST[0].chunkId, "LIST");
    });
    it("LISTChunks[0].chunkSize should be > 0", function() {
        assert.ok(wav.LIST[0].chunkSize > 0);
    });
    it("LISTChunks[0].format should be 'adtl'", function() {
        assert.equal(wav.LIST[0].format, "adtl");
    });
    it("file should have 2 subchunks in the LIST", function() {
        assert.equal(wav.LIST[0].subChunks.length, 2);
    });
    // labl 1
    it("subChunk[0] chunkId should be 'labl'", function() {
        assert.equal(wav.LIST[0].subChunks[0].chunkId, 'labl');
    });
    it("subChunk[0] should point to cue.points[0]", function() {
        assert.equal(
            wav.LIST[0].subChunks[0].dwName, wav.cue.points[0].dwName);
    });
    // labl2
    it("subChunk[1] chunkId should be 'labl'", function() {
        assert.equal(wav.LIST[0].subChunks[1].chunkId, 'labl');
    });
});

describe("16-bit LIST writing (16bit-16kHz-2markers-mono.wav)", function() {

    let wavB = new WaveFile(
        fs.readFileSync(path + "16bit-16kHz-2markers-mono.wav"));
    let wav = new WaveFile(
        fs.readFileSync(path + "16bit-16kHz-2markers-mono.wav"));
    fs.writeFileSync(
        path + "/out/16bit-16kHz-2markers-mono-LIST.wav", wav.toBuffer());
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/16bit-16kHz-2markers-mono-LIST.wav"));

    let stats = fs.statSync(path + "16bit-16kHz-2markers-mono.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/16bit-16kHz-2markers-mono-LIST.wav");
    let fileSizeInBytes2 = stats["size"];

    it("wav.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wav2.LIST, wav.LIST);
    });
    it("wavB.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wavB.LIST, wav2.LIST);
    });

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav2.chunkSize should be == fileSizeInBytes2", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
    // cue + LIST
    it("file should have 2 cue points", function() {
        assert.equal(wav2.cue.points.length, 2);
    });
    it("LISTChunks[0].chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0].chunkId, "LIST");
    });
    it("LISTChunks[0].chunkSize should be > 0", function() {
        assert.ok(wav2.LIST[0].chunkSize > 0);
    });
    it("LISTChunks[0].format should be 'adtl'", function() {
        assert.equal(wav2.LIST[0].format, "adtl");
    });
    it("file should have 2 subchunks in the LIST", function() {
        assert.equal(wav2.LIST[0].subChunks.length, 2);
    });
    // labl 1
    it("subChunk[0] chunkId should be 'labl'", function() {
        assert.equal(wav2.LIST[0].subChunks[0].chunkId, 'labl');
    });
    it("subChunk[0] should point to cue.points[0]", function() {
        assert.equal(
            wav2.LIST[0].subChunks[0].dwName, wav2.cue.points[0].dwName);
    });
    it("subChunk[0].value be 'wave1'", function() {
        assert.equal(wav2.LIST[0].subChunks[0].value, 'wave1');
    });
    // labl2
    it("subChunk[1] chunkId should be 'labl'", function() {
        assert.equal(wav2.LIST[0].subChunks[1].chunkId, 'labl');
    });
    it("subChunk[1] should point to cue.points[1]", function() {
        assert.equal(
            wav2.LIST[0].subChunks[1].dwName, wav2.cue.points[1].dwName);
    });
    it("subChunk[1].value be 'wave2'", function() {
        assert.equal(wav2.LIST[0].subChunks[1].value, 'wave2');
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
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 16000", function() {
        assert.equal(wav2.fmt.sampleRate, 16000);
    });
    it("byteRate be 32000", function() {
        assert.equal(wav2.fmt.byteRate, 32000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav2.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav2.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("cueChunkId should be 'cue '", function() {
        assert.equal(wav2.cue.chunkId, 'cue ');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav2.data.samples.length > 0);
    });
});

// Audacity file
describe("read Audacity-16bit-lots-of-markers.wav and write " +
    "to new file", function() {
    
    // WaveFile with the original file untouched
    let wav = new WaveFile(
        fs.readFileSync(path + "Audacity-16bit-lots-of-markers.wav"));

    // WaveFile with the original file; this one will be used to
    // write the file to disk calling toBuffer(). This will redefine
    // some of the fields in the file.
    let wavB = new WaveFile(
        fs.readFileSync(path + "Audacity-16bit-lots-of-markers.wav"));

    // Write wavB to disk
    fs.writeFileSync(
        path + "/out/Audacity-16bit-lots-of-markers-out.wav", wavB.toBuffer());

    let stats = fs.statSync(path + "Audacity-16bit-lots-of-markers.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/Audacity-16bit-lots-of-markers-out.wav");
    let fileSizeInBytes2 = stats["size"];

    // WaveFile with the re-written file
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/Audacity-16bit-lots-of-markers-out.wav"));

    it("wav.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wav2.LIST, wav.LIST);
    });
    it("wav.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wav2.chunkSize, wav.chunkSize);
    });

    it("wav.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wav2.LIST[0]["subChunks"], wav.LIST[0]["subChunks"]);
    });

    it("wav.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wav.chunkSize, wavB.chunkSize);
    });
    it("wav.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wav.LIST, wavB.LIST);
    });

    // Other tests
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav2.chunkSize should be == fileSizeInBytes2", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
    it("chunkId should be 'LIST'", function() {
        assert.equal(wav2.LIST[0].chunkId, "LIST");
    });
    it("chunkSize should be > 0", function() {
        assert.ok(wav2.LIST[0].chunkSize > 0);
    });
    it("LISTChunks.length should be 1", function() {
        assert.equal(wav2.LIST.length, 1);
    });
    it("format should be 'INFO'", function() {
        assert.equal(wav2.LIST[0].format, "adtl");
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
    it("sampleRate should be 44100", function() {
        assert.equal(wav2.fmt.sampleRate, 44100);
    });
    it("byteRate should be 176400", function() {
        assert.equal(wav2.fmt.byteRate, 176400);
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
    it("samples on the new file should have the same",
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

// Audacity file with 17 markers
describe("read Audacity-16bit-lots-of-markers.wav and write " +
    "to new file", function() {
    
    let wav = new WaveFile(
        fs.readFileSync(path + "Audacity-16bit-17-MARKERS.wav"));
    let wavB = new WaveFile(
        fs.readFileSync(path + "Audacity-16bit-17-MARKERS.wav"));
    fs.writeFileSync(
        path + "/out/Audacity-16bit-17-MARKERS-out.wav", wavB.toBuffer());
    let stats = fs.statSync(
        path + "Audacity-16bit-17-MARKERS.wav");
    let fileSizeInBytes1 = stats["size"];
    stats = fs.statSync(path + "/out/Audacity-16bit-17-MARKERS-out.wav");
    let fileSizeInBytes2 = stats["size"];
    let wav2 = new WaveFile(
        fs.readFileSync(path + "/out/Audacity-16bit-17-MARKERS-out.wav"));
    
    it("wav.LIST should be == wav2.LIST", function() {
        assert.deepEqual(wav2.LIST, wav.LIST);
    });

    // Other tests
    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes1);
    });
    it("wav2.chunkSize should be == fileSizeInBytes2", function() {
        assert.equal(wav2.chunkSize + 8, fileSizeInBytes2);
    });
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
