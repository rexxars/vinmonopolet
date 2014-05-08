'use strict';

module.exports = function(price) {
    return Number(
        price
            .trim()
            .replace(/^Kr\.\s*/, '')
            .replace(/,\-$/, '')
            .replace(/,/g, '.')
            .replace(/(\d+(\.\d*)?)[\s\S]*/, '$1')
    );
};
