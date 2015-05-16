'use strict';

var expect = require('chai').expect;
var categoryScraper = require('../../src/scrapers/category');
var Category = require('../../src/models/category');

describe('category scraper', function() {
    it('returns error if no categories were found', function(done) {
        categoryScraper('foo', function(err) {
            expect(err).to.be.an.instanceOf(Error);
            done();
        });
    });

    it('returns error if links had no href', function(done) {
        var html = '<div><h3 class="title"><a name="moo">Øl (<em>501</em>)</a></h3></div>';

        categoryScraper(html, function(err) {
            expect(err).to.be.an.instanceOf(Error);
            done();
        });
    });

    it('returns valid results for valid markup', function(done) {
        var html = '<div><h3 class="title"><a href="blah?filterIds=25;36ah">Øl (<em>501</em>)</a></h3>';
        html += '<h3 class="title"><a href="blah?filterIds=88;36ah">Vin (<em>12135</em>)</a></h3></div>';

        categoryScraper(html, function(err, results) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(results).to.have.length(2);
            expect(results[0]).to.be.an.instanceOf(Category);
            expect(results[1]).to.be.an.instanceOf(Category);
            done();
        });
    });
});
