import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Prepares gitignored environment files for local / CI / Vercel builds.
 *
 * - Local file exists and FORCE_ENV_GENERATE is unset → copy to environment.ts
 * - Otherwise → generate from process.env (nothing secret is hardcoded here)
 *
 * Vercel / production required env (Project → Settings → Environment Variables):
 *   API_URL
 *   APP_URL                 (optional on Vercel — falls back to VERCEL_URL)
 *   FIREBASE_API_KEY
 *   FIREBASE_AUTH_DOMAIN
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_STORAGE_BUCKET
 *   FIREBASE_MESSAGING_SENDER_ID
 *   FIREBASE_APP_ID
 *   FIREBASE_MEASUREMENT_ID (optional)
 *
 * Aliases: DEV_API_URL → API_URL, DEV_APP_URL → APP_URL
 */

const FILE_BY_MODE = {
  production: 'src/environments/environment.production.ts',
  'production-design': 'src/environments/environment.production.ts',
  'development-local': 'src/environments/environment.development-local.ts',
  'development-remote': 'src/environments/environment.development-remote.ts',
  development: 'src/environments/environment.development-local.ts',
  local: 'src/environments/environment.development-local.ts',
  remote: 'src/environments/environment.development-remote.ts',
};

const MODE_META = {
  production: { production: true, designMode: false },
  'production-design': { production: true, designMode: true },
  'development-local': { production: false, designMode: true },
  'development-remote': { production: false, designMode: true },
};

const mode = process.argv[2] ?? 'development-local';
const sourceRel = FILE_BY_MODE[mode] ?? FILE_BY_MODE['development-local'];
const defaultsKey =
  mode === 'development' || mode === 'local'
    ? 'development-local'
    : mode === 'remote'
      ? 'development-remote'
      : mode in MODE_META
        ? mode
        : 'development-local';
const meta = MODE_META[defaultsKey];
const source = resolve(sourceRel);
const target = resolve('src/environments/environment.ts');
const forceGenerate = process.env.FORCE_ENV_GENERATE === '1' || process.env.FORCE_ENV_GENERATE === 'true';
const isProdLike = defaultsKey === 'production' || defaultsKey === 'production-design';
const onVercel = process.env.VERCEL === '1';

function boolEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') {
    return fallback;
  }
  return raw === '1' || raw.toLowerCase() === 'true';
}

function firstEnv(...names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
  }
  return '';
}

function vercelAppUrl() {
  const productionUrl = firstEnv('VERCEL_PROJECT_PRODUCTION_URL');
  if (productionUrl) {
    return productionUrl.startsWith('http') ? productionUrl : `https://${productionUrl}`;
  }
  const previewUrl = firstEnv('VERCEL_URL');
  if (previewUrl) {
    return previewUrl.startsWith('http') ? previewUrl : `https://${previewUrl}`;
  }
  return '';
}

function failMissing(missing) {
  const where = onVercel
    ? 'Vercel → Project → Settings → Environment Variables (Production + Preview)'
    : 'CI secrets / local env';
  console.error(`Missing required environment variable(s): ${missing.join(', ')}`);
  console.error(`Set them in ${where}.`);
  console.error(
    'Needed: API_URL, APP_URL (or auto on Vercel), FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID',
  );
  process.exit(1);
}

function buildEnvironmentSource() {
  const production = boolEnv('PRODUCTION', meta.production);
  const designMode = boolEnv('DESIGN_MODE', meta.designMode);
  const requireSecrets = isProdLike || forceGenerate;

  const apiUrl =
    firstEnv('API_URL', 'DEV_API_URL', 'BACKEND_URL') ||
    (requireSecrets ? '' : 'http://localhost:3001');
  const appUrl =
    firstEnv('APP_URL', 'DEV_APP_URL') ||
    (onVercel ? vercelAppUrl() : '') ||
    (requireSecrets ? '' : 'http://localhost:4200');

  const firebase = {
    apiKey: firstEnv('FIREBASE_API_KEY'),
    authDomain: firstEnv('FIREBASE_AUTH_DOMAIN'),
    projectId: firstEnv('FIREBASE_PROJECT_ID'),
    storageBucket: firstEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: firstEnv('FIREBASE_MESSAGING_SENDER_ID'),
    appId: firstEnv('FIREBASE_APP_ID'),
    measurementId: firstEnv('FIREBASE_MEASUREMENT_ID') || 'PLACEHOLDER',
  };
  const turnstileSiteKey = firstEnv('TURNSTILE_SITE_KEY', 'CF_TURNSTILE_SITE_KEY');
  const recaptchaSiteKey = firstEnv('RECAPTCHA_SITE_KEY', 'GOOGLE_RECAPTCHA_SITE_KEY');

  if (requireSecrets) {
    const missing = [];
    if (!apiUrl) missing.push('API_URL');
    if (!appUrl) missing.push('APP_URL');
    if (!firebase.apiKey) missing.push('FIREBASE_API_KEY');
    if (!firebase.authDomain) missing.push('FIREBASE_AUTH_DOMAIN');
    if (!firebase.projectId) missing.push('FIREBASE_PROJECT_ID');
    if (!firebase.storageBucket) missing.push('FIREBASE_STORAGE_BUCKET');
    if (!firebase.messagingSenderId) missing.push('FIREBASE_MESSAGING_SENDER_ID');
    if (!firebase.appId) missing.push('FIREBASE_APP_ID');
    if (missing.length) {
      failMissing(missing);
    }
  } else {
    firebase.apiKey ||= 'PLACEHOLDER';
    firebase.authDomain ||= 'PLACEHOLDER';
    firebase.projectId ||= 'PLACEHOLDER';
    firebase.storageBucket ||= 'PLACEHOLDER';
    firebase.messagingSenderId ||= 'PLACEHOLDER';
    firebase.appId ||= 'PLACEHOLDER';
  }

  return `/** Auto-generated by scripts/prepare-environment.mjs (${defaultsKey}). Do not commit. */
export const environment = {
  production: ${production},
  designMode: ${designMode},
  apiUrl: ${JSON.stringify(apiUrl)},
  appUrl: ${JSON.stringify(appUrl)},
  turnstileSiteKey: ${JSON.stringify(turnstileSiteKey)},
  recaptchaSiteKey: ${JSON.stringify(recaptchaSiteKey)},
  firebaseConfig: {
    apiKey: ${JSON.stringify(firebase.apiKey)},
    authDomain: ${JSON.stringify(firebase.authDomain)},
    projectId: ${JSON.stringify(firebase.projectId)},
    storageBucket: ${JSON.stringify(firebase.storageBucket)},
    messagingSenderId: ${JSON.stringify(firebase.messagingSenderId)},
    appId: ${JSON.stringify(firebase.appId)},
    measurementId: ${JSON.stringify(firebase.measurementId)},
  },
};
`;
}

if (forceGenerate || !existsSync(source)) {
  writeFileSync(source, buildEnvironmentSource(), 'utf8');
  console.log(`${forceGenerate ? 'Forced write' : 'Generated'} ${sourceRel}`);
}

copyFileSync(source, target);
console.log(`Prepared src/environments/environment.ts from ${sourceRel}`);
