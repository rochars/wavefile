/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import closure from 'rollup-plugin-closure-compiler-js';

// Read externs definitions
const fs = require('fs');
let externsSrc = fs.readFileSync('./externs.js', 'utf8');
externsSrc += 'WaveFile.getLISTBytes_ = function() {};'

// License notes
const license = '/*!\n'+
  ' * https://github.com/rochars/wavefile\n' +
  ' * Copyright (c) 2017-2018 Rafael da Silva Rocha.\n' +
  ' * Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen.\n' +
  ' * Copyright (c) 2016 acida, 2018 Rafael da Silva Rocha.\n' +
  ' *\n' +
  ' * Permission is hereby granted, free of charge, to any person obtaining\n' +
  ' * a copy of this software and associated documentation files (the\n' +
  ' * "Software"), to deal in the Software without restriction, including\n' +
  ' * without limitation the rights to use, copy, modify, merge, publish,\n' +
  ' * distribute, sublicense, and/or sell copies of the Software, and to\n' +
  ' * permit persons to whom the Software is furnished to do so, subject to\n' +
  ' * the following conditions:\n' +
  ' *\n' +
  ' * The above copyright notice and this permission notice shall be\n' +
  ' * included in all copies or substantial portions of the Software.\n' +
  ' *\n' +
  ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,\n' +
  ' * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n' +
  ' * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\n' +
  ' * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE\n' +
  ' * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION\n' +
  ' * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION\n' +
  ' * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n' +
  ' */\n';


let UMDBanner = "(function (global, factory) {" +
  "typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :" +
  "typeof define === 'function' && define.amd ? define(factory) :" +
  "(global.WaveFile = factory());" +
  "}(this, (function () { 'use strict';"

let UMDFooter = 'return WaveFile; })));';

export default [
  // cjs, es
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.cjs.js',
        name: 'wavefile',
        footer: 'module.exports.default = WaveFile;',
        format: 'cjs'
      },
      {
        file: 'dist/wavefile.js',
        format: 'es'
      }
    ]
  },
  // umd
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.umd.js',
        name: 'WaveFile',
        format: 'iife',
      }
    ],
    plugins: [
      closure({
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'WHITESPACE_ONLY',
        warningLevel: 'VERBOSE',
        preserveTypeAnnotations: true,
        createSourceMap: false,
        outputWrapper: UMDBanner + '%output%' + UMDFooter
      })
    ]
  },
  // browser
  {
    input: 'index.js',
    output: [
      {
        name: 'wavefile',
        format: 'iife',
        file: 'dist/wavefile.min.js',
        banner: license,
        footer: 'window["WaveFile"]=wavefile;'
      }
    ],
    plugins: [
      closure({
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
        externs: [{src:externsSrc}]
      })
    ]
  }
];
