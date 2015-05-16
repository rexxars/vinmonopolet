'use strict';

var expect = require('chai').expect;
var typesScraper = require('../../src/scrapers/types');
var Type = require('../../src/models/type');

describe('types scraper', function() {
    it('returns null as results if no results were found', function(done) {
        typesScraper('foo', function(err, types) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(types).to.equal(null);
            done();
        });
    });

    it('returns correct types on valid markup', function(done) {
        typesScraper(getValidHtml(), function(err, types) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(types).to.have.length(2);
            expect(types[0]).to.be.an.instanceOf(Type);

            expect(types[0].title).to.equal('Stout');
            expect(types[0].productCount).to.equal(913);
            expect(types[0].filterId).to.equal(37);

            expect(types[1].title).to.equal('IPA');
            expect(types[1].productCount).to.equal(1318);
            expect(types[1].filterId).to.equal(42);
            done();
        });
    });
});

function getValidHtml() {
    return [
        '<div class="content"><ul class="facet">',
        '  <li><a href="blah?filterIds=13;37">Stout</a><em>(913)</em></li>',
        '  <li><a href="blah?filterIds=19;42">IPA</a><em>(1318)</em></li>',
        '</ul></div>'
    ].join('\n');
}
