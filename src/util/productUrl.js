const baseUrl = 'https://www.vinmonopolet.no'

module.exports = path => {
  if (path[0] === '/') {
    return `${baseUrl}${path}`
  }

  return `${baseUrl}/p/${path}`
}
