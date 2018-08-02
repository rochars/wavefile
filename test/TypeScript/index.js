"use strict";
/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */
exports.__esModule = true;
/**
 * @fileoverview TypeScript declaration tests.
 * @see https://github.com/rochars/wavefile
 */
var index_js_1 = require("../../index.js");
var wav = new index_js_1["default"]();
wav.fromScratch(1, 8000, "32", [0]);
console.log(wav);
