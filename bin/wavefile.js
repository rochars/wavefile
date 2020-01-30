#!/usr/bin/env node
/*
 * Copyright (c) 2017-2019 Rafael da Silva Rocha.
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
 * @fileoverview wavefile CLI.
 * @see https://github.com/rochars/wavefile
 */

const WaveFile = require('../dist/wavefile.js').WaveFile;
const fs = require('fs');

/** @type {string} */
const presentation = " WaveFile 8.1.0\n" +
" Copyright (c) 2017-2018 Rafael da Silva Rocha.\n";

/** @type {string} */
const help = " Usage:\n" +
  "\n" +
  "  wavefile path/to/input.wav [...options] path/to/output.wav\n" +
  "\n" +
  " Available options:\n" +
  "\n" +
  "  --resample   Ex: wavefile input.wav --resample=16000 output.wav\n" +
  "               Change the sample rate. The input file is not affected\n" +
  "               Use with --method to change the interpolation method:\n" +
  "               Ex: wavefile in.wav --resample=8000 --method=sinc out.wav\n" +
  "               If --method is ommited, cubic interpolation will be used.\n" +
  "\n" +
  "  --bitdepth   Ex: wavefile input.wav --bitdepth=32f output.wav\n" +
  "               Change the bit depth.\n" +
  "               The input file is not affected.\n" +
  "               Possible values: 8, 16, 24, 32, 32f, 64\n" +
  "\n" +
  "  --compress   Ex: wavefile input.wav --compress=adpcm output.wav\n" +
  "               Apply compression to the file.\n" +
  "               The input file is not affected.\n" +
  "               Possible values: adpcm, alaw, mulaw\n" +
  "\n" +
  "  --tag        Ex: wavefile input.wav --tag=ICRD\n" +
  "               Print the value of tag if the tag exists.\n" +
  "\n" +
  "  --list-tags  Ex: wavefile input.wav --list-tags\n" +
  "               Print all tags of the file.\n" +
  "\n" +
  "  --list-cue   Ex: wavefile input.wav --list-cue\n" +
  "               Print all the cue points of the file.\n" +
  "\n" +
  "  --bits       Ex: wavefile input.wav --bits\n" +
  "               Print the bit depth of the file.\n" +
  "\n" +
  "  --rate       Ex: wavefile input.wav --rate\n" +
  "               Print the sample rate of the file.\n" +
  "\n" +
  "  --help       Ex: --help\n" +
  "               Show this help page.\n" +
  "\n";

// Help
if (process.argv[2] == '-h' ||
    process.argv[2] == '--help' || process.argv.length < 4) {
  console.log(presentation);
  console.log(help);
  process.exit();
}

/**
 * Anything that is not a command will be considered a file reference;
 * the first item in the list will be considered the input, all
 * others will be considered output.
 * @type {!Array<string>}
 */
let files = [];

/**
 * Anything that is not a file will be considered a command;
 * All commands should be executed against the input file.
 * @type {Object}
 */
let commands = {};

// parse args
for (let arg=2; arg<process.argv.length; arg++) {
  if (process.argv[arg].slice(0, 1) == '-') {
    commands[process.argv[arg].split("=")[0]] = process.argv[arg].split("=")[1];
  } else {
    files.push(process.argv[arg]);
  }
}

// Load the input file
/** @type {!Object} */
let wav = new WaveFile(fs.readFileSync(files[0]));
files.splice(0, 1);

// Run the commands
/** @type {boolean} */
let shouldWrite = false;
for (let command in commands) {
  // --bitdepth
  if (command == '--bitdepth') {
    wav.toBitDepth(commands[command]);
    shouldWrite = true;
  // --resample
  } else if (command == '--resample') {
    /** @type {!Object} */
    let options = {
      'method' : commands['--method'] ? commands['--method'] : 'cubic'
    };
    wav.toSampleRate(parseInt(commands[command], 10), options);
    shouldWrite = true;
  // --compress
  } else if (command == '--compress') {
    if (commands[command] == 'adpcm') {
      wav.toIMAADPCM();
      shouldWrite = true;
    } else if (commands[command] == 'alaw') {
      wav.toALaw();
      shouldWrite = true;
    } else if (commands[command] == 'mulaw') {
      wav.toMuLaw();
      shouldWrite = true;
    }
  // --tag
  } else if (command == '--tag') {
    console.log(wav.getTag(commands[command]));
  // --list-tag
  } else if (command == '--list-tags') {
    /** @type {!Object} */
    tags = wav.listTags();
    for (var tag in tags) {
      if (tags.hasOwnProperty(tag)) {
         console.log(tag + ': ' + tags[tag]);
      }
    }
  // --list-cue
  } else if (command == '--list-cue') {
    console.log(wav.listCuePoints());
  // --bits
  } else if (command == '--bits') {
    if (wav.fmt.validBitsPerSample) {
      console.log(wav.fmt.validBitsPerSample);
    } else {
      console.log(wav.fmt.bitPerSample);
    }
  // --rate
  } else if (command == '--rate') {
    console.log(wav.fmt.sampleRate);
  // error
  } else {
    if (!(command === '--method' && commands['--resample'])) {
      console.log('ERROR: Bad option. Run wavefile -h to check the available'+
        ' options.');
      process.exit();
    }
  }
}

// Write the output file
if (shouldWrite) {
  if (files.length) {
    for (let file in files) {
      fs.writeFileSync(files[file], wav.toBuffer());
    }
  }
}
