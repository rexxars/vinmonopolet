'use strict';

var expect = require('chai').expect;
var Type = require('../../src/models/type');

describe('type model', function() {
    it('sets passed props', function() {
        var model = new Type({ title: 'Foobar' });
        expect(model.title).to.equal('Foobar');
    });
});
