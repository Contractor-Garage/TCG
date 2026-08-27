/*
  Availability rules for units and locations.

  A unit's `availableDate` is a plain YYYY-MM-DD calendar date meaning "this unit
  opens up on this day". Absent/empty means it is available right now. Dates in the
  past are treated as "available now" rather than being cleaned up in the database —
  the comparison happens here at render time against the visitor's local today, so it
  flips over correctly for everyone with no scheduled job to fail silently.

  The date only carries meaning when `available` is true; `available` remains the
  master on/off switch for a unit.
*/

/** Today as YYYY-MM-DD in the viewer's local timezone. */
function todayISO() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/**
 * True when the unit is listed as available but does not open up until a future date.
 * Both arguments to the comparison are YYYY-MM-DD, which sorts correctly as a string.
 */
export function isFutureDated(unit) {
  if (!unit?.available || !unit.availableDate) return false
  return unit.availableDate > todayISO()
}

/**
 * "May 1, 2026" from "2026-05-01". Parsed into a local-time Date via the numeric
 * constructor — `new Date('2026-05-01')` would parse as UTC midnight and render as
 * April 30 anywhere west of Greenwich.
 */
export function formatAvailableDate(isoDate) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return ''
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** The text shown in the "Available" column: "Now" or the formatted future date. */
export function getAvailabilityLabel(unit) {
  return isFutureDated(unit) ? formatAvailableDate(unit.availableDate) : 'Now'
}

/**
 * The available units for a location, ordered the way a prospect reads them:
 * everything open now first, then future openings by soonest date.
 */
export function getAvailableUnits(location) {
  return (location?.units || [])
    .filter((unit) => unit.available)
    .sort((a, b) => {
      const aDate = isFutureDated(a) ? a.availableDate : ''
      const bDate = isFutureDated(b) ? b.availableDate : ''
      return aDate.localeCompare(bDate)
    })
}

/**
 * The single display status for a location. `comingSoon` is set by the owner in the
 * portal and takes precedence over anything derived from units.
 *
 * A location counts as Available when it has any unit listed as available, including
 * units that only open up on a future date — a prospect searching for space is well
 * served by a bay opening next month, and the exact date is shown on the detail page.
 */
export function getLocationStatus(location) {
  if (location?.comingSoon) return 'Coming Soon'
  return location?.units?.some((unit) => unit.available) ? 'Available' : 'Full'
}
