'use strict';

var cheerio = require('cheerio');

module.exports = function typesParser(body, callback) {
    var $ = cheerio.load(body),
        types = [];

    $('.content .facet li').each(function() {
        var link = $(this).find('a');

        var filterId = (link.attr('href')
            .replace(/.*?filterIds=([\d;]+).*?/, '$1')
            .split(';')
            .pop());

        types.push({
            title: link.text().trim(),
            count: parseInt($(this).find('em').text().replace(/[()]/g, ''), 10),
            filterId: parseInt(filterId, 10)
        });
    });

    callback(undefined, types.length ? types : null);
};
