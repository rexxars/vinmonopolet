'use strict';

var cheerio    = require('cheerio'),
    priceFix   = require('../price-normalizer');

var amountFix  = function(amount) {
    return amount.replace(/\s+/, ' ');
};

module.exports = function searchParser(body, callback) {
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
};
