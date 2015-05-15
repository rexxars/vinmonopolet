'use strict';

var cheerio = require('cheerio');
var Category = require('../models/category');

module.exports = function categoryParser(body, callback) {
    var $ = cheerio.load(body),
        categories = [],
        link;

    $('h3.title em').each(function() {
        link = $(this).closest('h3.title').find('a');

        categories.push(new Category({
            title: link.text(),
            productCount: $(this).text(),
            filterId: link.attr('href').replace(/.*?filterIds=(\d+).*/, '$1')
        }));
    });

    callback(
        categories.length ? null : new Error('No categories found'),
        categories
    );
};
