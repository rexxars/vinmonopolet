'use strict';

var expect = require('chai').expect;
var setProps = require('../../src/models/set-props');
var TestModel = function(row, map) {
    setProps(this, row, map);
};

describe('set-props model helper', function() {
    it('skips setting properties that are not defined in data map', function() {
        var model = new TestModel({ foo: 'bar' }, { bar: { name: 'foo' } });
        expect(model.foo).to.be.undefined;
    });

    it('skips setting properties that are marked as skipped', function() {
        var model = new TestModel({ foo: 'bar' }, { foo: { skip: true } });
        expect(model.foo).to.be.undefined;
    });

    it('applies filter to properties that define one', function() {
        var model = new TestModel({ foo: '1337' }, { foo: { filter: Number } });
        expect(model.foo).to.equal(1337);
    });

    it('applies passes model data to filter as second parameter', function() {
        var testFilter = function(val, row) {
            expect(val).to.equal('1337');
            expect(row.bar).to.equal(1942);
            return 'foobar';
        };

        var model = new TestModel(
            { foo: '1337', bar: 1942 },
            { foo: { filter: testFilter }
        });

        expect(model.foo).to.equal('foobar');
    });

    it('props can be renamed by specifying name', function() {
        var model = new TestModel(
            { foo: '1337' },
            { foo: { name: 'newFoo' }
        });

        expect(model.foo).to.be.undefined;
        expect(model.newFoo).to.equal('1337');
    });
});
