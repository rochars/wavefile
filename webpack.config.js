/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview webpack configuration file.
 * Three dist files are created:
 * - wavefile.cjs.js, CommonJS dist for Node. No dependencies included.
 * - wavefile.umd.js, UMD with dependencies included.
 * - wavefile.min.js, Compiled for browsers. All dependencies included.
 */

const ClosureCompiler = require('google-closure-compiler-js').webpack;

module.exports = [
  // CommonJS dist, no dependencies in the bundle.
  // Will be the one in the "main" field of package.json.
  {
    target: 'node',
    entry: './index.js',
    output: {
      filename: './dist/wavefile.cjs.js',
      library: "WaveFile",
      libraryTarget: "commonjs2"
    },
    externals: {
      'byte-data': 'byte-data',
      "alawmulaw": "alawmulaw",
      "base64-arraybuffer": "base64-arraybuffer",
      "bitdepth": "bitdepth",
      "imaadpcm": "imaadpcm",
      "riff-chunks": "riff-chunks"
    },
  },
  // UMD with dependencies in the bundle.
  // Will be the one in the "browser" field of package.json.
  {
    entry: './index.js',
    resolve: {
      mainFields: ['module', 'main']
    },
    output: {
      filename: './dist/wavefile.umd.js',
      library: "WaveFile",
      libraryTarget: "umd"
    }
  },
  // Browser dist with dependencies, compiled.
  {
    entry: './index.js',
    resolve: {
      mainFields: ['module', 'main']
    },
    output: {
      filename: './dist/wavefile.min.js',
      library: "WaveFile",
      libraryTarget: "window"
    },
    plugins: [
      new ClosureCompiler({
        options: {
          languageIn: 'ECMASCRIPT6',
          languageOut: 'ECMASCRIPT5',
          compilationLevel: 'ADVANCED',
          warningLevel: 'VERBOSE',
          exportLocalPropertyDefinitions: true,
          generateExports: true,
          outputWrapper: '%output%window' + 
            '["WaveFile"]=window["WaveFile"]["WaveFile"]'
        }
      })
    ]
  }
];
