'use strict';

var Availability = require('../models/availability');

function filterStoreAvailability(availability) {
    return new Availability(availability);
}

module.exports = function availabilityFilter(stores) {
    return stores.map(filterStoreAvailability);
};
