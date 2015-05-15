'use strict';

var expect = require('chai').expect;
var volume = require('../../src/filters/volume');

describe('volume filter', function() {
    it('returns null when input is an empty string', function() {
        expect(volume('')).to.be.null;
    });

    it('returns numbers as-is', function() {
        expect(volume(13.37)).to.equal(13.37);
        expect(volume(19)).to.equal(19);
    });

    it('handles ml', function() {
        expect(volume('200ml')).to.equal(0.2);
        expect(volume('20 ml')).to.equal(0.02);

        expect(volume('208ml')).to.equal(0.208);
        expect(volume('207 ml')).to.equal(0.207);
    });

    it('handles cl', function() {
        expect(volume('20cl')).to.equal(0.2);
        expect(volume('2 cl')).to.equal(0.02);

        expect(volume('13.37cl')).to.be.closeTo(0.1337, 0.0005);
        expect(volume('3.37 cl')).to.equal(0.0337);
    });

    it('handles dl', function() {
        expect(volume('20dl')).to.equal(2);
        expect(volume('2dl')).to.equal(0.2);

        expect(volume('20.31dl')).to.be.closeTo(2.031, 0.001);
        expect(volume('2.31dl')).to.equal(0.231);
    });

    it('handles liters', function() {
        expect(volume('2l')).to.equal(2);
        expect(volume('2 l')).to.equal(2);

        expect(volume('3liter')).to.equal(3);
        expect(volume('3 liter')).to.equal(3);

        expect(volume('3.51liter')).to.equal(3.51);
        expect(volume('3.51 liter')).to.equal(3.51);
    });
});
