/** Escape HTML then apply a tiny safe markdown subset. */
export function renderSafeMarkdown(source: string): string {
  const escaped = escapeHtml(String(source ?? ''));
  const lines = escaped.split('\n');
  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  const openList = (type: 'ul' | 'ol') => {
    if (listType === type) return;
    closeList();
    out.push(`<${type}>`);
    listType = type;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }
    if (trimmed.startsWith('### ')) {
      closeList();
      out.push(`<h3>${wrapHeadingNumber(inlineMd(trimmed.slice(4)))}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeList();
      out.push(`<h2>${wrapHeadingNumber(inlineMd(trimmed.slice(3)))}</h2>`);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      closeList();
      out.push(`<h1>${wrapHeadingNumber(inlineMd(trimmed.slice(2)))}</h1>`);
      continue;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      openList('ul');
      out.push(`<li>${inlineMd(trimmed.slice(2))}</li>`);
      continue;
    }
    const ordered = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (ordered) {
      openList('ol');
      out.push(`<li value="${ordered[1]}">${inlineMd(ordered[2])}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${inlineMd(trimmed)}</p>`);
  }
  closeList();
  return out.join('\n');
}

/** Wrap leading section numbers like "1." / "7.1" for styled badges. */
function wrapHeadingNumber(html: string): string {
  // Subsections: "7.1 Title" (no trailing period after the number)
  if (/^\d+\.\d+/.test(html)) {
    return html.replace(/^(\d+(?:\.\d+)+)\s+/, '<span class="md-num">$1</span> ');
  }
  // Top sections: "1. Title"
  return html.replace(/^(\d+)\.\s+/, '<span class="md-num">$1</span> ');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineMd(text: string): string {
  // Links: [label](https://...) — http(s) only
  let result = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi,
    '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>',
  );
  // Relative app links: [label](/#/path) or [label](/path)
  result = result.replace(
    /\[([^\]]+)\]\((\/[^)\s]*)\)/g,
    '<a href="$2">$1</a>',
  );
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return result;
}
