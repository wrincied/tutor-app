import { describe, expect, it } from 'vitest';
import {
  asUrlLang,
  isUrlLang,
  langFromPath,
  localizePath,
  stripLocalePrefix,
} from './locale-url';

describe('locale-url', () => {
  it('detects url langs', () => {
    expect(isUrlLang('de')).toBe(true);
    expect(isUrlLang('uk')).toBe(false);
    expect(isUrlLang('by')).toBe(false);
    expect(asUrlLang('fr')).toBe('de');
    expect(asUrlLang('uk')).toBe('ru');
  });

  it('strips and localizes paths', () => {
    expect(stripLocalePrefix('/de/app/home')).toBe('/app/home');
    expect(stripLocalePrefix('/en')).toBe('/');
    expect(stripLocalePrefix('/uk/pricing')).toBe('/pricing');
    expect(localizePath('/app/home', 'de')).toBe('/de/app/home');
    expect(localizePath('/', 'ru')).toBe('/ru');
    expect(localizePath('/de/pricing', 'en')).toBe('/en/pricing');
  });

  it('reads lang from path', () => {
    expect(langFromPath('/ru/login')).toBe('ru');
    expect(langFromPath('/uk/login')).toBeNull();
    expect(langFromPath('/app/home')).toBeNull();
  });
});
