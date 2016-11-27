const textFilter = require('../filters/text')
const volumeFilter = require('../filters/volume')
const priceFilter = require('../filters/price')
const joinFilter = require('../filters/join')
const clockToPrctFilter = require('../filters/clockToPercentage')
const trimFilter = require('../filters/trim')
const numberFilter = require('../filters/number')
const foodPairingFilter = require('../filters/foodPairing')

module.exports = {
  Varenummer: ['code'],
  Varenavn: ['name', textFilter],
  Volum: ['containerSize', volumeFilter],
  Pris: ['price', priceFilter],
  Literpris: ['pricePerLiter', priceFilter],
  Varetype: ['productType', textFilter],
  Produktutvalg: ['productSelection', textFilter],
  Butikkategori: ['storeCategory', textFilter],
  Fylde: ['fullness', clockToPrctFilter],
  Friskhet: ['freshness', clockToPrctFilter],
  Garvestoffer: ['tannins', clockToPrctFilter],
  Bitterhet: ['bitterness', clockToPrctFilter],
  Sodme: ['sweetness', clockToPrctFilter],
  Farge: ['color', trimFilter],
  Lukt: ['aroma', textFilter],
  Smak: ['taste', textFilter],
  Passertil01: ['foodPairing', joinFilter(['Passertil01', 'Passertil02', 'Passertil03']), foodPairingFilter],
  Land: ['mainCountry', textFilter],
  Distrikt: ['district', textFilter],
  Underdistrikt: ['subDistrict', textFilter],
  Argang: ['vintage', numberFilter],
  Rastoff: ['rawMaterial', textFilter],
  Råstoff: ['rawMaterial', textFilter],
  Metode: ['method', textFilter],
  Alkohol: ['abv', numberFilter.greedy],
  Sukker: ['sugar', numberFilter.nullify(['Ukjent'])],
  Syre: ['acid', numberFilter.nullify(['Ukjent'])],
  Lagringsgrad: ['storable', textFilter],
  Produsent: ['mainProducer', textFilter],
  Grossist: ['wholesaler', textFilter],
  Distributor: ['distributor', textFilter],
  Distributør: ['distributor', textFilter],
  Emballasjetype: ['containerType', textFilter],
  Korktype: ['cork', textFilter],
  Vareurl: ['url']
}
