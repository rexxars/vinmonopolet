'use strict';

var cheerio = require('cheerio');
var Type = require('../models/type');

module.exports = function typesParser(body, callback) {
    var $ = cheerio.load(body),
        types = [];

    $('.content .facet li').each(function() {
        var link = $(this).find('a');

        var filterId = (link.attr('href')
            .replace(/.*?filterIds=([\d;]+).*/, '$1')
            .split(';')
            .pop());

        types.push(new Type({
            title: link.text(),
            productCount: $(this).find('em').text().replace(/[()]/g, ''),
            filterId: filterId
        }));
    });

    callback(null, types.length ? types : null);
};
