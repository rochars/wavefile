# Roadmap

This document outlines the development plan from a high level and will be updated as progress is made.

Please feel free to file issues on this repository if you have questions, concerns or suggestions.

See [CONTRIBUTING.md](CONTRIBUTING.md) for information about how to contribute to this project.

## Planned features
Items in this list should not require a major version update.
- Handle "file" chunks
- Handle "wavl" and "slnt" chunks
- Handle "plst" (playlist) chunks
- Handle "inst" (instrument) chunk
- Change the sample rate of the audio
- Handle ID3 tags
- Handle RF64 (fully)
- Handle Wave64
- Convert mono to stereo and stereo to mono
- Concat two or more wave files

## Planned changes
Items in this list may require a major version update.

### Make it easier to manipulate the samples in a WaveFile object

### Better handling of cue points and their labels
Cue points (and associated data) currently need to be referenced by the point index (the dwName property), but the index of the points may change if a point is created or removed. This is unpractical and should be better.

### The bitDepth param should describe only the bit depth
The bitDepth param on methods like WaveFile.fromScratch() is a string used for 3 things:
- Inform the bit depth of the audio
- Inform the compression, if any
- Inform if the samples are floating point in cases where they could be int or float

This is why the bitDepth param is a string. It should be a number describing only the bit depth. Information about compression type or if the samples are int or float should be described apart from the bit depth of the audio.

## Chores

### Cross-browser tests
Automate cross-browser tests and add browser compatibility badge to README.

### Fix the name of test wav files
Update the name of the files in *test/files/* so they all follow the naming convention described in [CONTRIBUTING.md](CONTRIBUTING.md).

### Unit testing
The current test suite is actually a high level test suite aimed to run against the minified dist file - as a consequence, it only tests public methods and properties. There should be a test suite aimed at the source files to test all aspects of the WaveFile class.
