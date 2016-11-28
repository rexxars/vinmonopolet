const facetsMap = require('../datamaps/facetsMap')
const FacetValue = require('./FacetValue')

const displayNames = {
  'mainCategory': 'Kategori',
  'mainSubCategory': 'Underkategori',
  'mainSubSubCategory': 'Varetype',
  'mainCountry': 'Land',
  'volumeRanges': 'Volum',
  'isGoodfor': 'Passer til',
  'Soedme': 'Sødme',
  'Tannin(Sulfates)': 'Garvestoffer',
  'Raastoff': 'Råstoff',
  'Biodynamic': 'Biodynamisk',
  'Eco': 'Økologisk',
  'Gluten': 'Glutenfri',
  'inStockFlag': 'På lager'
}

function Facet(facet) {
  const [title, valueFilter] = facetsMap[facet.name] || []

  this.title = title || facet.name
  this.name = facet.name
  this.displayName = displayNames[facet.name] || facet.name
  this.category = facet.category
  this.multiSelect = facet.multiSelect
  this.values = facet.values.map(val =>
    new FacetValue(val, valueFilter)
  )
}

Facet.Category = [
  ['ALCOHOL_FREE', 'mainCategory:alkoholfritt', 'Alkoholfritt'],
  ['RED_WINE', 'mainCategory:rødvin', 'Rødvin'],
  ['ROSE_WINE', 'mainCategory:rosévin', 'Rosévin'],
  ['WHITE_WINE', 'mainCategory:hvitvin', 'Hvitvin'],
  ['RIPPLING_WINE', 'mainCategory:perlende_vin', 'Perlende vin'],
  ['FLAVORED_WINE', 'mainCategory:aromatisert_vin', 'Aromatisert vin'],
  ['SPARKLING_WINE', 'mainCategory:musserende_vin', 'Musserende vin'],
  ['FORTIFIED_WINE', 'mainCategory:sterkvin', 'Sterkvin'],
  ['FRUIT_WINE', 'mainCategory:fruktvin', 'Fruktvin'],
  ['LIQUOR', 'mainCategory:brennevin', 'Brennevin'],
  ['CIDER', 'mainCategory:sider', 'Sider'],
  ['BEER', 'mainCategory:øl', 'Øl'],
  ['SAKE', 'mainCategory:sake', 'Sake'],
  ['MEAD', 'mainCategory:mjød', 'Mjød']
].reduce((target, category) => {
  const [id, value, name] = category
  target[id] = new FacetValue({name, query: {query: {value}}})
  return target
})

module.exports = Facet
