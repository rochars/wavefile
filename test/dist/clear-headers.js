/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2019 Rafael da Silva Rocha. MIT License.
 *
 * Test the clearHeaders() method.
 * 
 */

const assert = require("assert");
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "./test/files/";

describe('reset the fact chunk when converting from ADPCM to PCM', function() {
    let wav = new WaveFile(
        fs.readFileSync(
            path + "/4-bit-imaadpcm-8kHz-noBext-mono-reaper.wav"));
    wav.fromIMAADPCM();
    it("fact.ChunkId should be '' on the new file", function() {
        assert.equal(wav.fact.chunkId, '');
    });
});

describe('reset the fact chunk when converting from alaw to PCM', function() {
    let wav = new WaveFile();
    wav.fromBuffer(fs.readFileSync(path + "/8bit-alaw-8kHz-noBext-mono-encoded.wav"));
    wav.fromALaw();
    it("fact.ChunkId should be '' on the new file", function() {
        assert.equal(wav.fact.chunkId, '');
    });
});

describe('reset the fact chunk when converting from mulaw to PCM', function() {
    let wav = new WaveFile();
    wav.fromBuffer(fs.readFileSync(path + "/8bit-mulaw-8kHz-noBext-mono-encoded.wav"));
    wav.fromMuLaw();
    it("fact.ChunkId should be '' on the new file", function() {
        assert.equal(wav.fact.chunkId, '');
    });
});

describe("Read a file with cbSize then another with no cbSize", function() {
    it("cbSize should be 22",
            function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
        assert.equal(wav.fmt.cbSize, 22);
    });
    it("cbSize should be 0 when reading another file with no cbSize",
            function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "M1F1-int12WE-AFsp.wav"));
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.equal(wav.fmt.cbSize, 0);
    });
});

describe('reset the fmt.validBitsPerSample field', function() {
    it("fmt.validBitsPerSample should be 8", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "8bit-mulaw-8kHz-noBext-mono-encoded.wav"));
        assert.deepEqual(wav.fmt.validBitsPerSample, 8);
    });
    it("fmt.validBitsPerSample should be 0", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "8bit-mulaw-8kHz-noBext-mono-encoded.wav"));
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.deepEqual(wav.fmt.validBitsPerSample, 0);
    });
});

describe('reset the fmt.dwChannelMask field', function() {
    it("fmt.dwChannelMask should be 0x33", function() {
        // create a 4-channel wav
        let channel = [];
        for (let i=0; i<9000; i++) {
            channel.push(0);
        }
        let wav = new WaveFile();
        wav.fromScratch(4, 48000, '16', [channel, channel, channel, channel]);
        assert.deepEqual(wav.fmt.dwChannelMask, 0x33);
    });
    it("fmt.dwChannelMask should be 0", function() {
        // create a 4-channel wav
        let channel = [];
        for (let i=0; i<9000; i++) {
            channel.push(0);
        }
        let wav = new WaveFile();
        wav.fromScratch(4, 48000, '16', [channel, channel, channel, channel]);
        // read a 1 channel wav
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.deepEqual(wav.fmt.dwChannelMask, 0);
    });
});

describe('reset the fmt.subformat field', function() {
    it("fmt.subformat should be [1, 1048576, 2852126848, 1905997824]", function() {
        // create a 10-bit wav
        let wav = new WaveFile();
        let samples = [];
        for (let i=0; i<9000; i++) {
            samples.push(0);
        }
        wav.fromScratch(1, 8000, '10', samples);
        assert.deepEqual(wav.fmt.subformat, [1, 1048576, 2852126848, 1905997824]);
    });
    it("fmt.subformat should be []", function() {
        // create a 10-bit wav
        let wav = new WaveFile();
        let samples = [];
        for (let i=0; i<9000; i++) {
            samples.push(0);
        }
        wav.fromScratch(1, 8000, '10', samples);
        // read a 16-bit wav
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.deepEqual(wav.fmt.subformat, []);
    });
});

describe('reset the fact chunk', function() {
    it("fact.chunkId should be 'cue '", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "8bit-mulaw-8kHz-noBext-mono-encoded.wav"));
        assert.deepEqual(wav.fact.chunkId, 'fact');
    });
    it("fact.chunkId should be ''", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "8bit-mulaw-8kHz-noBext-mono-encoded.wav"));
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.deepEqual(wav.fact.chunkId, '');
    });
});

describe('reset the cue chunk', function() {
    // cue
    it("cue.chunkId should be 'cue '", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-16kHz-markers-mono.wav"));
        assert.deepEqual(wav.cue.chunkId, 'cue ');
    });
    // no cue
    it("cue.chunkId should be ''", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-16kHz-markers-mono.wav"));
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.deepEqual(wav.cue.chunkId, '');
    });
});

