'use strict';

var async = require('async');
var Vinmonopolet = require('./vinmonopolet');

module.exports = function getProductsByFilters(filters, callback) {
    var allProducts = [];
    var queue = async.queue(function(task, cb) {
        Vinmonopolet.searchProducts(filters, task.page, function(err, products) {
            if (err) {
                return cb(err);
            }

            allProducts = allProducts.concat(products);
            cb();
        });
    }, 7);

    queue.drain = function() {
        callback(null, allProducts);
    };

    Vinmonopolet.getNumberOfPagesForSearch(filters, function(err, totalPages) {
        if (err) {
            return callback(err);
        }

        for (var i = 1; i <= totalPages; i++) {
            queue.push({ page: i });
        }
    });
};
