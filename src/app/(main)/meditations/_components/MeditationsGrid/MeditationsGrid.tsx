'use client';

import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import StoryCatalogGrid from '@/components/main/StoryCatalogGrid/StoryCatalogGrid';
import { STORY_CATALOG_GRID_CLASS } from '@/utils/storyCover.utils';
import { Suspense } from 'react';

export default function MeditationsGrid() {
  return (
    <Suspense
      fallback={
        <div className={STORY_CATALOG_GRID_CLASS}>
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
        </div>
      }
    >
      <StoryCatalogGrid
        storyType="meditation"
        noun="meditations"
        accentColor="#EEA13D"
        buttonBg="#EEA13D"
        ratingColor="#EEA13D"
      />
    </Suspense>
  );
}
