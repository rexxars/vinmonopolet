'use strict';

var cheerio    = require('cheerio'),
    request    = require('request'),
    async      = require('async'),
    metaMap    = require('./lib/meta-map'),
    priceFix   = require('./lib/price-normalizer'),
    charFix    = require('./lib/characteristics-extractor'),
    contentFix = require('./lib/content-extractor'),
    amountFix  = function(amount) { return amount.replace(/\s+/, ' '); },
    _          = require('lodash');

var ProductCrawler = function() {};

ProductCrawler.OVERVIEW_URL = 'http://www.vinmonopolet.no/vareutvalg/';
ProductCrawler.SEARCH_URL   = 'http://www.vinmonopolet.no/vareutvalg/sok';
ProductCrawler.PRODUCT_URL  = 'http://www.vinmonopolet.no/vareutvalg/vare/sku-';
ProductCrawler.PRODUCT_QUERY_PARAMS = '?ShowShopsWithProdInStock=true&sku=504201&fylke_id=*';
ProductCrawler.SEARCH_DEFAULT_PARAMETERS = {
    query: '*',
    sort: 2,
    sortMode: 0
};

_.extend(ProductCrawler.prototype, {

    getCategories: function(callback) {
        this.request(ProductCrawler.OVERVIEW_URL, this.categoryParser, callback);
    },

    getProductDetails: function(productSku, callback) {
        this.request(
            ProductCrawler.PRODUCT_URL + productSku + ProductCrawler.PRODUCT_QUERY_PARAMS,
            this.productParser,
            callback
        );
    },

    getProductsByFilters: function(filters, callback) {
        var page = 0,
            lastPage = false,
            allProducts = [];

        async.doWhilst(
            function(next) {
                page++;
                this.searchProducts(filters, page, function(err, products, options) {
                    if (err) { return callback(err); }

                    allProducts = allProducts.concat(products);
                    lastPage = options.isLastPage;

                    next();
                });
            }.bind(this),
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
            ProductCrawler.SEARCH_DEFAULT_PARAMETERS,
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

        this.request(
            ProductCrawler.SEARCH_URL + '?' + qs.join('&'),
            this.searchParser,
            callback
        );
    },

    categoryParser: function(body, callback) {
        var $ = cheerio.load(body),
            categories = [],
            link;

        $('h3.title em').each(function() {
            link = $(this).closest('h3.title').find('a');
            categories.push({
                title: link.text().trim(),
                count: parseInt($(this).text().replace(/[^\d]/g, ''), 10),
                filterId: parseInt(link.attr('href').replace(/.*?filterIds=(\d+).*?/, '$1'), 10)
            });
        });

        callback(categories.length ? undefined : 'No categories found', categories);
    },

    searchParser: function(body, callback) {
        var $ = cheerio.load(body),
            list = $('#productList tbody'),
            products = [],
            lastPage = false,
            row, link, priceEl;

        list.find('tr').each(function() {
            row = $(this);
            link = row.find('h3 a');
            priceEl = row.find('td.price');

            products.push({
                sku: parseInt(link.attr('href').replace(/.*?sku-(\d+).*?/, '$1'), 10),
                title: row.find('h3 a').text().trim(),
                containerSize: amountFix(priceEl.find('h3 em').text().trim().replace(/^\(|\)$/g, '')),
                price: priceFix(priceEl.find('h3 strong').text()),
                pricePerLiter: priceFix(priceEl.find('p').text())
            });
        });

        // See if we're on the last page
        lastPage = $('table.pages td').last().children().last().is('a') === false;

        callback(undefined, products, { isLastPage: lastPage });
    },

    productParser: function(body, callback) {
        var $ = cheerio.load(body),
            priceEl = $('#addToCart');

        var productInfo = {
            sku: parseInt($('input[name="sku"]').val(), 10),
            title: $('.pageBody h1').first().text().trim(),
            containerSize: amountFix(priceEl.find('h3 em').text().trim().replace(/^\(|\)$/g, '')),
            price: priceFix(priceEl.find('h3 strong').text()),
            pricePerLiter: priceFix(priceEl.find('p').text())
        };

        // Get meta-info
        $('.productData li').each(function() {
            var li     = $(this),
                attrib = li.find('.attrib').text().replace(/:$/, '').replace(/\s+/g, ' '),
                value  = li.find('span.data').text().replace(/\s+/, ' ').trim();

            if (metaMap[attrib]) {
                productInfo[metaMap[attrib]] = value;
            } else if (attrib === 'Karakteristikk') {
                _.extend(productInfo, charFix(li, $));
            } else if (attrib === 'Innhold') {
                _.extend(productInfo, contentFix(li, $));
            } else if (attrib === 'Passer til') {
                var pairings = [];
                li.find('img').each(function() {
                    pairings.push($(this).attr('title'));
                });
                productInfo.foodPairings = pairings.join(', ');
            } else if (metaMap[attrib] === false) {
                // Skip without warning
            } else {
                console.log('Unknown property: ' + attrib);
            }
        });

        callback(undefined, productInfo);
    },

    request: function(url, parser, callback) {
        request(url, function(err, res, body) {
            if (err || res.statusCode !== 200) {
                return setImmediate(callback, err || res.statusCode);
            }

            parser(body, callback);
        });
    }

});

module.exports = ProductCrawler;
