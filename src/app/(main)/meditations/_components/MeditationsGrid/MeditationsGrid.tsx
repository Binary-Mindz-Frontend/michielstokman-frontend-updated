'use client';

import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import StoryCatalogGrid from '@/components/main/StoryCatalogGrid/StoryCatalogGrid';
import { Suspense } from 'react';

export default function MeditationsGrid() {
  return (
    <Suspense
      fallback={
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
