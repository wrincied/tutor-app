import { describe, expect, it } from 'vitest';
import {
  financeAnchorFromQuery,
  financeCanShiftForward,
  financeCurrentAnchor,
  financePeriodRange,
  financeShiftAnchor,
} from './finance-period';

describe('financePeriodRange', () => {
  const now = new Date('2026-05-19T12:00:00.000Z');

  it('returns empty for all', () => {
    expect(financePeriodRange('all', null, now)).toEqual({});
  });

  it('returns month bounds for current month', () => {
    expect(financePeriodRange('month', null, now)).toEqual({
      from: '2026-05-01',
      to: '2026-05-31',
    });
  });

  it('returns month bounds for selected anchor', () => {
    expect(financePeriodRange('month', { year: 2025, month: 2 }, now)).toEqual({
      from: '2025-02-01',
      to: '2025-02-28',
    });
  });

  it('returns year bounds for current year', () => {
    expect(financePeriodRange('year', null, now)).toEqual({
      from: '2026-01-01',
      to: '2026-12-31',
    });
  });

  it('returns year bounds for selected anchor', () => {
    expect(financePeriodRange('year', { year: 2024, month: 5 }, now)).toEqual({
      from: '2024-01-01',
      to: '2024-12-31',
    });
  });
});

describe('finance period navigation', () => {
  const now = new Date('2026-05-19T12:00:00.000Z');
  const anchor = financeCurrentAnchor(now);

  it('shifts month backward', () => {
    expect(financeShiftAnchor('month', anchor, -1)).toEqual({ year: 2026, month: 4 });
  });

  it('blocks forward at current month', () => {
    expect(financeCanShiftForward('month', anchor, now)).toBe(false);
    expect(financeCanShiftForward('month', { year: 2026, month: 4 }, now)).toBe(true);
  });

  it('blocks forward at current year', () => {
    expect(financeCanShiftForward('year', anchor, now)).toBe(false);
    expect(financeCanShiftForward('year', { year: 2025, month: 5 }, now)).toBe(true);
  });

  it('parses anchor query', () => {
    expect(financeAnchorFromQuery('2025-09', 'month')).toEqual({ year: 2025, month: 9 });
    expect(financeAnchorFromQuery('2024', 'year')).toEqual({
      year: 2024,
      month: financeCurrentAnchor().month,
    });
  });
});
