const FoodPairing = require('../models/FoodPairing')
const number = require('../filters/number')
const clockToPercentage = require('../filters/clockToPercentage')
const boolean = require('../filters/boolean')

const pairingCodeToIdentifier = code =>
  FoodPairing[code] && FoodPairing[code].identifier

module.exports = {
  'Butikker': ['stores'],
  'Pris': ['price'],
  'isGoodfor': ['foodPairing', pairingCodeToIdentifier],
  'Fylde': ['fullness', clockToPercentage.range],
  'Friskhet': ['freshness', clockToPercentage.range],
  'Bitterhet': ['bitterness', clockToPercentage.range],
  'Soedme': ['sweetness', clockToPercentage.range],
  'Tannin(Sulfates)': ['tannins', clockToPercentage.range],
  'Sukker': ['sugar', number],
  'Raastoff': ['rawMaterial'],
  'Emballasjetype': ['containerType'],
  'Lagringsgrad': ['storable'],
  'Biodynamic': ['bioDynamic'],
  'Eco': ['eco'],
  'Fairtrade': ['fairtrade'],
  'Gluten': ['gluten'],
  'Kosher': ['kosher'],
  'inStockFlag': ['inStock', boolean],
}