describe('reset the smpl chunk', function() {
    // smpl
    it("smpl.chunkId should be 'smpl'", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-region.wav"));
        assert.deepEqual(wav.smpl.chunkId, 'smpl');
    });
    // no smpl
    it("smpl.chunkId should be ''", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-region.wav"));
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.deepEqual(wav.smpl.chunkId, '');
    });
});

describe('reset the bext chunk', function() {
    
    it("bext.ChunkId should be 'bext'", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav"));
        assert.equal(wav.bext.chunkId, 'bext');
    });
    it("bext.ChunkId should be ''", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "32bitIEEE-16kHz-bext-mono.wav"));
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.equal(wav.bext.chunkId, '');
    });
});

describe('reset the ds64 chunk', function() {
    
    it("ds64.ChunkId should be 'ds64'", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "RF64-16bit-8kHz-stereo-reaper.wav"));
        assert.equal(wav.ds64.chunkId, 'ds64');
    });
    it("ds64.ChunkId should be ''", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "RF64-16bit-8kHz-stereo-reaper.wav"));
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.equal(wav.ds64.chunkId, '');
    });
});

describe('reset the LIST chunk', function() {
    
    it("LIST len should be > 0'", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav"));
        assert.equal(wav.LIST.length , 1);
    });
    it("LIST len should be == 0", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav"));
        wav.fromBuffer(fs.readFileSync(path + "24bit-16kHz-bext-mono.wav"));
        assert.equal(wav.LIST.length , 0);
    });
});

describe('reset the junk chunk', function() {
    
    it("junk.ChunkId should be 'junk'", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        assert.equal(wav.junk.chunkId, 'junk');
    });
    it("junk.ChunkId should be ''", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16-bit-8kHz-noBext-mono.wav"));
        wav.fromBuffer(fs.readFileSync(path + "smpl_cue.wav"));
        assert.equal(wav.junk.chunkId, '');
    });
});

// --------------------------------------------------------------

// Test changing the bit depth; in this cases LIST, cue, smpl and bext
// chunks should be preserved

describe('cue points should be preserved when changing the bit depth', function() {
    it("cue.ChunkId should be 'cue '", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));

        // label is Ω, wich uses 2 bytes;
        // chunkSize in original file is 7
        assert.equal(wav.LIST[0].subChunks[0].chunkSize, 7);

        assert.equal(wav.cue.chunkId, 'cue ');
        wav.toBitDepth('32');
        assert.equal(wav.cue.chunkId, 'cue ');
        fs.writeFileSync(
            path + "/out/32bit-8kHz-markers-1c-encoded-clear-headers.wav",
            wav.toBuffer());

        wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "/out/32bit-8kHz-markers-1c-encoded-clear-headers.wav"));
        assert.equal(wav.cue.chunkId, 'cue ');

        // label is Ω, wich uses 2 bytes;
        // chunkSize in new file must be 7 too
        assert.equal(wav.LIST[0].subChunks[0].chunkSize, 7);

        // Load the original file
        let originalWav = new WaveFile();
        originalWav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));

        // Compare the cue points in the original file
        // with the ones in the new file
        assert.deepEqual(originalWav.cue, wav.cue);
    });
});

describe('RIFF tags should be preserved when changing the bit depth', function() {
    it("cue.ChunkId should be 'cue '", function() {
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav"));
        assert.equal(wav.LIST.length, 1);
        wav.toBitDepth('32');
        assert.equal(wav.LIST.length, 1);
        fs.writeFileSync(
            path + "/out/32bit-from-M1F1-int12WE-clear-headers.wav",
            wav.toBuffer());

        wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "/out/32bit-from-M1F1-int12WE-clear-headers.wav"));
        assert.equal(wav.LIST.length, 1);

        // Load the original file
        let originalWav = new WaveFile();
        originalWav.fromBuffer(fs.readFileSync(path + "M1F1-int12WE-AFsp-NEW-TAGS.wav"));

        // Compare the LIST chunk in the original file
        // with the LIST chunk in the new file
        assert.deepEqual(originalWav.LIST, wav.LIST);
    });
});

describe('bext should be preserved when changing the bit depth', function() {
    it("cue.ChunkId should be 'cue '", function() {
        
        // Load a fle with bext
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "24bit-16kHz-bext-mono.wav"));
        assert.equal(wav.bext.chunkId, 'bext');

        // Change the bith depth and assert bext remains
        wav.toBitDepth('32');
        assert.equal(wav.bext.chunkId, 'bext');
        
        // Write the new file to disk        
        fs.writeFileSync(
            path + "/out/32bit-from-24bit-bext-clear-headers.wav",
            wav.toBuffer());

        // Load the new file and assert bext remains
        wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "/out/32bit-from-24bit-bext-clear-headers.wav"));
        assert.equal(wav.bext.chunkId, 'bext');

        // Load the original file
        let originalWav = new WaveFile();
        originalWav.fromBuffer(fs.readFileSync(path + "24bit-16kHz-bext-mono.wav"));

        // Compare the bext chunk in the original file
        // with the bext chunk in the new file
        assert.deepEqual(originalWav.bext, wav.bext);
    });
});

