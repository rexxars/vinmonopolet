const sizeMatcher = /cache\/(\d+)x(\d+)[/-]/

function ProductImage(img) {
  this.format = img.format
  this.description = img.altText
  this.type = img.imageType
  this.url = img.url
  this.size = guessSizeFromUrl(img.url)
}

ProductImage.prototype.toString = function () {
  return this.url
}

function guessSizeFromUrl(url) {
  const [, width, height] = (url && url.match(sizeMatcher)) || []
  return width && height ? {
    maxWidth: Number(width),
    maxHeight: Number(height)
  } : null
}

module.exports = ProductImage
