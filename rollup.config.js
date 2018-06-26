/*
 * https://github.com/rochars/byte-data
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

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
  // umd
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
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
    ]
  },
  // esm
  {
    input: 'index.js',
    output: [
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
  }
];
