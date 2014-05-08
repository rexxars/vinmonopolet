'use strict';

var map = {
    'Fylde': 'fullness',
    'Sødme': 'sweetness',
    'Bitterhet': 'bitterness',
};

module.exports = function(el, $) {
    var maxClock = 12, props = {};

    el.find('.facet').each(function() {
        var facet = $(this).find('em').text().replace(/:$/, ''),
            clock = ($(this).find('img').attr('src') || '').replace(/.*clocks\/(\d+).*/, '$1');

        props[map[facet]] = Number((clock / maxClock).toFixed(2));
    });

    return props;
};
