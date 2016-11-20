'use strict';

var util = require('util');
var events = require('events');
var iconv = require('iconv-lite');
var split = require('split');
var csv = require('csv-parser');
var got = require('got');
var Product = require('./models/product');
var Store = require('./models/store');
var csvUrlsScraper = require('./scrapers/csvUrls');
var requestUrl = require('./util/request-url');
var symmetricStream = require('./util/symmetric-stream');

var csvOptions = { separator: ';' };
var refUrl = 'https://www.vinmonopolet.no/datadeling';

function VinmonopoletStream() {}
util.inherits(VinmonopoletStream, events.EventEmitter);

VinmonopoletStream.prototype.parseProduct = function(row) {
    this.emit('data', new Product(row));
};

VinmonopoletStream.prototype.parseStore = function(row) {
    this.emit('data', new Store(row));
};

VinmonopoletStream.prototype.emitEnd = function() {
    this.emit('end');
};

function getCsvStream(url) {
    return got(url)
        .pipe(iconv.decodeStream('iso-8859-1'))
        .pipe(split())
        .pipe(symmetricStream())
        .pipe(csv(csvOptions));
}

module.exports = {
    getProductStream: function() {
        var stream = new VinmonopoletStream();

        getCsvUrls(function(err, urls) {
            if (err) {
                stream.emit('error', err);
                return;
            }

            getCsvStream(urls.products)
                .on('data', stream.parseProduct.bind(stream))
                .on('end', stream.emitEnd.bind(stream));
        });

        return stream;
    },

    getStoreStream: function() {
        var stream = new VinmonopoletStream();

        getCsvUrls(function(err, urls) {
            if (err) {
                stream.emit('error', err);
                return;
            }

            getCsvStream(urls.stores)
                .on('data', stream.parseStore.bind(stream))
                .on('end', stream.emitEnd.bind(stream));
        });

        return stream;
    }
};

function getCsvUrls(callback) {
    requestUrl(refUrl, csvUrlsScraper, callback);
}
