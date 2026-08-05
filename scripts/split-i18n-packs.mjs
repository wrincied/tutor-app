/**
 * One-shot: invert Record<Lang, T> dictionaries into per-language locale packs.
 * Run: node scripts/split-i18n-packs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const langs = ['ru', 'en', 'de', 'kz', 'uk', 'by'];

const DICT_MAP = [
  ['NAV', 'nav'],
  ['PAGE_TITLE', 'pageTitles'],
  ['ACCOUNT', 'account'],
  ['AUTH', 'auth'],
  ['LEGAL_COMMON', 'legal'],
  ['LEGAL_DATA', 'legalData'],
  ['LEGAL_COOKIES', 'legalCookies'],
  ['SHARED', 'shared'],
  ['CALENDAR', 'calendar'],
  ['TAX_MODE_LABELS', 'taxModeLabels'],
  ['FINANCE', 'finance'],
  ['ACTIVITY_LOG', 'activityLog'],
  ['STUDENTS', 'students'],
  ['HOME', 'home'],
];

function extractBalanced(source, openIdx) {
  if (source[openIdx] !== '{') {
    throw new Error(`Expected { at ${openIdx}`);
  }
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let i = openIdx; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === inStr) {
        inStr = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return source.slice(openIdx, i + 1);
      }
    }
  }
  throw new Error('Unbalanced braces');
}

function findRecordObject(source, constName) {
  const re = new RegExp(`(?:export\\s+)?const\\s+${constName}\\s*:\\s*Record<Lang,[^=]*=\\s*\\{`);
  const m = re.exec(source);
  if (!m) {
    throw new Error(`Dictionary not found: ${constName}`);
  }
  const openIdx = m.index + m[0].length - 1;
  return extractBalanced(source, openIdx);
}

function splitTopLevelKeys(objSource) {
  // objSource includes surrounding { }
  const inner = objSource.slice(1, -1);
  const result = {};
  let i = 0;
  while (i < inner.length) {
    while (i < inner.length && /\s|,/.test(inner[i])) {
      i++;
    }
    if (i >= inner.length) {
      break;
    }
    const keyMatch = /^(ru|en|de|kz|uk|by)\s*:/.exec(inner.slice(i));
    if (!keyMatch) {
      // skip unexpected token
      throw new Error(`Expected lang key near: ${inner.slice(i, i + 40)}`);
    }
    const key = keyMatch[1];
    i += keyMatch[0].length;
    while (i < inner.length && /\s/.test(inner[i])) {
      i++;
    }
    let value;
    if (inner[i] === '{') {
      value = extractBalanced(inner, i);
      i += value.length;
    } else {
      // identifier or spread expression until comma at depth 0
      let depth = 0;
      let inStr = null;
      let escape = false;
      const start = i;
      for (; i < inner.length; i++) {
        const ch = inner[i];
        if (inStr) {
          if (escape) {
            escape = false;
            continue;
          }
          if (ch === '\\') {
            escape = true;
            continue;
          }
          if (ch === inStr) {
            inStr = null;
          }
          continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') {
          inStr = ch;
          continue;
        }
        if (ch === '{' || ch === '(' || ch === '[') {
          depth++;
        } else if (ch === '}' || ch === ')' || ch === ']') {
          depth--;
        } else if (ch === ',' && depth === 0) {
          break;
        }
      }
      value = inner.slice(start, i).trim();
    }
    result[key] = value;
  }
  return result;
}

function resolveAlias(value, aliases, lang) {
  const trimmed = value.trim();
  // NAV_UK / ACCOUNT_BY etc.
  const aliasMatch = /^(NAV|PAGE_TITLE|ACCOUNT|AUTH|SHARED|LEGAL_COMMON|LEGAL_DATA|LEGAL_COOKIES|CALENDAR|FINANCE|STUDENTS|ACTIVITY_LOG|TAX_MODE_LABELS|HOME)_(UK|BY)$/.exec(
    trimmed,
  );
  if (aliasMatch) {
    const dict = aliasMatch[1];
    const from = aliasMatch[2].toLowerCase();
    const packKey = DICT_MAP.find(([d]) => d === dict)?.[1];
    if (!packKey) {
      throw new Error(`No pack key for ${dict}`);
    }
    const resolved = aliases[from]?.[packKey];
    if (!resolved) {
      throw new Error(`Alias missing ${trimmed} for lang=${lang}`);
    }
    return resolved;
  }
  return trimmed;
}

function extractNamedConst(source, name) {
  const re = new RegExp(`(?:export\\s+)?const\\s+${name}\\s*[:=][^=]*=\\s*`);
  const m = re.exec(source);
  if (!m) {
    return null;
  }
  let i = m.index + m[0].length;
  while (i < source.length && /\s/.test(source[i])) {
    i++;
  }
  if (source[i] === '{') {
    return extractBalanced(source, i);
  }
  // expression until semicolon at depth 0
  let depth = 0;
  let inStr = null;
  let escape = false;
  const start = i;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === inStr) {
        inStr = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '{' || ch === '(' || ch === '[') {
      depth++;
    } else if (ch === '}' || ch === ')' || ch === ']') {
      depth--;
    } else if (ch === ';' && depth === 0) {
      break;
    }
  }
  return source.slice(start, i).trim();
}

const i18nPath = path.join(root, 'scripts/i18n-service.legacy-source.ts');
const adminPath = path.join(root, 'src/app/core/i18n/admin.locales.ts');
const pricingPath = path.join(root, 'src/app/core/i18n/pricing.locales.ts');
const ukPath = path.join(root, 'src/app/core/i18n/locales/locale-uk.ts');
const byPath = path.join(root, 'src/app/core/i18n/locales/locale-by.ts');

if (!fs.existsSync(i18nPath)) {
  console.error('Missing scripts/i18n-service.legacy-source.ts — restore from git history before regenerating packs.');
  process.exit(1);
}

const i18nSrc = fs.readFileSync(i18nPath, 'utf8');
const adminSrc = fs.readFileSync(adminPath, 'utf8');
const pricingSrc = fs.readFileSync(pricingPath, 'utf8');
const ukSrc = fs.readFileSync(ukPath, 'utf8');
const bySrc = fs.readFileSync(byPath, 'utf8');

/** @type {Record<string, Record<string, string>>} */
const packs = Object.fromEntries(langs.map((l) => [l, {}]));

