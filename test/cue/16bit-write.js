/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing the "cue " chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "test/files/";

describe('update cue point label', function() {

    let wav = new WaveFile(
        fs.readFileSync("./test/files/Audacity-16bit-17-MARKERS.wav"));
    wav.updateLabel(2, "updated label");
    fs.writeFileSync(
        "./test/files/out/fromScratch-CUE13.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE13.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE13.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 17", function() {
        assert.equal(wavCue2.cue.points.length, 17);
    });
    it("updated label should be 'updated label'", function() {
        labelText = wavCue2.LIST[0]["subChunks"][1]["value"];
        assert.equal(labelText, "updated label");
    });
});

describe('cue points with no labels', function() {

    let wav = new WaveFile(
        fs.readFileSync("./test/files/Audacity-16bit-17-MARKERS.wav"));
    wav.deleteCuePoint(1);
    wav.LIST = [];
    wav.deleteCuePoint(1);
    fs.writeFileSync(
        "./test/files/out/fromScratch-CUE12.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE12.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE12.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 15", function() {
        assert.equal(wavCue2.cue.points.length, 15);
    });
});

describe('delete all points', function() {

    let wav = new WaveFile(
        fs.readFileSync("./test/files/Audacity-16bit-17-MARKERS.wav"));
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    fs.writeFileSync(
        "./test/files/out/fromScratch-CUE11.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE11.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE11.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 10", function() {
        assert.equal(wavCue2.cue.points.length, 10);
    });
});

describe('delete a point', function() {
    
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
    wav.setCuePoint(1500, "cue marker 5");
    wav.setCuePoint(1000, "cue marker 3"); //
    wav.setCuePoint(1250, "cue marker 4"); //
    wav.setCuePoint(500, "cue marker 1"); //
    wav.setCuePoint(750, "cue marker 2"); //
    wav.setCuePoint(1750, "cue marker 6"); //
    wav.deleteCuePoint(2); // point in 750
    wav.deleteCuePoint(3); // point 1250
    fs.writeFileSync(
        "./test/files/out/fromScratch-CUE10.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE10.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE10.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 4", function() {
        assert.equal(wavCue2.cue.points.length, 4);
    });
});

describe('delete all points', function() {

    let wav = new WaveFile(
        fs.readFileSync("./test/files/Audacity-16bit-17-MARKERS.wav"));
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    fs.writeFileSync("./test/files/out/fromScratch-CUE9.wav", wav.toBuffer());

    var stats = fs.statSync("./test/files/out/fromScratch-CUE9.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE9.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "");
    });
    it("wav.cue.points.length should be 0", function() {
        assert.equal(wavCue2.cue.points.length, 0);
    });
});

describe('delete a point', function() {
    
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
    wav.setCuePoint(1500, "cue marker 5");
    wav.setCuePoint(1000, "cue marker 3");
    wav.setCuePoint(1250, "cue marker 4");
    wav.setCuePoint(500, "cue marker 1"); 
    wav.setCuePoint(750, "cue marker 2"); 
    wav.setCuePoint(1750, "cue marker 6");
    wav.deleteCuePoint(2);
    fs.writeFileSync(
        "./test/files/out/fromScratch-CUE8.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE8.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE8.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 5", function() {
        assert.equal(wavCue2.cue.points.length, 5);
    });
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wav.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 5", function() {
        assert.equal(wav.cue.points.length, 5);
    });
});

describe('create 44100 kHz 24-bit stereo wave file with lots of cue points',
        function() {
    
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
    wav.setCuePoint(1500, "cue marker 1");
    wav.setCuePoint(1000, "cue marker 2"); //
    wav.setCuePoint(1250, "cue marker 3"); //
    wav.setCuePoint(500, "cue marker 4"); //
    wav.setCuePoint(750, "cue marker 5"); //
    wav.setCuePoint(1750, "cue marker 6"); //
    wav.setCuePoint(1550, "cue marker 7"); //
    fs.writeFileSync(
        "./test/files/out/fromScratch-CUE7.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE7.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE7.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 7", function() {
        assert.equal(wavCue2.cue.points.length, 7);
    });
});

