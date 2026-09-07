'use client';

import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import StoryCatalogGrid from '@/components/main/StoryCatalogGrid/StoryCatalogGrid';
import { Suspense } from 'react';

export default function ConfessionsGrid() {
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
        storyType="confession"
        noun="confessions"
        accentColor="#EB2874"
        buttonBg="#D22D4C"
        ratingColor="#EB2874"
      />
    </Suspense>
  );
}
