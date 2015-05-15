'use strict';

var expect = require('chai').expect;
var Store = require('../../src/models/store');

describe('store model', function() {
    it('sets passed props', function() {
        var model = new Store({ Butikknavn: 'Foobar' });
        expect(model.name).to.equal('Foobar');
    });
});
