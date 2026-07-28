import { describe, expect, it } from 'vitest';
import type { UserProfile } from '@interfaces';
import { postAuthPath, safeReturnUrl } from './post-auth-navigation';

describe('safeReturnUrl', () => {
  it('accepts in-app paths', () => {
    expect(safeReturnUrl('/app/students')).toBe('/app/students');
    expect(safeReturnUrl('/app/calendar?student=1')).toBe('/app/calendar?student=1');
  });

  it('rejects open redirects and non-app paths', () => {
    expect(safeReturnUrl('https://evil.example')).toBeNull();
    expect(safeReturnUrl('//evil.example')).toBeNull();
    expect(safeReturnUrl('/login')).toBeNull();
    expect(safeReturnUrl('/app/onboarding')).toBeNull();
  });
});

describe('postAuthPath', () => {
  const profile = {
    onboarding_completed: true,
    data_consent_accepted: true,
  } as UserProfile;

  it('prefers safe returnUrl when onboarding is done', () => {
    expect(postAuthPath(profile, true, '/app/finance')).toBe('/app/finance');
  });

  it('falls back to home without returnUrl', () => {
    expect(postAuthPath(profile, true, null)).toBe('/app/home');
  });

  it('ignores returnUrl until email is verified', () => {
    expect(postAuthPath(profile, false, '/app/students')).toBe('/app/verify-email-notice');
  });
});
