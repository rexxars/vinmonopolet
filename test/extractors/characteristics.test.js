'use strict';

var cheerio = require('cheerio');
var expect = require('chai').expect;
var extractor = require('../../src/extractors/characteristics');

describe('characteristics extractor', function() {
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

    it('returns an empty object if img contains no src attribute', function() {
        var html = '<div><span class="facet"><em>Fylde:</em><img /></span></div>';

        var $ = cheerio.load(html);
        var props = extractor($('div'), $);
        expect(Object.keys(props)).to.have.length(0);
    });

    it('returns all facets found on valid markup', function() {
        var html = '<div><span class="facet"><em>Fylde:</em><img src="/img/clocks/10.gif"/></span>';
        html += '<span class="facet"><em>S&oslash;dme:</em><img src="/img/clocks/6.gif"/></span></div>';
        var $ = cheerio.load(html);
        var props = extractor($('div'), $);

        expect(Object.keys(props)).to.have.length(2);
        expect(props.Fylde).to.equal('10');
        expect(props['Sødme']).to.equal('6');
    });
});
