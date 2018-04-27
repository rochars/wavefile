/**
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

module.exports = {
  entry: './index.js',
  output: {
    filename: './dist/wavefile.js'
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
              replace: "window['WaveFile'] = WaveFile;"
            },
          ]
        }
      }
    ]
  }
};