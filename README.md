# vinmonopolet

[![npm version](http://img.shields.io/npm/v/vinmonopolet.svg?style=flat-square)](http://browsenpm.org/package/vinmonopolet)[![Build Status](http://img.shields.io/travis/rexxars/vinmonopolet/master.svg?style=flat-square)](https://travis-ci.org/rexxars/vinmonopolet)[![Coverage Status](http://img.shields.io/codeclimate/coverage/github/rexxars/vinmonopolet.svg?style=flat-square)](https://codeclimate.com/github/rexxars/vinmonopolet)[![Code Climate](http://img.shields.io/codeclimate/github/rexxars/vinmonopolet.svg?style=flat-square)](https://codeclimate.com/github/rexxars/vinmonopolet/)

Extracts information on products and stores from Vinmonopolet

## Installation
The `vinmonopolet` library can be installed using [npm](https://npmjs.org/):

```bash
npm install --save vinmonopolet
```

```bash
yarn add vinmonopolet
```

## Disclaimer & terms of service

Please see https://www.vinmonopolet.no/datadeling for the terms of service regarding usage of the data retrieved through this module. Please note that this module is not in any way endorsed by or affiliated with Vinmonopolet.

## Usage

### Get products

```js
const vinmonopolet = require('vinmonopolet')

vinmonopolet.getProducts().then(response => {
  console.log(response.products) // Array of products
  console.log(response.pagination) // Info on pagination
})
```

### Sort products by price

```js
const vinmonopolet = require('vinmonopolet')

// Available sorting modes: `price`, `name`, `relevance`
vinmonopolet.getProducts({sort: ['price', 'desc']}).then(response => {
  console.log(response.products) // Array of products
  console.log(response.pagination) // Info on pagination
})
```

### Get all products within a category

** Note **: ES6 async/await, but you get the idea

```js
import {getProducts, Facet} from 'vinmonopolet'

async function getAllCiders() {
  let {pagination, products} = await getProducts({facet: Facet.Category.CIDER})
  
  while (pagination.hasNext) {
    const response = await pagination.next()
    products = products.concat(response.products)
    pagination = response.pagination
  }

  return products
}

getAllMeads().then(allProducts => {
  console.log(allProducts)
})
```

### Search for products

```js
const vinmonopolet = require('vinmonopolet')

vinmonopolet.searchProducts('valpolicella', {sort: ['price', 'asc']}).then(response => {
  console.log(response.products) // Array of products
  console.log(response.pagination) // Info on pagination
})
```

### Get specific product by code (detailed)

```js
const vinmonopolet = require('vinmonopolet')

vinmonopolet.getProduct('1174701').then(product => {
  console.log(product)
})
```

### Get specific product by barcode (detailed)

```js
const vinmonopolet = require('vinmonopolet')

vinmonopolet.getProductByBarcode('5060154910315').then(product => {
  console.log(product)
})
```

### Get facets to use in product filtering

```js
const vinmonopolet = require('vinmonopolet')

vinmonpolet.getFacets().then(facets => {
  const countryFacet = facets.find(facet => facet.name === 'mainCountry')
  const norwayFacetValue = countryFacet.values.find(val => val.name === 'Norge')
  
  return vinmonopolet.getProducts({limit: 3, facet: norwayFacetValue})
}).then(response => {
  console.log(response.products) // 3 products from Norway
})
```

### Get all products as a stream (node only)

```javascript
const vinmonopolet = require('vinmonopolet');

vinmonopolet
  .stream.getProducts()
  .on('data', function(product) {
    console.log(product);
  })
  .on('end', function() {
    console.log('Done!');
  });
```

### Get all stores as a stream (node only)

```javascript
const vinmonopolet = require('vinmonopolet');

vinmonopolet
  .stream.getStores()
  .on('data', function(store) {
    console.log(store);
  })
  .on('end', function() {
    console.log('Done!');
  });
```

## Models

### Product

**Note**: Unless you are using `getProduct()`, products will contain a subset of this info. To fully populate a product, call `product.populate()`, which will return a promise. You can check if a product is fully populated by calling `isComplete()` on it.

```js
{
  // Product code (ID)
  code: '2179901',
  // Product name, usually with manufacturer name
  name: 'Mikkeller Black Ink and Blood Imperial raspberry stout Brandy',
  // Product type (Norwegian)
  productType: 'Øl',
  // Alcohol by volume
  abv: 17,
  // URL to the product detail page
  url: 'https://www.vinmonopolet.no/Land/Belgia/Mikkeller-Black-Ink-and-Blood-Imperial-raspberry-stout-Brandy/p/2179901',
  // Price per unit/container
  price: 288.8,
  // Price per liter
  pricePerLiter: 385.1,
  // Product images
  images: [{
    format: 'zoom',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'PRIMARY',
    url: 'https://bilder.vinmonopolet.no/cache/515x515-0/2179901-1.jpg',
    size: {width: 515, height: 515}
  }, {
    format: 'product',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'PRIMARY',
    url: 'https://bilder.vinmonopolet.no/cache/300x300-0/2179901-1.jpg',
    size: {width: 300, height: 300}
  }, {
    format: 'thumbnail',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'PRIMARY',
    url: 'https://bilder.vinmonopolet.no/cache/96x96-0/2179901-1.jpg',
    size: {width: 96, height: 96}
  }, {
    format: 'cartIcon',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'PRIMARY',
    url: 'https://bilder.vinmonopolet.no/cache/65x65-0/2179901-1.jpg',
    size: {width: 65, height: 65}
  }, {
    format: 'superZoom',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'GALLERY',
    url: 'https://bilder.vinmonopolet.no/cache/1200x1200-0/2179901-1.jpg',
    size: {width: 1200, height: 1200}
  }, {
    format: 'zoom',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'GALLERY',
    url: 'https://bilder.vinmonopolet.no/cache/515x515-0/2179901-1.jpg',
    size: {width: 515, height: 515}
  }, {
    format: 'product',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'GALLERY',
    url: 'https://bilder.vinmonopolet.no/cache/300x300-0/2179901-1.jpg',
    size: {width: 300, height: 300}
  }, {
    format: 'thumbnail',
    description: 'Mikkeller Black Ink and Blood Imperial Raspberry Stout Brandy',
    type: 'GALLERY',
    url: 'https://bilder.vinmonopolet.no/cache/96x96-0/2179901-1.jpg',
    size: {width: 96, height: 96}
  }],
  // EAN-13 barcode
  barcode: 5704255106825,
  // Container size in liters
  containerSize: 0.75,
  // Container type description (Norwegian)
  containerType: 'Glass',
  // Vintage (year)
  vintage: null,
  // Type of cork (Norwegian)
  cork: null,
  // Product description, if any
  description: '',
  // Product summary, if any
  summary: '',
  // Brewing method (Norwegian)
  method: null,
  // Sulfates/tannins (scale 0 - 100, null means not specified)
  tannins: null,
  // Fullness (scale: 0 - 100, null means not specified)
  fullness: 83,
  // Sweetness (scale: 0 - 100, null means not specified)
  sweetness: null,
  // Freshness (scale: 0 - 100, null means not specified)
  freshness: 25,
  // Bitterness (scale: 0 - 100, null means not specified)
  bitterness: 33,
  // Product color description (Norwegian)
  color: 'Dyp mørk.',
  // Product aroma description (Norwegian)
  aroma: 'Kaffebønner, bringebær og brandy.',
  // Product taste description (Norwegian)
  taste: 'Kompleks. Vanilje, bringebær, kaffe og brandy.',
  // Description of how storable this product is (Norwegian)
  storable: 'Drikkeklar nå, men kan også lagres',
  // Array of appropriate food pairings (names in Norwegian)
  foodPairing: [
    {code: 'A', identifier: 'aperitif', name: 'Aperitiff/avec'},
    {code: 'L', identifier: 'cheese', name: 'Ost'},
    {code: 'N', identifier: 'dessert', name: 'Dessert, kake, frukt'}
  ],
  // Array of "raw materials". Unfortunately not as structured as one could have wanted.
  rawMaterial: [{
    id: '999',
    name: 'Vann, malt, bringebær, bygg, mørk cassanade, humle og champagnegjær',
    percentage: null
  }],
  // Grams of sugar per liter (null means not specified)
  sugar: null,
  // Grams of acid per liter (null means not specified)
  acid: null,
  // Whether this product is considered ecological
  eco: false,
  // Whether this product is gluten free
  gluten: false,
  // Whether this product is kosher
  kosher: false,
  // Whether this product is "fair trade"-labeled
  fairTrade: false,
  // Whether this product is produced in accordance to biodynamic agriculture methods
  bioDynamic: false,
  // Product producer (brewery/wineyard etc)
  mainProducer: {
    code: 'mikkeller/de_proef_brouwerij',
    name: 'Mikkeller/De Proef Brouwerij',
    url: '/Producenter/Mikkeller-De-Proef-Brouwerij/c/mikkeller%2Fde_proef_brouwerij'
  },
  // Product distributor
  distributor: 'Skanlog As',
  // ID of product distributor
  distributorId: 30190,
  // Product wholesaler
  wholesaler: 'Terroir AS',
  // Categories this product is categorized under
  categories: [
    {code: 'belgia', name: 'Belgia', url: '/Land/Belgia/c/belgia'},
    {code: 'belgia_øvrige', name: 'Øvrige', url: '/* cut from example */'},
    {code: 'øl', name: 'Øl', url: '/* cut from example */'},
    {code: 'mikkeller/de_proef_brouwerij', name: 'Mikkeller/De Proef Brouwerij', url: '/* cut from example */'},
    {code: 'øl_porter_&_stout', name: 'Porter & stout', url: '/* cut from example */'}
  ],
  // Main category for this product
  mainCategory: {
    code: 'øl',
    name: 'Øl',
    url: '/Nettbutikk-kategorier/%C3%98l/c/%C3%B8l'
  },
  // Subcategory for this product
  mainSubCategory: {
    code: 'øl_porter_&_stout',
    name: 'Porter & stout',
    url: '/Nettbutikk-kategorier/%C3%98l/Porter-%26-stout/c/%C3%B8l_porter_%26_stout'
  },
  // Main country this product was produced in
  mainCountry: {
    code: 'belgia',
    name: 'Belgia',
    url: '/Land/Belgia/c/belgia'
  },
  // District of country this product was produced in
  district: {
    code: 'belgia_øvrige',
    name: 'Øvrige',
    url: '/Land/Belgia/%C3%98vrige/c/belgia_%C3%B8vrige'
  },
  // Subdistrict, if any
  subDistrict: null,
  // Store category between 1 and 7, or independent (Norwegian)
  storeCategory: 'Uavhengig sortiment',
  // Product selection (Norwegian) (basis-, test-, parti- or bestillingsutvalget)
  productSelection: 'Bestillingsutvalget',
  // Age limit to buy this product
  ageLimit: 18,
  
  // Not really sure what these fields mean, but they're part of the data returned, so...
  buyable: true,
  deliveryTime: '0000030190',
  nrOfUsage: 3,
  availableForPickup: false,
  averageRating: null,
  stock: {stockLevel: 0, stockLevelStatus: 'outOfStock'},
  status: 'active',
  expiredDate: '2015-05-08',
  purchasable: true,
  newProduct: false,
  numberOfReviews: 0
}
```

### Store

```js
{
  name: 'Oslo, Briskeby',
  streetAddress: 'Briskebyveien 48',
  streetZip: '0258',
  streetCity: 'OSLO',
  postalAddress: 'Postboks  123',
  postalZip: '0258',
  postalCity: 'OSLO',
  phoneNumber: '04560',
  // Store category between 1 and 7, or independent (Norwegian)
  // The higher the number, the better the product selection
  category: 'Kategori 6',
  // Coordinates (longitude, latitude)
  gpsCoordinates: [10.7169757, 59.9206481],

  // Opening hour details for the given week
  // Numbers in `opens` and `closes` are minutes since midnight.
  // In other words: 600 means 10AM, 1080 means 6PM
  // Any null values means it's closed
  weekNumber: 20,
  openingHoursMonday: {opens: 600, closes: 1080},
  openingHoursTuesday: {opens: 600, closes: 1080},
  openingHoursWednesday: {opens: 600, closes: 1080},
  openingHoursThursday: null,
  openingHoursFriday: {opens: 540, closes: 1080},
  openingHoursSaturday: {opens: 540, closes: 900},

  // Opening hour details for the next week
  weekNumberNext: 21,
  openingHoursNextMonday: {opens: 600, closes: 1080},
  openingHoursNextTuesday: {opens: 600, closes: 1080},
  openingHoursNextWednesday: {opens: 600, closes: 1080},
  openingHoursNextThursday: {opens: 600, closes: 1080},
  openingHoursNextFriday: {opens: 540, closes: 1080},
  openingHoursNextSaturday: null
}
```

## License

MIT-licensed. See LICENSE.