describe('smpl chunk should be preserved when changing the bit depth', function() {
    it("smpl.ChunkId should be 'smpl'", function() {
        
        // Load a fle with smpl
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-region.wav"));
        assert.equal(wav.smpl.chunkId, 'smpl');

        // Change the bith depth and assert smpl remains
        wav.toBitDepth('32');
        assert.equal(wav.smpl.chunkId, 'smpl');
        
        // Write the new file to disk        
        fs.writeFileSync(
            path + "/out/32bit-from-16bit-smpl-clear-headers.wav",
            wav.toBuffer());

        // Load the new file and assert smpl remains
        wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "/out/32bit-from-16bit-smpl-clear-headers.wav"));
        assert.equal(wav.smpl.chunkId, 'smpl');

        // Load the original file
        let originalWav = new WaveFile();
        originalWav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-region.wav"));

        // Compare the smpl chunk in the original file
        // with the smpl chunk in the new file
        assert.deepEqual(originalWav.smpl, wav.smpl);
    });
});


// --------------------------------------------------------------

// Test changing the compression; in this cases only fmt , fact, ds64 and data
// chunks should reset

describe('cue points should be kept when compressing to ADPCM', function() {
    it("cue should be the same after ADPCM compression", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.equal(wav.cue.chunkId, 'cue ');
        wav.toIMAADPCM();
        assert.equal(wav.cue.chunkId, 'cue ');
        wavOriginal.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.deepEqual(wav.cue, wavOriginal.cue);
    });
    it("cue should be equal in both files", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(
            fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        wav.toIMAADPCM();
        fs.writeFileSync(
            path + "/out/4bitADPCM-8kHz-markers-1c-encoded-clear-headers.wav",
            wav.toBuffer());
        wav.fromBuffer(fs.readFileSync(
            path + "/out/4bitADPCM-8kHz-markers-1c-encoded-clear-headers.wav"));
        wav.fromIMAADPCM();
        wavOriginal.fromBuffer(
            fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.deepEqual(wav.cue, wavOriginal.cue);
    });
});

describe('smpl should be kept when compressing to ADPCM', function() {
    it("smpl should be the same after ADPCM compression", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.equal(wav.smpl.chunkId, 'smpl');
        wav.toIMAADPCM();
        assert.equal(wav.smpl.chunkId, 'smpl');
        wavOriginal.fromBuffer(fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.deepEqual(wav.smpl, wavOriginal.smpl);
    });
    it("smpl should be equal in both files", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(
            fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        wav.toIMAADPCM();
        fs.writeFileSync(
            path + "/out/4bitADPCM-8kHz-1c-1region-reaper-encoded-clear-headers.wav",
            wav.toBuffer());
        wav.fromBuffer(fs.readFileSync(
            path + "/out/4bitADPCM-8kHz-1c-1region-reaper-encoded-clear-headers.wav"));
        wav.fromIMAADPCM();
        wavOriginal.fromBuffer(
            fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.deepEqual(wav.smpl, wavOriginal.smpl);
    });
});

describe('bext should be kept when compressing to ADPCM', function() {
    it("should keep the bext chunk", function() {
        // Load a file with bext
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8khz-bext-mono.wav"));
        assert.equal(wav.bext.chunkId, 'bext');
        // bext should reset
        wav.toIMAADPCM();
        assert.equal(wav.bext.chunkId, 'bext');

        fs.writeFileSync(
            path + "/out/ADPCM-from-16bit-8khz-bext-mono-clear-headers.wav",
            wav.toBuffer());

        wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "/out/ADPCM-from-16bit-8khz-bext-mono-clear-headers.wav"));
        assert.equal(wav.bext.chunkId, 'bext');
    });
});

// A-Law
describe('cue points should be kept when compressing to A-Law', function() {
    it("cue should be the same after ADPCM compression", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.equal(wav.cue.chunkId, 'cue ');
        wav.toALaw();
        assert.equal(wav.cue.chunkId, 'cue ');
        wavOriginal.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.deepEqual(wav.cue, wavOriginal.cue);
    });
    it("cue should be equal in both files", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(
            fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        wav.toALaw();
        fs.writeFileSync(
            path + "/out/A-Law-8kHz-markers-1c-encoded-clear-headers.wav",
            wav.toBuffer());
        wav.fromBuffer(fs.readFileSync(
            path + "/out/A-Law-8kHz-markers-1c-encoded-clear-headers.wav"));
        wav.fromALaw();
        wavOriginal.fromBuffer(
            fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.deepEqual(wav.cue, wavOriginal.cue);
    });
});

