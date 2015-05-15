'use strict';

var expect = require('chai').expect;
var Product = require('../../src/models/product');

describe('product model', function() {
    it('sets passed props', function() {
        var model = new Product({ Varenummer: '1337' });
        expect(model.sku).to.equal(1337);
    });
});
