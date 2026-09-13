const STORAGE_PREFIX = 's4u.expenseQuickCategories.';
const MAX_CATEGORIES = 24;
const MAX_LEN = 64;

/** Distinct border accents for category chips (transparent fill + colored outline). */
export const EXPENSE_CATEGORY_PALETTE = [
  '#0f766e', // teal
  '#2563eb', // blue
  '#c2410c', // terracotta
  '#7c3aed', // violet
  '#b45309', // amber
  '#be123c', // rose
  '#047857', // green
  '#0369a1', // sky
] as const;

export type ExpenseQuickCategory = {
  label: string;
  color: string;
};

type StoredQuickCategories = {
  v: 2;
  categories: ExpenseQuickCategory[];
  /** Labels removed from chips (presets / used-on-expense stay hidden until typed again). */
  hidden: string[];
};

export function normalizeExpenseCategoryLabel(raw: string): string {
  return String(raw ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, MAX_LEN);
}

function labelKey(label: string): string {
  return normalizeExpenseCategoryLabel(label).toLowerCase();
}

/** Stable color from label hash (same label → same color). */
export function colorForExpenseCategory(label: string): string {
  const key = labelKey(label);
  if (!key) {
    return EXPENSE_CATEGORY_PALETTE[0];
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return EXPENSE_CATEGORY_PALETTE[hash % EXPENSE_CATEGORY_PALETTE.length];
}

function normalizeColor(raw: unknown, label: string): string {
  const c = String(raw ?? '').trim();
  if (/^#[0-9a-fA-F]{6}$/.test(c)) {
    return c.toLowerCase();
  }
  return colorForExpenseCategory(label);
}

function emptyStore(): StoredQuickCategories {
  return { v: 2, categories: [], hidden: [] };
}

function readStore(userId: string): StoredQuickCategories {
  if (typeof localStorage === 'undefined' || !userId) {
    return emptyStore();
  }
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    if (!raw) {
      return emptyStore();
    }
    const parsed = JSON.parse(raw) as unknown;

    // Legacy: string[]
    if (Array.isArray(parsed)) {
      const categories: ExpenseQuickCategory[] = [];
      const seen = new Set<string>();
      for (const item of parsed) {
        const label = normalizeExpenseCategoryLabel(String(item ?? ''));
        if (!label) {
          continue;
        }
        const key = labelKey(label);
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        categories.push({ label, color: colorForExpenseCategory(label) });
        if (categories.length >= MAX_CATEGORIES) {
          break;
        }
      }
      return { v: 2, categories, hidden: [] };
    }

    if (!parsed || typeof parsed !== 'object') {
      return emptyStore();
    }

    const obj = parsed as Partial<StoredQuickCategories> & { categories?: unknown };
    const categories: ExpenseQuickCategory[] = [];
    const seen = new Set<string>();
    const list = Array.isArray(obj.categories) ? obj.categories : [];
    for (const item of list) {
      let label = '';
      let colorRaw: unknown;
      if (typeof item === 'string') {
        label = normalizeExpenseCategoryLabel(item);
      } else if (item && typeof item === 'object') {
        label = normalizeExpenseCategoryLabel(String((item as ExpenseQuickCategory).label ?? ''));
        colorRaw = (item as ExpenseQuickCategory).color;
      }
      if (!label) {
        continue;
      }
      const key = labelKey(label);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      categories.push({ label, color: normalizeColor(colorRaw, label) });
      if (categories.length >= MAX_CATEGORIES) {
        break;
      }
    }

    const hidden: string[] = [];
    const hiddenSeen = new Set<string>();
    for (const h of Array.isArray(obj.hidden) ? obj.hidden : []) {
      const label = normalizeExpenseCategoryLabel(String(h ?? ''));
      if (!label) {
        continue;
      }
      const key = labelKey(label);
      if (hiddenSeen.has(key)) {
        continue;
      }
      hiddenSeen.add(key);
      hidden.push(label);
    }

    return { v: 2, categories, hidden };
  } catch {
    return emptyStore();
  }
}

function writeStore(userId: string, store: StoredQuickCategories): void {
  if (!userId || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(store));
  } catch {
    /* quota / private mode */
  }
}

export function loadExpenseQuickCategories(userId: string): ExpenseQuickCategory[] {
  return readStore(userId).categories;
}

export function loadExpenseHiddenCategories(userId: string): string[] {
  return readStore(userId).hidden;
}

export function rememberExpenseQuickCategory(
  userId: string,
  category: string,
  color?: string,
): ExpenseQuickCategory[] {
  const label = normalizeExpenseCategoryLabel(category);
  if (!userId || !label) {
    return loadExpenseQuickCategories(userId);
  }
  const store = readStore(userId);
  const key = labelKey(label);
  const existing = store.categories.find((c) => labelKey(c.label) === key);
  const nextColor = normalizeColor(color ?? existing?.color, label);
  const categories = [
    { label, color: nextColor },
    ...store.categories.filter((c) => labelKey(c.label) !== key),
  ].slice(0, MAX_CATEGORIES);
  const hidden = store.hidden.filter((h) => labelKey(h) !== key);
  writeStore(userId, { v: 2, categories, hidden });
  return categories;
}

/** Remove chip from quick list and hide until user types it again. */
export function removeExpenseQuickCategory(
  userId: string,
  category: string,
): { categories: ExpenseQuickCategory[]; hidden: string[] } {
  const label = normalizeExpenseCategoryLabel(category);
  if (!userId || !label) {
    const store = readStore(userId);
    return { categories: store.categories, hidden: store.hidden };
  }
  const store = readStore(userId);
  const key = labelKey(label);
  const categories = store.categories.filter((c) => labelKey(c.label) !== key);
  const hidden = store.hidden.some((h) => labelKey(h) === key)
    ? store.hidden
    : [...store.hidden, label];
  writeStore(userId, { v: 2, categories, hidden });
  return { categories, hidden };
}

/** Merge presets + saved + used-on-expenses; skip hidden; presets first. */
export function mergeExpenseCategoryOptions(
  presets: string[],
  saved: ExpenseQuickCategory[],
  fromExpenses: string[],
  hidden: string[] = [],
): ExpenseQuickCategory[] {
  const hiddenKeys = new Set(hidden.map(labelKey).filter(Boolean));
  const colorByKey = new Map<string, string>();
  for (const c of saved) {
    colorByKey.set(labelKey(c.label), c.color);
  }

  const out: ExpenseQuickCategory[] = [];
  const seen = new Set<string>();
  for (const raw of [...presets, ...saved.map((c) => c.label), ...fromExpenses]) {
    const label = normalizeExpenseCategoryLabel(raw);
    if (!label) {
      continue;
    }
    const key = labelKey(label);
    if (seen.has(key) || hiddenKeys.has(key)) {
      continue;
    }
    seen.add(key);
    out.push({
      label,
      color: colorByKey.get(key) ?? colorForExpenseCategory(label),
    });
    if (out.length >= MAX_CATEGORIES) {
      break;
    }
  }
  return out;
}

/** Resolve border color for a category label (saved → hash). */
export function resolveExpenseCategoryColor(
  label: string,
  saved: ExpenseQuickCategory[],
): string {
  const key = labelKey(label);
  if (!key) {
    return EXPENSE_CATEGORY_PALETTE[0];
  }
  const found = saved.find((c) => labelKey(c.label) === key);
  return found?.color ?? colorForExpenseCategory(label);
}
