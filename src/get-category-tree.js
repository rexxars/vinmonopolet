'use strict';

var async = require('async');
var clone = require('lodash.clone');
var Vinmonopolet = require('./vinmonopolet');

function getTypesTree(filters, cb) {
    Vinmonopolet.getTypesByFilters(filters, function(err, types) {
        if (err) {
            return cb(err);
        }

        if (!types) {
            return cb(null);
        }

        async.parallel(types.map(function(type) {
            return function(mapCb) {
                filters[type.filterId] = type.title;

                getTypesTree(clone(filters), function(treeErr, subtypes) {
                    if (treeErr) {
                        return mapCb(treeErr);
                    }

                    type.subtypes = subtypes;

                    mapCb(null, type);
                });
            };
        }), cb);
    });
}

module.exports = function getCategoryTree(callback) {
    Vinmonopolet.getCategories(function(err, categories) {
        if (err) {
            return callback(err);
        }

        async.parallel(categories.map(function(category) {
            return function(cb) {
                var filters = {};
                filters[category.filterId] = category.title;

                getTypesTree(filters, function(treeErr, types) {
                    if (treeErr) {
                        return cb(treeErr);
                    }

                    category.types = types;

                    cb(null, category);
                });
            };
        }), callback);
    });
};
