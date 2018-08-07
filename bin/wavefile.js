#!/usr/bin/env node

/**
 * @fileoverview wavefile CLI.
 * @see https://github.com/rochars/wavefile
 */

const WaveFile = require('../dist/wavefile.umd.js');
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
if (process.argv[2] == '-h' || process.argv[2] == '--help' || process.argv.length < 4) {
  console.log(presentation);
  console.log(help);
  process.exit();
}

// Anything that is not a arg will be considered a file reference;
// the first item in the list will be considered the input, all
// others will be output
/** @type {Array<string>} */
let files = [];

// Anything that is not a file will be considered a command;
// All commands should be executed against the input file
/** @type {Array<string>} */
let commands = [];

// parse args
for (let arg=2; arg<process.argv.length; arg++) {
  if (process.argv[arg].slice(0, 1) == '-') {
    commands.push(process.argv[arg]);
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
  let splitCommand = commands[command].split("=");
  if (splitCommand[0] == '--bitdepth') {
    wav.toBitDepth(splitCommand[1]);
    shouldWrite = true;
  // --compress
  } else if (splitCommand[0] == '--compress') {
    if (splitCommand[1] == 'adpcm') {
      wav.toIMAADPCM();
      shouldWrite = true;
    } else if (splitCommand[1] == 'alaw') {
      wav.toALaw();
      shouldWrite = true;
    } else if (splitCommand[1] == 'mulaw') {
      wav.toMuLaw();
      shouldWrite = true;
    }
  // --tag
  } else if (splitCommand[0] == '--tag') {
    console.log(wav.getTag(splitCommand[1]));
  // --list-tag
  } else if (splitCommand[0] == '--list-tags') {
    tags = wav.listTags();
    for (var tag in tags) {
          if (tags.hasOwnProperty(tag)) {
             console.log(tag + ': ' + tags[tag]);
          }
      }
  // --list-cue
  } else if (splitCommand[0] == '--list-cue') {
    console.log(wav.listCuePoints());
  // --bits
  } else if (splitCommand[0] == '--bits') {
    if (wav.fmt.validBitsPerSample) {
      console.log(wav.fmt.validBitsPerSample);
    } else {
      console.log(wav.fmt.bitPerSample);
    }
  // --rate
  } else if (splitCommand[0] == '--rate') {
    console.log(wav.fmt.sampleRate);
  // error
  } else {
    console.log('ERROR: Bad option. Run wavefile -h to check the available options.');
    process.exit();
  }
}

// Write the output
if (shouldWrite) {
  if (files.length) {
    for (let file in files) {
      fs.writeFileSync(files[file], wav.toBuffer());
    }
  }
}
