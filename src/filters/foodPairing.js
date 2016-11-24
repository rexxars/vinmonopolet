const FoodPairing = require('../models/FoodPairing')

module.exports = values => {
  if (!values) {
    return []
  }

  return values
    .map(name => FoodPairing.byName[name])
    .filter(Boolean)
}
