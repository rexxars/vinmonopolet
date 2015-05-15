'use strict';

var expect = require('chai').expect;
var number = require('../../src/filters/number');

describe('number filter', function() {
    it('returns null when input is an empty string', function() {
        expect(number('')).to.be.null;
    });

    it('handles commas and spaces after the norwegian number display rules', function() {
        expect(number('166,15')).to.equal(166.15);
        expect(number('1 337,17')).to.equal(1337.17);
    });

    it('can nullify given values', function() {
        expect(number.nullify(['moo'])('50')).to.equal(50);
        expect(number.nullify(['moo'])('moo')).to.equal(null);
    });
});
