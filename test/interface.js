/*!
 * Wavefile
 * Copyright (c) 2017 Rafael da Silva Rocha.
 * 
 */

var assert = require("assert");

describe("interface", function() {

    let wavefile = require("../index.js");
    
    it("Should create a Wavefile object", function() {
        let wav = new wavefile.Wavefile();
        assert.ok(wav);
    });
});
