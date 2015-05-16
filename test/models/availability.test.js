'use strict';

var expect = require('chai').expect;
var Availability = require('../../src/models/availability');

describe('availability model', function() {
    it('sets passed props', function() {
        var model = new Availability({ storeName: 'Foobar' });
        expect(model.storeName).to.equal('Foobar');
    });
});
