'use strict';

var dataMap = require('../data-maps/type-data-map');
var setProps = require('./set-props');

module.exports = function Type(row, map) {
    setProps(this, row, map || dataMap);
};
