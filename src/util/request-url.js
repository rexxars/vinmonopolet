'use strict';

var got = require('got');
var ua = [
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    '(KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
].join(' ');

module.exports = function requestUrl(url, parser, callback) {
    got(url, {
        headers: {
            'User-Agent': ua
        }
    }, function(err, body, res) {
        if (err || res.statusCode !== 200) {
            return setImmediate(callback, err || new Error('HTTP ' + res.statusCode));
        }

        parser(body, callback);
    });
};
