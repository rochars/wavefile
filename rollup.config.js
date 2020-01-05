/*
 * Copyright (c) 2018-2019 Rafael da Silva Rocha.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * @fileoverview rollup configuration file.
 * @see https://github.com/rochars/wavefile
 */

import fs from 'fs';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// Polyfills for the UMD
const polyfills = fs.readFileSync('./scripts/polyfills.js', 'utf8');

export default [
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/wavefile.js',
        name: 'wavefile',
        format: 'umd'
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      compiler({
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT3',
        compilation_level: 'ADVANCED',
        warning_level: 'VERBOSE',
        outputWrapper: polyfills + '%output%',
        externs: ['externs/wavefile.js','externs/amd.js',]
      }),
      compiler({
        language_in: 'ECMASCRIPT3',
        language_out: 'ECMASCRIPT3',
        compilation_level: 'WHITESPACE_ONLY',
        warning_level: 'QUIET'
      })
    ]
  }
];
