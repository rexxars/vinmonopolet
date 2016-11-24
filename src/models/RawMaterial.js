function RawMaterial(mat) {
  this.id = mat.id
  this.name = mat.name
  this.percentage = Number(mat.percentage)
}

RawMaterial.prototype.toString = function () {
  return this.name
}

module.exports = RawMaterial
