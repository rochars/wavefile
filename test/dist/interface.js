/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test properties of the WaveFile API.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../loader.js");
const path = "./test/files/";

describe('Float files with 1, -1, 0, -0, Infinity, -Infinity', function() {
    let wav = new WaveFile();
    let samples = [-1, 1, 0, -0, Infinity, -Infinity];
    it('create a 32f file with the samples as they are', function() {
        wav.fromScratch(1, 8000, '32f', samples, {container: 'RIFX'});
        assert.deepEqual(wav.getSamples(), new Float64Array(samples));
    });
    it('create a 64-bit file with the samples as they are', function() {
        wav.fromScratch(1, 8000, '64', samples, {container: 'RIFX'});
        assert.deepEqual(wav.getSamples(), new Float64Array(samples));
    });
});

describe('Float files with NaN, -NaN', function() {
    let wav = new WaveFile();
    let samples = [NaN, -NaN];
    it('create a 32f file with the samples as they are', function() {
        wav.fromScratch(1, 8000, '32f', samples, {container: 'RIFX'});
        assert.ok(wav.getSamples()[0] !== wav.getSamples()[0]);
        assert.ok(wav.getSamples()[1] !== wav.getSamples()[1]);
    });
    it('create a 64-bit file with the samples as they are', function() {
        wav.fromScratch(1, 8000, '64', samples, {container: 'RIFX'});
        assert.ok(wav.getSamples()[0] !== wav.getSamples()[0]);
        assert.ok(wav.getSamples()[1] !== wav.getSamples()[1]);
    });
});

describe('Float file, small number', function() {
    let wav = new WaveFile();
    let samples = [0.0000000000000000000000000000000000000000001];
    it('create a 32f file with the samples as they are', function() {
        wav.fromScratch(1, 8000, '32f', samples, {container: 'RIFX'});
        assert.equal(wav.getSamples()[0], 9.949219096706201e-44);
    });
    it('create a 64-bit file with the samples as they are', function() {
        wav.fromScratch(1, 8000, '64', samples, {container: 'RIFX'});
        assert.equal(wav.getSamples()[0],
            0.0000000000000000000000000000000000000000001);
    });
});

describe('Write and read some edge cases to 64 bit file', function() {
    let wav = new WaveFile(
        fs.readFileSync(path + "64bit-48kHz-noBext-mono-overflow.wav"));

    wav.setSample(0, 0);
    wav.setSample(1, -0);
    wav.setSample(2, Infinity);
    wav.setSample(3, -Infinity);
    wav.setSample(4, NaN);
    wav.setSample(5, -NaN);
    wav.setSample(6, 0.0000000000000000000000000000000000000000001);

    fs.writeFileSync(
        path + "/out/64bit-48kHz-noBext-mono-overflow-edge.wav",
        wav.toBuffer());

    let wav2 = new WaveFile(
        fs.readFileSync(path +
            "/out/64bit-48kHz-noBext-mono-overflow-edge.wav"));

    it('read a 64-bit file with the samples as they are', function() {
        assert.equal(wav2.getSample(0), 0);
        assert.equal(wav2.getSample(1), -0);
        assert.equal(wav2.getSample(2), Infinity);
        assert.equal(wav2.getSample(3), -Infinity);
        assert.ok(wav2.getSample(4) !== wav.getSamples()[3]);
        assert.ok(wav2.getSample(5) !== wav.getSamples()[5]);
        assert.equal(wav2.getSample(6),
            0.0000000000000000000000000000000000000000001);
    });
});

// Int samples
describe('Should clamp int samples on overflow', function() {
    wav = new WaveFile();
    it('should limit the sample', function() {
        wav.fromScratch(1, 8000, '16', [32768, -32769], {container: 'RIFX'});
        assert.deepEqual(wav.getSamples(), new Float64Array([32767, -32768]));
    });
});
