'use strict';

var assert = require('assert');
var expect = require('chai').expect;
var vinmonopolet = require('../');
var existingSku, productDetails;
var integrationEnabled = (
    process.env.CONTINUOUS_INTEGRATION ||
    process.env.INTEGRATION_TESTS_ENABLED
);

var describ = integrationEnabled ? describe : describe.skip;

describ('vinmonopolet (integration)', function() {
    describe('scrapers', function() {
        it('is able to extract categories', function(done) {
            this.timeout(5000);
            vinmonopolet.getCategories(function(err, categories) {
                expect(err).not.to.be.ok;

                // Found some categories?
                expect(categories.length).to.be.above(0, 'number of categories should be larger than 0');

                // Going to assume the red wine category does not lose the 0-index
                expect(categories[0].title).to.equal('Rødvin', 'should have correct category title');
                expect(categories[0].productCount).to.be.above(100, 'category should have item count above 100');
                expect(categories[0].filterId).to.equal(25, 'should have correct category filter id');

                done();
            });
        });

        it('is able to extract products from a category', function(done) {
            this.timeout(5000);

            // Going to assume the Alkoholfritt-category exists
            vinmonopolet.searchProducts({ filters: { 25: 'Alkoholfritt' } }, function(err, products) {
                expect(err).not.to.be.ok;

                // Found some products?
                expect(products.length).to.be.above(0, 'number of products should be larger than 0');

                // Just making assumptions here...
                expect(products[0].title.length).to.be.above(5, 'should have product title');
                expect(products[0].sku).to.be.above(0, 'should have product sku');
                expect(products[0].containerSize).to.above(0, 'should have a container size');
                expect(products[0].price).to.be.above(0, 'should have a product price');
                expect(products[0].pricePerLiter).to.be.above(0, 'should have a product price per liter');

                // Ensure we don't have any NaN's
                var keys = ['price', 'pricePerLiter', 'sku'], key;
                for (var i = 0; i < keys.length; i++) {
                    key = keys[i];
                    expect(!isNaN(products[0][key])).to.be.ok;
                }

                // Cache for later reuse
                existingSku = products[0].sku;
                productDetails = products[0];

                done();
            });
        });

        it('is able to extract product info', function(done) {
            this.timeout(5000);

            vinmonopolet.getProduct(existingSku, function(err, product) {
                expect(err).not.to.be.ok;

                expect(product.title).to.equal(productDetails.title, 'should have correct product title');
                expect(product.sku).to.equal(existingSku, 'should have correct product sku');
                expect(product.containerSize).to.equal(productDetails.containerSize, 'should have correct product container size');
                expect(product.price).to.equal(productDetails.price, 'should have correct product price');
                expect(product.pricePerLiter).to.equal(productDetails.pricePerLiter, 'should have correct product price per liter');
                assert(typeof product.productType === 'string', 'should have correct product type');
                assert(typeof product.productSelection === 'string', 'should have correct product selection');
                assert(typeof product.storeCategory === 'string', 'should have correct store category');
                assert(typeof product.color === 'string', 'should have correct product color');
                assert(typeof product.aroma === 'string', 'should have correct product aroma');
                assert(typeof product.taste === 'string', 'should have correct product taste');
                assert(Array.isArray(product.foodPairings), 'should have correct food pairings');
                assert(typeof product.country === 'string', 'should have correct product country/region');
                assert(typeof product.region === 'string', 'should have correct product country/region');
                assert(typeof product.abv === 'number', 'should have correct product alcohol percentage');
                assert(typeof product.manufacturer === 'string', 'should have correct product manufacturer');
                assert(typeof product.wholesaler === 'string', 'should have correct product wholesaler');
                assert(typeof product.distributor === 'string', 'should have correct product distributor');
                assert(typeof product.containerType === 'string', 'should have correct product container type');

                if (product.ingredients) {
                    assert(typeof product.ingredients === 'string', 'should have correct product ingredients');
                }

                if (product.sugar) {
                    assert(typeof product.sugar === 'number', 'should have correct product sugar info');
                }

                if (product.acid) {
                    assert(typeof product.acid === 'string', 'should have correct product acid info');
                }

                done();
            });
        });

        it('is able to extract availability for product', function(done) {
            this.timeout(5000);

            vinmonopolet.getProduct(existingSku, function(err, product) {
                expect(err).not.to.be.ok;

                var availability = product.availability;
                expect(availability.length).to.be.above(0, 'should find one or more store with the product in stock');

                assert(typeof availability[0].storeName === 'string', 'should find correct store name');
                assert(typeof availability[0].storeId === 'number', 'should find correct store id');
                assert(typeof availability[0].quantity === 'number', 'should find correct product quantity');

                done();
            });
        });

        it('is able to get category tree', function(done) {
            this.timeout(20000);

            vinmonopolet.getCategoryTree(function(err, tree) {
                expect(err).not.to.be.ok;

                expect(tree.length).to.equal(9, 'should have nine categories');

                // Going to assume the red wine category does not lose the 0-index
                expect(tree[0].title).to.equal('Rødvin', 'should have correct category title');
                expect(tree[0].productCount).to.be.above(100, 'category should have item count above 100');
                expect(tree[0].filterId).to.equal(25, 'should have correct category filter id');

                // Going to assume the distilled spirits category does not lose the 6-index
                expect(tree[6].types.length).to.be.above(10, 'category brennevin should have more then 10 types');

                // Going to assume the whisky type does not lose the 0-index
                var whisky = tree[6].types[0];

                expect(whisky.title).to.equal('Whisky', 'should have correct type title');
                expect(whisky.productCount).to.be.above(100, 'type should have item count above 100');
                expect(whisky.filterId).to.equal(26, 'should have correct type filter id');
                expect(whisky.subtypes.length).to.be.above(0, 'type should have one or more subtypes');

                // Going to assume the first whiskey subtype is malt whisky
                var maltWhisky = whisky.subtypes[0];

                expect(maltWhisky.title).to.equal('Maltwhisky', 'type subtype should have correct title');
                expect(maltWhisky.productCount).to.be.above(100, 'type subtype should have item count above 100');
                expect(maltWhisky.filterId).to.equal(27, 'type subtype should have correct filter id');
                expect(maltWhisky.subtypes).to.not.be.ok;

                done();
            });
        });
    });
});
