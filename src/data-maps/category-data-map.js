'use strict';

var numberFilter = require('../filters/number');
var textFilter = require('../filters/text');
var trimFilter = require('../filters/trim');

module.exports = {
    title: {
        filter: trimFilter
    },

    productCount: {
        filter: numberFilter.greedy
    },

    filterId: {
        filter: numberFilter
    }
};
