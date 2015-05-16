'use strict';

var cheerio = require('cheerio');
var expect = require('chai').expect;
var extractor = require('../../src/extractors/contents');

var validHtml = '<li><strong class="attrib">Innhold:</strong> ';
validHtml += '<span class="facet">Alkohol 10,01%</span> ';
validHtml += '<span class="facet">Sukker: 19,30 g/l</span> ';
validHtml += '<span class="facet">Syre: 6,00 g/l</span></li>';

describe('contents extractor', function() {
    it('returns an empty object if no facets were found', function() {
        var $ = cheerio.load('<div><span></span></div>');
        var props = extractor($('span'), $);
        expect(Object.keys(props)).to.have.length(0);
    });

    it('returns an empty object if facet contained no recognizable elements', function() {
        var $ = cheerio.load('<div><span class="facet"></span></div>');
        var props = extractor($('div'), $);
        expect(Object.keys(props)).to.have.length(0);
    });

    it('returns all content elements found on valid markup', function() {
        var $ = cheerio.load(validHtml);
        var props = extractor($('li'), $);

        expect(Object.keys(props)).to.have.length(3);
        expect(props.Alkohol).to.equal('10,01%');
        expect(props.Sukker).to.equal('19,30');
        expect(props.Syre).to.equal('6,00');
    });
});
