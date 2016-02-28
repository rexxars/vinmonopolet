'use strict';

var numberFilter = require('./number');

var units = {
    ml: 1000,
    cl: 100,
    dl: 10,
    l: 1,
    liter: 1
};

module.exports = function volumeFilter(val) {
    if (!val) {
        return null;
    } else if (typeof val === 'number') {
        return val;
    }

    var unit = val.match(/(ml|cl|dl|l|liter)/) || [];
    var amount = numberFilter.greedy(val);
    var factor = units[unit[1]] || 1;

    return amount / factor;
};
