/* eslint-disable camelcase */
'use strict';

var openingHoursFilter = require('../filters/opening-hours');
var numberFilter = require('../filters/number');
var joinFilter = require('../filters/join');

module.exports = {
    Butikknavn: { name: 'name' },
    Gateadresse: { name: 'streetAddress' },
    Gate_postnummer: { name: 'streetZip' },
    Gate_poststed: { name: 'streetCity' },
    Postadresse: { name: 'postalAddress' },
    Post_postnummer: { name: 'postalZip' },
    Post_poststed: { name: 'postalCity' },
    Telefonnummer: { name: 'phoneNumber' },
    Kategori: { name: 'category' },
    GPS_lengdegrad: {
        name: 'gpsCoordinates',
        filter: joinFilter(['GPS_lengdegrad', 'GPS_breddegrad'], Number)
    },
    Ukenummer: {
        name: 'weekNumber',
        filter: numberFilter
    },
    Apn_mandag: {
        name: 'openingHoursMonday',
        filter: openingHoursFilter
    },
    Apn_tirsdag: {
        name: 'openingHoursTuesday',
        filter: openingHoursFilter
    },
    Apn_onsdag: {
        name: 'openingHoursWednesday',
        filter: openingHoursFilter
    },
    Apn_torsdag: {
        name: 'openingHoursThursday',
        filter: openingHoursFilter
    },
    Apn_fredag: {
        name: 'openingHoursFriday',
        filter: openingHoursFilter
    },
    Apn_lordag: {
        name: 'openingHoursSaturday',
        filter: openingHoursFilter
    },
    // LOL RIGHT LIKE THIS IS EVER GONNA HAPPEN :( :(
    Apn_sondag: {
        name: 'openingHoursSunday',
        filter: openingHoursFilter
    },

    Ukenummer_neste: {
        name: 'weekNumberNext',
        filter: numberFilter
    },

    Apn_neste_mandag: {
        name: 'openingHoursNextMonday',
        filter: openingHoursFilter
    },
    Apn_neste_tirsdag: {
        name: 'openingHoursNextTuesday',
        filter: openingHoursFilter
    },
    Apn_neste_onsdag: {
        name: 'openingHoursNextWednesday',
        filter: openingHoursFilter
    },
    Apn_neste_torsdag: {
        name: 'openingHoursNextThursday',
        filter: openingHoursFilter
    },
    Apn_neste_fredag: {
        name: 'openingHoursNextFriday',
        filter: openingHoursFilter
    },
    Apn_neste_lordag: {
        name: 'openingHoursNextSaturday',
        filter: openingHoursFilter
    },
    // LOL RIGHT LIKE THIS IS EVER GONNA HAPPEN :( :(
    Apn_neste_sondag: {
        name: 'openingHoursNextSunday',
        filter: openingHoursFilter
    }
};
