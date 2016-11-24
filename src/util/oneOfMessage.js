module.exports = function oneOfMessage(items) {
  const options = items.map(item => `"${item}"`).join(', ')
  return `Must be one of: ${options}`
}