describe('smpl should be kept when compressing to A-Law', function() {
    it("smpl should be the same after A-Law compression", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.equal(wav.smpl.chunkId, 'smpl');
        wav.toALaw();
        assert.equal(wav.smpl.chunkId, 'smpl');
        wavOriginal.fromBuffer(fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.deepEqual(wav.smpl, wavOriginal.smpl);
    });
    it("smpl should be equal in both files", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(
            fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        wav.toALaw();
        fs.writeFileSync(
            path + "/out/A-Law-8kHz-1c-1region-reaper-encoded-clear-headers.wav",
            wav.toBuffer());
        wav.fromBuffer(fs.readFileSync(
            path + "/out/A-Law-8kHz-1c-1region-reaper-encoded-clear-headers.wav"));
        wav.fromALaw();
        wavOriginal.fromBuffer(
            fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.deepEqual(wav.smpl, wavOriginal.smpl);
    });
});

describe('bext should be kept when compressing to A-Law', function() {
    it("should keep the bext chunk", function() {
        // Load a file with bext
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8khz-bext-mono.wav"));
        assert.equal(wav.bext.chunkId, 'bext');
        // bext should reset
        wav.toALaw();
        assert.equal(wav.bext.chunkId, 'bext');

        fs.writeFileSync(
            path + "/out/A-Law-from-16bit-8khz-bext-mono-clear-headers.wav",
            wav.toBuffer());

        wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "/out/A-Law-from-16bit-8khz-bext-mono-clear-headers.wav"));
        assert.equal(wav.bext.chunkId, 'bext');
    });
});

// mu-Law
describe('cue points should be kept when compressing to mu-Law', function() {
    it("cue should be the same after mu compression", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.equal(wav.cue.chunkId, 'cue ');
        wav.toMuLaw();
        assert.equal(wav.cue.chunkId, 'cue ');
        wavOriginal.fromBuffer(fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.deepEqual(wav.cue, wavOriginal.cue);
    });
    it("cue should be equal in both files", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(
            fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        wav.toMuLaw();
        fs.writeFileSync(
            path + "/out/mu-Law-8kHz-markers-1c-encoded-clear-headers.wav",
            wav.toBuffer());
        wav.fromBuffer(fs.readFileSync(
            path + "/out/mu-Law-8kHz-markers-1c-encoded-clear-headers.wav"));
        wav.fromMuLaw();
        wavOriginal.fromBuffer(
            fs.readFileSync(path + "16bit-8kHz-1c-reaper-utf8cue.wav"));
        assert.deepEqual(wav.cue, wavOriginal.cue);
    });
});

describe('smpl should be kept when compressing to mu-Law', function() {
    it("smpl should be the same after mu-Law compression", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.equal(wav.smpl.chunkId, 'smpl');
        wav.toMuLaw();
        assert.equal(wav.smpl.chunkId, 'smpl');
        wavOriginal.fromBuffer(fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.deepEqual(wav.smpl, wavOriginal.smpl);
    });
    it("smpl should be equal in both files", function() {
        let wav = new WaveFile();
        let wavOriginal = new WaveFile();
        wav.fromBuffer(
            fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        wav.toMuLaw();
        fs.writeFileSync(
            path + "/out/mu-Law-8kHz-1c-1region-reaper-encoded-clear-headers.wav",
            wav.toBuffer());
        wav.fromBuffer(fs.readFileSync(
            path + "/out/mu-Law-8kHz-1c-1region-reaper-encoded-clear-headers.wav"));
        wav.fromMuLaw();
        wavOriginal.fromBuffer(
            fs.readFileSync(path + "16bit-9khz-1c-1region-reaper.wav"));
        assert.deepEqual(wav.smpl, wavOriginal.smpl);
    });
});

describe('bext should be kept when compressing to mu-Law', function() {
    it("should keep the bext chunk", function() {
        // Load a file with bext
        let wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "16bit-8khz-bext-mono.wav"));
        assert.equal(wav.bext.chunkId, 'bext');
        // bext should reset
        wav.toMuLaw();
        assert.equal(wav.bext.chunkId, 'bext');

        fs.writeFileSync(
            path + "/out/mu-Law-from-16bit-8khz-bext-mono-clear-headers.wav",
            wav.toBuffer());

        wav = new WaveFile();
        wav.fromBuffer(fs.readFileSync(path + "/out/mu-Law-from-16bit-8khz-bext-mono-clear-headers.wav"));
        assert.equal(wav.bext.chunkId, 'bext');
    });
});
