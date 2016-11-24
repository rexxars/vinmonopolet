module.exports = year => {
  return year && year !== '0000' ? Number(year) : null
}
