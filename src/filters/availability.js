'use strict';

var textFilter = require('./text');
var numberFilter = require('./number');

function filterStoreAvailability(availability) {
    return {
        storeId: numberFilter(availability.storeId),
        storeName: textFilter(availability.storeName),
        quantity: numberFilter(availability.quantity)
    };
}

module.exports = function availabilityFilter(stores) {
    return stores.map(filterStoreAvailability);
};
