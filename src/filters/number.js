function normalizeNumber(number) {
  const num = String(number)
  return num.replace(/,/g, '.').replace(/\s/g, '').replace(/,/g, '.')
}

function numberFilter(number) {
  if (!number) {
    return null
  }

  if (number.value) {
    return number.value
  }

  const num = String(number)
  if (num === '') {
    return null
  }

  if (num.indexOf('-') !== -1) {
    return num.split('-').map(numberFilter).join('-')
  }

  return Number(normalizeNumber(number))
}

numberFilter.greedy = function (number) {
  const num = normalizeNumber(number)
  if (num === '') {
    return null
  }

  const normalized = num
    .replace(/[^\d.]/g, '')
    .replace(/(^\.+|\.+$)/g, '')

  return Number(normalized)
}

numberFilter.nullify = function (nulls) {
  return function (number) {
    if (nulls.indexOf(number) > -1) {
      return null
    }

    return numberFilter(number)
  }
}

module.exports = numberFilter
