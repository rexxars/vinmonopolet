'use strict';

var expect = require('chai').expect;
var requestUrl = require('../../src/util/request-url');

var ua = [
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    '(KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
].join(' ');

var domain = 'http://www.vinmonopolet.no';
var filter = function(str, callback) {
    callback(null, str.toUpperCase());
};

describe('url requestor', function() {
    var mock;

    it('includes "Chrome" in user-agent', function(done) {
        mock = require('nock')(domain, {
            reqheaders: {
                'user-agent': ua
            }
        }).get('/').reply(200, 'Wat');

        requestUrl(domain + '/', filter, function(err) {
            expect(err).not.to.be.an.instanceOf(Error);
            mock.done();
            done();
        });
    });

    it('applies specified filter', function(done) {
        mock = require('nock')(domain).get('/').reply(200, 'Wat');
        requestUrl(domain + '/', filter, function(err, body) {
            expect(err).not.to.be.an.instanceOf(Error);
            expect(body).to.equal('WAT');
            mock.done();
            done();
        });
    });

    it('calls callback with error on request failure', function(done) {
        mock = require('nock')(domain).get('/').replyWithError('Foobar');
        requestUrl(domain + '/', filter, function(err) {
            expect(err).to.be.an.instanceOf(Error);
            mock.done();
            done();
        });
    });

    it('calls callback with error if encountering non-200 response', function(done) {
        mock = require('nock')(domain).get('/').reply(255, 'No idea');
        requestUrl(domain + '/', filter, function(err) {
            expect(err).to.be.an.instanceOf(Error);
            mock.done();
            done();
        });
    });
});
