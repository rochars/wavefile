/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2020 Rafael da Silva Rocha. MIT License.
 *
 * Test the functions from lib/truncate-samples.js.
 * 
 */

const assert = require("assert");
const truncateIntSamples = require('../../lib/truncate-samples').truncateIntSamples;

describe("Truncate int samples", function() {
    
	it("should truncate 8-bit samples", function() {
        let samples = new Float64Array([-1, 256]);
    	truncateIntSamples(samples, 8);
        assert.deepEqual(samples, new Float64Array([0, 255]));
    });    

    it("should truncate 16-bit samples", function() {
        let samples = new Float64Array([-40000, 32777]);
    	truncateIntSamples(samples, 16);
        assert.deepEqual(samples, new Float64Array([-32768, 32767]));
    });    
});
