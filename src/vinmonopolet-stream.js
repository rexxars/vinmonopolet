'use strict';

var util = require('util');
var events = require('events');
var iconv = require('iconv-lite');
var csv = require('csv-parser');
var got = require('got');
var Product = require('./models/product');
var Store = require('./models/store');

var csvOptions = { separator: ';' };
var productsUrl = 'http://www.vinmonopolet.no/api/produkter';
var storesUrl = 'http://www.vinmonopolet.no/api/butikker';

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

module.exports = {
    getProductStream: function() {
        var stream = new VinmonopoletStream();

        got(productsUrl)
            .pipe(iconv.decodeStream('iso-8859-1'))
            .pipe(csv(csvOptions))
            .on('data', stream.parseProduct.bind(stream))
            .on('end', stream.emitEnd.bind(stream));

        return stream;
    },

    getStoreStream: function() {
        var stream = new VinmonopoletStream();

        got(storesUrl)
            .pipe(iconv.decodeStream('iso-8859-1'))
            .pipe(csv(csvOptions))
            .on('data', stream.parseStore.bind(stream))
            .on('end', stream.emitEnd.bind(stream));

        return stream;
    }
};
