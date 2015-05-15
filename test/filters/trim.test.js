'use strict';

var expect = require('chai').expect;
var trim = require('../../src/filters/trim');

describe('trim filter', function() {
    it('trims whitespace from start and end of string', function() {
        expect(trim(' Foo bar ')).to.equal('Foo bar');
        expect(trim('\nFoo\nBar\n')).to.equal('Foo\nBar');
    });

    it('trims trailing punctuation', function() {
        expect(trim('Foobar.')).to.equal('Foobar');
        expect(trim('Foo bar.')).to.equal('Foo bar');
    });
});
