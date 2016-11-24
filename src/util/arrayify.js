module.exports = function arrayify(item) {
  return Array.isArray(item) ? item : [item]
}
