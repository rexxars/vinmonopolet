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
var queryResponse1 = readFixture('search-query-response-1.html');
var queryResponse2 = readFixture('search-query-response-2.html');
var queryResponse3 = readFixture('search-query-response-3.html');

var ricSearchResponse = readFixture('ric-search-response.html');
var ricDetailResponse = readFixture('ric-detail-response.html');

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

            vinmonopolet.searchProducts({ filters: { 25: 'Alkoholfritt' } }, function(err) {
                assert(err, 'should error on invalid response');
                done();
            });
        });

        it('is able to extract products from a category', function(done) {
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(200, searchResponse1);
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(200, searchResponse1);
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=2').reply(200, searchResponse2);

            vinmonopolet.searchProducts({ filters: { 25: 'Alkoholfritt' } }, function(err, products) {
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

        it('is able to extract products from a search result', function(done) {
            mock.get(searchPath + '?query=brygghus&sort=2&sortMode=0&countresult=true&page=1').reply(200, queryResponse1);
            mock.get(searchPath + '?query=brygghus&sort=2&sortMode=0&countresult=true&page=1').reply(200, queryResponse1);
            mock.get(searchPath + '?query=brygghus&sort=2&sortMode=0&countresult=true&page=2').reply(200, queryResponse2);
            mock.get(searchPath + '?query=brygghus&sort=2&sortMode=0&countresult=true&page=3').reply(200, queryResponse3);

            vinmonopolet.searchProducts({ query: 'brygghus' }, function(err, products) {
                expect(err).is.not.ok;

                // Found all products?
                expect(products).length.to.be(72, 'should find all products for query');

                // Correct values for result on first and last page?
                if (products.length >= 72) {
                    expect(products[25].title).to.equal('Ego Brygghus Reign in Citra', 'should have correct product title');
                    expect(products[25].sku).to.equal(2270002, 'should have correct product sku');
                    expect(products[25].containerSize).to.equal(0.5, 'should have correct product container size');
                    expect(products[25].price).to.equal(69.5, 'should have correct product price');
                    expect(products[25].pricePerLiter).to.equal(139, 'should have correct product price per liter');

                    expect(products[71].title).to.equal('Thy økologisk humle', 'should have correct product title');
                    expect(products[71].sku).to.equal(1757202, 'should have correct product sku');
                    expect(products[71].containerSize).to.equal(0.33, 'should have correct product container size');
                    expect(products[71].price).to.equal(41.7, 'should have correct product price');
                    expect(products[71].pricePerLiter).to.equal(126.4, 'should have correct product price per liter');
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

        it('can use the getProductsByCategoryName() alias for easy search within category', function(done) {
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(404);

            vinmonopolet.getProductsByCategoryName('Alkoholfritt', function(err) {
                assert(err, 'should error on invalid response');
                done();
            });
        });

        it('is able to extract products from a category', function(done) {
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(200, searchResponse1);
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=1').reply(200, searchResponse1);
            mock.get(searchPath + '?query=*&sort=2&sortMode=0&filterIds=25&filterValues=Alkoholfritt&page=2').reply(200, searchResponse2);

            vinmonopolet.searchProducts({ filters: { 25: 'Alkoholfritt' } }, function(err, products) {
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

        it('is able to extract detailed product info from a search', function(done) {
            var sku = 2270002;
            mock.get(searchPath + '?query=Reign%20in%20Citra&sort=2&sortMode=0&countresult=true&page=1').reply(200, ricSearchResponse);
            mock.get(searchPath + '?query=Reign%20in%20Citra&sort=2&sortMode=0&countresult=true&page=1').reply(200, ricSearchResponse);
            mock.get(productPath + sku + vinmonopolet.PRODUCT_QUERY_PARAMS + sku).reply(200, ricDetailResponse);

            vinmonopolet.searchProducts({ query: 'Reign in Citra', detailed: true }, function(err, products) {
                expect(err).to.not.be.an.instanceOf(Error);

                // Found all products?
                expect(products).length.to.be(1, 'should find just one product for search');

                expect(products[0].title).to.equal('Ego Brygghus Reign in Citra', 'should have correct product title');
                expect(products[0].sku).to.equal(sku, 'should have correct product sku');
                expect(products[0].containerSize).to.equal(0.5, 'should have correct product container size');
                expect(products[0].price).to.equal(69.50, 'should have correct product price');
                expect(products[0].pricePerLiter).to.equal(139, 'should have correct product price per liter');
                expect(products[0].fullness).to.equal(58, 'should have correct product fullness');
                expect(products[0].availability).to.have.length(7, 'should have correct product availability info');

                done();
            });
        });

        it('is returns error if detailed info retrieval fails for a search', function(done) {
            var sku = 2270002;
            mock.get(searchPath + '?query=Reign%20in%20Citra&sort=2&sortMode=0&countresult=true&page=1').reply(200, ricSearchResponse);
            mock.get(searchPath + '?query=Reign%20in%20Citra&sort=2&sortMode=0&countresult=true&page=1').reply(200, ricSearchResponse);
            mock.get(productPath + sku + vinmonopolet.PRODUCT_QUERY_PARAMS + sku).reply(404);

            vinmonopolet.searchProducts({ query: 'Reign in Citra', detailed: true }, function(err) {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
        });

        it('is returns error if an error occurs during retrieval of search results', function(done) {
            mock.get(searchPath + '?query=Reign%20in%20Citra&sort=2&sortMode=0&countresult=true&page=1').reply(200, ricSearchResponse);
            mock.get(searchPath + '?query=Reign%20in%20Citra&sort=2&sortMode=0&countresult=true&page=1').reply(503, 'Server error');

            vinmonopolet.searchProducts({ query: 'Reign in Citra', detailed: true }, function(err) {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
        });

        it('can get whole category tree', function(done) {
            var overview = [
                '<div><h3 class="title"><a href="/sok?filterIds=25">R&oslash;dvin</a> <em>(6033)</em></h3>',
                '<h3 class="title"><a href="/sok?filterIds=25">Brennevin</a> <em>(2438)</em></h3></div>'
            ].join('');

            var liquor = [
                '<div class="content"><div class="facet"><ul><li>',
                '<a href="/sok?filterIds=25;26&amp;filterValues=Brennevin%3BWhisky">Whisky</a>',
                '&nbsp;<em>(675)</em></li></ul></div></div>'
            ].join('');

            mock.get(overviewPath).reply(200, overview);
            mock.get(typesPath + '&filterIds=25&filterValues=R%C3%B8dvin').reply(200, typesResponse1);
            mock.get(typesPath + '&filterIds=25&filterValues=Brennevin').reply(200, liquor);
            mock.get(typesPath + '&filterIds=25;26&filterValues=Brennevin%3BWhisky').reply(200, typesResponse3);
            mock.get(typesPath + '&filterIds=25;26;27&filterValues=Brennevin%3BWhisky%3BMaltwhisky').reply(200, '');

            vinmonopolet.getCategoryTree(function(err, tree) {
                expect(err).not.to.be.an.instanceOf(Error);

                // Root level
                expect(tree[0].title).to.equal('Rødvin');
                expect(tree[0].filterId).to.equal(25);
                expect(tree[0].productCount).to.equal(6033);

                expect(tree[1].title).to.equal('Brennevin');
                expect(tree[1].filterId).to.equal(25);
                expect(tree[1].productCount).to.equal(2438);

                // Types within brennevin
                expect(tree[1].types).to.have.length(1);
                expect(tree[1].types[0].title).to.equal('Whisky', 'should have correct type title');
                expect(tree[1].types[0].productCount).to.equal(675, 'should have correct type item count');
                expect(tree[1].types[0].filterId).to.equal(26, 'should have correct type filter id');

                // Subtypes within whisky
                expect(tree[1].types[0].subtypes).to.have.length(1);

                // Correct title, count and filterId?
                expect(tree[1].types[0].subtypes[0].title).to.equal('Maltwhisky', 'should have correct type title');
                expect(tree[1].types[0].subtypes[0].productCount).to.equal(508, 'should have correct type count');
                expect(tree[1].types[0].subtypes[0].filterId).to.equal(27, 'should have correct type filter id');
                expect(tree[1].types[0].subtypes[0].subtypes).to.be.an('undefined');

                done();
            });
        });

        it('returns error if request to fetch root-level categories failed', function(done) {
            mock.get(overviewPath).reply(503, 'Server error');
            vinmonopolet.getCategoryTree(function(err) {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
        });

        it('returns error if a request for a type in the chain fails', function(done) {
            var overview = [
                '<div><h3 class="title"><a href="/sok?filterIds=25">R&oslash;dvin</a> <em>(6033)</em></h3>',
                '<h3 class="title"><a href="/sok?filterIds=25">Brennevin</a> <em>(2438)</em></h3></div>'
            ].join('');

            mock.get(overviewPath).reply(200, overview);
            mock.get(typesPath + '&filterIds=25&filterValues=R%C3%B8dvin').reply(200, typesResponse1);
            mock.get(typesPath + '&filterIds=25&filterValues=Brennevin').reply(503, 'Server error');

            vinmonopolet.getCategoryTree(function(err) {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
        });

        it('returns error if a request for a subtype in the chain fails', function(done) {
            var overview = [
                '<div><h3 class="title"><a href="/sok?filterIds=25">R&oslash;dvin</a> <em>(6033)</em></h3>',
                '<h3 class="title"><a href="/sok?filterIds=25">Brennevin</a> <em>(2438)</em></h3></div>'
            ].join('');

            var liquor = [
                '<div class="content"><div class="facet"><ul><li>',
                '<a href="/sok?filterIds=25;26&amp;filterValues=Brennevin%3BWhisky">Whisky</a>',
                '&nbsp;<em>(675)</em></li></ul></div></div>'
            ].join('');

            mock.get(overviewPath).reply(200, overview);
            mock.get(typesPath + '&filterIds=25&filterValues=R%C3%B8dvin').reply(200, typesResponse1);
            mock.get(typesPath + '&filterIds=25&filterValues=Brennevin').reply(200, liquor);
            mock.get(typesPath + '&filterIds=25;26&filterValues=Brennevin%3BWhisky').reply(200, typesResponse3);
            mock.get(typesPath + '&filterIds=25;26;27&filterValues=Brennevin%3BWhisky%3BMaltwhisky').reply(503);

            vinmonopolet.getCategoryTree(function(err) {
                expect(err).to.be.an.instanceOf(Error);
                done();
            });
        });
    });
});
