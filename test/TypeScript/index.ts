/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview TypeScript declaration tests.
 * @see https://github.com/rochars/wavefile
 */

import { WaveFile } from '../../index.js'

let wav = new WaveFile();
wav.fromScratch(1, 8000, "32", new Uint32Array([0]));
wav.fromScratch(1, 8000, "32", new Float64Array([0]));
wav.fromScratch(1, 8000, "32", [0]);
wav.fromScratch(1, 8000, "32", [[0],[0]]);

let samples: Float64Array;
samples = wav.getSamples();

samples = wav.getSamples(true, Int32Array);

try {
	wav.fromBuffer(new Uint8Array([0]));
} catch (e) {
}

console.log(wav);
