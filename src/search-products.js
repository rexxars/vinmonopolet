'use strict';

var async = require('async');
var Vinmonopolet = require('./vinmonopolet');

module.exports = function getAllProductsForSearch(data, callback) {
    var allProducts = [];
    var queue = async.queue(function(task, cb) {
        Vinmonopolet.getSearchPage(data, task.page, function(err, products) {
            if (err) {
                queue.kill();
                return callback(err);
            }

            if (data.detailed) {
                async.map(products, Vinmonopolet.getProduct, function(mapErr, results) {
                    if (mapErr) {
                        queue.kill();
                        return callback(mapErr);
                    }

                    allProducts = allProducts.concat(results);
                    cb();
                });
            } else {
                allProducts = allProducts.concat(products);
                cb();
            }
        });
    }, 7);

    queue.drain = function(err) {
        callback(err, allProducts);
    };

    Vinmonopolet.getNumberOfPagesForSearch(data, function(err, totalPages) {
        if (err) {
            return callback(err);
        }

        for (var i = 1; i <= totalPages; i++) {
            queue.push({ page: i });
        }
    });
};
