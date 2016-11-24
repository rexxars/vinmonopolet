function militaryClockToMinutes(clock) {
  const hours = parseInt(clock.substr(0, 2), 10)
  const minutes = parseInt(clock.substr(2, 4), 10)
  return (hours * 60) + minutes
}

module.exports = function openingHoursFilter(hours) {
  if (hours.toLowerCase() === 'stengt') {
    return null
  }

  const parts = hours.split(/ - /).map(militaryClockToMinutes)
  return {
    opens: parts[0],
    closes: parts[1]
  }
}
