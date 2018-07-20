/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview TypeScript declaration tests.
 * @see https://github.com/rochars/wavefile
 */

import WaveFile from '../../dist/wavefile.umd.js'

let wav = new WaveFile();
wav.fromScratch(1, 8000, "32", [0]);

console.log(wav);