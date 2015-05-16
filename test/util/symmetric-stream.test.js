'use strict';

var stringToStream = require('string-to-stream');
var split = require('split');
var concat = require('concat-stream');
var expect = require('chai').expect;
var symmetricStream = require('../../src/util/symmetric-stream');

describe('symmetric stream', function() {
    it('leaves symmetric streams as-is', function(done) {
        var input = [
            'totally "awesome" test case, this',
            'when "everything" is symmetric, there is nothing to do',
            'but let is pass "directly" through.', ''
        ].join('\n');

        stringToStream(input)
            .pipe(split())
            .pipe(symmetricStream())
            .pipe(concat(function(output) {
                expect(output.toString()).to.equal(input);
                done();
            }));
    });

    it('fixes trailing asymmetric stream', function(done) {
        var input = [
            'not so "awesome" test case, this',
            'this "middle" line has a stray " which',
            'causes lots of "problems".', ''
        ].join('\n');

        stringToStream(input)
            .pipe(split())
            .pipe(symmetricStream())
            .pipe(concat(function(output) {
                expect(output.toString()).to.equal(input.replace(/stray "/, 'stray  '));
                done();
            }));
    });

    it('fixes leading asymmetric stream', function(done) {
        var input = [
            'less "awesome test case, this at it',
            'leads of with a stray "quote" thing which',
            'causes lots of "problems".', ''
        ].join('\n');

        stringToStream(input)
            .pipe(split())
            .pipe(symmetricStream())
            .pipe(concat(function(output) {
                expect(output.toString()).to.equal(input.replace(/less "/, 'less  '));
                done();
            }));
    });

    it('fixes trailing asymmetric stream with escaped quotes', function(done) {
        var input = [
            'how does it ""deal"" with double-escaped"',
            'quote "signs" though?', ''
        ].join('\n');

        stringToStream(input)
            .pipe(split())
            .pipe(symmetricStream())
            .pipe(concat(function(output) {
                expect(output.toString()).to.equal(input.replace(/escaped"/, 'escaped '));
                done();
            }));
    });

    it('fixes leading asymmetric stream with escaped quotes', function(done) {
        var input = [
            'how "does it ""deal"" with double-escaped',
            'quote "signs" though?', ''
        ].join('\n');

        stringToStream(input)
            .pipe(split())
            .pipe(symmetricStream())
            .pipe(concat(function(output) {
                expect(output.toString()).to.equal(input.replace(/"does/, ' does'));
                done();
            }));
    });
});
