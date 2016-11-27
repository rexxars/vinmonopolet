const noSupport = () => {
  throw new Error('Streaming functions not supported in browsers')
}

module.exports = {
  getProducts: noSupport,
  getStores: noSupport
}
