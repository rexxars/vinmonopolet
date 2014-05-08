[![Build Status][1]][2] [![dependency status][3]][4]

vinmonopolet
============

Crawls Vinmonopolet and extracts information on the products available

## Installation
The `vinmonopolet` library can be installed using [npm](https://npmjs.org/):

```bash
# NPM:
npm install --save vinmonopolet
```

## Usage

```javascript
var vinmonopolet = require('vinmonopolet');

vinmonopolet.getCategories(function(err, categories) {
    console.log(categories);
    /*
    [ { title: 'Rødvin', count: 6033, filterId: 25 },
      { title: 'Hvitvin', count: 3997, filterId: 25 },
      { title: 'Rosévin', count: 465, filterId: 25 },
      { title: 'Musserende vin', count: 1143, filterId: 25 },
      { title: 'Fruktvin', count: 72, filterId: 25 },
      { title: 'Sterkvin', count: 312, filterId: 25 },
      { title: 'Brennevin', count: 2242, filterId: 25 },
      { title: 'Øl', count: 668, filterId: 25 },
      { title: 'Alkoholfritt', count: 56, filterId: 25 } ]
    */
});

// Note: This might take a while.
vinmonopolet.getProductsByCategoryName('Øl', function(err, products) {
    console.log(products);
    /*
    [ { sku: 9351702,
        title: 'Ægir Lynchburg Natt Barrel-Aged Imperial Porter',
        containerSize: '50 cl',
        price: 159.9,
        pricePerLiter: 319.8 },
      { sku: 597902,
        title: 'Ægir Mai Helles Bock',
        containerSize: '50 cl',
        price: 59.9,
        pricePerLiter: 119.8 },
      { sku: 9477602,
        title: 'Ægir Ratatosk Double IPA',
        containerSize: '50 cl',
        price: 84.9,
        pricePerLiter: 169.8 } ]
    */
});

vinmonopolet.getProductDetails(9351702, function(err, product) {
    console.log(product);

    /*
    { sku: 9351702,
      title: 'Ægir Lynchburg Natt Barrel-Aged Imperial Porter',
      containerSize: '50 cl',
      price: 159.9,
      pricePerLiter: 319.8,
      productType: 'Overgjæret',
      productSelection: 'Bestillingsutvalg',
      shopCategory: 'Uavhengig sortiment',
      fullness: 0.83,
      sweetness: 0.5,
      bitterness: 0.67,
      color: 'Mørk',
      aroma: 'Kaffe, mørkt malt, fat, whisky, noe vanilje.',
      taste: 'God fylde og bitterhet, kaffe, sjokolade og noe fat, lang avslutning.',
      foodPairings: 'Apertiff',
      countryRegion: 'Norge, Øvrige',
      ingredients: 'Maltet bygg, humle, gjær, vann',
      alcohol: 10,
      sugar: 'Ukjent',
      acid: 'Ukjent',
      storable: 'Drikkeklar nå, men kan også lagres',
      manufacturer: 'Ægir Bryggeri',
      wholesaler: 'Cask Norway AS',
      distributor: 'SKANLOG VSD AS',
      containerType: 'Engangsflasker av glass' }
    */
});

```

[1]: https://travis-ci.org/rexxars/vinmonopolet.png
[2]: https://travis-ci.org/rexxars/vinmonopolet
[3]: https://david-dm.org/rexxars/vinmonopolet.png
[4]: https://david-dm.org/rexxars/vinmonopolet
