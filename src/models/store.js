'use strict';

var dataMap = require('../data-maps/store-data-map');
var setProps = require('./set-props');

module.exports = function Store(row, map) {
    setProps(this, row, map || dataMap);
};
