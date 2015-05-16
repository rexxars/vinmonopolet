'use strict';

var expect = require('chai').expect;
var productScraper = require('../../src/scrapers/product');
var Product = require('../../src/models/product');

describe('product scraper', function() {
    it('returns error if sku was not found', function(done) {
        productScraper('foo', function(err) {
            expect(err).to.be.an.instanceOf(Error);
            done();
        });
    });

    it('returns error if product title was not found', function(done) {
        productScraper('<div><input name="sku" value="2270002" /></div>', function(err) {
            expect(err).to.be.an.instanceOf(Error);
            done();
        });
    });

    it('returns Product model instance on successful retrieval', function(done) {
        productScraper(getValidHtml(), function(err, product) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(product).to.be.an.instanceOf(Product);

            expect(product.sku).to.equal(2270002);
            expect(product.title).to.equal('Ego Brygghus - Reign in Citra');
            expect(product.containerSize).to.equal(0.5);
            expect(product.price).to.equal(69.5);
            expect(product.pricePerLiter).to.equal(139);
            expect(product.availability).to.be.an('undefined');
            done();
        });
    });

    it('returns Product model with availability if present', function(done) {
        productScraper(getValidHtml({ availability: true }), function(err, product) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(product).to.be.an.instanceOf(Product);

            expect(product.sku).to.equal(2270002);
            expect(product.availability).to.have.length(2);

            expect(product.availability[0].storeId).to.equal(244);
            expect(product.availability[0].storeName).to.equal('Molde Vinmonopol');
            expect(product.availability[0].quantity).to.equal(32);
            expect(product.availability[0].productSku).to.equal(2270002);

            expect(product.availability[1].storeId).to.equal(178);
            expect(product.availability[1].storeName).to.equal('Oslo, Kiellandsplass Vinmonopol');
            expect(product.availability[1].quantity).to.equal(18);
            expect(product.availability[1].productSku).to.equal(2270002);
            done();
        });
    });

    it('returns Product model with meta information if present', function(done) {
        productScraper(getValidHtml({ productData: true }), function(err, product) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(product).to.be.an.instanceOf(Product);

            expect(product.sku).to.equal(2270002);
            expect(product.title).to.equal('Ego Brygghus - Reign in Citra');
            expect(product.containerSize).to.equal(0.5);
            expect(product.price).to.equal(69.5);
            expect(product.pricePerLiter).to.equal(139);
            expect(product.productType).to.equal('Overgjæret');
            expect(product.productSelection).to.equal('Bestillingsutvalg');
            expect(product.storeCategory).to.equal('Uavhengig sortiment');
            expect(product.fullness).to.equal(58);
            expect(product.freshness).to.equal(67);
            expect(product.bitterness).to.equal(67);
            expect(product.color).to.equal('Mørk gyllen, kritthvit skum');
            expect(product.aroma).to.equal('Floral og sitrus-dominert aroma.');
            expect(product.taste).to.equal('Balansert bitterhet med en fin fruktighet i avslutning.');
            expect(product.foodPairings).to.have.members(['Apertiff', 'Grønnsaker']);
            expect(product.country).to.equal('Norge');
            expect(product.region).to.equal('Østfold');
            expect(product.ingredients).to.equal('Humle, vann, gjær og malt');
            expect(product.method).to.equal('Tradisjonell overgjæret prosess');
            expect(product.abv).to.equal(5.4);
            expect(product.sugar).to.equal(12);
            expect(product.acid).to.equal(null);
            expect(product.storable).to.equal('Drikkeklar, ikke egnet for lagring');
            expect(product.manufacturer).to.equal('Ego Brygghus');
            expect(product.wholesaler).to.equal('Beer Enthusiast AS');
            expect(product.distributor).to.equal('Cuveco AS');
            expect(product.containerType).to.equal('Engangsflasker av glass');
            expect(product.corkType).to.equal('Crown Cap');
            expect(product.url).to.equal('http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-2270002');

            done();
        });
    });

    it('executes unknownPropLogger if encountering unknown product properties', function(done) {
        var addHtml = [
            '<div class="productData"><ul><li><strong class="attrib">Foo:</strong> ',
            '<span class="data">bar</span></li></ul></div>'
        ].join('');

        process.env.DEBUG = 1;
        productScraper.unknownPropLogger = function(msg) {
            expect(msg).to.equal('Unknown prop: "Foo", value: "bar"');
            done();
        };

        productScraper(getValidHtml({ add: addHtml }), function(err, product) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(product).to.be.an.instanceOf(Product);

            expect(product.sku).to.equal(2270002);
        });
    });

    it('swallows errors if no unknownPropLogger if encountering unknown product properties', function(done) {
        var addHtml = [
            '<div class="productData"><ul><li><strong class="attrib">Foo:</strong> ',
            '<span class="data">bar</span></li></ul></div>'
        ].join('');

        delete process.env.DEBUG;
        productScraper.unknownPropLogger = function() {
            expect(false).to.equal(true, 'Unknown property logger should never be called in non-debug mode');
        };

        productScraper(getValidHtml({ add: addHtml }), function(err, product) {
            expect(err).to.not.be.an.instanceOf(Error);
            expect(product).to.be.an.instanceOf(Product);

            expect(product.sku).to.equal(2270002);
            done();
        });
    });
});

