'use strict';

var expect = require('chai').expect;
var clockToPercentage = require('../../src/filters/clock-to-percentage');

describe('clock-to-percentage filter', function() {
    it('returns null if input is not a number (NaN)', function() {
        expect(clockToPercentage('moo')).to.be.null;
    });

    it('returns null if input is 0', function() {
        expect(clockToPercentage(0)).to.be.null;
    });

    it('limits percentage between 0 and 100', function() {
        expect(clockToPercentage(-15)).to.equal(0);
        expect(clockToPercentage(1337)).to.equal(100);
    });

    it('gives correct output for the defined range', function() {
        expect(clockToPercentage(1)).to.equal(8);
        expect(clockToPercentage(2)).to.equal(17);
        expect(clockToPercentage(3)).to.equal(25);
        expect(clockToPercentage(4)).to.equal(33);
        expect(clockToPercentage(5)).to.equal(42);
        expect(clockToPercentage(6)).to.equal(50);
        expect(clockToPercentage(7)).to.equal(58);
        expect(clockToPercentage(8)).to.equal(67);
        expect(clockToPercentage(9)).to.equal(75);
        expect(clockToPercentage(10)).to.equal(83);
        expect(clockToPercentage(11)).to.equal(92);
        expect(clockToPercentage(12)).to.equal(100);
    });
});
