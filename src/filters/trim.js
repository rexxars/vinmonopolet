'use strict';

module.exports = function trimFilter(val) {
    return String(val).trim().replace(/\.$/, '');
};
