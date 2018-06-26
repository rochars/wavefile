/*
 * https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview webpack configuration file.
 */

const ClosureCompiler = require('google-closure-compiler-js').webpack;
const BannerPlugin = require("webpack").BannerPlugin;

module.exports = [
  // Browser dist with dependencies, compiled.
  {
    devtool: 'source-map',
    entry: './index.js',
    mode: 'production',
    resolve: {
      mainFields: ['module', 'main']
    },
    optimization: {minimize:false},
    output: {
      filename: 'wavefile.min.js',
      library: "WaveFile",
      libraryTarget: "window"
    },
    plugins: [
      new BannerPlugin('wavefile Copyright (c) 2017-2018 Rafael da Silva Rocha.\n'+
          'base64-arraybuffer-es6 Copyright (c) 2017 Brett Zamir, ' +
          '2012 Niklas von Hertzen Licensed under the MIT license.'),
      new ClosureCompiler({
        options: {
          languageIn: 'ECMASCRIPT6',
          languageOut: 'ECMASCRIPT5',
          compilationLevel: 'ADVANCED',
          warningLevel: 'VERBOSE',
          exportLocalPropertyDefinitions: true,
          generateExports: true,
          outputWrapper: '%output%window.' + 
            'WaveFile=window.WaveFile.default;',
          createSourceMap: true
        }
      })
    ]
  }
];
