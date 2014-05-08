'use strict';

var cheerio = require('cheerio');

module.exports = function categoryParser(body, callback) {
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
};
