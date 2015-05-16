'use strict';

var Vinmonopolet = require('./vinmonopolet');
var requestUrl = require('./util/request-url');
var searchScraper = require('./scrapers/search');
var extend = require('lodash.assign');

module.exports = function searchProducts(data, page, callback) {
    var query = extend({}, Vinmonopolet.SEARCH_DEFAULT_PARAMETERS);

    if (data.filters) {
        var filterIds = [], filterValues = [];
        for (var key in data.filters) {
            filterIds.push(key);
            filterValues.push(data.filters[key]);
        }

        query = extend(query, {
            filterIds: filterIds.join(';'),
            filterValues: filterValues.join(';')
        });
    }

    if (data.query) {
        query.query = data.query;
        query.countresult = 'true';
    }

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
