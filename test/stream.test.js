'use strict';

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

var polet = require('../');
var Product = require('../src/models/product');
var Store = require('../src/models/store');

var getNock = function() {
    return require('nock');
};

describe('vinmonopolet-stream', function() {
    describe('product stream', function() {
        it('emits data events', function(done) {
            this.timeout(500);
            var mock = getProductStreamMock();

            polet
                .getProductStream()
                .once('data', function(product) {
                    expect(product).to.be.an.instanceOf(Product);
                })
                .on('end', function() {
                    mock.done();
                    done();
                });
        });

        it('converts strings to UTF-8', function(done) {
            this.timeout(500);
            var mock = getProductStreamMock();

            polet
                .getProductStream()
                .once('data', function(product) {
                    expect(product.title).to.equal('Løiten Linie');
                    expect(product.region).to.equal('Øvrige');
                })
                .on('end', function() {
                    mock.done();
                    done();
                });
        });

        it('transforms rows according to data map', function(done) {
            this.timeout(500);
            var mock = getProductStreamMock();

            var last;
            polet.getProductStream().on('data', function(product) {
                last = product;
            }).on('end', function() {
                expect(last.sku).to.equal(2002);
                expect(last.title).to.equal('Graham\'s Late Bottled Vintage 2008/2009');
                expect(last.containerSize).to.equal(0.38);
                expect(last.price).to.equal(119.9);
                expect(last.pricePerLiter).to.equal(319.7);
                expect(last.productType).to.equal('Portvin');
                expect(last.productSelection).to.equal('Basisutvalget');
                expect(last.storeCategory).to.equal('Butikkategori 6');
                expect(last.fullness).to.equal(67);
                expect(last.freshness).to.equal(67);
                expect(last.tannins).to.equal(33);
                expect(last.bitterness).to.equal(42);
                expect(last.sweetness).to.equal(67);
                expect(last.color).to.equal('Mørk rød');
                expect(last.aroma).to.equal('Svalt preg av modne mørke bær, tørket frukt, lakris og krydder.');
                expect(last.taste).to.equal('Rik, sødmefull og fint balansert. Fast, litt krydderpreget ettersmak. (2008)');
                expect(last.foodPairings).to.include.members(['Dessert, kake, frukt', 'Ost']);
                expect(last.country).to.equal('Portugal');
                expect(last.region).to.equal('Douro');
                expect(last.subRegion).to.equal('Øvrige');
                expect(last.vintage).to.equal(2009);
                expect(last.ingredients).to.equal('Touriga Nacional, Touriga Franca, Tinta Roriz, Tinta Barroca, Tinto Cão');
                expect(last.method).to.equal('Temperaturkontrollert gjæring i ståltanker. 4-5 års fatlagring.');
                expect(last.abv).to.equal(20);
                expect(last.sugar).to.equal(101.5);
                expect(last.acid).to.equal(4.4);
                expect(last.storable).to.equal('Drikkeklar nå, men kan også lagres');
                expect(last.manufacturer).to.equal('W&J Graham');
                expect(last.wholesaler).to.equal('Stenberg & Blom AS');
                expect(last.distributor).to.equal('Cuveco AS');
                expect(last.containerType).to.equal('Engangsflasker av glass');
                expect(last.corkType).to.equal('Naturkork');
                expect(last.url).to.equal('http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-2002');

                mock.done();
                done();
            });
        });
    });

    describe('store stream', function() {
        it('emits data events', function(done) {
            this.timeout(500);
            var mock = getStoreStreamMock();

            polet
                .getStoreStream()
                .once('data', function(store) {
                    expect(store).to.be.an.instanceOf(Store);
                })
                .on('end', function() {
                    mock.done();
                    done();
                });
        });

        it('converts strings to UTF-8', function(done) {
            this.timeout(500);
            var mock = getStoreStreamMock();

            var last;
            polet
                .getStoreStream()
                .on('data', function(store) {
                    last = store;
                })
                .on('end', function() {
                    expect(last.streetAddress).to.equal('Østre Rosten 28');

                    mock.done();
                    done();
                });
        });

        it('transforms rows according to data map', function(done) {
            this.timeout(500);
            var mock = getStoreStreamMock();

            var last;
            polet.getStoreStream().on('data', function(store) {
                last = store;
            }).on('end', function() {
                expect(last.name).to.equal('Trondheim, City Syd');
                expect(last.streetAddress).to.equal('Østre Rosten 28');
                expect(last.streetZip).to.equal('7075');
                expect(last.streetCity).to.equal('TILLER');
                expect(last.postalAddress).to.equal('Østre Rosten 28');
                expect(last.postalZip).to.equal('7075');
                expect(last.postalCity).to.equal('TILLER');
                expect(last.phoneNumber).to.equal('04560');
                expect(last.category).to.equal('Kategori 7');
                expect(last.weekNumber).to.equal(20);

                expect(last.openingHoursMonday.opens).to.equal(600);
                expect(last.openingHoursMonday.closes).to.equal(1080);
                expect(last.openingHoursTuesday.opens).to.equal(600);
                expect(last.openingHoursTuesday.closes).to.equal(1080);
                expect(last.openingHoursWednesday.opens).to.equal(600);
                expect(last.openingHoursWednesday.closes).to.equal(1080);
                expect(last.openingHoursThursday).to.equal(null);
                expect(last.openingHoursFriday.opens).to.equal(600);
                expect(last.openingHoursFriday.closes).to.equal(1080);
                expect(last.openingHoursSaturday.opens).to.equal(600);
                expect(last.openingHoursSaturday.closes).to.equal(900);
                expect(last.weekNumberNext).to.equal(21);
                expect(last.openingHoursNextMonday.opens).to.equal(600);
                expect(last.openingHoursNextMonday.closes).to.equal(1080);
                expect(last.openingHoursNextTuesday.opens).to.equal(600);
                expect(last.openingHoursNextTuesday.closes).to.equal(1080);
                expect(last.openingHoursNextWednesday.opens).to.equal(600);
                expect(last.openingHoursNextWednesday.closes).to.equal(1080);
                expect(last.openingHoursNextThursday.opens).to.equal(600);
                expect(last.openingHoursNextThursday.closes).to.equal(1080);
                expect(last.openingHoursNextFriday.opens).to.equal(600);
                expect(last.openingHoursNextFriday.closes).to.equal(1080);
                expect(last.openingHoursNextSaturday).to.equal(null);

                expect(last.gpsCoordinates).to.include.members([
                    10.3809509,
                    63.3682271
                ]);

                mock.done();
                done();
            });
        });
    });
});

function getProductStreamMock() {
    var stream = fs.createReadStream(
        path.join(__dirname, 'fixtures', 'products-chunk.csv')
    );

    return getNock()('http://www.vinmonopolet.no')
        .get('/api/produkter')
        .reply(200, function() {
            return stream;
        });
}

function getStoreStreamMock() {
    var stream = fs.createReadStream(
        path.join(__dirname, 'fixtures', 'stores-chunk.csv')
    );

    return getNock()('http://www.vinmonopolet.no')
        .get('/api/butikker')
        .reply(200, function() {
            return stream;
        });
}
