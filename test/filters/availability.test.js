'use strict';

var expect = require('chai').expect;
var availability = require('../../src/filters/availability');
var AvailabilityModel = require('../../src/models/availability');

describe('availability filter', function() {
    it('returns availability model instances', function() {
        var output = availability([
            { storeId: 1, storeName: 'foo', quantity: 5 },
            { storeId: 2, storeName: 'bar', quantity: 10 }
        ]);

        expect(output).to.have.length(2);
        expect(output[0]).to.be.an.instanceOf(AvailabilityModel);
        expect(output[1]).to.be.an.instanceOf(AvailabilityModel);

        expect(output[0].storeName).to.equal('foo');
        expect(output[1].storeName).to.equal('bar');
    });
});
