export const STORY_GROWTH_AREAS = [
  'Fear & Freedom',
  'Self-Acceptance',
  'Forgiveness',
  'Letting Go',
  'Presence',
  'Self-Compassion',
  'Rebuilding',
  'Patience',
  'Love & Connection',
  'Purpose & Meaning',
] as const;

export const STORY_LIFE_PHASES = [
  'Discovering',
  'Building',
  'Recalibrating',
  'Deepening',
  'Passing On',
] as const;

export type CatalogSort = 'newest' | 'most_listened' | 'highest_rated';

export const CATALOG_SORTS: { id: CatalogSort; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'most_listened', label: 'Most listened' },
  { id: 'highest_rated', label: 'Highest rated' },
];

export function cardMoodTags(tags: string[] | null | undefined, max = 2): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeMoodText(str: string): string {
  return str.toLowerCase().replace(/[-_&]/g, ' ').replace(/\s+/g, ' ').trim();
}

const GROWTH_AREA_SYNONYMS: Record<string, string[]> = {
  'self acceptance': ['self acceptance', 'self-acceptance', 'autonomy', 'acceptance'],
  'fear freedom': ['fear & freedom', 'overcoming fear', 'fear', 'freedom'],
  'love connection': [
    'love & connection',
    'sexual expression',
    'sexual exploration',
    'love',
    'connection',
  ],
  'purpose meaning': ['purpose & meaning', 'confidence building', 'purpose', 'meaning'],
  forgiveness: ['forgiveness', 'forgive'],
  'letting go': ['letting go', 'release'],
  presence: ['presence', 'present'],
  'self compassion': ['self compassion', 'self-compassion', 'compassion'],
  rebuilding: ['rebuilding', 'rebuild', 'starting over'],
  patience: ['patience', 'patient'],
};

export function listHasValue(values: unknown, needle: string): boolean {
  if (!Array.isArray(values)) return false;
  const normNeedle = normalizeMoodText(needle);
  const synonyms = GROWTH_AREA_SYNONYMS[normNeedle] || [normNeedle];

  return values.some((value) => {
    const rawStr = String(value).trim();
    if (!rawStr) return false;
    const normValue = normalizeMoodText(rawStr);
    if (normValue === normNeedle) return true;
    return synonyms.some(
      (syn) => normValue === syn || normValue.includes(syn) || syn.includes(normValue),
    );
  });
}

export function catalogEmptyMessage({
  noun,
  growthArea,
  tag,
  hideExplicit,
}: {
  noun: string;
  growthArea?: string | null;
  tag?: string | null;
  hideExplicit?: boolean;
}): string {
  if (growthArea && tag) {
    return `No ${noun} in ${growthArea} tagged “${tag}” yet.`;
  }
  if (growthArea) {
    return `No ${noun} in ${growthArea} yet.`;
  }
  if (tag) {
    return `No ${noun} tagged “${tag}” yet.`;
  }
  if (hideExplicit) {
    return `No ${noun} match these filters.`;
  }
  return `No ${noun} found.`;
}
