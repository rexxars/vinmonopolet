'use strict';

module.exports = function(el, $) {
    var props = {};

    el.find('.facet').each(function() {
        var facet = $(this).find('em').text().replace(/:$/, ''),
            clock = ($(this).find('img').attr('src') || '').replace(/.*clocks\/(\d+).*/, '$1');

        props[facet] = clock;
    });

    return props;
};
