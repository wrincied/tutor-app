import { RenderMode, type ServerRoute } from '@angular/ssr';

const URL_LANGS = ['de', 'en', 'ru'] as const;

/** Public pages with crawlable content (skip auth forms — Firebase not SSR-safe). */
const PUBLIC_SUFFIXES = [
  '',
  '/pricing',
  '/help',
  '/status',
  '/legal/impressum',
  '/legal/data-processing',
  '/legal/cookies',
  '/legal/terms',
  '/not-found',
] as const;

function langParams(): Array<{ lang: string }> {
  return URL_LANGS.map((lang) => ({ lang }));
}

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },

  ...PUBLIC_SUFFIXES.map((suffix): ServerRoute => {
    const path = suffix ? `:lang${suffix}` : ':lang';
    return {
      path,
      renderMode: RenderMode.Prerender,
      async getPrerenderParams() {
        return langParams();
      },
    };
  }),

  { path: '**', renderMode: RenderMode.Client },
];
