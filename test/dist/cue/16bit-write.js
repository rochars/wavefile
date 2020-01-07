/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test writing the "cue " chunk.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe('update cue point label', function() {

    let wav = new WaveFile(
        fs.readFileSync("././test/files/Audacity-16bit-17-MARKERS.wav"));
    wav.updateLabel(2, "updated label");
    fs.writeFileSync(
        "././test/files/out/fromScratch-CUE13.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE13.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE13.wav"));

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
        fs.readFileSync("././test/files/Audacity-16bit-17-MARKERS.wav"));
    wav.deleteCuePoint(1);
    wav.LIST = [];
    wav.deleteCuePoint(1);
    fs.writeFileSync(
        "././test/files/out/fromScratch-CUE12.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE12.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE12.wav"));

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
        fs.readFileSync("././test/files/Audacity-16bit-17-MARKERS.wav"));
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    wav.deleteCuePoint(1);
    // set a cue point with no label
    wav.setCuePoint({position: 500});

    fs.writeFileSync(
        "././test/files/out/fromScratch-CUE11.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE11.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE11.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });
    //cue
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 11", function() {
        assert.equal(wavCue2.cue.points.length, 11);
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
    wav.setCuePoint({position: 1500, label: "cue marker 5"});
    wav.setCuePoint({position: 1000, label: "cue marker 3"});
    wav.setCuePoint({position: 1250, label: "cue marker 4"});
    wav.setCuePoint({position: 500, label: "cue marker 1"});
    wav.setCuePoint({position: 750, label: "cue marker 2"});
    wav.setCuePoint({position: 1750, label: "cue marker 6"});

    wav.deleteCuePoint(2); // point in 750
    wav.deleteCuePoint(3); // point 1250
    fs.writeFileSync(
        "././test/files/out/fromScratch-CUE10.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE10.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE10.wav"));

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
        fs.readFileSync("././test/files/Audacity-16bit-17-MARKERS.wav"));
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
    fs.writeFileSync("././test/files/out/fromScratch-CUE9.wav", wav.toBuffer());

    var stats = fs.statSync("././test/files/out/fromScratch-CUE9.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE9.wav"));

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
    wav.setCuePoint({position: 1500, label: "cue marker 5"});
    wav.setCuePoint({position: 1000, label: "cue marker 3"});
    wav.setCuePoint({position: 1250, label: "cue marker 4"});
    wav.setCuePoint({position: 500, label: "cue marker 1"});
    wav.setCuePoint({position: 750, label: "cue marker 2"});
    wav.setCuePoint({position: 1750, label: "cue marker 6"});

    wav.deleteCuePoint(2);
    fs.writeFileSync(
        "././test/files/out/fromScratch-CUE8.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE8.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("././test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE8.wav"));

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

    // create a file from scratch
    let wavThis = new WaveFile();

    // cue points in the original file should = 0
    it("fromScratch-CUE7, original, before fromScratch", function() {
        assert.deepEqual(wavThis.listCuePoints(), []);
    });

});

describe('create 44100 kHz 24-bit stereo wave file with lots of cue points',
        function() {

    // create a file from scratch
    let wavThis = new WaveFile();

    let samples = [];
    for (let i=0; i<128000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wavThis.fromScratch(2, 44100, '24', deInterleaved);

    // cue points in the original file should = 0
    it("fromScratch-CUE7, original, no cue points added yet", function() {
        assert.deepEqual(wavThis.listCuePoints(), []);
    });
});


describe('create 44100 kHz 24-bit stereo wave file with lots of cue points',
        function() {

    // create a file from scratch
    let wavThis = new WaveFile();
    let samples = [];
    for (let i=0; i<128000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wavThis.fromScratch(2, 44100, '24', deInterleaved);

    // set some cue points in the file
    // cue points are added out of order
    wavThis.setCuePoint({position: 1500, label: "cue marker 1"});
    wavThis.setCuePoint({position: 1000, label: "cue marker 2"});
    wavThis.setCuePoint({position: 1250, label: "cue marker 3"});
    wavThis.setCuePoint({position: 500, label: "cue marker 4"});
    wavThis.setCuePoint({position: 750, label: "cue marker 5"});
    wavThis.setCuePoint({position: 1750, label: "cue marker 6"});
    wavThis.setCuePoint({position: 1550, label: "cue marker 7"});

    // cue points in the original file
    originalCuePoints = wavThis.listCuePoints();
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[0].label, 'cue marker 4');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[1].label, 'cue marker 5');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[2].label, 'cue marker 2');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[3].label, 'cue marker 3');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[4].label, 'cue marker 1');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[5].label, 'cue marker 7');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[6].label, 'cue marker 6');
    });
});


