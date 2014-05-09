'use strict';

var cheerio    = require('cheerio'),
    priceFix   = require('../price-normalizer'),
    metaMap    = require('../meta-map'),
    charFix    = require('../extractors/characteristics-extractor'),
    contentFix = require('../extractors/content-extractor'),
    _          = require('lodash');

var amountFix  = function(amount) {
    return amount.replace(/\s+/, ' ');
};

module.exports = function productParser(body, callback) {
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

    // Store availability
    var availability = [];
    $('.listStores li').each(function() {
        availability.push({
            shopName: $(this).find('a').text().trim(),
            shopId  : parseInt($(this).find('a').attr('href').replace(/.*butikk_id=(\d+).*/, '$1'), 10),
            quantity: parseInt($(this).find('em').text().replace(/.*\((\d+) på lager\).*/, '$1'), 10),
        });
    });

    callback(undefined, productInfo, availability);
};
