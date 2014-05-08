'use strict';

var map = {
    'Alkohol': 'alcohol',
    'Sukker': 'sugar',
    'Syre': 'acid',
};

module.exports = function(el, $) {
    var props = {}, parts, prop, value;

    el.find('.facet').each(function() {
        parts = $(this).text().split(/:?\s+/);
        prop = map[parts[0]];
        value = parts[1];

        if (prop === 'alcohol') {
            value = Number(value.replace(/%$/, '').replace(/,/g, '.'));
        }

        props[prop] = value;
    });

    return props;
};
