/*
 * https://github.com/rochars/byte-data
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import closure from 'rollup-plugin-closure-compiler-js';

// License notes for bundles that include dependencies
const license = '/*!\n'+
  ' * wavefile Copyright (c) 2017-2018 Rafael da Silva Rocha.\n'+
  ' * base64-arraybuffer-es6 Copyright (c) 2017 Brett Zamir,\n' +
  ' *   2012 Niklas von Hertzen Licensed under the MIT license.\n' +
  ' */\n';

export default [
  // cjs
  {
    input: 'index.js',
    external: [
      'byte-data',
      'alawmulaw',
      'base64-arraybuffer-es6',
      'bitdepth',
      'imaadpcm',
      'riff-chunks'
    ],
    output: [
      {
        file: 'dist/wavefile.cjs.js',
        name: 'wavefile.default',
        footer: 'module.exports.default = WaveFile',
        format: 'cjs'
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
  // umd, es
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.umd.js',
        name: 'WaveFile',
        format: 'umd'
      },
      {
        file: 'dist/wavefile.js',
        format: 'es'
      },
      {
        name: 'WaveFile',
        format: 'iife',
        file: 'dist/wavefile.browser.js',
        banner: license,
        footer: 'window["WaveFile"]=WaveFile;'
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
  // browser
  {
    input: 'index.js',
    output: [
      {
        name: 'WaveFile',
        format: 'iife',
        file: 'dist/wavefile.min.js',
        banner: license,
        footer: 'window["WaveFile"]=WaveFile;'
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
        exportLocalPropertyDefinitions: true,
        generateExports: true
      })
    ]
  }
];
