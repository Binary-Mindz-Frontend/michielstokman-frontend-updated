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
        accentColor="#EB2874"
        buttonBg="#D22D4C"
        ratingColor="#EB2874"
      />
    </Suspense>
  );
}