describe('create 44100 kHz 24-bit stereo wave file with lots of cue points',
        function() {

    // create a file from scratch
    let wavThis = new WaveFile();
    let samples = [];
    for (let i=0; i<128000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wavThis.fromScratch(2, 44100, '24', deInterleaved);

    // set some cue points in the file
    // cue points are added in order
    wavThis.setCuePoint({position: 500, label: "cue marker 4"});
    wavThis.setCuePoint({position: 750, label: "cue marker 5"});
    wavThis.setCuePoint({position: 1000, label: "cue marker 2"});
    wavThis.setCuePoint({position: 1250, label: "cue marker 3"});
    wavThis.setCuePoint({position: 1500, label: "cue marker 1"});
    wavThis.setCuePoint({position: 1550, label: "cue marker 7"});
    wavThis.setCuePoint({position: 1750, label: "cue marker 6"});

    // cue points in the original file
    originalCuePoints = wavThis.listCuePoints();
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[0].label, 'cue marker 4');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[1].label, 'cue marker 5');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[2].label, 'cue marker 2');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[3].label, 'cue marker 3');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[4].label, 'cue marker 1');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[5].label, 'cue marker 7');
    });
    it("fromScratch-CUE7, original, cue point 1 name", function() {
        assert.equal(originalCuePoints[6].label, 'cue marker 6');
    });
});


