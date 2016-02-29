'use strict';

var availabilityFilter = require('../filters/availability');
var clockToPrctFilter = require('../filters/clock-to-percentage');
var numberFilter = require('../filters/number');
var volumeFilter = require('../filters/volume');
var priceFilter = require('../filters/price');
var joinFilter = require('../filters/join');
var textFilter = require('../filters/text');
var trimFilter = require('../filters/trim');

module.exports = {
    Varenummer: {
        name: 'sku',
        filter: numberFilter
    },
    Varenavn: {
        name: 'title',
        filter: textFilter
    },
    Volum: {
        name: 'containerSize',
        filter: volumeFilter
    },
    Pris: {
        name: 'price',
        filter: priceFilter
    },
    Literpris: {
        name: 'pricePerLiter',
        filter: priceFilter
    },
    Varetype: {
        name: 'productType',
        filter: textFilter
    },
    Produktutvalg: {
        name: 'productSelection',
        filter: textFilter
    },
    Butikkategori: {
        name: 'storeCategory',
        filter: textFilter
    },
    Fylde: {
        name: 'fullness',
        filter: clockToPrctFilter
    },
    Friskhet: {
        name: 'freshness',
        filter: clockToPrctFilter
    },
    Garvestoffer: {
        name: 'tannins',
        filter: clockToPrctFilter
    },
    Bitterhet: {
        name: 'bitterness',
        filter: clockToPrctFilter
    },
    Sodme: {
        name: 'sweetness',
        filter: clockToPrctFilter
    },
    Farge: {
        name: 'color',
        filter: trimFilter
    },
    Lukt: {
        name: 'aroma',
        filter: textFilter
    },
    Smak: {
        name: 'taste',
        filter: textFilter
    },
    Passertil01: {
        name: 'foodPairings',
        filter: joinFilter(['Passertil01', 'Passertil02', 'Passertil03'])
    },
    Passertil02: { skip: true },
    Passertil03: { skip: true },
    Land: {
        name: 'country',
        filter: textFilter
    },
    Distrikt: {
        name: 'region',
        filter: textFilter
    },
    Underdistrikt: {
        name: 'subRegion',
        filter: textFilter
    },
    Argang: {
        name: 'vintage',
        filter: numberFilter
    },
    Rastoff: {
        name: 'ingredients',
        filter: textFilter
    },
    Metode: {
        name: 'method',
        filter: textFilter
    },
    Alkohol: {
        name: 'abv',
        filter: numberFilter.greedy
    },
    Sukker: {
        name: 'sugar',
        filter: numberFilter.nullify(['Ukjent'])
    },
    Syre: {
        name: 'acid',
        filter: numberFilter.nullify(['Ukjent'])
    },
    Lagringsgrad: {
        name: 'storable',
        filter: textFilter
    },
    Produsent: {
        name: 'manufacturer',
        filter: textFilter
    },
    Grossist: {
        name: 'wholesaler',
        filter: textFilter
    },
    Distributor: {
        name: 'distributor',
        filter: textFilter
    },
    Emballasjetype: {
        name: 'containerType',
        filter: textFilter
    },
    Korktype: {
        name: 'corkType',
        filter: textFilter
    },
    Vareurl: {
        name: 'url'
    },

    // Custom prop for availability
    availability: {
        name: 'availability',
        filter: availabilityFilter
    },

    Råstoff: {
        name: 'ingredients',
        filter: textFilter
    },

    Distributør: {
        name: 'distributor',
        filter: textFilter
    }
};
