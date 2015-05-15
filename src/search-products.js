'use strict';

var Vinmonopolet = require('./vinmonopolet');
var requestUrl = require('./util/request-url');
var searchScraper = require('./scrapers/search');
var extend = require('lodash.assign');

module.exports = function searchProducts(filters, page, callback) {
    var query = {}, filterIds = [], filterValues = [];
    for (var key in filters) {
        filterIds.push(key);
        filterValues.push(filters[key]);
    }

    query = extend(
        query,
        Vinmonopolet.SEARCH_DEFAULT_PARAMETERS,
        {
            filterIds: filterIds.join(';'),
            filterValues: filterValues.join(';')
        }
    );

    var qs = [];
    for (key in query) {
        qs.push(key + '=' + encodeURIComponent(query[key]));
    }

    qs.push('page=' + page);

    requestUrl(
        Vinmonopolet.SEARCH_URL + '?' + qs.join('&'),
        searchScraper,
        callback
    );
};
