/**
* WaveFile: https://github.com/rochars/wavefile
* Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
*
* Tests for sample rate conversion, nearest point method.
* 
*/

const assert = require('assert');
const fs = require("fs");
const WaveFile = require("../../test/loader.js");
const path = "./test/files/";

console.log('point');

let hrstart = process.hrtime();

// Chirps, FP

describe('Downsample a 32-bit 44.1kHz log sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "32fp-44100Hz-mono-chirp-1-22050-log.wav"));

  // Convert to another sample rate
  wav.toSampleRate(16000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-32fp-16000Hz-mono-chirp-1-22050-log.wav",
    wav.toBuffer());
});

describe('Upsample a 32-bit 44.1kHz log sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "32fp-44100Hz-mono-chirp-1-22050-log.wav"));

  // Convert to another sample rate
  wav.toSampleRate(96000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-32fp-96000Hz-mono-chirp-1-22050-log.wav",
    wav.toBuffer());
});

describe('Downsample a 32-bit 44.1kHz linear sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "32fp-44100Hz-mono-chirp-1-22050-linear.wav"));

  // Convert to another sample rate
  wav.toSampleRate(16000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-32fp-16000Hz-mono-chirp-1-22050-linear.wav",
    wav.toBuffer());
});

describe('Upsample a 32-bit 44.1kHz linear sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "32fp-44100Hz-mono-chirp-1-22050-linear.wav"));

  // Convert to another sample rate
  wav.toSampleRate(96000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-32fp-96000Hz-mono-chirp-1-22050-linear.wav",
    wav.toBuffer());
});

// Chirps, int

describe('Downsample a 16-bit 44.1kHz log sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "16bit-44100Hz-mono-chirp-1-22050-log.wav"));

  // Convert to another sample rate
  wav.toSampleRate(16000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-16bit-16000Hz-mono-chirp-1-22050-log.wav",
    wav.toBuffer());
});

describe('Upsample a 16-bit 44.1kHz log sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "16bit-44100Hz-mono-chirp-1-22050-log.wav"));

  // Convert to another sample rate
  wav.toSampleRate(96000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-16bit-96000Hz-mono-chirp-1-22050-log.wav",
    wav.toBuffer());
});

describe('Downsample a 16-bit 44.1kHz linear sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "16bit-44100Hz-mono-chirp-1-22050-linear.wav"));

  // Convert to another sample rate
  wav.toSampleRate(16000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-16bit-16000Hz-mono-chirp-1-22050-linear.wav",
    wav.toBuffer());
});

describe('Upsample a 16-bit 44.1kHz linear sine sweep', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "16bit-44100Hz-mono-chirp-1-22050-linear.wav"));

  // Convert to another sample rate
  wav.toSampleRate(96000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-16bit-96000Hz-mono-chirp-1-22050-linear.wav",
    wav.toBuffer());
});

// Songs

describe('Downsample a 16bit 44.1kHz file', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "song1.wav"));

  // Convert to another sample rate
  wav.toSampleRate(16000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-song1-16kHz.wav",
    wav.toBuffer());
});

describe('Upsample a 16bit 44.1kHz file', function() {
  // Read a 8kHz wav 
  let wav = new WaveFile(
    fs.readFileSync(path + "song1.wav"));

  // Convert to another sample rate
  wav.toSampleRate(96000, {method: 'point', LPF: true, LPFType: 'FIR'});

  // Write the file
  fs.writeFileSync(
    path + "/out/to-sample-rate/point-song1-96kHz.wav",
    wav.toBuffer());
});

hrend = process.hrtime(hrstart);
console.info('%ds %dms', hrend[0], hrend[1] / 1000000);
