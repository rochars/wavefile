/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import closure from 'rollup-plugin-closure-compiler-js';
import babel from 'rollup-plugin-babel';

// Read externs definitions
const fs = require('fs');
let externsSrc = fs.readFileSync('./externs.js', 'utf8');
externsSrc += 'WaveFile.getLISTBytes_ = function() {};'

// License notes
const license = '/*!\n'+
  ' * wavefile\n'+
  ' *   Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.\n'+
  ' * base64-arraybuffer-es6\n' +
  ' *   Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen. MIT License.\n' +
  ' * imaadpcm\n' +
  ' *   Copyright (c) 2016 acida, 2018 Rafael da Silva Rocha. MIT License.\n' +
  ' */\n';

let UMDBanner = "var WaveFile = (function (global, factory) {" +
  "typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :" +
  "typeof define === 'function' && define.amd ? define(factory) :" +
  "(global.WaveFile = factory());" +
  "}(this, (function () { 'use strict';"

let UMDFooter = 'return WaveFile; })));';

export default [
  // cjs
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
    ],
    plugins: [
      nodeResolve(),
      commonjs()
    ]
  },
  // umd
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.umd.js',
        name: 'WaveFile',
        format: 'umd',
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      babel()
      /*closure({
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'SIMPLE',
        warningLevel: 'VERBOSE',
        preserveTypeAnnotations: true,
        createSourceMap: false,
        outputWrapper: UMDBanner + '%output%' + UMDFooter

      })*/
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
      nodeResolve(),
      commonjs(),
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