describe('create 44100 kHz 24-bit stereo wave file with two cue points',
    function() {
    
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
    wav.setCuePoint(1500, "cue marker");
    wav.setCuePoint(1000, "cue marker 2");
    fs.writeFileSync("./test/files/out/fromScratch-CUE6.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE6.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE6.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 2", function() {
        assert.equal(wavCue2.cue.points.length, 2);
    });
});

describe('create 44100 kHz 24-bit stereo wave file with one cue point',
    function() {
    
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
    wav.setCuePoint(1500, "cue marker");
    fs.writeFileSync("./test/files/out/fromScratch-CUE5.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE5.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE5.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 1", function() {
        assert.equal(wavCue2.cue.points.length, 1);
    });
});

describe('create 16000 kHz stereo wave file with one cue point', function() {
    
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<32000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wav.fromScratch(2, 8000, '16', deInterleaved);
    wav.setCuePoint(1500, "cue marker");
    fs.writeFileSync("./test/files/out/fromScratch-CUE4.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE4.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE4.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 1", function() {
        assert.equal(wavCue2.cue.points.length, 1);
    });
});

describe('create 16000 kHz stereo wave file with one cue point', function() {
    
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<32000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wav.fromScratch(2, 16000, '16', deInterleaved);
    wav.setCuePoint(1000, "cue marker");
    fs.writeFileSync("./test/files/out/fromScratch-CUE3.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE3.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE3.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 1", function() {
        assert.equal(wavCue2.cue.points.length, 1);
    });
    //rest of the file
    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 2', function() {
        assert.equal(wav.fmt.numChannels, 2);
    });
    it('sampleRate should be 16000', function() {
        assert.equal(wav.fmt.sampleRate, 16000);
    });
    it('byteRate should be 64000', function() {
        assert.equal(wav.fmt.byteRate, 64000);
    });
    it('blockAlign should be 4', function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 128000', function() {
        assert.equal(wav.data.chunkSize, 128000);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});

describe('create 16000 kHz wave file with one cue point', function() {
    
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<32000; i++)  {
        samples.push(0);
    }
    wav.fromScratch(1, 16000, '16', samples);
    wav.setCuePoint(1000, "cue marker");
    fs.writeFileSync("./test/files/out/fromScratch-CUE2.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE2.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE2.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 1", function() {
        assert.equal(wavCue2.cue.points.length, 1);
    });
    //rest of the file
    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 16000', function() {
        assert.equal(wav.fmt.sampleRate, 16000);
    });
    it('byteRate should be 32000', function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 8', function() {
        assert.equal(wav.data.chunkSize, 64000);
    });
    it('samples should be the same as the args', function() {
        assert.deepEqual(wav.data.samples, samples);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});

describe('create 8000 kHz wave file with one cue point in 1s', function() {
    
    let wav = new WaveFile();
    let samples = [];
    for (let i=0; i<16000; i++)  {
        samples.push(0);
    }
    wav.fromScratch(1, 8000, '16', samples);
    wav.setCuePoint(1000, "cue marker");
    fs.writeFileSync("./test/files/out/fromScratch-CUE.wav", wav.toBuffer());
    var stats = fs.statSync("./test/files/out/fromScratch-CUE.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("./test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("./test/files/out/fromScratch-CUE.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 1", function() {
        assert.equal(wavCue2.cue.points.length, 1);
    });
    //rest of the file
    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.container, "RIFF");
    });
    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });
    it('fmtChunkId should be "fmt "', function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it('fmtChunkSize should be 16', function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it('audioFormat should be 1', function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it('numChannels should be 1', function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it('sampleRate should be 8000', function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it('byteRate should be 16000', function() {
        assert.equal(wav.fmt.byteRate, 16000);
    });
    it('blockAlign should be 2', function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it('bitsPerSample should be 16', function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it('dataChunkId should be "data"', function() {
        assert.equal(wav.data.chunkId, "data");
    });
    it('dataChunkSize should be 32000', function() {
        assert.equal(wav.data.chunkSize, 32000);
    });
    it('samples should be the same as the args', function() {
        assert.deepEqual(wav.data.samples, samples);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});