function getValidHtml(opts) {
    var parts = [
        '  <input name="sku" value="2270002" />',
        '  <h1>Ego Brygghus - Reign in Citra</h1>',
        '  <div id="addToCart">',
        '    <h3><em>50&nbsp;cl</em>',
        '    <strong>Kr. 69,50</strong></h3>',
        '    <p>Kr. 139,-\n pr. liter</p>',
        '  </div>'
    ];

    if (opts && opts.availability) {
        parts = parts.concat([
            '<ul class="listStores"><li>',
            '  <a href=\'url?butikk_id=244\'><strong>Molde Vinmonopol</strong></a>',
            '  <em>(32 p&aring; lager)</em>',
            '</li><li>',
            '  <a href=\'url?butikk_id=178\'><strong>Oslo, Kiellandsplass Vinmonopol</strong></a>',
            '  <em>(18 p&aring; lager)</em>',
            '</li></ul>'
        ]);
    }

    if (opts && opts.productData) {
        parts = parts.concat([
            '<div class="productData">',
            '  <ul>',
            '    <li><strong class="attrib">Varenummer:</strong> <span class="data">2270002</span></li>',
            '    <li><strong class="attrib">Varetype:</strong> <span class="data">Overgj&aelig;ret</span></li>',
            '    <li><strong class="attrib">Produktutvalg:</strong> <span class="data">Bestillingsutvalg</span></li>',
            '    <li><strong class="attrib">Butikkategori:</strong> <span class="data">Uavhengig sortiment</span></li>',
            '    <li>',
            '      <strong class="attrib">Karakteristikk:</strong>',
            '      <span class="facet"><em>Fylde:</em><img height="15" src="/clocks/7.gif" width="15"></span>',
            '      <span class="facet"><em>Friskhet:</em><img height="15" src="/clocks/8.gif" width="15"></span>',
            '      <span class="facet"><em>Bitterhet:</em><img height="15" src="/clocks/8.gif" width="15"></span>',
            '    </li>',
            '    <li><strong class="attrib">Farge:</strong> <span class="data">M&oslash;rk gyllen, kritthvit skum.</span></li>',
            '    <li><strong class="attrib">Lukt:</strong> <span class="data">Floral og sitrus-dominert aroma.</span></li>',
            '    <li><strong class="attrib">Smak:</strong> <span class="data">Balansert bitterhet med en fin fruktighet i avslutning.</span></li>',
            '    <li>',
            '      <strong class="attrib">Passer til:</strong>',
            '      <span class="data">',
            '        <img alt="Apertiff" src="/food/A.gif" title="Apertiff">&nbsp;&nbsp;',
            '        <img alt="Grønnsaker" src="/food/R.gif" title="Grønnsaker">&nbsp;&nbsp;',
            '      </span>',
            '    </li>',
            '    <li><strong class="attrib">Land/distrikt:</strong> <span class="data">Norge, &Oslash;stfold</span></li>',
            '    <li><strong class="attrib">Råstoff:</strong> <span class="data">Humle, vann, gjær og malt</span></li>',
            '    <li><strong class="attrib">Metode:</strong> <span class="data">Tradisjonell overgj&aelig;ret prosess</span></li>',
            '    <li>',
            '      <strong class="attrib">Innhold:</strong>',
            '      <span class="facet">Alkohol 5,40%</span>',
            '      <span class="facet">Sukker: 12,00 g/l</span>',
            '      <span class="facet">Syre: Ukjent</span>',
            '    </li>',
            '    <li><strong class="attrib">Lagringsgrad:</strong><span class="data">Drikkeklar, ikke egnet for lagring</span></li>',
            '    <li><strong class="attrib">Produsent:</strong> <span class="data">Ego Brygghus</span></li>',
            '    <li><strong class="attrib">Grossist:</strong> <span class="data">Beer Enthusiast AS</span></li>',
            '    <li><strong class="attrib">Distribut&oslash;r:</strong> <span class="data">Cuveco AS</span></li>',
            '    <li><strong class="attrib">Emballasjetype:</strong> <span class="data">Engangsflasker av glass</span></li>',
            '    <li><strong class="attrib">Korktype:</strong> <span class="data">Crown Cap</span></li>',
            '  </ul>',
            '</div>'
        ]);
    }

    if (opts && opts.add) {
        parts.push(opts.add);
    }

    return '<div class="pageBody">' + parts.join('\n') + '</div>';
}

module.exports = {
    getValidHtml: getValidHtml
};
