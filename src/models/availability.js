'use strict';

var dataMap = require('../data-maps/availability-data-map');
var setProps = require('./set-props');

module.exports = function Availability(row, map) {
    setProps(this, row, map || dataMap);
};
