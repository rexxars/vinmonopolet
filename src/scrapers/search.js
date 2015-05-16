'use strict';

var cheerio = require('cheerio');
var Product = require('../models/product');

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

        products.push(new Product({
            Varenummer: link.attr('href').replace(/.*?sku-(\d+).*/, '$1'),
            Varenavn: row.find('h3 a').text(),
            Volum: priceEl.find('h3 em').text().trim().replace(/^\(|\)$/g, ''),
            Pris: priceEl.find('h3 strong').text(),
            Literpris: priceEl.find(':contains("pr. liter")').text()
        }));
    });

    // See if we're on the last page
    pages = $('table.pages').last();
    currentPage = pages.find('td b').text().trim();

    if (currentPage) {
        isLastPage = pages.find('td').last().children().last().is('a') === false;
        lastPage = pages.find('td a').last().prev().attr('href').replace(/.*?page=(\d+).*/, '$1');
        totalPages = parseInt(isLastPage ? currentPage : lastPage, 10);
    } else {
        totalPages = 1;
    }

    callback(null, products, {
        totalPages: totalPages
    });
};
