"use strict";
/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */
exports.__esModule = true;
/**
 * @fileoverview TypeScript declaration tests.
 * @see https://github.com/rochars/wavefile
 */
var wavefile_umd_js_1 = require("../../dist/wavefile.umd.js");
var wav = new wavefile_umd_js_1["default"]();
wav.fromScratch(1, 8000, "32", [0]);
console.log(wav);
