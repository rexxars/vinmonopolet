'use strict';

module.exports = function contentsExtractor(el, $) {
    var props = {}, parts, prop, value;

    el.find('.facet').each(function() {
        parts = $(this).text().split(/:?\s+/);
        prop = parts[0];
        value = parts[1];

        props[prop] = value;
    });

    return props;
};
