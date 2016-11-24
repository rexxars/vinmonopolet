function clockToPrctFilter(val) {
  const num = Number(val)

  if (isNaN(num) || num === 0) {
    return null
  }

  const prct = Math.round((num / 12) * 100)
  return Math.min(100, Math.max(0, prct))
}

clockToPrctFilter.range = val => {
  return val
    .split('-')
    .map((num, i) => clockToPrctFilter(i === 0 ? num - 1 : num) || 0)
    .join(' - ')
}

module.exports = clockToPrctFilter
