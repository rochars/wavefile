/*!
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * 
 */

var assert = require('assert');


describe('4-bit to 24-bit (existing 4-bit wave file)', function() {
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "/4bit-imaadpcm-8kHz-noBext-mono.wav"));

    wav.fromIMAADPCM("24");

    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/24bit-8kHz-noBext-mono-decoded-source2.wav",
        wav2.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav2.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1",
            function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });

    it("blockAlign should be 2",
            function() {
        assert.equal(wav2.fmt.blockAlign, 3);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav2.fmt.bitsPerSample, 24);
    });
    
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.data.samples.length > 0);
    });
});

describe('16-bit to 4-bit', function() {
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));

    wav.toIMAADPCM();

    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/4bit-imaadpcm-8kHz-noBext-mono-encoded.wav", wav2.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 20",
            function() {
        assert.equal(wav2.fmt.chunkSize, 20);
    });
    it("audioFormat should be 17 (IMA ADPCM)",
            function() {
        assert.equal(wav2.fmt.audioFormat, 17);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });

    it("blockAlign should be 256",
            function() {
        assert.equal(wav2.fmt.blockAlign, 256);
    });
    it("bitsPerSample should be 4",
            function() {
        assert.equal(wav2.fmt.bitsPerSample, 4);
    });
    it("factChunkId should be 'fact' on the new file",
            function() {
        assert.equal(wav2.fact.chunkId, 'fact');
    });
    
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.data.samples.length > 0);
    });
});


describe('4-bit to 16-bit (4-bit encoded with wavefile.js)', function() {
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "/4bit-imaadpcm-8kHz-noBext-mono-encoded.wav"));

    wav.fromIMAADPCM();

    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/16bit-8kHz-noBext-mono-decoded.wav",
        wav2.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav2.fmt.chunkSize, 16);
    });
    it("audioFormat should be 17 (PCM)",
            function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });

    it("blockAlign should be 2",
            function() {
        assert.equal(wav2.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav2.fmt.bitsPerSample, 16);
    });
    
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.data.samples.length > 0);
    });
});

describe('4-bit to 16-bit (existing 4-bit wave file)', function() {
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "/4bit-imaadpcm-8kHz-noBext-mono.wav"));

    wav.fromIMAADPCM();

    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/16bit-8kHz-noBext-mono-decoded-source2.wav",
        wav2.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav2.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1",
            function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });

    it("blockAlign should be 2",
            function() {
        assert.equal(wav2.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav2.fmt.bitsPerSample, 16);
    });
    
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.data.samples.length > 0);
    });
});

describe('4-bit to 16-bit (1024 blockalign)', function() {
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "/4-bit-imaadpcm-8kHz-noBext-mono-reaper.wav"));

    //wav.fromIMAADPCM(1024);
    wav.fromIMAADPCM();

    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/16bit-8kHz-noBext-mono-decoded-reaper.wav",
        wav2.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 16",
            function() {
        assert.equal(wav2.fmt.chunkSize, 16);
    });
    it("audioFormat should be 1",
            function() {
        assert.equal(wav2.fmt.audioFormat, 1);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });

    it("blockAlign should be 2",
            function() {
        assert.equal(wav2.fmt.blockAlign, 2);
    });
    it("bitsPerSample should be 16",
            function() {
        assert.equal(wav2.fmt.bitsPerSample, 16);
    });
    
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.data.samples.length > 0);
    });
});



describe('8-bit A-Law to 4-bit ADPCM', function() {
    let fs = require("fs");
    const WaveFile = require("../../test/loader.js");
    let path = "test/files/";
    
    let wav = new WaveFile(
        fs.readFileSync(path + "8bit-alaw-8kHz-noBext-mono-encoded.wav"));

    wav.toIMAADPCM();

    let wav2 = new WaveFile(wav.toBuffer());
    fs.writeFileSync(path + "/out/4bit-8kHz-mono-imaadpcm-encoded-from-alaw.wav", wav2.toBuffer());

    it("chunkId should be 'RIFF'",
            function() {
        assert.equal(wav2.container, "RIFF");
    });
    it("fmtChunkId should be 'fmt '",
            function() {
        assert.equal(wav2.fmt.chunkId, "fmt ");
    });
    it("format should be 'WAVE'",
            function() {
        assert.equal(wav2.format, "WAVE");
    });
    it("fmtChunkSize should be 20",
            function() {
        assert.equal(wav2.fmt.chunkSize, 20);
    });
    it("audioFormat should be 17 (IMA ADPCM)",
            function() {
        assert.equal(wav2.fmt.audioFormat, 17);
    });
    it("numChannels should be 1",
            function() {
        assert.equal(wav2.fmt.numChannels, 1);
    });
    it("sampleRate should be 8000",
            function() {
        assert.equal(wav2.fmt.sampleRate, 8000);
    });

    it("blockAlign should be 256",
            function() {
        assert.equal(wav2.fmt.blockAlign, 256);
    });
    it("bitsPerSample should be 4",
            function() {
        assert.equal(wav2.fmt.bitsPerSample, 4);
    });
    it("factChunkId should be 'fact' on the new file",
            function() {
        assert.equal(wav2.fact.chunkId, 'fact');
    });
    
    it("dataChunkId should be 'data'",
            function() {
        assert.equal(wav2.data.chunkId, 'data');
    });
    it("dataChunkSize should be > 0",
            function() {
        assert.ok(wav2.data.chunkSize > 0);
    });
    it("samples.length should be > 0",
            function() {
        assert.ok(wav2.data.samples.length > 0);
    });
});