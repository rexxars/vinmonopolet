'use strict';

module.exports = function clockToPrctFilter(val) {
    var num = Number(val);

    if (isNaN(num) || num === 0) {
        return null;
    }

    var prct = Math.round((num / 12) * 100);
    return Math.min(100, Math.max(0, prct));
};
