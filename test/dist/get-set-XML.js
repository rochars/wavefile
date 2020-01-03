/**
 * WaveFile: https://github.com/rochars/wavefile
 * Copyright (c) 2017-2020 Rafael da Silva Rocha. MIT License.
 *
 * Test getting and setting XML chunks.
 * 
 */

const fs = require("fs");
var assert = assert || require('assert');
const WaveFile = require("../loader.js");
const path = "./test/files/";

describe('Get and set iXML chunks', function() {
    
    it("getiXML() should return the value of the iXML chunk", function () {
        let wav = new WaveFile();
        wav.iXML.chunkId = 'iXML';
        wav.iXML.value = '<ixml/>';
        assert.equal(wav.getiXML(), '<ixml/>');
    });

    it("setiXML() should set the iXML chunkId to 'iXML", function () {
        let wav = new WaveFile();
        wav.setiXML('<ixml/>');
        assert.equal(wav.iXML.chunkId, 'iXML');
    });

    it("setiXML() should thorw TypeError if value is a number", function () {
        assert.throws(function() {
            let wav = new WaveFile();
            wav.setiXML(1);
        }, TypeError);
    });
});

describe('Get and set _PMX chunks', function() {
    
    it("get_PMX() should return the value of the _PMX chunk", function () {
        let wav = new WaveFile();
        wav._PMX.chunkId = '_PMX';
        wav._PMX.value = '<_PMX/>';
        assert.equal(wav.get_PMX(), '<_PMX/>');
    });

    it("set_PMX() should set the _PMX chunkId to '_PMX", function () {
        let wav = new WaveFile();
        wav.set_PMX('<_PMX/>');
        assert.equal(wav._PMX.chunkId, '_PMX');
    });

    it("set_PMX() should thorw TypeError if value is a number", function () {
        assert.throws(function() {
            let wav = new WaveFile();
            wav.set_PMX(1);
        }, TypeError);
    });
});
