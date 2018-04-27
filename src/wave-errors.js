/*
 * WAVE_ERRORS
 * Error messages.
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

/**
 * Error messages.
 * @enum {string}
 */
module.exports =  {
    "format": "Not a supported format.",
    "wave": "Could not find the 'WAVE' format identifier",
    "fmt ": "Could not find the 'fmt ' chunk",
    "data": "Could not find the 'data' chunk",
    "fact": "Could not find the 'fact' chunk",
    "bitDepth": "Invalid bit depth.",
    "numChannels": "Invalid number of channels.",
    "sampleRate": "Invalid sample rate."
};