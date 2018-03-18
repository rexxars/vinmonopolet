const baseUrl = 'https://www.vinmonopolet.no'
const oldUrl = 'http://www.vinmonopolet.no/vareutvalg'

// Vinmonopolet seems to use a weird mix of escape/encodeURIComponent
const enc = str => encodeURIComponent(str)
  .replace(/'/g, '%27')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/~/g, '%7E')
  .replace(/!/g, '%21')

module.exports = (url, row) => {
  const path = String(url)
  if (path[0] === '/') {
    return `${baseUrl}${path}`
  }

  if (path.indexOf(oldUrl) === 0) {
    // Try rewriting to new format
    const namePart = enc(row.Varenavn.replace(/[.\s]/ig, '-').replace(/-{2,}/g, '-'))
    return [baseUrl, 'vmp', row.Land && `Land/${enc(row.Land)}`, namePart, 'p', row.Varenummer]
      .filter(Boolean).join('/')
  }

  return `${baseUrl}/p/${path}`
}
