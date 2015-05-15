'use strict';

module.exports = function textFilter(val) {
    return String(val).trim().replace(/\\'/g, '\'');
};
