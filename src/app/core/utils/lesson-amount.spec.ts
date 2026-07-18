import { describe, expect, it } from 'vitest';
import {
  lessonAmountFromPrice,
  normalizeLessonPriceMode,
} from './lesson-amount';

describe('normalizeLessonPriceMode', () => {
  it('maps fixed aliases', () => {
    expect(normalizeLessonPriceMode('fixed')).toBe('fixed');
    expect(normalizeLessonPriceMode('lesson')).toBe('fixed');
    expect(normalizeLessonPriceMode(null, 'lesson')).toBe('fixed');
  });

  it('defaults to hourly', () => {
    expect(normalizeLessonPriceMode()).toBe('hourly');
    expect(normalizeLessonPriceMode('hourly')).toBe('hourly');
    expect(normalizeLessonPriceMode(null, 'hour')).toBe('hourly');
  });
});

describe('lessonAmountFromPrice', () => {
  it('uses fixed price without duration scaling', () => {
    expect(lessonAmountFromPrice(40, 90, 'fixed')).toBe(40);
  });

  it('scales hourly price by duration', () => {
    expect(lessonAmountFromPrice(40, 90, 'hourly')).toBe(60);
    expect(lessonAmountFromPrice(40, 60, 'hourly')).toBe(40);
  });
});
