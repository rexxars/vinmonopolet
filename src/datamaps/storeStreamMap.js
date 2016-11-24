/* eslint-disable camelcase */
const openingHoursFilter = require('../filters/openingHours')
const numberFilter = require('../filters/number')

module.exports = {
  Butikknavn: ['name'],
  Gateadresse: ['streetAddress'],
  Gate_postnummer: ['streetZip'],
  Gate_poststed: ['streetCity'],
  Postadresse: ['postalAddress'],
  Post_postnummer: ['postalZip'],
  Post_poststed: ['postalCity'],
  Telefonnummer: ['phoneNumber'],
  Kategori: ['category'],
  GPS_breddegrad: ['latitude', numberFilter],
  GPS_lengdegrad: ['longitude', numberFilter],
  Ukenummer: ['weekNumber', numberFilter],
  Apn_mandag: ['openingHoursMonday', openingHoursFilter],
  Apn_tirsdag: ['openingHoursTuesday', openingHoursFilter],
  Apn_onsdag: ['openingHoursWednesday', openingHoursFilter],
  Apn_torsdag: ['openingHoursThursday', openingHoursFilter],
  Apn_fredag: ['openingHoursFriday', openingHoursFilter],
  Apn_lordag: ['openingHoursSaturday', openingHoursFilter],
  Apn_sondag: ['openingHoursSunday', openingHoursFilter],
  // ^LOL RIGHT LIKE THAT IS EVER GONNA HAPPEN :( :(

  Ukenummer_neste: ['weekNumberNext', numberFilter],
  Apn_neste_mandag: ['openingHoursNextMonday', openingHoursFilter],
  Apn_neste_tirsdag: ['openingHoursNextTuesday', openingHoursFilter],
  Apn_neste_onsdag: ['openingHoursNextWednesday', openingHoursFilter],
  Apn_neste_torsdag: ['openingHoursNextThursday', openingHoursFilter],
  Apn_neste_fredag: ['openingHoursNextFriday', openingHoursFilter],
  Apn_neste_lordag: ['openingHoursNextSaturday', openingHoursFilter],
  Apn_neste_sondag: ['openingHoursNextSunday', openingHoursFilter]
  // ^LOL RIGHT LIKE THAT IS EVER GONNA HAPPEN :( :(
}
