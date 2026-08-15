import { computeWeekLockTimestamps } from './lockdates';

describe('computeWeekLockTimestamps', () => {
  it('returns all 18 weeks', () => {
    const timestamps = computeWeekLockTimestamps('2026-09-06');
    expect(Object.keys(timestamps)).toEqual(
      Array.from({ length: 18 }, (_, i) => String(i + 1))
    );
  });

  it('locks week 1 at 12:55pm EDT (UTC-4) on the given Sunday', () => {
    const timestamps = computeWeekLockTimestamps('2026-09-06');
    expect(timestamps['1']).toBe(Date.UTC(2026, 8, 6, 16, 55, 0));
  });

  it('spaces weeks 7 calendar days apart, before the DST changeover', () => {
    const timestamps = computeWeekLockTimestamps('2026-09-06');
    // Week 8 Sunday is October 25, 2026 -- still EDT.
    expect(timestamps['8']).toBe(Date.UTC(2026, 9, 25, 16, 55, 0));
  });

  it('accounts for the fall-back DST transition mid-season', () => {
    const timestamps = computeWeekLockTimestamps('2026-09-06');
    // Week 9 Sunday is November 1, 2026 -- clocks fall back to EST at 2am
    // that day, so 12:55pm is already EST (UTC-5).
    expect(timestamps['9']).toBe(Date.UTC(2026, 10, 1, 17, 55, 0));
    // Week 10 Sunday is November 8, 2026 -- fully into EST.
    expect(timestamps['10']).toBe(Date.UTC(2026, 10, 8, 17, 55, 0));
  });

  it('keeps every lock time at exactly 12:55pm local Eastern time', () => {
    const timestamps = computeWeekLockTimestamps('2026-09-06');
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    for (const ms of Object.values(timestamps)) {
      const parts = dtf.formatToParts(new Date(ms)).reduce((acc, p) => {
        acc[p.type] = p.value;
        return acc;
      }, {});
      expect(`${parts.hour}:${parts.minute}`).toBe('12:55');
    }
  });
});
