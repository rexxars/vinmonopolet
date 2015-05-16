# vinmonopolet

[![npm version](http://img.shields.io/npm/v/vinmonopolet.svg?style=flat-square)](http://browsenpm.org/package/vinmonopolet)[![Build Status](http://img.shields.io/travis/rexxars/vinmonopolet/master.svg?style=flat-square)](https://travis-ci.org/rexxars/vinmonopolet)[![Coverage Status](http://img.shields.io/codeclimate/coverage/github/rexxars/vinmonopolet.svg?style=flat-square)](https://codeclimate.com/github/rexxars/vinmonopolet)[![Code Climate](http://img.shields.io/codeclimate/github/rexxars/vinmonopolet.svg?style=flat-square)](https://codeclimate.com/github/rexxars/vinmonopolet/)

Extracts information on products, categories and stores from Vinmonopolet

## Installation
The `vinmonopolet` library can be installed using [npm](https://npmjs.org/):

```bash
npm install --save vinmonopolet
```

## Notes

It's important to note that this library uses two different ways of getting information, which results in very different retrieval speeds and a slightly different amount of details:

* `getProductStream()` and `getStoreStream()` retrieve data in a very efficient and fast manner and should be highly reliable. However, the products emitted do not include all the details available by using `getProduct()`.
* The other methods use web scraping, and as such they are slower and more error-prone. They do however include more details - store availability for products being one such example.

## Usage

### Get all products

```javascript
var vinmonopolet = require('vinmonopolet');

vinmonopolet
    .getProductStream()
    .on('data', function(product) {
        console.log(product);
    })
    .on('end', function() {
        console.log('Done!');
    });
```

### Get all stores

```javascript
var vinmonopolet = require('vinmonopolet');

vinmonopolet
    .getStoreStream()
    .on('data', function(store) {
        console.log(store);
    })
    .on('end', function() {
        console.log('Done!');
    });
```

### Get all products within a given category name (SLOW)

```js
var vinmonopolet = require('vinmonopolet');

// Note: This will take a while.
vinmonopolet.getProductsByCategoryName('Øl', function(err, products) {
    console.log(products);
});
```

### Get product info for given SKU

```js
var vinmonopolet = require('vinmonopolet');

vinmonopolet.getProduct(9351702, function(err, product) {
    console.log(product);
});
```

### Search for products

```js
var vinmonopolet = require('vinmonopolet');

vinmonopolet.searchProducts({
    query: 'Ego Brygghus',
    detailed: true // Default is false - faster, but limited data set
}, function(err, results) {
    console.log(results);
});
```

### Get all root-level categories

```js
var vinmonopolet = require('vinmonopolet');

vinmonopolet.getCategories(function(err, categories) {
    console.log(categories);
});
```

### Get entire category tree (SLOW)

```js
var vinmonopolet = require('vinmonopolet');

// Note: This takes a while
vinmonopolet.getCategoryTree(function(err, tree) {
    console.log(tree);

    // Result:
    [ { title: 'Rødvin', productCount: 6149, filterId: 25, types: null },
      { title: 'Hvitvin', productCount: 4128, filterId: 25, types: null },
      { title: 'Rosévin', productCount: 490, filterId: 25, types: null },
      /* ... */
      { title: 'Brennevin',
        productCount: 2334,
        filterId: 25,
        types:
          [ { title: 'Whisky',
              productCount: 675,
              filterId: 26,
              subtypes: [
                { title: 'Maltwhisky',
                  productCount: 508,
                  filterId: 27,
                  subtypes: null } ] },
            { title: 'Druebrennevin',
               productCount: 564,
               filterId: 26,
               subtypes:
                 [ { title: 'Grappa',
                     productCount: 56,
                     filterId: 27,
                     subtypes: null } ] },
            { title: 'Akevitt', productCount: 184, filterId: 26, subtypes: null },
            /* ... */
          ]}
      /* ... */
    ]
});
```

## Models

### Product

**Note**: Different methods return a different set of properties, unfortunately. This is due to Vinmonopolet not having an API that delivers all available data, and combining all the different sources would be too expensive. Rule of thumb: Use `getProduct()` for a fairly complete model. Incomplete models can be populated by calling `product.populate(callback)`.

```js
{
    // Product ID / Stock Keeping Unit
    sku: 2270002,
    // Product name, usually with manufacturer name
    title: 'Ego Brygghus Reign in Citra',
    // Container size in liters
    containerSize: 0.5,
    // Price per unit/container
    price: 69.5,
    // Price per liter
    pricePerLiter: 139,
    // Product type (Norwegian)
    productType: 'Overgjæret',
    // Product selection (basis-, test-, parti- or bestillingsutvalg)
    productSelection: 'Bestillingsutvalg',
    // Store category between 1 and 7, or independent (Norwegian)
    storeCategory: 'Uavhengig sortiment',
    // Fullness (scale: 0 - 100, null means not specified)
    fullness: 58,
    // Freshness (scale: 0 - 100, null means not specified)
    freshness: 67,
    // Bitterness (scale: 0 - 100, null means not specified)
    bitterness: 67,
    // Product color description (Norwegian)
    color: 'Mørk gyllen, kritthvit skum',
    // Product aroma description (Norwegian)
    aroma: 'Floral og sitrus-dominert aroma.',
    // Product taste description (Norwegian)
    taste: 'Balansert bitterhet med en fin fruktighet i avslutning.',
    // Array of appropriate food pairings (Norwegian)
    foodPairings: [ 'Apertiff', 'Grønnsaker' ],
    // Country of origin (Norwegian)
    country: 'Norge',
    // Region of origin (Norwegian)
    region: 'Østfold',
    // Product ingredients (Norwegian)
    ingredients: 'Humle, vann, gjær og malt',
    // Brewing method (Norwegian)
    method: 'Tradisjonell overgjæret prosess',
    // Alcohol by volume
    abv: 5.4,
    // Grams of sugar per liter (null means not specified)
    sugar: 12,
    // Grams of acid per liter (null means not specified)
    acid: null,
    // Description of how storable this product is (Norwegian)
    storable: 'Drikkeklar, ikke egnet for lagring',
    // Product manufacturer (brewery/wineyard etc)
    manufacturer: 'Ego Brygghus',
    // Product wholesaler
    wholesaler: 'Beer Enthusiast AS',
    // Product distributor
    distributor: 'Cuveco AS',
    // Container type description (Norwegian)
    containerType: 'Engangsflasker av glass',
    // Type of cork (Norwegian)
    corkType: 'Crown Cap',
    // Array of stores where the product is available, see below
    availability:
     [ [Object(Availability)],
       [Object(Availability)],
       [Object(Availability)] ],
    // URL to the product detail page
    url: 'http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-2270002'
}
```

### Availability

```js
{
    // Name of the store which has the product in store
    storeName: 'Fredrikstad, Torvbyen Vinmonopol',
    // ID of the store which has the product in store
    storeId: 219,
    // Quantity of product in stock
    quantity: 22
}
```

### Category

```js
{
    // Name of category
    title: 'Øl',
    // Number of products in category
    productCount: 947,
    // Filter ID (used internally)
    filterId: 25
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
    gpsCoordinates: [ 10.7169757, 59.9206481 ],

    // Opening hour details for the given week
    // Numbers in `opens` and `closes` are minutes since midnight.
    // In other words: 600 means 10AM, 1080 means 6PM
    // Any null values means it's closed
    weekNumber: 20,
    openingHoursMonday: { opens: 600, closes: 1080 },
    openingHoursTuesday: { opens: 600, closes: 1080 },
    openingHoursWednesday: { opens: 600, closes: 1080 },
    openingHoursThursday: null,
    openingHoursFriday: { opens: 540, closes: 1080 },
    openingHoursSaturday: { opens: 540, closes: 900 },

    // Opening hour details for the next week
    weekNumberNext: 21,
    openingHoursNextMonday: { opens: 600, closes: 1080 },
    openingHoursNextTuesday: { opens: 600, closes: 1080 },
    openingHoursNextWednesday: { opens: 600, closes: 1080 },
    openingHoursNextThursday: { opens: 600, closes: 1080 },
    openingHoursNextFriday: { opens: 540, closes: 1080 },
    openingHoursNextSaturday: null
}
```

### Type

```js
{
    // Name of type
    title: 'Druebrennevin',
    // Number of products in type
    productCount: 577,
    // Filter ID (used internally)
    filterId: 26
}
```

## License

MIT-licensed. See LICENSE.
