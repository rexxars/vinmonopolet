'use strict';

module.exports = function priceFilter(price) {
    return Number(
        String(price)
            .trim()
            .replace(/^Kr\.\s*/, '')
            .replace(/\./g, '')
            .replace(/,\-$/, '')
            .replace(/,/g, '.')
            .replace(/\s/g, '')
            .replace(/(\d+(\.\d*)?)[\s\S]*/, '$1')
    );
};
