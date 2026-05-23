/** Разбор displayName из Firebase OAuth (Google и др.). */
export function splitDisplayName(displayName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const display = displayName?.trim() ?? '';
  if (!display) {
    return { firstName: '', lastName: '' };
  }
  const parts = display.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}
