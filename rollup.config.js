/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import closure from 'rollup-plugin-closure-compiler-js';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

// Read externs definitions
const fs = require('fs');
const externsSrc = fs.readFileSync('./externs/wavefile.js', 'utf8');

// License notes
const licenseSrc = fs.readFileSync('./LICENSE', 'utf8');
const license = '/*!\n'+
  'https://github.com/rochars/wavefile\n' +
  'Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen.\n' +
  'Copyright (c) 2016 acida, 2018 Rafael da Silva Rocha.\n' +
  licenseSrc +
  '\n */\n';

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
    ],
    plugins: [
      resolve(),
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
      resolve(),
      commonjs(),
      babel()
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
      resolve(),
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
