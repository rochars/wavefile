/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require("assert");

describe("interface", function() {

    const WaveFile = require("../test/loader.js");
    
    it("Should create a WaveFile object", function() {
        assert.ok(new WaveFile());
    });
});
