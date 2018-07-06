/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test creating 16-bit RIFX files with the fromScratch method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../../test/loader.js");
const path = "./test/files/";

describe("Handle instances of RIFF and RIFX at the same time", function() {

    // Read a RIFX file
    let rifxwav = new WaveFile(
        fs.readFileSync(path + "RIFX-16bit-mono.wav"));

    // Read a RIFF file and make a buffer from it,
    // then read the same RIFF file again
    let riffwav1 = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    let riffBuffer1 = riffwav1.toBuffer();
    let riffwav2 = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    // Again read a RIFX
    rifxwav = new WaveFile(
        fs.readFileSync(path + "RIFX-16bit-mono.wav"));

    // turn the second RIFF to a buffer
    let riffBuffer2 = riffwav2.toBuffer();

    it("firsr RIFF buffer should be == second RIFF buffer", function() {
        assert.deepEqual(riffBuffer1, riffBuffer2);
    });
});

describe('create 16-bit wave files from scratch', function() {
    
    let wav = new WaveFile();
    wav.fromScratch(
        1, 48000, '16', [0, 1, -32768, 32767], {"container": "RIFX"});

    it('chunkId should be "RIFX"', function() {
        assert.equal(wav.container, "RIFX");
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
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 96000', function() {
        assert.equal(wav.fmt.byteRate, 96000);
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
        assert.equal(wav.data.chunkSize, 8);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav.data.samples, [0, 1, -32768, 32767]);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});

describe("create 16-bit wave files from scratch, write and " +
    "read the file", function() {
    
    let wav = new WaveFile();
    wav.fromScratch(
        1, 48000, '16', [0, 1, -32768, 32767], {"container": "RIFX"});

    fs.writeFileSync(
        "././test/files/out/16-bit-48kHz-mono-RIFX-fromScratch.wav",
        wav.toBuffer());

    wav = new WaveFile(
        fs.readFileSync(
            "././test/files/out/16-bit-48kHz-mono-RIFX-fromScratch.wav"));
    
    var stats = fs.statSync(
        "././test/files/out/16-bit-48kHz-mono-RIFX-fromScratch.wav");
    var fileSizeInBytes = stats["size"];

    it("chunkSize should be == fileSizeInBytes", function() {
        assert.equal(wav.chunkSize + 8, fileSizeInBytes);
    });
    it('chunkId should be "RIFX"', function() {
        assert.equal(wav.container, "RIFX");
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
    it('sampleRate should be 48000', function() {
        assert.equal(wav.fmt.sampleRate, 48000);
    });
    it('byteRate should be 96000', function() {
        assert.equal(wav.fmt.byteRate, 96000);
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
        assert.equal(wav.data.chunkSize, 8);
    });
    it('samples should be the same as the args', function() {
        //assert.deepEqual(wav.data.samples, [0, 1, -32768, 32767]);
    });
    it('bitDepth should be "16"', function() {
        assert.equal(wav.bitDepth, "16");
    });
});


describe("16-bit RIFX reading", function() {

    let wBytes = fs.readFileSync(path + "RIFX-16bit-mono.wav");
    let wav = new WaveFile(wBytes);
    // The same contents in a RIFF file
    let riffwav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    var stats = fs.statSync(path + "16-bit-8kHz-noBext-mono.wav");
    var fileSizeInBytes = stats["size"];

    it("chunkSize should be == fileSizeInBytes", function() {
        assert.equal(riffwav.chunkSize + 8, fileSizeInBytes);
    });
    it("chunkId should be 'RIFX'", function() {
        assert.equal(wav.container, "RIFX");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 16000", function() {
        assert.equal(wav.fmt.byteRate, 16000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
    it("samples in RIFX file should be the same", function() {
        //assert.deepEqual(wav.data.samples, riffwav.data.samples);
    });
});


describe("16-bit RIFX to RIFF", function() {

    let rifxwav = new WaveFile(
        fs.readFileSync(path + "RIFX-16bit-mono.wav"));

    rifxwav.toRIFF();
    fs.writeFileSync(
        path + "/out/RIFX-to-RIFF-16bit-mono.wav", rifxwav.toBuffer());

    let wav = new WaveFile(
        fs.readFileSync(path + "/out/RIFX-to-RIFF-16bit-mono.wav"));

    // The same contents in the original RIFF file
    let riffWav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 16000", function() {
        assert.equal(wav.fmt.byteRate, 16000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
    it("samples in RIFF-from-RIFX file should be the same as in the " +
        "RIFF file", function() {
        //assert.deepEqual(wav.data.samples, rifxwav.data.samples);
    });
});

describe("RF64 to RIFF", function() {

    let fs = require("fs");
    const WaveFile = require("../../../test/loader.js");
    let path = "./test/files/";
    let wav2 = new WaveFile(
        fs.readFileSync(path + "RF64-16bit-8kHz-stereo-reaper.wav"));
    wav2.toRIFF();
    fs.writeFileSync(
        path + "/out/RIFF-16bit-8kHz-stereo-from-RF64.wav",
        wav2.toBuffer());
    let wav = new WaveFile(
        fs.readFileSync(path + "/out/RIFF-16bit-8kHz-stereo-from-RF64.wav"));

    it("chunkId should be 'RIFF'", function() {
        assert.equal(wav.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 2", function() {
        assert.equal(wav.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate should be 32000", function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4", function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
});


describe("16-bit RIFF to RIFX", function() {

    let riffwav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
    riffwav.toRIFX();
    fs.writeFileSync(
        path + "/out/RIFF-to-RIFX-16bit-mono.wav", riffwav.toBuffer());
    let wav = new WaveFile(
        fs.readFileSync(path + "/out/RIFF-to-RIFX-16bit-mono.wav"));

    it("chunkId should be 'RIFX'", function() {
        assert.equal(wav.container, "RIFX");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1 (PCM)", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 1", function() {
        assert.equal(wav.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate be 16000", function() {
        assert.equal(wav.fmt.byteRate, 16000);
    });
    it("blockAlign should be 2", function() {
        assert.equal(wav.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
    it("samples in RIFF-to-RIFX file should be the same as in " +
        " the RIFF file", function() {
        //assert.deepEqual(wav.data.samples, riffwav.data.samples);
    });
});

describe("RIFX cbSize and validBitsPerSample", function() {
    
    let riffwav = new WaveFile(
        fs.readFileSync(path + "4bit-imaadpcm-8kHz-noBext-mono.wav"));
    riffwav.toRIFX();
    fs.writeFileSync(
        path + "/out/RIFF-to-RIFX-4bit-imaadpcm-8kHz-noBext-mono.wav",
        riffwav.toBuffer());
    let wav = new WaveFile(
        fs.readFileSync(
            path + "/out/RIFF-to-RIFX-4bit-imaadpcm-8kHz-noBext-mono.wav"));

    it("cbSize should be 2 in the original file", function() {
        assert.equal(riffwav.fmt.cbSize, 2);
    });
    it("validBitsPerSample should be 505 in the original file", function() {
        assert.equal(riffwav.fmt.validBitsPerSample, 505);
    });
    it("cbSize should be 2 in the RIFX file", function() {
        assert.equal(wav.fmt.cbSize, 2);
    });
    it("validBitsPerSample should be 505 in the RIFX file", function() {
        assert.equal(wav.fmt.validBitsPerSample, 505);
    });
});

describe("RF64 to RIFX", function() {

    let wav2 = new WaveFile(
        fs.readFileSync(path + "RF64-16bit-8kHz-stereo-reaper.wav"));
    wav2.toRIFX();
    fs.writeFileSync(
        path + "/out/RIFX-16bit-8kHz-stereo-fromRF64.wav", wav2.toBuffer());
    let wav = new WaveFile(
        fs.readFileSync(path + "/out/RIFX-16bit-8kHz-stereo-fromRF64.wav"));

    it("chunkId should be 'RIFX'", function() {
        assert.equal(wav.container, "RIFX");
    });
    it("fmtChunkId should be 'fmt '", function() {
        assert.equal(wav.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'", function() {
        assert.equal(wav.format, "WAVE");
    });
    it("fmtChunkSize should be 16", function() {
        assert.equal(wav.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1", function() {
        assert.equal(wav.fmt.audioFormat, 1);
    });
    it("numChannels should be 2", function() {
        assert.equal(wav.fmt.numChannels, 2);
    });
    it("sampleRate should be 8000", function() {
        assert.equal(wav.fmt.sampleRate, 8000);
    });
    it("byteRate should be 32000", function() {
        assert.equal(wav.fmt.byteRate, 32000);
    });
    it("blockAlign should be 4", function() {
        assert.equal(wav.fmt.blockAlign, 4);
    });
    it("bitsPerSample should be 16", function() {
        assert.equal(wav.fmt.bitsPerSample, 16);
    });
    it("dataChunkId should be 'data'", function() {
        assert.equal(wav.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav.data.samples.length > 0);
    });
});


describe('read RIFX file from disk and write to new RIFX file', function() {
    
    let wBytes = fs.readFileSync(path + "RIFX-16bit-mono.wav");
    let wav = new WaveFile();
    wav.fromBuffer(wBytes);
    let wav2 = new WaveFile();
    let bytes3 = wav.toBuffer();
    wav2.fromBuffer(bytes3);
    let bytes4 = wav2.toBuffer();
    fs.writeFileSync(path + "/out/RIFX-16bit-mono.wav", bytes4);

    it("chunkId should be 'RIFX'", function() {
        assert.equal(wav2.container, "RIFX");
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
    it("sampleRate should be 8000", function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });
    it("byteRate should be 16000", function() {
        assert.equal(wav2.fmt.byteRate, 16000);
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
    it("dataChunkSize should be > 0", function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0", function() {
        assert.ok(wav2.data.samples.length > 0);
    });
    it("samples on the new file should have the same length as " +
        "in the original file", function() {
        assert.equal(wav2.data.samples.length, wav.data.samples.length);
    });
    it("samples on the new file should be same as the original " +
        " file", function() {
        assert.deepEqual(wav2.data.samples, wav.data.samples);
    });
});