describe('create 44100 kHz 24-bit stereo wave file with lots of cue points',
        function() {

    // create a file from scratch
    let wavThis = new WaveFile();
    let samples = [];
    for (let i=0; i<128000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wavThis.fromScratch(2, 44100, '24', deInterleaved);
    wavThis.setCuePoint({position: 1500, label: "cue marker 1"});
    wavThis.setCuePoint({position: 1000, label: "cue marker 2"});
    wavThis.setCuePoint({position: 1250, label: "cue marker 3"});
    wavThis.setCuePoint({position: 500, label: "cue marker 4"});
    wavThis.setCuePoint({position: 750, label: "cue marker 5"});
    wavThis.setCuePoint({position: 1750, label: "cue marker 6"});
    wavThis.setCuePoint({position: 1550, label: "cue marker 7"});
    wavThis.toBuffer()

    // cue points in the original file after toBuffer
    toBufferCuePoints = wavThis.listCuePoints();
    it("fromScratch-CUE7, toBuffer, cue point 1 name", function() {
        assert.equal(toBufferCuePoints[0].label, 'cue marker 4');
    });
    it("fromScratch-CUE7, toBuffer, cue point 1 name", function() {
        assert.equal(toBufferCuePoints[1].label, 'cue marker 5');
    });
    it("fromScratch-CUE7, toBuffer, cue point 1 name", function() {
        assert.equal(toBufferCuePoints[2].label, 'cue marker 2');
    });
    it("fromScratch-CUE7, toBuffer, cue point 1 name", function() {
        assert.equal(toBufferCuePoints[3].label, 'cue marker 3');
    });
    it("fromScratch-CUE7, toBuffer, cue point 1 name", function() {
        assert.equal(toBufferCuePoints[4].label, 'cue marker 1');
    });
    it("fromScratch-CUE7, toBuffer, cue point 1 name", function() {
        assert.equal(toBufferCuePoints[5].label, 'cue marker 7');
    });
    it("fromScratch-CUE7, toBuffer, cue point 1 name", function() {
        assert.equal(toBufferCuePoints[6].label, 'cue marker 6');
    });
});

describe('create 44100 kHz 24-bit stereo wave file with lots of cue points',
        function() {

    // create a file from scratch
    let wavThis = new WaveFile();
    let samples = [];
    for (let i=0; i<128000; i++)  {
        samples.push(0);
    }
    let deInterleaved = [
        samples,
        samples
    ];
    wavThis.fromScratch(2, 44100, '24', deInterleaved);

    // Set cue points in the file
    wavThis.setCuePoint({position: 1500, label: "cue marker 1"});
    wavThis.setCuePoint({position: 1000, label: "cue marker 2"});
    wavThis.setCuePoint({position: 1250, label: "cue marker 3"});
    wavThis.setCuePoint({position: 500, label: "cue marker 4"});
    wavThis.setCuePoint({position: 750, label: "cue marker 5"});
    wavThis.setCuePoint({position: 1750, label: "cue marker 6"});
    wavThis.setCuePoint({position: 1550, label: "cue marker 7"});

    // write the file
    fs.writeFileSync(
        "././test/files/out/fromScratch-CUE7.wav", wavThis.toBuffer());

    // Get the size of the file
    var stats = fs.statSync("././test/files/out/fromScratch-CUE7.wav");
    var fileSizeInBytes1 = stats["size"];

    // Open the written file
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE7.wav"));

    it("wav.chunkSize should be == fileSizeInBytes1", function() {
        assert.equal(wavCue2.chunkSize + 8, fileSizeInBytes1);
    });

    // cue chunk in the written file
    it("wav.cue.chunkId should be 'cue '", function() {
        assert.equal(wavCue2.cue.chunkId, "cue ");
    });
    it("wav.cue.points.length should be 7", function() {
        assert.equal(wavCue2.cue.points.length, 7);
    });
    it("wav.cue.points.length should be 7", function() {
        assert.equal(wavCue2.cue.points.length, 7);
    });

    // cue points in the written file
    cuePoints = wavCue2.listCuePoints();
    it("fromScratch-CUE7, written, cue point 1 name", function() {
        assert.equal(cuePoints[0].label, 'cue marker 4');
    });
    it("fromScratch-CUE7, written, cue point 1 name", function() {
        assert.equal(cuePoints[1].label, 'cue marker 5');
    });
    it("fromScratch-CUE7, written, cue point 1 name", function() {
        assert.equal(cuePoints[2].label, 'cue marker 2');
    });
    it("fromScratch-CUE7, written, cue point 1 name", function() {
        assert.equal(cuePoints[3].label, 'cue marker 3');
    });
    it("fromScratch-CUE7, written, cue point 1 name", function() {
        assert.equal(cuePoints[4].label, 'cue marker 1');
    });
    it("fromScratch-CUE7, written, cue point 1 name", function() {
        assert.equal(cuePoints[5].label, 'cue marker 7');
    });
    it("fromScratch-CUE7, written, cue point 1 name", function() {
        assert.equal(cuePoints[6].label, 'cue marker 6');
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
    wav.setCuePoint({position: 1500, label: "cue marker"});
    wav.setCuePoint({position: 1000, label: "cue marker 2"});

    fs.writeFileSync("././test/files/out/fromScratch-CUE6.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE6.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("././test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE6.wav"));

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
    wav.setCuePoint({position: 1500, label: "cue marker"});
    fs.writeFileSync("././test/files/out/fromScratch-CUE5.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE5.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("././test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE5.wav"));

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
    wav.setCuePoint({position: 1500, label: "cue marker"});
    fs.writeFileSync("././test/files/out/fromScratch-CUE4.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE4.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("././test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE4.wav"));

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
    wav.setCuePoint({position: 1000, label: "cue marker"});
    fs.writeFileSync("././test/files/out/fromScratch-CUE3.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE3.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("././test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE3.wav"));

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
    wav.setCuePoint({position: 1000, label: "cue marker"});
    fs.writeFileSync("././test/files/out/fromScratch-CUE2.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE2.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("././test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE2.wav"));

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
        //assert.deepEqual(wav.data.samples, samples);
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
    wav.setCuePoint({position: 1000, label: "cue marker"});
    fs.writeFileSync("././test/files/out/fromScratch-CUE.wav", wav.toBuffer());
    var stats = fs.statSync("././test/files/out/fromScratch-CUE.wav");
    var fileSizeInBytes1 = stats["size"];
    let wavCue = new WaveFile(
        fs.readFileSync("././test/files/test-cue-reaper.wav"));
    let wavCue2 = new WaveFile(
        fs.readFileSync("././test/files/out/fromScratch-CUE.wav"));

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
        //assert.deepEqual(wav.data.samples, samples);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});
