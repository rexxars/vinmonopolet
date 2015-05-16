'use strict';

var expect = require('chai').expect;
var Category = require('../../src/models/category');

describe('category model', function() {
    it('sets passed props', function() {
        var model = new Category({ title: 'Foobar' });
        expect(model.title).to.equal('Foobar');
    });
});
