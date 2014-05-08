'use strict';

var request = require('request'),
    async   = require('async'),
    _       = require('lodash');

var categoryParser = require('./lib/parsers/category-parser'),
    productParser  = require('./lib/parsers/product-parser'),
    searchParser   = require('./lib/parsers/search-parser');

function pageRequest(url, parser, callback) {
    request({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.132 Safari/537.36'
        }
    }, function(err, res, body) {
        if (err || res.statusCode !== 200) {
            return setImmediate(callback, err || res.statusCode);
        }

        parser(body, callback);
    });
}

var Vinmonopolet = {};

_.extend(Vinmonopolet, {

    OVERVIEW_URL: 'http://www.vinmonopolet.no/vareutvalg/',
    SEARCH_URL: 'http://www.vinmonopolet.no/vareutvalg/sok',
    PRODUCT_URL: 'http://www.vinmonopolet.no/vareutvalg/vare/sku-',
    PRODUCT_QUERY_PARAMS: '?ShowShopsWithProdInStock=true&sku=504201&fylke_id=*',
    SEARCH_DEFAULT_PARAMETERS: {
        query: '*',
        sort: 2,
        sortMode: 0
    },

    getCategories: function(callback) {
        pageRequest(Vinmonopolet.OVERVIEW_URL, categoryParser, callback);
    },

    getProductDetails: function(productSku, callback) {
        pageRequest(
            Vinmonopolet.PRODUCT_URL + productSku + Vinmonopolet.PRODUCT_QUERY_PARAMS,
            productParser,
            callback
        );
    },

    getProductsByCategoryName: function(name, callback) {
        Vinmonopolet.getProductsByFilters({ 25: name }, callback);
    },

    getProductsByFilters: function(filters, callback) {
        var page = 0,
            lastPage = false,
            allProducts = [];

        async.doWhilst(
            function(next) {
                page++;
                Vinmonopolet.searchProducts(filters, page, function(err, products, options) {
                    if (err) { return callback(err); }

                    allProducts = allProducts.concat(products);
                    lastPage = options.isLastPage;

                    next();
                });
            },
            function() { return lastPage === false; },
            function(err) { callback(err, allProducts); }
        );
    },

    searchProducts: function(filters, page, callback) {
        var query = {}, filterIds = [], filterValues = [];
        for (var key in filters) {
            filterIds.push(key);
            filterValues.push(filters[key]);
        }

        query = _.extend(
            query,
            Vinmonopolet.SEARCH_DEFAULT_PARAMETERS,
            {
                filterIds: filterIds.join(';'),
                filterValues: filterValues.join(';')
            }
        );

        var qs = [];
        for (key in query) {
            qs.push(key + '=' + encodeURIComponent(query[key]));
        }

        qs.push('page=' + page);

        pageRequest(
            Vinmonopolet.SEARCH_URL + '?' + qs.join('&'),
            searchParser,
            callback
        );
    }

});

module.exports = Vinmonopolet;
