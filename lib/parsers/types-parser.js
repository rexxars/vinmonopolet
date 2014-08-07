var cheerio = require('cheerio');

module.exports = function typesparser(body, callback) {
    var $ = cheerio.load(body),
        types = [];

    $('.content .facet li').each(function() {
        var link = $(this).find('a');

        types.push({
            title: link.text().trim(),
            count: parseInt($(this).find('em').text().replace(/[()]/g, ''), 10),
            filterId: parseInt(link.attr('href')
                               .replace(/.*?filterIds=([\d;]+).*?/, '$1')
                               .split(';')
                               .pop(), 10)
        });
    });

    callback(undefined, types.length ? types : null);
};
