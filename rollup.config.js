/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import closure from 'rollup-plugin-closure-compiler-js';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

// Read externs definitions
const fs = require('fs');
const externsFile = fs.readFileSync('./externs/wavefile.js', 'utf8');

// License notes
const licenseSrc = fs.readFileSync('./LICENSE', 'utf8');
const license = '/*!\n'+
  'https://github.com/rochars/wavefile\n' +
  'Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen.\n' +
  'Copyright (c) 2016 acida, 2018 Rafael da Silva Rocha.\n' +
  licenseSrc +
  '\n */\n';

// GCC wrapper
const outputWrapper = license + 'var window=window||{};'+
  '%output%' +
  'var module=module||{};module.exports=exports;module.exports.default=exports;' +
  'var define=define||function(){};' +
'define(["exports"],function(exports){return module.exports;});'

export default [
  // ES bundle
  {
    input: 'index.js',
    output: [
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
  // UMD dist
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.umd.js',
        name: 'WaveFile',
        format: 'cjs',
        banner: 'var exports=exports||{};' +
        'window["WaveFile"]=exports;'
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
        outputWrapper: outputWrapper,
        externs: [{src: externsFile + 'exports={};'}]
      }),
    ]
  }
];
