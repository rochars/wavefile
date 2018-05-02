/**
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

const ClosureCompiler = require('google-closure-compiler-js').webpack;
module.exports = {
  entry: './index.js',
  output: {
    filename: './dist/wavefile-min.js'
  },
  module: {
    loaders: [
      {
        test:  /index\.js$/,
        loader: 'string-replace-loader',
        query: {
          multiple: [
            {
              search: 'module.exports = WaveFile;',
              replace: "window['WaveFile'] = window['WaveFile'] ? window['WaveFile'] : WaveFile;"
            },
          ]
        }
      }
    ],
  },
  plugins: [
    new ClosureCompiler({
      options: {
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'SIMPLE'
      }
    })
  ]
};