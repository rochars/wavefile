/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2018 Rafael da Silva Rocha. MIT License.
 *
 * Test the functions from lib/parsers/base64-arraybuffer.js
 * 
 */

import '../loader.js';
import assert from 'node:assert'
import * as base64ArrayBuffer from '../../lib/parsers/base64-arraybuffer.js';

describe('Test the lib/base64-arraybuffer module',
        function() {

    it("should export a encode function", function() {
        assert.equal(typeof base64ArrayBuffer.encode, 'function');
    });
    it("should export a decode function", function() {
        assert.equal(typeof base64ArrayBuffer.decode, 'function');
    });

    it("encode byte len = 6", function() {
        assert.equal(base64ArrayBuffer.encode([1,1]), 'AQE=');
    });
});