/** Mirrors backend cover tagline packing (story_cover.format_two_line_field). */
const TAGLINE_LINE_SOFT = 28;
const TAGLINE_LINE_HARD = 32;

function stripEmphasis(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateAtLastWord(text: string, maxChars: number): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= maxChars) return cleaned;
  const cut = cleaned.slice(0, maxChars);
  if (maxChars >= cleaned.length || /\s/.test(cleaned[maxChars] ?? '')) {
    return cut.trimEnd();
  }
  const sp = cut.lastIndexOf(' ');
  if (sp <= 0) return cut.trimEnd();
  return cut.slice(0, sp).trimEnd();
}

/**
 * Public tagline lines for the details hero pink stack.
 * Caps length like cover/tagline generation so oversized copy still reads as sentences.
 */
export function publicTaglineLines(tagline?: string | null): string[] {
  const raw = (tagline || '').replace(/\r\n/g, '\n').trim();
  if (!raw) return [];

  const plain = stripEmphasis(raw.replace(/[ \t]+/g, ' '));
  const parts = plain
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  if (parts.length === 1 && parts[0].length > TAGLINE_LINE_SOFT) {
    const line = parts[0];
    let cut = truncateAtLastWord(line, TAGLINE_LINE_SOFT);
    if (cut.length < Math.max(8, Math.floor(TAGLINE_LINE_SOFT / 3))) {
      cut = truncateAtLastWord(line, TAGLINE_LINE_HARD);
    }
    const rest = line.slice(cut.length).trim();
    const line2 = rest ? truncateAtLastWord(rest, TAGLINE_LINE_HARD) : '';
    return line2 ? [cut, line2] : [cut];
  }

  const line1 = truncateAtLastWord(parts[0], TAGLINE_LINE_HARD);
  if (parts.length === 1) return line1 ? [line1] : [];
  const line2 = truncateAtLastWord(parts.slice(1).join(' '), TAGLINE_LINE_HARD);
  return line2 ? [line1, line2] : [line1];
}

/**
 * First complete hook sentence for hero description — never a mid-clause fragment.
 */
export function firstHookSentence(hook?: string | null, hardLimit = 220): string {
  const cleaned = (hook || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';

  const endMatch = cleaned.match(/^(.{12,}?[.!?])(?:\s|$)/);
  if (endMatch) {
    const sentence = endMatch[1].trim();
    if (sentence.length <= hardLimit) return sentence;
    return truncateAtLastWord(sentence, hardLimit);
  }

  const semi = cleaned.indexOf(';');
  if (semi >= 12) {
    const clause = cleaned.slice(0, semi).trim();
    const normalized = clause.endsWith('.') ? clause : `${clause}.`;
    if (normalized.length <= hardLimit) return normalized;
    return truncateAtLastWord(normalized, hardLimit);
  }

  return truncateAtLastWord(cleaned, hardLimit);
}
