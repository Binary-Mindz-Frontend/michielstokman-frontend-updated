export type StoryListenType = 'confession' | 'meditation' | string;

export function getOverviewHref(storyType?: string | null): '/confessions' | '/meditations' {
  return storyType === 'meditation' ? '/meditations' : '/confessions';
}

export function getNextStoryLabel(storyType?: string | null): string {
  return storyType === 'meditation' ? 'Next Meditation' : 'Next Confession';
}

export interface FeedStoryLike {
  id: string | number;
  story_type?: string | null;
  card_type?: string | null;
  has_access?: boolean;
  growth_areas?: string[] | null;
  tags?: string[] | null;
  life_phase?: string | null;
  gender?: string | null;
  sexual_orientation?: string | null;
}

/** Subset of /me/profile used for Next ranking. */
export interface ListenProfileLike {
  life_phase?: string | null;
  gender?: string | null;
  sexual_orientation?: string | null;
  slider_desire_relationship?: number | null;
  slider_life_purpose?: number | null;
  slider_sexuality_life_energy?: number | null;
  slider_true_self?: number | null;
  slider_fear_freedom?: number | null;
  slider_career_money?: number | null;
  slider_health_body?: number | null;
  slider_enlightenment?: number | null;
}

/** Map profile slider keys → story growth-area / tag keywords. */
const SLIDER_GROWTH_HINTS: { field: keyof ListenProfileLike; hints: string[] }[] = [
  {
    field: 'slider_desire_relationship',
    hints: ['Desire & Relationship', 'Love & Connection', 'Love', 'Connection', 'Relationship'],
  },
  {
    field: 'slider_life_purpose',
    hints: ['Life & Purpose', 'Purpose & Meaning', 'Purpose', 'Meaning'],
  },
  {
    field: 'slider_sexuality_life_energy',
    hints: ['Sexuality & Life Energy', 'Presence', 'Love & Connection', 'Energy'],
  },
  {
    field: 'slider_true_self',
    hints: ['Show Your True Self', 'Self-Acceptance', 'Self-Compassion', 'Honesty', 'True Self'],
  },
  {
    field: 'slider_fear_freedom',
    hints: ['Fear & Freedom', 'Letting Go', 'Freedom', 'Fear'],
  },
  {
    field: 'slider_career_money',
    hints: ['Career & Money', 'Purpose & Meaning', 'Rebuilding', 'Career'],
  },
  {
    field: 'slider_health_body',
    hints: ['Health & Body', 'Self-Compassion', 'Body', 'Health'],
  },
  {
    field: 'slider_enlightenment',
    hints: ['Enlightenment', 'Presence', 'Purpose & Meaning', 'Deepening'],
  },
];

function norm(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase();
}

function listNorm(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values.map((v) => norm(String(v))).filter(Boolean);
}

function sameTypeStories(stories: FeedStoryLike[], storyType?: string | null): FeedStoryLike[] {
  const type = storyType || undefined;
  return stories.filter((item) => {
    if (item?.card_type === 'liberation_journey') return false;
    if (!type) return true;
    return item?.story_type === type;
  });
}

/**
 * Pick the next same-type story for the listen loop.
 * Prefers upcoming items with access; wraps to the first other accessible story.
 */
export function getNextStoryId(
  stories: FeedStoryLike[],
  currentId: string | number,
  storyType?: string | null,
): string | null {
  const sameType = sameTypeStories(stories, storyType);

  if (sameType.length <= 1) return null;

  const currentIndex = sameType.findIndex((item) => String(item.id) === String(currentId));
  if (currentIndex === -1) {
    const first = sameType.find((item) => item.has_access !== false) || sameType[0];
    return first ? String(first.id) : null;
  }

  const after = sameType.slice(currentIndex + 1);
  const before = sameType.slice(0, currentIndex);
  const ordered = [...after, ...before];

  const preferred = ordered.find((item) => item.has_access !== false) || ordered[0];
  return preferred ? String(preferred.id) : null;
}

/** Top growth hints from the highest profile sliders (value >= 5). */
export function profileGrowthHints(profile?: ListenProfileLike | null): string[] {
  if (!profile) return [];

  const ranked = SLIDER_GROWTH_HINTS.map(({ field, hints }) => {
    const raw = profile[field];
    const value = typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
    return { value, hints };
  })
    .filter((row) => row.value >= 5)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const hints: string[] = [];
  for (const row of ranked) {
    for (const hint of row.hints) {
      if (!hints.some((h) => norm(h) === norm(hint))) hints.push(hint);
    }
  }
  return hints;
}

function tokenOverlapScore(haystack: string[], needles: string[]): number {
  if (!haystack.length || !needles.length) return 0;
  let score = 0;
  for (const needle of needles) {
    const n = norm(needle);
    if (!n) continue;
    for (const hay of haystack) {
      if (hay === n || hay.includes(n) || n.includes(hay)) {
        score += hay === n ? 3 : 1;
        break;
      }
    }
  }
  return score;
}

export function scoreStoryForProfile(
  story: FeedStoryLike,
  profile?: ListenProfileLike | null,
  growthHints: string[] = [],
): number {
  let score = 0;

  if (story.has_access !== false) score += 2;

  if (!profile) return score;

  const areas = listNorm(story.growth_areas);
  const tags = listNorm(story.tags);
  const bag = [...areas, ...tags];

  score += tokenOverlapScore(bag, growthHints);

  if (profile.life_phase && norm(story.life_phase) === norm(profile.life_phase)) {
    score += 4;
  }

  if (profile.gender && norm(story.gender) === norm(profile.gender)) {
    score += 1;
  }

  if (
    profile.sexual_orientation &&
    norm(story.sexual_orientation) === norm(profile.sexual_orientation)
  ) {
    score += 1;
  }

  return score;
}

/**
 * Personalized Next: same type, exclude current, rank by profile overlap.
 * Falls back to feed-order next when scores tie or profile is empty.
 */
export function getPersonalizedNextStoryId(
  stories: FeedStoryLike[],
  currentId: string | number,
  storyType?: string | null,
  profile?: ListenProfileLike | null,
): string | null {
  const sameType = sameTypeStories(stories, storyType);
  const candidates = sameType.filter((item) => String(item.id) !== String(currentId));
  if (!candidates.length) return null;

  const hints = profileGrowthHints(profile);
  const hasProfileSignal =
    Boolean(profile?.life_phase) ||
    Boolean(profile?.gender) ||
    Boolean(profile?.sexual_orientation) ||
    hints.length > 0;

  if (!hasProfileSignal) {
    return getNextStoryId(stories, currentId, storyType);
  }

  const currentIndex = sameType.findIndex((item) => String(item.id) === String(currentId));

  const ranked = candidates
    .map((story, idx) => {
      const feedDistance =
        currentIndex === -1
          ? idx
          : (() => {
              const i = sameType.findIndex((s) => String(s.id) === String(story.id));
              if (i === -1) return 999;
              // Prefer stories after current in the feed (smaller wrap distance).
              return i > currentIndex ? i - currentIndex : sameType.length - currentIndex + i;
            })();

      return {
        id: String(story.id),
        score: scoreStoryForProfile(story, profile, hints),
        feedDistance,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.feedDistance - b.feedDistance;
    });

  return ranked[0]?.id ?? getNextStoryId(stories, currentId, storyType);
}
