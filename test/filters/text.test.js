'use strict';

var expect = require('chai').expect;
var text = require('../../src/filters/text');

describe('text filter', function() {
    it('trims whitespace from start and end of string', function() {
        expect(text(' Foo bar ')).to.equal('Foo bar');
        expect(text('\nFoo\nBar\n')).to.equal('Foo\nBar');
    });

    it('replaces backslashes followed by apostrophes with apostrophe', function() {
        expect(text('Beck\\\'s thingy')).to.equal('Beck\'s thingy');
    });
});
