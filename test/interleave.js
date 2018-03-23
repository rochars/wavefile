/*!
 * riffwave64
 * Read & write wave files with 8, 16, 24, 32 PCM, 32 IEEE & 64-bit data.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/riffwave64
 * https://tr2099.github.io
 *
 */

var assert = require('assert');

describe('interleave', function() {
    
    let WaveFile = require('../index.js');    

    it('should interleave the samples of a 2-channel wave file',
            function() {
        let wav = new WaveFile();
        let stereoSamples = [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ];
        wav.fromScratch(2, 48000, '8', stereoSamples);
        wav.interleave();
        let expected = [0, 0, -2, -1, 4, 4, 3, 3];
        assert.deepEqual(wav.samples, expected);
    });

    it('should de-interleave the samples of a 2-channel wave file',
            function() {
        let wav = new WaveFile();
        let samples = [0, 0, -2, -1, 4, 4, 3, 3];
        wav.fromScratch(1, 48000, '8', samples);
        wav.numChannels = 2;
        wav.deInterleave();
        let expected = [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ];
        assert.deepEqual(wav.samples, expected);
    });

    it('should interleave the samples of a 3-channel wave file',
            function() {
        let wav = new WaveFile();
        let stereoSamples = [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ];
        wav.fromScratch(2, 48000, '8', stereoSamples);
        wav.interleave();
        let expected = [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3];
        assert.deepEqual(wav.samples, expected);
    });

    it('should de-interleave the samples of a 3-channel wave file',
            function() {
        let wav = new WaveFile();
        let samples = [0, 0, 0, -2, -1, -1, 4, 4, 5, 3, 3, 3];
        wav.fromScratch(1, 48000, '8', samples);
        wav.numChannels = 3;
        wav.deInterleave();
        let expected = [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ];
        assert.deepEqual(wav.samples, expected);
    });

    /*
    it('should de-interleave the samples of a 2-channel wave file',
            function() {
        let samples = [0, 0, -2, -1, 4, 4, 3, 3];
        let expected = [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ];
        let deIntervealedSamples = rw64.deInterleave(samples, 2);
        assert.deepEqual(deIntervealedSamples, expected);
    });

    it('should interleave and de-interleave the samples ' +
        'of a 2-channel wave file', function() {
        let buffer = [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ];
        let samples = rw64.interleave(buffer);
        let samples2 = rw64.deInterleave(samples, buffer.length);

        assert.deepEqual(samples2, buffer);
    });

    it('should interleave and de-interleave the samples ' +
        'of a 3-channel wave file', function() {
        let buffer = [
            [0, -2, 4, 3],
            [0, -1, 4, 3],
            [0, -1, 5, 3]
        ];
        let samples = rw64.interleave(buffer);
        let samples2 = rw64.deInterleave(samples, buffer.length);

        assert.deepEqual(samples2, buffer);
    });

    it('should write a two channel file and then read ' +
        'and de-interleave the samples', function() {
        let buffer = [
            [0, -2, 4, 3],
            [0, -1, 4, 3]
        ];
        let samples = rw64.interleave(buffer);
        let wav = rw64.writeWavBytes(2, 48000, '16', samples);
        let wavRead = rw64.readWavBytes(wav);

        assert.equal(wavRead.numChannels, 2);

        let samples2 = rw64.deInterleave(
            wavRead.samples, wavRead.numChannels);

        assert.deepEqual(samples2, buffer);
    });
    */
});