// Prefill uk/by from dedicated locale files (used when Record points to NAV_UK etc.)
const localeFileAlias = {
  uk: ukSrc,
  by: bySrc,
};
const fileAliases = { uk: {}, by: {} };
for (const [lang, src] of Object.entries(localeFileAlias)) {
  for (const [dict, packKey] of DICT_MAP) {
    const suffix = lang.toUpperCase();
    const name = `${dict}_${suffix}`;
    const body = extractNamedConst(src, name);
    if (body) {
      fileAliases[lang][packKey] = body;
    }
  }
}

for (const [dict, packKey] of DICT_MAP) {
  const obj = findRecordObject(i18nSrc, dict);
  const parts = splitTopLevelKeys(obj);
  for (const lang of langs) {
    if (!parts[lang]) {
      throw new Error(`Missing ${lang} in ${dict}`);
    }
    packs[lang][packKey] = resolveAlias(parts[lang], fileAliases, lang);
  }
}

// Resolve ACTIVITY_LOG_* identifiers and LEGAL_COMMON spreads into plain objects
for (const lang of langs) {
  let activityRaw = packs[lang].activityLog.trim();
  if (/^ACTIVITY_LOG_[A-Z]+$/.test(activityRaw)) {
    const src = activityRaw.endsWith('_UK') ? ukSrc : activityRaw.endsWith('_BY') ? bySrc : i18nSrc;
    activityRaw = extractNamedConst(src, activityRaw);
  }
  packs[lang].activityLog = activityRaw;

  const legalObj = evalExpr(packs[lang].legal);
  const legalScope = {
    LEGAL_COMMON: {
      ru: legalObj,
      en: legalObj,
      de: legalObj,
      kz: legalObj,
      uk: legalObj,
      by: legalObj,
    },
    LEGAL_COMMON_UK: legalObj,
    LEGAL_COMMON_BY: legalObj,
  };
  const legalDataObj = evalExpr(packs[lang].legalData, legalScope);
  const legalCookiesObj = evalExpr(packs[lang].legalCookies, legalScope);

  packs[lang].legal = tsObjectLiteral(legalObj);
  packs[lang].legalData = tsObjectLiteral(legalDataObj);
  packs[lang].legalCookies = tsObjectLiteral(legalCookiesObj);
  packs[lang].activityLog = tsObjectLiteral(evalExpr(packs[lang].activityLog));
}

