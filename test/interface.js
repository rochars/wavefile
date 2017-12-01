/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require("assert");

describe("interface", function() {

    let WaveFile = require("../index.js");
    
    it("Should create a WaveFile object", function() {
        assert.ok(new WaveFile());
    });
});
