'use strict';

var expect = require('chai').expect;
var Product = require('../../src/models/product');
var getValidHtml = require('../scrapers/product.test').getValidHtml;

describe('product model', function() {
    it('sets passed props', function() {
        var model = new Product({ Varenummer: '1337' });
        expect(model.sku).to.equal(1337);
    });

    it('can populate itself by calling populate()', function(done) {
        var mock = require('nock')('http://www.vinmonopolet.no');
        mock.get('/vareutvalg/varedetaljer/sku-2270002?ShowShopsWithProdInStock=true&fylke_id=*&sku=2270002')
            .reply(200, getValidHtml({ productData: true }));

        var model = new Product({ Varenummer: '2270002' });
        expect(model.sku).to.equal(2270002);
        expect(model.fullness).to.be.an('undefined');

        model.populate(function(err, populated) {
            expect(err).not.to.be.an.instanceOf(Error);
            expect(populated).to.equal(model);
            expect(populated.fullness).to.equal(58);

            mock.done();
            done();
        });
    });

    it('can returns error if encountering problem when calling populate()', function(done) {
        var mock = require('nock')('http://www.vinmonopolet.no');
        mock.get('/vareutvalg/varedetaljer/sku-2270002?ShowShopsWithProdInStock=true&fylke_id=*&sku=2270002')
            .reply(503, 'Server error');

        var model = new Product({ Varenummer: '2270002' });
        expect(model.sku).to.equal(2270002);

        model.populate(function(err, populated) {
            expect(err).to.be.an.instanceOf(Error);
            expect(populated).to.be.an('undefined');

            mock.done();
            done();
        });
    });
});
