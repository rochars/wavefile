/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview webpack configuration file.
 * Two dist files are created:
 * - wavefile.js, ES5 UMD dist
 * - wavefile.min.js, ES5 dist for browsers only
 */

const ClosureCompiler = require('google-closure-compiler-js').webpack;
module.exports = [
  // ES5 browser dist
  {
    entry: './index.js',
    output: {
      filename: './dist/wavefile.min.js',
      library: "WaveFile",
      libraryTarget: "window",
    },
    plugins: [
      new ClosureCompiler({
        options: {
          languageIn: 'ECMASCRIPT6',
          languageOut: 'ECMASCRIPT5',
          compilationLevel: 'ADVANCED',
          warningLevel: "VERBOSE",
          processCommonJsModules: true,
          exportLocalPropertyDefinitions: true,
          generateExports: true,
          newTypeInf: true,
        },
      }),
    ],
  },
  // UMD
  {
    entry: './index.js',
    output: {
  	  filename: './dist/wavefile.umd.js',
  	  library: "WaveFile",
  	  libraryTarget: "umd",
    },
    plugins: [
      new ClosureCompiler({
        options: {
          languageIn: 'ECMASCRIPT6',
          languageOut: 'ECMASCRIPT5',
          compilationLevel: 'WHITESPACE_ONLY',
          preserveTypeAnnotations: true,
        },
      }),
    ],
  }
];
