import type { StoryType } from '@/types/memberStory.types';
import type { StaticImageData } from 'next/image';

import confessionFallback from '@/assets/shared/confession-card-1.png';
import meditationsHero from '@/assets/shared/meditations-hero.png';

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
    return coverUrl!.trim();
  }
  return getStoryCoverFallback(storyType);
}
