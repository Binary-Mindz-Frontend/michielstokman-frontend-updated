import { resolveMediaUrl } from '@/lib/publications/media';
import type { StoryType } from '@/types/memberStory.types';
import type { StaticImageData } from 'next/image';

import confessionFallback from '@/assets/shared/confession-card-1.png';
import meditationsHero from '@/assets/shared/meditations-hero.png';

/** Catalog / liberations / dashboard listing grids — tuned for MacBook widths. */
export const STORY_CATALOG_GRID_CLASS =
  'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4';

export const STORY_COVER_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw';

export function getStoryCoverFallback(storyType: StoryType): StaticImageData {
  if (storyType === 'meditation') return meditationsHero;
  return confessionFallback;
}

export function hasStoryCover(coverUrl?: string | null): boolean {
  return Boolean(coverUrl?.trim());
}

export function resolveStoryCoverSrc(
  coverUrl: string | null | undefined,
  storyType: StoryType,
): string | StaticImageData {
  if (hasStoryCover(coverUrl)) {
    return resolveMediaUrl(coverUrl) ?? coverUrl!.trim();
  }
  return getStoryCoverFallback(storyType);
}

/**
 * Prefer Next.js image optimization for absolute http(s) covers (retina-friendly).
 * Skip for static imports (handled by Next), data/blob, or unresolved relative paths.
 */
export function shouldUnoptimizeStoryImage(src: string | StaticImageData): boolean {
  if (typeof src !== 'string') return false;
  if (/^(data:|blob:)/i.test(src)) return true;
  if (!/^https?:\/\//i.test(src)) return true;
  return false;
}
