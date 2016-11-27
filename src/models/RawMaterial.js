function RawMaterial(mat) {
  this.id = mat.id
  this.name = mat.name
  this.percentage = mat.percentage ? Number(mat.percentage) : null
}

RawMaterial.prototype.toString = function () {
  return this.name
}

module.exports = RawMaterial
