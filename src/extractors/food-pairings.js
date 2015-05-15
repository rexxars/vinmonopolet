'use strict';

module.exports = function foodPairings(el, $) {
    var pairings = [];
    el.find('img[title]').each(function() {
        pairings.push($(this).attr('title'));
    });

    return {
        Passertil01: pairings[0],
        Passertil02: pairings[1],
        Passertil03: pairings[2]
    };
};
