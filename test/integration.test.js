'use strict';

var redtape = require('redtape');
var vinmonopolet = require('../');
var test = redtape();
var existingSku, productDetails;

test('crawler is able to extract categories', function(t) {
    vinmonopolet.getCategories(function(err, categories) {
        if (err) { t.error(err); }

        // Found some categories?
        t.assert(categories.length > 0, 'number of categories should be larger than 0');

        // Going to assume the red wine category does not lose the 0-index
        t.equal(categories[0].title, 'Rødvin', 'should have correct category title');
        t.assert(categories[0].count > 100, 'category should have item count above 100');
        t.equal(categories[0].filterId, 25, 'should have correct category filter id');

        t.end();
    });
});

test('crawler is able to extract products from a category', function(t) {
    // Going to assume the Alkoholfritt-category exists
    vinmonopolet.getProductsByFilters({ 25: 'Alkoholfritt' }, function(err, products) {
        if (err) { t.error(err); }

        // Found some products?
        t.assert(products.length > 0, 'number of products should be larger than 0');

        // Just making assumptions here...
        t.assert(products[0].title.length > 5, 'should have product title');
        t.assert(products[0].sku > 0, 'should have product sku');
        t.assert(products[0].containerSize.indexOf('cl') > -1, 'should have a container size');
        t.assert(products[0].price > 0, 'should have a product price');
        t.assert(products[0].pricePerLiter > 0, 'should have a product price per liter');

        // Ensure we don't have any NaN's
        var keys = ['price', 'pricePerLiter', 'sku'], key;
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            t.assert(!isNaN(products[0][key]), key + ' should not equal NaN');
        }

        // Cache for later reuse
        existingSku = products[0].sku;
        productDetails = products[0];

        t.end();
    });
});

test('crawler is able to extract product info', function(t) {
    vinmonopolet.getProductDetails(existingSku, function(err, product) {
        if (err) { t.error(err); }

        t.equal(product.title, productDetails.title, 'should have correct product title');
        t.equal(product.sku, existingSku, 'should have correct product sku');
        t.equal(product.containerSize, productDetails.containerSize, 'should have correct product container size');
        t.equal(product.price, productDetails.price, 'should have correct product price');
        t.equal(product.pricePerLiter, productDetails.pricePerLiter, 'should have correct product price per liter');
        t.assert(typeof product.productType === 'string', 'should have correct product type');
        t.assert(typeof product.productSelection === 'string', 'should have correct product selection');
        t.assert(typeof product.shopCategory === 'string', 'should have correct shop category');
        t.assert(typeof product.color === 'string', 'should have correct product color');
        t.assert(typeof product.aroma === 'string', 'should have correct product aroma');
        t.assert(typeof product.taste === 'string', 'should have correct product taste');
        t.assert(typeof product.foodPairings === 'string', 'should have correct food pairings');
        t.assert(typeof product.countryRegion === 'string', 'should have correct product country/region');
        t.assert(typeof product.ingredients === 'string', 'should have correct product ingredients');
        t.assert(typeof product.alcohol === 'number', 'should have correct product alcohol percentage');
        t.assert(typeof product.sugar === 'string', 'should have correct product sugar info');
        t.assert(typeof product.acid === 'string', 'should have correct product acid info');
        t.assert(typeof product.manufacturer === 'string', 'should have correct product manufacturer');
        t.assert(typeof product.wholesaler === 'string', 'should have correct product wholesaler');
        t.assert(typeof product.distributor === 'string', 'should have correct product distributor');
        t.assert(typeof product.containerType === 'string', 'should have correct product container type');

        t.end();
    });
});

test('crawler is able to extract availability for product', function(t) {
    vinmonopolet.getProductDetails(existingSku, function(err, product, availability) {
        if (err) { t.error(err); }

        t.assert(availability.length > 0, 'should find one or more store with the product in stock');

        t.assert(typeof availability[0].shopName === 'string', 'should find correct shop name');
        t.assert(typeof availability[0].shopId === 'number', 'should find correct shop id');
        t.assert(typeof availability[0].quantity === 'number', 'should find correct product quantity');

        t.end();
    });
});
