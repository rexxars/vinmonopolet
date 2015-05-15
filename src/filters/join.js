'use strict';

module.exports = function(keys, filter) {
    return function joinKeysFilter(value, row) {
        var values = [];
        keys.forEach(function(key) {
            if (row[key]) {
                values.push(
                    filter ?
                    filter(row[key]) :
                    row[key]
                );
            }
        });
        return values;
    };
};