function evalExpr(expr, scope = {}) {
  const keys = Object.keys(scope);
  const vals = keys.map((k) => scope[k]);
  return new Function(...keys, `return (${expr});`)(...vals);
}

function tsObjectLiteral(obj) {
  return JSON.stringify(obj, null, 2);
}

// Admin — known small overrides (avoid fragile string-spread inlining)
const adminRuObj = evalExpr(extractNamedConst(adminSrc, 'ADMIN_RU'));
const adminEnObj = evalExpr(extractNamedConst(adminSrc, 'ADMIN_EN'), {
  ADMIN_RU: adminRuObj,
});
packs.ru.admin = tsObjectLiteral(adminRuObj);
packs.en.admin = tsObjectLiteral(adminEnObj);
packs.de.admin = tsObjectLiteral({
  ...adminEnObj,
  title: 'Admin-Dashboard',
  usersTab: 'Nutzer',
  settingsTab: 'Einstellungen',
});
packs.kz.admin = tsObjectLiteral({
  ...adminRuObj,
  title: 'Әкімші панелі',
  dashboardTab: 'Дашборд',
  usersTab: 'Пайдаланушылар',
  settingsTab: 'Баптаулар',
});
packs.uk.admin = tsObjectLiteral({
  ...adminRuObj,
  title: 'Панель адміністратора',
  usersTab: 'Користувачі',
  settingsTab: 'Налаштування',
});
packs.by.admin = tsObjectLiteral({
  ...adminRuObj,
  title: 'Панель адміністратара',
  usersTab: 'Карыстальнікі',
  settingsTab: 'Налады',
});

// Pricing — evaluate named consts with shared scope
const pricingScope = {};
pricingScope.PRICING_RU = evalExpr(extractNamedConst(pricingSrc, 'PRICING_RU'));
pricingScope.PRICING_EN = evalExpr(extractNamedConst(pricingSrc, 'PRICING_EN'), pricingScope);
pricingScope.PRICING_DE = evalExpr(extractNamedConst(pricingSrc, 'PRICING_DE'), pricingScope);
pricingScope.PRICING_UK = evalExpr(extractNamedConst(pricingSrc, 'PRICING_UK'), pricingScope);
pricingScope.PRICING_BY = evalExpr(extractNamedConst(pricingSrc, 'PRICING_BY'), pricingScope);
pricingScope.PRICING_KZ = evalExpr(extractNamedConst(pricingSrc, 'PRICING_KZ'), pricingScope);

const pricingByLang = splitTopLevelKeys(findRecordObject(pricingSrc, 'PRICING'));
for (const lang of langs) {
  const raw = pricingByLang[lang].trim();
  const obj = pricingScope[raw];
  if (!obj) {
    throw new Error(`Missing pricing for ${lang}: ${raw}`);
  }
  packs[lang].pricing = tsObjectLiteral(obj);
}

const outDir = path.join(root, 'src/app/core/i18n/packs');
fs.mkdirSync(outDir, { recursive: true });

const header = `/* eslint-disable */
/** Auto-generated by scripts/split-i18n-packs.mjs — do not edit by hand. */
import type { LocalePack } from '../locale-pack';

`;

for (const lang of langs) {
  const p = packs[lang];
  const body = `export const LOCALE_PACK = {
  nav: ${p.nav},
  pageTitles: ${p.pageTitles},
  account: ${p.account},
  auth: ${p.auth},
  legal: ${p.legal},
  legalData: ${p.legalData},
  legalCookies: ${p.legalCookies},
  shared: ${p.shared},
  calendar: ${p.calendar},
  taxModeLabels: ${p.taxModeLabels},
  finance: ${p.finance},
  activityLog: ${p.activityLog},
  students: ${p.students},
  home: ${p.home},
  pricing: ${p.pricing},
  admin: ${p.admin},
} satisfies LocalePack;
`;
  fs.writeFileSync(path.join(outDir, `${lang}.pack.ts`), header + body, 'utf8');
  console.log('wrote', lang, 'pack', Math.round((header + body).length / 1024), 'KB');
}

console.log('done');
