'use strict';

var assert = require('assert');
var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var vinmonopolet = require('../');
var domain = 'http://www.vinmonopolet.no';
var readFixture = function(file) {
    return fs.readFileSync(path.join(__dirname, 'fixtures', file), { encoding: 'utf8' });
};

var overviewPath = vinmonopolet.OVERVIEW_URL.replace(domain, '');
var overviewResponse = readFixture('overview-response.html');

var typesPath = vinmonopolet.TYPES_URL.replace(domain, '');
var typesResponse1 = readFixture('types-response-1.html');
var typesResponse2 = readFixture('types-response-2.html');
var typesResponse3 = readFixture('types-response-3.html');

var searchPath = vinmonopolet.SEARCH_URL.replace(domain, '');
var searchResponse1 = readFixture('search-response-1.html');
var searchResponse2 = readFixture('search-response-2.html');

var productPath = vinmonopolet.PRODUCT_URL.replace(domain, '');
var productResponse = readFixture('product-detail-response.html');

var mock;

describe('vinmonopolet (unit)', function() {
    beforeEach(function() {
        mock = require('nock')(domain);
    });

    afterEach(function() {
        mock.done();
    });

    describe('scrapers', function() {
        it('handles 404-error on category retrieval gracefully', function(done) {
            mock.get(overviewPath).reply(404);

            vinmonopolet.getCategories(function(err) {
                assert(err, 'should error on invalid response');
                done();
            });
        });

        it('interprets no found categories as error', function(done) {
            mock.get(overviewPath).reply(200, 'Invalid HTML');

            vinmonopolet.getCategories(function(err) {
                assert(err, 'should error on no categories');
                expect(err.message).to.equal('No categories found', 'should have correct error message');
                done();
            });
        });

        it('is able to extract categories on normal response', function(done) {
            mock.get(overviewPath).reply(200, overviewResponse);

            vinmonopolet.getCategories(function(err, categories) {
                expect(err).is.not.ok;

                // Found all categories?
                expect(categories).length.to.be(9);

                // Correct first and last title, count and filterId?
                if (categories.length >= 9) {
                    expect(categories[0].title).to.equal('Rødvin', 'should have correct category title');
                    expect(categories[0].productCount).to.equal(6033, 'should have correct category item count');
                    expect(categories[0].filterId).to.equal(25, 'should have correct category filter id');

                    expect(categories[8].title).to.equal('Alkoholfritt', 'should have correct category title');
                    expect(categories[8].productCount).to.equal(56, 'should have correct category item count');
                    expect(categories[8].filterId).to.equal(25, 'should have correct category filter id');
                }

                done();
            });
        });

        it('interprets no found types as null', function(done) {
            mock.get(typesPath + '&filterIds=25&filterValues=Hvitvin')
                .reply(200, typesResponse1);

            vinmonopolet.getTypesByFilters({ 25: 'Hvitvin' }, function(err, types) {
                expect(err).not.to.be.ok;
                expect(types).to.be.null;
                done();
            });
        });

        it('is able to extract types on normal response', function(done) {
            mock.get(typesPath + '&filterIds=25&filterValues=Brennevin')
                .reply(200, typesResponse2);

            vinmonopolet.getTypesByFilters({ 25: 'Brennevin' }, function(err, types) {
                expect(err).is.not.ok;

                // Found all types?
                expect(types).length.to.be(14);

                // Correct first and last title, count and filterId?
                if (types.length >= 9) {
                    expect(types[0].title).to.equal('Whisky', 'should have correct type title');
                    expect(types[0].productCount).to.equal(675, 'should have correct type item count');
                    expect(types[0].filterId).to.equal(26, 'should have correct type filter id');

                    expect(types[13].title).to.equal('Genever', 'should have correct type title');
                    expect(types[13].productCount).to.equal(3, 'should have correct type item count');
                    expect(types[8].filterId).to.equal(26, 'should have correct type filter id');
                }

                done();
            });
        });

        it('is able to extract subtypes on normal response', function(done) {
            mock.get(typesPath + '&filterIds=25;26&filterValues=Brennevin%3BWhisky')
                .reply(200, typesResponse3);

            vinmonopolet.getTypesByFilters({
                25: 'Brennevin',
                26: 'Whisky'
            }, function(err, types) {
                expect(err).is.not.ok;

                // Found only type?
                expect(types).length.to.be(1);

                // Correct title, count and filterId?
                expect(types[0].title).to.equal('Maltwhisky', 'should have correct type title');
                expect(types[0].productCount).to.equal(508, 'should have correct type count');
                expect(types[0].filterId).to.equal(27, 'should have correct type filter id');

                done();
            });
        });

        it('handles 404-error on product search retrieval gracefully', function(done) {
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(404);

            vinmonopolet.getProductsByFilters({ 25: 'Alkoholfritt' }, function(err) {
                assert(err, 'should error on invalid response');
                done();
            });
        });

        it('is able to extract products from a category', function(done) {
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(200, searchResponse1);
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(200, searchResponse1);
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=2').reply(200, searchResponse2);

            vinmonopolet.getProductsByFilters({ 25: 'Alkoholfritt' }, function(err, products) {
                expect(err).is.not.ok;

                // Found all products?
                expect(products).length.to.be(56, 'should find all products for filter');

                // Correct values for first and last product?
                if (products.length >= 56) {
                    expect(products[0].title).to.equal('3 Horses Apple Malt Beverage', 'should have correct product title');
                    expect(products[0].sku).to.equal(109802, 'should have correct product sku');
                    expect(products[0].containerSize).to.equal(0.33, 'should have correct product container size');
                    expect(products[0].price).to.equal(1109.9, 'should have correct product price');
                    expect(products[0].pricePerLiter).to.equal(60.3, 'should have correct product price per liter');

                    expect(products[55].title).to.equal('Weihenstephaner Hefeweissbier Alkoholfrei', 'should have correct product title');
                    expect(products[55].sku).to.equal(116502, 'should have correct product sku');
                    expect(products[55].containerSize).to.equal(0.5, 'should have correct product container size');
                    expect(products[55].price).to.equal(24.4, 'should have correct product price');
                    expect(products[55].pricePerLiter).to.equal(48.8, 'should have correct product price per liter');
                }

                done();
            });
        });

        it('handles 404-error on product information retrieval gracefully', function(done) {
            var sku = 9351702;
            mock.get(productPath + sku + vinmonopolet.PRODUCT_QUERY_PARAMS + sku).reply(404);

            vinmonopolet.getProduct(sku, function(err) {
                assert(err, 'should error on invalid response');
                done();
            });
        });

        it('is able to extract product info', function(done) {
            var sku = 9351702;
            mock.get(productPath + sku + vinmonopolet.PRODUCT_QUERY_PARAMS + sku).reply(200, productResponse);

            vinmonopolet.getProduct(sku, function(err, product) {
                expect(err).is.not.ok;

                expect(product.title).to.equal('Ægir Lynchburg Natt Barrel-Aged Imperial Porter', 'should have correct product title');
                expect(product.sku).to.equal(sku, 'should have correct product sku');
                expect(product.containerSize).to.equal(0.5, 'should have correct product container size');
                expect(product.price).to.equal(159.9, 'should have correct product price');
                expect(product.pricePerLiter).to.equal(319.8, 'should have correct product price per liter');
                expect(product.productType).to.equal('Overgjæret', 'should have correct product type');
                expect(product.productSelection).to.equal('Bestillingsutvalg', 'should have correct product selection');
                expect(product.storeCategory).to.equal('Uavhengig sortiment', 'should have correct store category');
                expect(product.color).to.equal('Mørk', 'should have correct product color');
                expect(product.aroma).to.equal('Kaffe, mørkt malt, fat, whisky, noe vanilje.', 'should have correct product aroma');
                expect(product.taste).to.equal('God fylde og bitterhet, kaffe, sjokolade og noe fat, lang avslutning.');
                expect(product.foodPairings).to.include.members(['Apertiff'], 'should have correct food pairings');
                expect(product.country).to.equal('Norge', 'should have correct product country');
                expect(product.region).to.equal('Øvrige', 'should have correct product region');
                expect(product.ingredients).to.equal('Maltet bygg, humle, gjær, vann', 'should have correct product ingredients');
                expect(product.abv).to.equal(10.01, 'should have correct product alcohol percentage');
                expect(product.sugar).to.equal(19.3, 'should have correct product sugar info');
                expect(product.acid).to.equal(6, 'should have correct product acid info');
                expect(product.storable).to.equal('Drikkeklar nå, men kan også lagres', 'should have correct product storage info');
                expect(product.manufacturer).to.equal('Ægir Bryggeri', 'should have correct product manufacturer');
                expect(product.wholesaler).to.equal('Cask Norway AS', 'should have correct product wholesaler');
                expect(product.distributor).to.equal('SKANLOG VSD AS', 'should have correct product distributor');
                expect(product.containerType).to.equal('Engangsflasker av glass', 'should have correct product container type');

                done();
            });
        });

        it('is able to extract availability for product', function(done) {
            var sku = 9351702;
            mock.get(productPath + sku + vinmonopolet.PRODUCT_QUERY_PARAMS + sku).reply(200, productResponse);

            vinmonopolet.getProduct(sku, function(err, product) {
                expect(err).is.not.ok;

                var availability = product.availability;
                expect(availability).length.to.be(8, 'should find all stores');

                if (availability.length > 7) {
                    expect(availability[0].storeName).to.equal('Molde Vinmonopol', 'should find correct store name');
                    expect(availability[0].storeId).to.equal(244, 'should find correct store id');
                    expect(availability[0].quantity).to.equal(32, 'should find correct product quantity');

                    expect(availability[7].storeName).to.equal('Voss Vinmonopol', 'should find correct store name');
                    expect(availability[7].storeId).to.equal(298, 'should find correct store id');
                    expect(availability[7].quantity).to.equal(18, 'should find correct product quantity');
                }

                done();
            });
        });
    });
});
