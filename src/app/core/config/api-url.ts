import { environment } from '@environment';

const base = environment.apiUrl.replace(/\/$/, '');

/** Базовый URL API без завершающего слэша. path — сегмент после /api (без ведущего /). */
export function apiUrl(path = ''): string {
  const segment = path.replace(/^\/+|\/+$/g, '');
  return segment ? `${base}/api/${segment}` : `${base}/api`;
}
