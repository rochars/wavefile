/*
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 * @see https://github.com/rochars/wavefile
 */

import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import closure from 'rollup-plugin-closure-compiler-js';

// Read externs definitions
const fs = require('fs');
const polyfills = fs.readFileSync('./scripts/polyfills.js', 'utf8');
const externs = fs.readFileSync('./externs/wavefile.js', 'utf8');

// GCC wrapper
const outputWrapper =
  ";exports.default=exports;var WaveFile={};" +
  "typeof module!=='undefined'?module.exports=exports :" +
  "typeof define==='function'&&define.amd?define(['exports'],exports.default) :" +
  "typeof global!=='undefined'?global.WaveFile=exports:WaveFile=exports;";

export default [
  // ES6 bundle
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.js',
        format: 'es'
      },
      // kept for compatibility with version 8.x dist
      {
        file: 'dist/wavefile.cjs.js',
        format: 'cjs'
      },
      
    ],
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // kept for compatibility with version 8.x dist
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.min.js',
        name: 'WaveFileModule',
        format: 'iife',
        footer: 'window["WaveFile"] = WaveFileModule;'
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      closure({
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
        externs: [{src: externs}]
      }),
    ]
  },
  // Main UMD dist
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.umd.js',
        name: 'WaveFile',
        format: 'umd',
        banner: polyfills
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel(),
      terser({mangle: false})
    ]
  },
];
