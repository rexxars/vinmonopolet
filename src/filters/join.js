module.exports = function (keys, filter) {
  return function joinKeysFilter(value, row) {
    const values = []
    keys.forEach(key => {
      if (row[key]) {
        values.push(filter
          ? filter(row[key])
          : row[key]
        )
      }
    })
    return values
  }
}
