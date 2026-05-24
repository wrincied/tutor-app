import { describe, expect, it } from 'vitest';
import {
  buildRruleString,
  buildWeeklyRrule,
  expandLessonOccurrences,
  parseByDayFromRrule,
  parseUntilFromRrule,
} from './lesson-recurrence';
import type { CalendarLesson } from '@interfaces';

describe('lesson-recurrence', () => {
  it('builds RFC 5545 weekly rule', () => {
    expect(buildWeeklyRrule(['MO', 'WE'])).toBe('FREQ=WEEKLY;BYDAY=MO,WE');
  });

  it('builds monthly rule with UNTIL', () => {
    expect(
      buildRruleString({
        freq: 'monthly',
        byDay: [],
        untilDate: '2026-12-31',
        startDate: '2026-05-15',
      }),
    ).toBe('FREQ=MONTHLY;BYMONTHDAY=15;UNTIL=20261231T235959Z');
  });

  it('parses UNTIL from rrule string', () => {
    expect(parseUntilFromRrule('FREQ=WEEKLY;BYDAY=MO;UNTIL=20261231T235959Z')).toBe('2026-12-31');
  });

  it('parses BYDAY from rrule string', () => {
    expect(parseByDayFromRrule('FREQ=WEEKLY;BYDAY=MO,WE')).toEqual(['MO', 'WE']);
  });

  it('expands weekly occurrences in range', () => {
    const lesson: CalendarLesson = {
      _id: 'l1',
      student_id: 's1',
      status: 'scheduled',
      scheduledAt: new Date(2026, 4, 26, 10, 30, 0, 0).toISOString(),
      lesson_duration: 90,
      lesson_price: 50,
      lesson_currency: 'EUR',
      reminder_sent: false,
      isRecurring: true,
      startDate: '2026-05-26',
      rrule: 'FREQ=WEEKLY;BYDAY=TU,TH',
    };

    const rangeStart = new Date(2026, 4, 25, 0, 0, 0, 0);
    const rangeEnd = new Date(2026, 5, 7, 23, 59, 59, 999);
    const expanded = expandLessonOccurrences(lesson, rangeStart, rangeEnd);

    expect(expanded.length).toBeGreaterThanOrEqual(2);
    expect(expanded.every((row) => row.isVirtualOccurrence)).toBe(true);
    expect(expanded.every((row) => row.occurrenceKey?.startsWith('l1:'))).toBe(true);
  });
});
