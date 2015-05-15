'use strict';

var expect = require('chai').expect;
var price = require('../../src/filters/price');

describe('price filter', function() {
    it('handles Kr prefix', function() {
        expect(price('Kr. 337')).to.equal(337);
        expect(price('Kr.337')).to.equal(337);
    });

    it('handles ,- postfix', function() {
        expect(price('337,-')).to.equal(337);
    });

    it('handles commas and punctuation after the norwegian price display rules', function() {
        expect(price('1.337.866,15')).to.equal(1337866.15);
        expect(price('1 337')).to.equal(1337);
    });

    it('handles trailing text', function() {
        expect(price('Kr. 48,80\n pr. liter')).to.equal(48.80);
    });

    it('handles everything combined', function() {
        expect(price('Kr. 1.337.866,15,-')).to.equal(1337866.15);
        expect(price('Kr.337,-')).to.equal(337);
    });
});
