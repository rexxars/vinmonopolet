'use strict';

function normalizeNumber(number) {
    var num = String(number);

    return (
        num
            .replace(/\s/g, '')
            .replace(/,/g, '.')
    );
}

function numberFilter(number) {
    var num = String(number);
    if (num === '') {
        return null;
    }

    return Number(normalizeNumber(number));
}

numberFilter.greedy = function(number) {
    var num = normalizeNumber(number);
    if (num === '') {
        return null;
    }

    return Number(num
        .replace(/[^\d\.]/g, '')
        .replace(/(^\.+|\.+$)/g, '')
    );
};

numberFilter.nullify = function(nulls) {
    return function(number) {
        if (nulls.indexOf(number) > -1) {
            return null;
        }

        return numberFilter(number);
    };
};

module.exports = numberFilter;
