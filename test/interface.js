/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/wavefile
 *
 */

var assert = require("assert");

describe("interface", function() {

    const WaveFile = require("../test/loader.js");
    
    it("Should create a WaveFile object", function() {
        assert.ok(new WaveFile());
    });
});
