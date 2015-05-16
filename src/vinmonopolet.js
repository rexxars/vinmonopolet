'use strict';

var merge = require('lodash.assign'),
    VinmonopoletStream = require('./vinmonopolet-stream'),
    requestUrl = require('./util/request-url'),
    categoryScraper = require('./scrapers/category'),
    typesScraper = require('./scrapers/types'),
    productScraper = require('./scrapers/product');

var Vinmonopolet = module.exports = {
    OVERVIEW_URL: 'http://www.vinmonopolet.no/vareutvalg/',
    TYPES_URL: 'http://www.vinmonopolet.no/vareutvalg/sok?expandFacet=5',
    SEARCH_URL: 'http://www.vinmonopolet.no/vareutvalg/sok',
    PRODUCT_URL: 'http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-',
    PRODUCT_QUERY_PARAMS: '?ShowShopsWithProdInStock=true&fylke_id=*&sku=',
    SEARCH_DEFAULT_PARAMETERS: {
        query: '*',
        sort: 2,
        sortMode: 0
    }
};

Vinmonopolet.getCategories = function(callback) {
    requestUrl(Vinmonopolet.OVERVIEW_URL, categoryScraper, callback);
};

Vinmonopolet.getTypesByFilters = function(filters, callback) {
    var filterIds = [], filterValues = [];

    for (var key in filters) {
        filterIds.push(key);
        filterValues.push(filters[key]);
    }

    var url = [
        Vinmonopolet.TYPES_URL,
        'filterIds=' + filterIds.join(';'),
        'filterValues=' + encodeURIComponent(filterValues.join(';'))
    ].join('&');

    requestUrl(url, typesScraper, callback);
};

Vinmonopolet.getProduct = function(product, callback) {
    var sku = product.sku || product;
    requestUrl(
        Vinmonopolet.PRODUCT_URL + sku + Vinmonopolet.PRODUCT_QUERY_PARAMS + sku,
        productScraper,
        callback
    );
};

Vinmonopolet.getProductsByCategoryName = function(name, callback) {
    Vinmonopolet.searchProducts({ filters: { 25: name } }, callback);
};

Vinmonopolet.getNumberOfPagesForSearch = function(data, callback) {
    Vinmonopolet.getSearchPage(data, 1, function(err, products, options) {
        callback(err, options ? options.totalPages : null);
    });
};

Vinmonopolet.getCategoryTree = require('./get-category-tree');
Vinmonopolet.getSearchPage = require('./get-search-page');
Vinmonopolet.searchProducts = require('./search-products');

merge(Vinmonopolet, VinmonopoletStream);
