'use strict';

var expect = require('chai').expect;
var extractor = require('../../src/extractors/region');

describe('region extractor', function() {
    it('returns empty object if no parts were found', function() {
        var props = extractor('');

        expect(Object.keys(props)).to.have.length(0);
    });

    it('returns only country if only one part is specified', function() {
        var props = extractor('  \nNorway ');
        expect(Object.keys(props)).to.have.length(1);
        expect(props.Land).to.equal('Norway');
    });

    it('returns country and region if two parts are specified', function() {
        var props = extractor('  \nNorway,Kristiansand ');
        expect(Object.keys(props)).to.have.length(2);
        expect(props.Land).to.equal('Norway');
        expect(props.Distrikt).to.equal('Kristiansand');
    });

    it('returns country, region and subregion if three parts are specified', function() {
        var props = extractor('  \nNorway,Kristiansand, Søm ');
        expect(Object.keys(props)).to.have.length(3);
        expect(props.Land).to.equal('Norway');
        expect(props.Distrikt).to.equal('Kristiansand');
        expect(props.Underdistrikt).to.equal('Søm');
    });
});
