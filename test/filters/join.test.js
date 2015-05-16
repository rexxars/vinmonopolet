'use strict';

var expect = require('chai').expect;
var join = require('../../src/filters/join');

describe('join filter', function() {
    it('returns a function when called', function() {
        expect(join()).to.be.a('function');
    });

    it('grabs the defined keys and returns an array', function() {
        var joiner = join(['a', 'b', 'c']);
        var output = joiner(null, {a: 'foo', b: 'bar', c: 'baz'});

        expect(output).to.include.members(['foo', 'bar', 'baz']);
        expect(output).to.have.length(3);
    });

    it('skips keys it can\'t find', function() {
        var joiner = join(['a', 'z', 'c']);
        var output = joiner(null, {a: 'foo', b: 'bar', c: 'baz'});

        expect(output).to.include.members(['foo', 'baz']);
        expect(output).to.have.length(2);
    });

    it('applies the defined filter', function() {
        var joiner = join(['a', 'z', 'c'], Number);
        var output = joiner(null, {a: '50', b: 'bar', c: '3.14'});

        expect(output).to.include.members([50, 3.14]);
        expect(output).to.have.length(2);
    });
});
