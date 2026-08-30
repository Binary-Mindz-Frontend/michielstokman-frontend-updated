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

export function listHasValue(values: unknown, needle: string): boolean {
  if (!Array.isArray(values)) return false;
  const match = needle.trim().toLowerCase();
  return values.some((value) => String(value).trim().toLowerCase() === match);
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
