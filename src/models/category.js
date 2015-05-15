'use strict';

var dataMap = require('../data-maps/category-data-map');
var setProps = require('./set-props');

module.exports = function Category(row, map) {
    setProps(this, row, map || dataMap);
};
