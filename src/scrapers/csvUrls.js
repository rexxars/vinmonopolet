'use strict';

var cheerio = require('cheerio');

var map = {
    Produkt: 'products',
    Butikk: 'stores'
};

module.exports = function csvUrlParser(body, callback) {
    var $ = cheerio.load(body),
        urls = {},
        link, match, linkHref, type;

    $('.article-page__content a').each(function() {
        link = $(this);
        linkHref = link.attr('href');
        match = link.text().match(/(Produkt|Butikk)/);

        if (!linkHref.match(/\.csv/) || !match) {
            return;
        }

        type = map[match[1]];
        urls[type] = linkHref;
    });

    callback(
        Object.keys(urls).length > 1 ? null : new Error('CSV URLs not found'),
        urls
    );
};
