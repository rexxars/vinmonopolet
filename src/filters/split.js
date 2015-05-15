'use strict';

module.exports = function splitFilterCreator(pattern, filter) {
    return function splitFilter(value) {
        return value.split(pattern).map(filter || String);
    };
};
