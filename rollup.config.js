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
        name: 'wavefile',
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
        format: 'umd',
        banner: '// wavefile Copyright (c) 2017-2018 Rafael da Silva Rocha.\n'+
          '// base64-arraybuffer-es6 Copyright (c) 2017 Brett Zamir, ' +
          '2012 Niklas von Hertzen Licensed under the MIT license.\n'
      },
      {
        file: 'dist/wavefile.js',
        format: 'es',
        banner: '// wavefile Copyright (c) 2017-2018 Rafael da Silva Rocha.\n'+
          '// base64-arraybuffer-es6 Copyright (c) 2017 Brett Zamir, ' +
          '2012 Niklas von Hertzen Licensed under the MIT license.\n'
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
        banner: '// wavefile Copyright (c) 2017-2018 Rafael da Silva Rocha.\n'+
          '// base64-arraybuffer-es6 Copyright (c) 2017 Brett Zamir, ' +
          '2012 Niklas von Hertzen Licensed under the MIT license.\n',
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
