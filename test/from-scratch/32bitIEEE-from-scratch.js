/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');

describe('create 32-bit IEEE wave file from scratch', function() {
    
    let wavefile = require('../../index.js');
    let wav = new wavefile.WaveFile();
    wav.fromScratch(1, 44100, '32f', [0, 0.04029441, -0.04029440, 1]);

    let fs = require('fs');
    fs.writeFileSync("./test/files/out/32-bitIEEE-441kHz-mono-fromScratch.wav", wav.toBuffer());

    it('chunkId should be "RIFF"', function() {
        assert.equal(wav.chunkId, "RIFF");
    });

    it('format should be "WAVE"', function() {
        assert.equal(wav.format, "WAVE");
    });

    it('subChunk1Id should be "fmt "', function() {
        assert.equal(wav.subChunk1Id, "fmt ");
    });

    it('subChunk1Size should be 16', function() {
        assert.equal(wav.subChunk1Size, 16);
    });

    it('audioFormat should be 3', function() {
        assert.equal(wav.audioFormat, 3);
    });

    it('numChannels should be 1', function() {
        assert.equal(wav.numChannels, 1);
    });

    it('sampleRate should be 44100', function() {
        assert.equal(wav.sampleRate, 44100);
    });

    it('byteRate should be 176400', function() {
        assert.equal(wav.byteRate, 176400);
    });

    it('blockAlign should be 4', function() {
        assert.equal(wav.blockAlign, 4);
    });

    it('bitsPerSample should be 32', function() {
        assert.equal(wav.bitsPerSample, 32);
    });

    it('subChunk2Id should be "data"', function() {
        assert.equal(wav.subChunk2Id, "data");
    });

    it('subChunk2Size should be 16', function() {
        assert.equal(wav.subChunk2Size, 16);
    });

    it('samples_ should be the same as the args', function() {
        assert.deepEqual(wav.samples_, [0, 0.04029441, -0.04029440, 1]);
    });

    it('bitDepth_ should be "24"', function() {
        assert.equal(wav.bitDepth_, "32f");
    });

    /*
    it('should return a 8-bit wave file with an odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '8', [0, 255, 2]);
        let wavRead = rw64.readWavBytes(wav);

        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.blockAlign, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 8);
        assert.deepEqual(wavRead.samples, [0, 255, 2]);
    });

    it('should return a 16-bit wave file', function() {
        let wav = rw64.writeWavBytes(1, 48000, '16',
            [0, 1, -32768, 32767]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.blockAlign, 2);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 16);
        assert.deepEqual(wavRead.samples, [0, 1, -32768, 32767]);
    });

    it('should return a 16-bit wave file with a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '16',
            [0, 1, -32768, 32767, 4]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.blockAlign, 2);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 16);
        assert.deepEqual(wavRead.samples, [0, 1, -32768, 32767, 4]);
    });

    it('should return a 24-bit wave file', function() {
        let wav = rw64.writeWavBytes(1, 48000, '24',
            [0, 1, -8388608, 8388607]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.blockAlign, 3);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 24);
        assert.equal(wavRead.subChunk2Size, 12); // 4 x 3
        assert.deepEqual(wavRead.samples, [0, 1, -8388608, 8388607]);
    });

    it('should return a 24-bit wave file with a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '24',
            [0, 1, -8388608, 8388607, 4]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.bitsPerSample, 24);
        assert.equal(wavRead.blockAlign, 3);
        assert.equal(wavRead.subChunk2Size, 15); // 5 x 3
        assert.deepEqual(wavRead.samples, [0, 1, -8388608, 8388607, 4]);
    });

    it('should return a 32-bit PCM wave file', function() {
        let wav = rw64.writeWavBytes(1, 44100, '32',
            [0, -2147483648, 2147483647, 4]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 44100);
        assert.equal(wavRead.bitsPerSample, 32);
        assert.equal(wavRead.blockAlign, 4);
        assert.deepEqual(wavRead.samples, [0, -2147483648, 2147483647, 4]);
    });

    it('should return a 32-bit PCM wave file with a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 44100, '32',
            [0, -2147483648, 45, 0, 1]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 44100);
        assert.equal(wavRead.bitsPerSample, 32);
        assert.equal(wavRead.blockAlign, 4);
        assert.deepEqual(wavRead.samples, [0, -2147483648, 45, 0, 1]);
    });

    it('should return a 32-bit IEEE wave file', function() {
        let wav = rw64.writeWavBytes(1, 48000, '32f',
            [0, 0.04029441, -0.04029440, 1, -1, 0]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 4);
        assert.equal(wavRead.bitsPerSample, 32);
        for (let i=0; i<wavRead.samples.length; i++) {
            wavRead.samples[i] = Number((wavRead.samples[i]).toFixed(8));
        }
        assert.deepEqual(wavRead.samples,
            [0, 0.04029441, -0.04029440, 1, -1, 0]);
    });

    it('should return a 32-bit IEEE wave file ' +
        'with a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '32f',
            [0, 0.04029441, -0.04029440, 1, -1, 0, 1]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 4);
        assert.equal(wavRead.bitsPerSample, 32);
        for (let i=0; i<wavRead.samples.length; i++) {
            wavRead.samples[i] = Number((wavRead.samples[i]).toFixed(8));
        }
        assert.deepEqual(wavRead.samples,
            [0, 0.04029441, -0.04029440, 1, -1, 0, 1]);
    });

    it('should return a wave file with 64-bit audio', function() {
        let wav = rw64.writeWavBytes(1, 48000, '64',
            [0.0, 0.04029440055111987, -0.04029440055111987, 1.0]);
        let wavRead = rw64.readWavBytes(wav);

        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 8);
        assert.equal(wavRead.bitsPerSample, 64);
        assert.deepEqual(wavRead.samples,
            [0.0, 0.04029440055111987, -0.04029440055111987, 1.0]);
    });

    it('should return a wave file with 64-bit ' +
        'audio and a odd number of samples',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '64',
            [0.0, 0.04029440055111987, -0.04029440055111987, 1.0, 1]);
        let wavRead = rw64.readWavBytes(wav);

        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 8);
        assert.equal(wavRead.bitsPerSample, 64);
        assert.deepEqual(wavRead.samples,
            [0.0, 0.04029440055111987, -0.04029440055111987, 1, 1]);
    });

    it('check rouding for double values on read/write',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '64',
            [3.141592653589793]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.ok(wavRead.samples[0] ==
            3.141592653589793);

    });

    it('check rouding for double values on read/write (forced change)',
        function() {
        let wav = rw64.writeWavBytes(1, 48000, '64',
            [3.141592653589793]);
        let wavRead = rw64.readWavBytes(wav);
        
        assert.ok(wavRead.samples[0] !=
            3.141592653589792);
    });

    it('should return a wave file with 64-bit audio on max and min range',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '64', [0,1,0,-1]);
        let wavRead = rw64.readWavBytes(wav);

        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 8);
        assert.equal(wavRead.bitsPerSample, 64);
        assert.deepEqual(wavRead.samples, [0,1,0,-1]);
    });

    it('should return another wave file with 64-bit audio', function() {
        let wav = rw64.writeWavBytes(1, 48000, '64',
            [0.0, 0.99999999999999999, -0.00000000000000001, 1]);
        let wavRead = rw64.readWavBytes(wav);

        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 8);
        assert.equal(wavRead.bitsPerSample, 64);
        assert.deepEqual(wavRead.samples,
            [0, 0.99999999999999999, -0.00000000000000001, 1]);
    });

    it('should return one more wave file with 64-bit audio', function() {
        let wav = rw64.writeWavBytes(1, 48000, '64',
            [0, 1, 1, -1, 0, -1, 0.99999999999999999,
            -0.00000000000000001, 1]);
        let wavRead = rw64.readWavBytes(wav);

        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 8);
        assert.equal(wavRead.bitsPerSample, 64);
        assert.deepEqual(wavRead.samples,
            [0, 1, 1, -1, 0, -1, 0.99999999999999999,
            -0.00000000000000001, 1]);
    });

    it('should return a 24-bit wave file with 8 channels', function() {
        let wav = rw64.writeWavBytes(8, 48000, '24',
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 8);
        assert.equal(read.sampleRate, 48000);
        assert.equal(read.blockAlign, 24);
        assert.equal(read.bitsPerSample, 24);
    });

    it('should return a 32-bit PCM wave file with 7 channels', function() {
        let wav = rw64.writeWavBytes(7, 48000, '32',
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 7);
        assert.equal(read.sampleRate, 48000);
        assert.equal(read.blockAlign, 28);
        assert.equal(read.bitsPerSample, 32);
    });

    it('should return a 24-bit wave file encoded as a base 64 string',
            function() {
        assert.ok(rw64.writeWavBase64(1, 48000, '24',
            [0, 0.5, -0.5]));
    });

    it('should return a 32-bit IEEE wave file encoded as a base 64 string',
            function() {
        assert.ok(rw64.writeWavBase64(1, 48000, '32f',
            [0, 0.5, -0.5]));
    });

    it('should return a 64-bit wave file encoded as a base 64 string',
            function() {
        assert.ok(rw64.writeWavBase64(1, 48000, '64',
            [0, 0.5, -0.5]));
    });

    it('should return a 24-bit wave file encoded as a Data URI',
            function() {
        assert.ok(rw64.writeWavDataURI(1, 48000, '24',
            [0, 0.5, -0.5]));
    });

    it('should return a 32-bit IEEE wave file encoded as a Data URI',
            function() {
        assert.ok(rw64.writeWavDataURI(1, 48000, '32f',
            [0, 0.5, -0.5]));
    });

    it('should return a 64-bit wave file encoded as a Data URI',
            function() {
        assert.ok(rw64.writeWavDataURI(1, 48000, '64',
            [0, 0.5, -0.5]));
    });

    it('should return another 64-bit wave file encoded as a Data URI',
            function() {
        assert.ok(rw64.writeWavDataURI(1, 48000, '64',
            [0, 1, -1, 0, 1]));
    });

    it('should write a 8-bit wav file with 1 Hz sample rate',
            function() {
        let samples = [0,1];
        let wav = rw64.writeWavBytes(1, 1, '8', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 1);
        assert.equal(read.sampleRate, 1);
        assert.equal(read.blockAlign, 1);
        assert.equal(read.bitsPerSample, 8);
    });

    it('should write a 8-bit stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '8', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 2);
        assert.equal(read.bitsPerSample, 8);
    });

    it('should write a 16-bit stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '16', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 4);
        assert.equal(read.bitsPerSample, 16);
    });

    it('should write a 24-bit stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '24', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 6);
        assert.equal(read.bitsPerSample, 24);
    });

    it('should write a 24-bit stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '24', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 6);
        assert.equal(read.bitsPerSample, 24);
    });

    it('should write a 32-bit PCM stereo wav file', function() {
        let channels = [
            [0,1,2],
            [0,1,2]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '32', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 1);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 8);
        assert.equal(read.bitsPerSample, 32);
    });

    it('should write a 32-bit IEEE stereo wav file', function() {
        let channels = [
            [0,1,-1],
            [0,1,-1]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '32f', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 3);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 8);
        assert.equal(read.bitsPerSample, 32);
    });

    it('should write a 64-bit stereo wav file', function() {
        let channels = [
            [0,1,-1],
            [0,1,-1]
        ];
        let samples = rw64.interleave(channels);
        let wav = rw64.writeWavBytes(2, 44100, '64', samples);
        let read = rw64.readWavBytes(wav);
        
        assert.equal(read.subChunk1Size, 16);
        assert.equal(read.audioFormat, 3);
        assert.equal(read.numChannels, 2);
        assert.equal(read.sampleRate, 44100);
        assert.equal(read.blockAlign, 16);
        assert.equal(read.bitsPerSample, 64);
    });

    it('should return a 64-bit wave file with non-negative 0',
            function() {
        let wav = rw64.writeWavBytes(1, 48000, '64', [0, 1, -1, -0, 1]);
        let wavRead = rw64.readWavBytes(wav);
        assert.equal(wavRead.audioFormat, 3);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 48000);
        assert.equal(wavRead.blockAlign, 8);
        assert.equal(wavRead.bitsPerSample, 64);
        assert.deepEqual(wavRead.samples, [0, 1, -1, 0, 1]);
    });

    it('should return a 32-bit PCM file with max possible sample value',
            function() {
        let wav = rw64.writeWavBytes(1, 16000, '32',
            [-2147483648, 2147483647, -1, 1, 0]);
        let wavRead = rw64.readWavBytes(wav);
        assert.equal(wavRead.audioFormat, 1);
        assert.equal(wavRead.numChannels, 1);
        assert.equal(wavRead.sampleRate, 16000);
        assert.equal(wavRead.blockAlign, 4);
        assert.equal(wavRead.bitsPerSample, 32);
        assert.deepEqual(wavRead.samples,
            [-2147483648, 2147483647, -1, 1, 0]);
    });
    */
});
