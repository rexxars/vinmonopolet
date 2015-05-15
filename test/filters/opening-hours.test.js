'use strict';

var expect = require('chai').expect;
var openingHours = require('../../src/filters/opening-hours');

describe('opening-hours filter', function() {
    it('returns null when input is "Stengt" (closed)', function() {
        expect(openingHours('Stengt')).to.be.null;
        expect(openingHours('stengt')).to.be.null;
    });

    it('transforms military clock to minutes from midnight', function() {
        expect(openingHours('1300 - 1900').opens).to.equal(780);
        expect(openingHours('1300 - 1900').closes).to.equal(1140);
        expect(openingHours('1000 - 1800').opens).to.equal(600);
        expect(openingHours('1000 - 1800').closes).to.equal(1080);
        expect(openingHours('0700 - 0900').opens).to.equal(420);
        expect(openingHours('0700 - 0900').closes).to.equal(540);
        expect(openingHours('0719 - 0959').closes).to.equal(599);
        expect(openingHours('0719 - 2359').closes).to.equal(1439);
    });
});
