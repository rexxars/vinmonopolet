const storeStreamMap = require('../datamaps/storeStreamMap')
const camelcase = require('lodash.camelcase')

function Store(store) {
  Object.keys(store).forEach(key => {
    const [name, valueFilter] = storeStreamMap[key] || []
    const fieldName = name || camelcase(key)
    this[fieldName] = valueFilter ? valueFilter(store[key]) : store[key]
  })
}

module.exports = Store
