function priceFilter(price) {
  if (!price) {
    return null
  }

  if (price.value) {
    return price.value
  }

  return Number(
    String(price)
      .trim()
      .replace(/^Kr\.\s*/, '')
      .replace(/\s*kr/i, '')
      .replace(/\./g, '')
      .replace(/,-$/, '')
      .replace(/,/g, '.')
      .replace(/\s/g, '')
      .replace(/(\d+(\.\d*)?)[\s\S]*/, '$1')
  )
}

module.exports = priceFilter
