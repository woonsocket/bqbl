const LOCK_HOUR = 12;
const LOCK_MINUTE = 55;
const TIME_ZONE = 'America/New_York';
const NUM_WEEKS = 18;

// Returns (localWallClockAsUtcMs - actualUtcMs) for the given instant and
// zone, i.e. how far the zone's wall clock reads from actual UTC at that
// instant. Negative west of UTC (e.g. -4h during EDT, -5h during EST).
function getTimeZoneOffsetMs(date, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = {};
  for (const { type, value } of dtf.formatToParts(date)) {
    parts[type] = value;
  }
  // Some locales/environments render midnight as hour "24".
  const hour = parts.hour === '24' ? '00' : parts.hour;
  const asUtcMs = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(hour), Number(parts.minute), Number(parts.second)
  );
  return asUtcMs - date.getTime();
}

// Returns the UTC ms timestamp for the given wall-clock time in `timeZone`.
// Resolves DST by looking up the zone's actual offset at that moment.
function zonedWallClockToUtcMs(year, month, day, hour, minute, timeZone) {
  const wallAsUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offsetMs = getTimeZoneOffsetMs(new Date(wallAsUtcMs), timeZone);
  return wallAsUtcMs - offsetMs;
}

// Given "YYYY-MM-DD" for week 1's Sunday, returns a map of week id
// (string "1".."18") to the UTC ms timestamp of 12:55pm Eastern on that
// week's Sunday -- five minutes before the 1:00pm ET kickoff window.
export function computeWeekLockTimestamps(week1SundayStr) {
  const [year, month, day] = week1SundayStr.split('-').map(Number);
  const timestamps = {};
  for (let week = 1; week <= NUM_WEEKS; week++) {
    // Advance the calendar date on a UTC grid (not a real instant), so this
    // is immune to DST shifts -- we only care about the calendar date.
    const gridDate = new Date(Date.UTC(year, month - 1, day));
    gridDate.setUTCDate(gridDate.getUTCDate() + (week - 1) * 7);
    timestamps[String(week)] = zonedWallClockToUtcMs(
      gridDate.getUTCFullYear(),
      gridDate.getUTCMonth() + 1,
      gridDate.getUTCDate(),
      LOCK_HOUR,
      LOCK_MINUTE,
      TIME_ZONE
    );
  }
  return timestamps;
}
