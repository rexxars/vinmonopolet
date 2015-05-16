'use strict';

var expect = require('chai').expect;
var searchScraper = require('../../src/scrapers/search');
var Product = require('../../src/models/product');

describe('search scraper', function() {
    it('returns empty array if no products were not found', function(done) {
        searchScraper('foo', function(err, products, options) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(products).to.have.length(0);
            expect(options.totalPages).to.equal(1);
            done();
        });
    });

    it('returns product model instances for matches', function(done) {
        searchScraper(getValidHtml(), function(err, products, options) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(products).to.have.length(2);
            expect(products[0]).to.be.an.instanceOf(Product);
            expect(options.totalPages).to.equal(1);

            expect(products[1].sku).to.equal(2270002);
            expect(products[1].title).to.equal('Ego Brygghus Reign in Citra');
            expect(products[1].containerSize).to.equal(0.5);
            expect(products[1].price).to.equal(69.5);
            expect(products[1].pricePerLiter).to.equal(139);
            expect(products[1].availability).to.be.an('undefined');
            done();
        });
    });

    it('returns correct total page count', function(done) {
        searchScraper(getValidHtml({ paginator: true }), function(err, products, options) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(products).to.have.length(2);
            expect(products[0]).to.be.an.instanceOf(Product);
            expect(options.totalPages).to.equal(2);
            done();
        });
    });

    it('returns correct total page count when on last page already', function(done) {
        searchScraper(getValidHtml({ paginator: 'on-last' }), function(err, products, options) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(products).to.have.length(2);
            expect(products[0]).to.be.an.instanceOf(Product);
            expect(options.totalPages).to.equal(2);
            done();
        });
    });
});

function getValidHtml(opts) {
    var parts = [
        '<div><table id="productList"><tbody>',
        '  <tr><td><h3><a href="/3-horses/sku-109802">3 Horses Apple Malt Beverage</a></h3></td>',
        '  <td class="price">',
        '    <h3><em>(33&nbsp;cl)</em><br><strong>Kr. 1.109,90</strong></h3>',
        '    <p>Kr. 60,30 pr. liter</p>',
        '  </td></tr>',
        '  <tr>',
        '    <td><h3><a href="/ego/sku-2270002">Ego Brygghus Reign in Citra</a></h3></td>',
        '    <td class="price">',
        '      <h3><em>(50&nbsp;cl)</em><br><strong>Kr. 69,50</strong></h3>',
        '      <p>Kr. 139 pr. liter</p>',
        '    </td>',
        '  </tr>',
        '</tbody></table></div>'
    ];

    if (opts && opts.paginator) {
        parts = parts.concat(opts.paginator === 'on-last' ? [
            '<table class="pages">',
            '  <tr>',
            '    <td><strong>Viser 1-30 av <span class="count">56</span> varer sortert alfabetisk.',
            '    <a href="/sok?page=2">Sorter etter pris</a></strong></td>',
            '    <td><a href="/sok?page=1">&laquo; Forrige</a>',
            '      <a href="/sok?page=1">1</a><b>2</b></td>',
            '  </tr>',
            '</table>'
        ] : [
            '<table class="pages">',
            '  <tr>',
            '    <td><strong>Viser 1-30 av <span class="count">56</span> varer sortert alfabetisk.',
            '    <a href="/sok?page=1">Sorter etter pris</a></strong></td>',
            '    <td><b>1</b> <a href="/sok?page=2">2</a> <a href="/sok?page=2">Neste &raquo;</a></td>',
            '  </tr>',
            '</table>'
        ]);
    }

    return parts.join('\n');
}
