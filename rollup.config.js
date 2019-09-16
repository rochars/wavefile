/*
 * Copyright (c) 2017-2019 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 * @see https://github.com/rochars/wavefile
 */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default [
  // ES6 and CJS bundles
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.js',
        format: 'esm'
      },
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

  // browser dist
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
      compiler({
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED',
        externs: ['externs/wavefile.js']
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
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      compiler({
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'SIMPLE',
        warning_level: 'VERBOSE',
        externs: ['externs/wavefile.js']
      }),
    ]
  },
];
