import { strict as assert } from 'assert';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { WaveFileCreator } from '../../lib/wavefile-creator.js';

const cliPath = 'bin/wavefile.js'

function stripAnsiColors(str) {
  return str.replace(/\x1B\[[0-9;]*[JKmsu]/g, '');
}

describe('WaveFile CLI', () => {
  const inputFile = 'input.wav';
  const outputFile = 'output.wav';

  // Helper function to create a dummy WAV file
  function createDummyWavFile(filename, sampleRate = 44100) {
    const wav = new WaveFileCreator();
    wav.fromScratch(1, sampleRate, '16', [0, 1, -32768, 32767]);

    fs.writeFileSync(filename, wav.toBuffer());
  }

  beforeEach(() => {
    createDummyWavFile(inputFile);
  });

  afterEach(() => {
    if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  });

  it('should display help when run with --help', () => {
    const result = execSync(`node ${cliPath} --help`)
    console.log(result);
    assert(result.includes('WaveFile 8.1.0'));
    assert(result.includes('Usage:'));
    assert(result.includes('Available options:'));
  });

  it('should change sample rate', () => {
    execSync(`node ${cliPath} ${inputFile} --resample=22050 ${outputFile}`);
    assert(fs.existsSync(outputFile));

    const result = stripAnsiColors(execSync(`node ${cliPath} ${outputFile} --rate`).toString().trim());
    assert.equal(result, '22050');
  });

  it('should list tags when --list-tags is used', () => {
    const result = execSync(`node ${cliPath} ${inputFile} --list-tags`).toString();
    // The dummy file doesn't have tags, so the result should be empty
    assert.equal(result.trim(), '');
  });

  it('should handle errors gracefully', () => {
    try {
      execSync(`node ${cliPath} ${inputFile} --invalid-option`);
    } catch (error) {
      assert(error.stderr.toString().includes('ERROR: Bad option'));
    }
  });
});