'use strict';

var cheerio = require('cheerio');
var expect = require('chai').expect;
var extractor = require('../../src/extractors/food-pairings');

var validHtml = '<li><img src="/food/A.gif" title="Apertiff" alt="Apertiff" />';
validHtml += '&nbsp;<img src="/food/B.gif" title="Tapas" alt="Tapas" /></li>';

describe('food pairings extractor', function() {
    it('returns undefined for keys not found', function() {
        var $ = cheerio.load('<div><span></span></div>');
        var props = extractor($('span'), $);

        expect(Object.keys(props)).to.have.length(3);
        expect(props.Passertil01).to.be.an('undefined');
        expect(props.Passertil02).to.be.an('undefined');
        expect(props.Passertil03).to.be.an('undefined');
    });

    it('returns undefined for keys without title attribute', function() {
        var $ = cheerio.load('<li><img src="/food/A.gif" /></li>');
        var props = extractor($('li'), $);
        expect(Object.keys(props)).to.have.length(3);
        expect(props.Passertil01).to.be.an('undefined');
        expect(props.Passertil02).to.be.an('undefined');
        expect(props.Passertil03).to.be.an('undefined');
    });

    it('returns correct values for found matches', function() {
        var $ = cheerio.load(validHtml);
        var props = extractor($('li'), $);

        expect(Object.keys(props)).to.have.length(3);
        expect(props.Passertil01).to.equal('Apertiff');
        expect(props.Passertil02).to.equal('Tapas');
        expect(props.Passertil03).to.be.an('undefined');
    });
});
