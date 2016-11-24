const request = require('../util/request')

const refUrl = 'https://www.vinmonopolet.no/datadeling'
const matcher = /["'](https?:\/\/[^"']+\.csv)["']>(Produkt|Butikk)/g
const map = {Butikk: 'stores', Produkt: 'products'}

request.raw(refUrl)
  .then(body => {
    const urls = {}

    /* eslint-disable no-cond-assign */
    let match
    while (match = matcher.exec(body)) {
      const [, url, type] = match
      urls[map[type]] = url
    }
    /* eslint-enable no-cond-assign */

    if (Object.keys(urls).length > 1) {
      return urls
    }

    throw new Error(
      `Failed to extract CSV-URLs from "${refUrl}" - please file an issue!`
    )
  })
  .then(urls => {
    Object.keys(urls).forEach(key => {
      console.log(key, ':', urls[key]) // eslint-disable-line no-console
    })
  })
  .catch(err => {
    setImmediate(() => {
      throw err
    })
  })
