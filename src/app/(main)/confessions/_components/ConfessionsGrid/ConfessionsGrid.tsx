'use client';

import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import StoryCatalogGrid from '@/components/main/StoryCatalogGrid/StoryCatalogGrid';
import { STORY_CATALOG_GRID_CLASS } from '@/utils/storyCover.utils';
import { Suspense } from 'react';

export default function ConfessionsGrid() {
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
        storyType="confession"
        noun="confessions"
        accentColor="#D22D4C"
        buttonBg="#D22D4C"
        ratingColor="#D22D4C"
      />
    </Suspense>
  );
}
