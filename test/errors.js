/*!
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

let assert = require("assert");
let chai = require("chai");
let expect = chai.expect;

describe('errors', function() {
    
    let fs = require("fs");
    let wavefile = require("../index.js");
    let path = "test/files/";

    let testFunc;
    const unsupportedFormatError = "Not a supported format.";
    const noWAVEChunkError = "Could not find the 'WAVE' chunk";
    const noFmtChunkError = "Could not find the 'fmt ' chunk";
    const noDataChunkError = "Could not find the 'data' chunk";
    const sampleRateError = "Invalid sample rate.";
    const numChannelsError = "Invalid number of channels.";
        
    it("should throw an error if not a RIFF file",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "RF64-64-bit-8kHz--mono-bext.wav");
            let wav = new wavefile.WaveFile();
            wav.fromBytes(wBytes);
        };
        expect(testFunc).to.throw(unsupportedFormatError);
    });

    it("should throw an error if there is no 'WAVE' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav");
            wBytes[10] = 0;
            let wav = new wavefile.WaveFile();
            wav.fromBytes(wBytes);

        };
        expect(testFunc).to.throw(noWAVEChunkError);
    });

    it("should throw an error if there is no 'fmt ' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav");
            wBytes[14] = 0;
            let wav = new wavefile.WaveFile();
            wav.fromBytes(wBytes);
        };
        expect(testFunc).to.throw(noFmtChunkError);
    });

    it("should throw an error if there is no 'data' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            wBytes[36] = 0;
            let wav = new wavefile.WaveFile(wBytes);
        };
        expect(testFunc).to.throw(noDataChunkError);
    });

    it("should throw an error if the sample rate is < 1",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new wavefile.WaveFile();
            wav.fromBytes(wBytes);
            wav.sampleRate = 0;
            wav.toBytes();
        };
        expect(testFunc).to.throw(sampleRateError);
    });

    it("should throw an error if the number of channels is < 1",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new wavefile.WaveFile();
            wav.fromBytes(wBytes);
            wav.numChannels = 0;
            wav.toBytes();
        };
        expect(testFunc).to.throw(numChannelsError);
    });

    it("should throw an error if enforceFact is true and there is not 'fact' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new wavefile.WaveFile();
            wav.enforceFact = true;
            wav.fromBytes(wBytes);
            wav.toBytes();
        };
        expect(testFunc).to.throw("Could not find the 'fact' chunk");
    });

    it("should throw an error if enforceBext is true and there is not 'bext' chunk",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new wavefile.WaveFile();
            wav.enforceBext = true;
            wav.fromBytes(wBytes);
            wav.toBytes();
        };
        expect(testFunc).to.throw("Could not find the 'bext' chunk");
    });

    it("should throw an error if the bit depth is not valid",
            function () {
        testFunc = function() {
            let wBytes = fs.readFileSync(path + "32bit-48kHz-noBext-mono.wav");
            let wav = new wavefile.WaveFile();
            wav.fromBytes(wBytes);
            wav.bitDepth_ = 3;
            wav.toBytes();
        };
        expect(testFunc).to.throw("Invalid bit depth.");
    });
});
