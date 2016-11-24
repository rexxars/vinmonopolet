const mocha = require('mocha')
const expect = require('chai').expect
const vinmonopolet = require('../')
require('hard-rejection/register')

const describe = mocha.describe
const it = mocha.it

describe('vinmonopolet', function () {
  this.timeout(30000)

  describe('getProducts', () => {
    it('can get basic product listing, returns promise of array', () =>
      expect(vinmonopolet.getProducts({sort: 'name'}))
        .to.eventually.have.length.above(0)
    )
  })
})
