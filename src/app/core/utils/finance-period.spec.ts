import { describe, expect, it } from 'vitest';
import { financePeriodRange } from './finance-period';

describe('financePeriodRange', () => {
  const now = new Date('2026-05-19T12:00:00.000Z');

  it('returns empty for all', () => {
    expect(financePeriodRange('all', now)).toEqual({});
  });

  it('returns month bounds', () => {
    expect(financePeriodRange('month', now)).toEqual({
      from: '2026-05-01',
      to: '2026-05-31',
    });
  });

  it('returns year bounds', () => {
    expect(financePeriodRange('year', now)).toEqual({
      from: '2026-01-01',
      to: '2026-12-31',
    });
  });
});
