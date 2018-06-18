/*
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 * https://github.com/rochars/wavefile
 *
 */
const ClosureCompiler = require('google-closure-compiler-js').webpack;
module.exports = [
  // UMD
  {
    entry: './index.js',
    output: {
      filename: './dist/wavefile.js',
      library: "WaveFile",
      libraryTarget: "umd",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  },
  // compiled
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
          exportLocalPropertyDefinitions: true,
          generateExports: true,
          /*processCommonJsModules: true*/
        }
      })
    ],
  }
];