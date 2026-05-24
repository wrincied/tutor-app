import { describe, expect, it } from 'vitest';
import {
  buildRruleFromConfig,
  formatRecurrenceSummary,
  parseRruleToConfig,
} from './lesson-recurrence-config';
import type { RecurrenceRuleConfig, RecurrenceSummaryLabels } from './lesson-recurrence-config';

const labels: RecurrenceSummaryLabels = {
  none: 'Once',
  daily: 'Daily',
  dailyInterval: 'Every {n} days',
  weekly: 'Weekly: {days}',
  weeklyInterval: 'Every {n} weeks: {days}',
  monthly: 'Monthly on {day}',
  monthlyInterval: 'Every {n} months on {day}',
  custom: 'Custom',
  endNever: 'Never',
  endUntil: 'until {date}',
  endCount: 'after {n}',
  weekdays: {
    MO: 'Mon',
    TU: 'Tue',
    WE: 'Wed',
    TH: 'Thu',
    FR: 'Fri',
    SA: 'Sat',
    SU: 'Sun',
  },
};

describe('lesson-recurrence-config', () => {
  it('builds weekly rule with interval and COUNT', () => {
    const config: RecurrenceRuleConfig = {
      preset: 'weekly',
      interval: 2,
      byDay: ['MO', 'WE'],
      customFreq: 'weekly',
      endMode: 'count',
      untilDate: null,
      count: 12,
    };
    expect(buildRruleFromConfig(config, '2026-05-15')).toBe(
      'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;COUNT=12',
    );
  });

  it('builds daily rule with UNTIL', () => {
    const config: RecurrenceRuleConfig = {
      preset: 'daily',
      interval: 1,
      byDay: [],
      customFreq: 'daily',
      endMode: 'until',
      untilDate: '2026-12-31',
      count: null,
    };
    expect(buildRruleFromConfig(config, '2026-05-15')).toBe(
      'FREQ=DAILY;INTERVAL=1;UNTIL=20261231T235959Z',
    );
  });

  it('parses weekly rrule back to config', () => {
    const config = parseRruleToConfig('FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;COUNT=5');
    expect(config.preset).toBe('weekly');
    expect(config.interval).toBe(2);
    expect(config.byDay).toEqual(['TU', 'TH']);
    expect(config.endMode).toBe('count');
    expect(config.count).toBe(5);
  });

  it('formats summary for monthly preset', () => {
    const config: RecurrenceRuleConfig = {
      preset: 'monthly',
      interval: 1,
      byDay: [],
      customFreq: 'monthly',
      endMode: 'never',
      untilDate: null,
      count: null,
    };
    expect(formatRecurrenceSummary(config, labels, '2026-05-15')).toContain('15');
  });
});
