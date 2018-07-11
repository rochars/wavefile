/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the exceptions.
 * 
 */

const fs = require("fs");
var assert = assert || require('assert');
const WaveFile = require("../loader.js");
const path = "./test/files/";

describe('errors', function() {
    
    it("fromScratch() should throw an error if the bit depth is not " +
        "valid", function () {
        assert.throws(function() {
            let wav = new WaveFile();
            wav.fromScratch(1, 44100, '8', [0]);
            wav.setTag(2, "no");
        }, /Invalid tag name./);
    });
    it("fromScratch() should throw an error if the bit depth is not " +
        " valid", function () {
        assert.throws(function() {
            let wav = new WaveFile();
            wav.fromScratch(1, 44100, '1', [0]);
        }, /Invalid bit depth./);
    });
    it("fromScratch() should throw an error if the number of channels " +
        "is not valid", function () {
        assert.throws(function() {
            let wav = new WaveFile();
            wav.fromScratch(0, 44100, '32', [0]);
        }, /Invalid number of channels./);
    });
    it("fromScratch() should throw an error if the number of channels " +
        "is not valid", function () {
        assert.throws(function() {
            let wav = new WaveFile();
            wav.fromScratch(1, 0, '32', [0]);
        }, /Invalid sample rate./);
    });
    it("should throw an error if not a RIFF, RIFX or RF64 file", function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "RF64-64-bit-8kHz--mono-bext.wav");
            wBytes[0] = 1;
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
        }, /Not a supported format./);
    });
    it("should throw an error if a RF64 have no ds64 chunk", function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "RF64-16bit-8kHz-stereo-reaper.wav");
            wBytes[12] = 1;
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
        }, /Could not find the "ds64" chunk/);
    });
    it('should throw an error if there is no "WAVE" chunk', function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "16-bit-8kHz-noBext-mono.wav");
            wBytes[10] = 0;
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
        }, /Could not find the "WAVE" format identifier/);
    });
    it("should throw an error if there is no 'fmt ' chunk when " +
        "reading", function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "16-bit-8kHz-noBext-mono.wav");
            wBytes[14] = 0;
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
        }, /Could not find the "fmt " chunk/);
    });
    it('should throw an error if there is no "fmt " chunk when ' +
        "writing", function () {
        assert.throws(function() {
            let wav = new WaveFile(
                fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
            wav.fmt.chunkId = "";
            wav.toBuffer();
        }, /Could not find the "fmt " chunk/);
    });
    it("should throw an error if there is no 'data' chunk", function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "32bit-48kHz-noBext-mono.wav");
            wBytes[36] = 0;
            let wav = new WaveFile(wBytes);
        }, /Could not find the "data" chunk/);
    });
    it("should throw an error if the sample rate is < 1", function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "32bit-48kHz-noBext-mono.wav");
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
            wav.fmt.sampleRate = 0;
            wav.toBuffer();
        }, /Invalid sample rate./);
    });
    it("should throw an error if the number of channels is < 1", function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "32bit-48kHz-noBext-mono.wav");
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
            wav.fmt.numChannels = 0;
            wav.toBuffer();
        }, /Invalid number of channels./);
    });
    it("should throw an error if the bit depth is not valid", function () {
        assert.throws(function() {
            let wBytes = fs.readFileSync(
                path + "32bit-48kHz-noBext-mono.wav");
            let wav = new WaveFile();
            wav.fromBuffer(wBytes);
            wav.bitDepth = 3;
            wav.toBuffer();
        }, /Invalid bit depth./);
    });
    it("should throw an error for toIMAADPCM() and sample " +
        "rate != 8000 Hz", function () {
        assert.throws(function() {
            let wav = new WaveFile(
                fs.readFileSync(path + "16bit-16kHz-markers-mono.wav"));
            wav.toIMAADPCM();
        }, /Only 8000 Hz files can be compressed as IMA-ADPCM./);
    });
    it("should throw an error for toIMAADPCM() and " +
        "numChannels != 1", function () {
        assert.throws(function() {
            let wav = new WaveFile(
                fs.readFileSync(path + "16bit-8kHz-stereo.wav"));
            wav.toIMAADPCM();
        }, /Only mono files can be compressed as IMA-ADPCM./);
    });
});
