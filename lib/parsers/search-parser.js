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
        isLastPage = false,
        totalPages = 0,
        row, link, priceEl, pages, currentPage, lastPage;

    list.find('tr').each(function() {
        row = $(this);
        link = row.find('h3 a');
        priceEl = row.find('td.price');

        products.push({
            sku: parseInt(link.attr('href').replace(/.*?sku-(\d+).*/, '$1'), 10),
            title: row.find('h3 a').text().trim(),
            containerSize: amountFix(priceEl.find('h3 em').text().trim().replace(/^\(|\)$/g, '')),
            price: priceFix(priceEl.find('h3 strong').text()),
            pricePerLiter: priceFix(priceEl.find('p').text())
        });
    });

    // See if we're on the last page
    pages       = $('table.pages');
    currentPage = pages.find('td b').text();
    isLastPage  = pages.find('td').last().children().last().is('a') === false;
    lastPage    = pages.find('td a').last().prev().attr('href').replace(/.*?page=(\d+).*/, '$1');
    totalPages  = parseInt(isLastPage ? currentPage : lastPage, 10);

    callback(undefined, products, {
        totalPages: totalPages
    });
};
