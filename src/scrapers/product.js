'use strict';

var cheerio = require('cheerio'),
    extend = require('lodash.assign'),
    Product = require('../models/product'),
    dataMap = require('../data-maps/product-data-map'),
    regionExtractor = require('../extractors/region'),
    contentExtractor = require('../extractors/contents'),
    foodPairingExtractor = require('../extractors/food-pairings'),
    characteristicsExtractor = require('../extractors/characteristics');

function productParser(body, callback) {
    var $ = cheerio.load(body),
        priceEl = $('#addToCart');

    var productInfo = {
        Varenummer: $('input[name="sku"]').val(),
        Varenavn: $('.pageBody h1').first().text(),
        Volum: priceEl.find('h3 em').text().trim().replace(/^\(|\)$/g, ''),
        Pris: priceEl.find('h3 strong').text(),
        Literpris: priceEl.find('p').text()
    };

    if (!productInfo.Varenummer || !productInfo.Varenavn) {
        return callback(new Error('Product SKU or name not found'));
    }

    // Get meta-info
    $('.productData li').each(function() {
        var li = $(this),
            attrib = li.find('.attrib').text().replace(/:$/, '').replace(/\s+/g, ' '),
            value = li.find('span.data').text().replace(/\s+/, ' ').trim(),
            typeDef = dataMap[attrib];

        if (typeDef) {
            productInfo[attrib] = value;
        } else if (attrib === 'Land/distrikt') {
            extend(productInfo, regionExtractor(value));
        } else if (attrib === 'Karakteristikk') {
            extend(productInfo, characteristicsExtractor(li, $));
        } else if (attrib === 'Innhold') {
            extend(productInfo, contentExtractor(li, $));
        } else if (attrib === 'Passer til') {
            extend(productInfo, foodPairingExtractor(li, $));
        } else if (process.env.DEBUG) {
            productParser.unknownPropLogger('Unknown prop: "' + attrib + '", value: "' + value + '"');
        }
    });

    // Store availability
    $('.listStores li').each(function() {
        if (!productInfo.availability) {
            productInfo.availability = [];
        }

        productInfo.availability.push({
            storeName: $(this).find('a').text(),
            storeId: $(this).find('a').attr('href').replace(/.*butikk_id=(\d+).*/, '$1'),
            quantity: $(this).find('em').text().replace(/.*\((\d+) på lager\).*/, '$1'),
            productSku: productInfo.Varenummer
        });
    });

    callback(null, new Product(productInfo));
}

/* eslint-disable no-console */
productParser.unknownPropLogger = console.log;
/* eslint-enable no-console */

module.exports = productParser;
