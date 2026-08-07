/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import LiberationsCard, { LiberationItem } from './_components/LiberationsCard/LiberationsCard';

// Fallback Asset
import fallbackCardImage from '@/assets/shared/confession-card-1.png';

export default function LiberationsGrid() {
  const [visibleCount, setVisibleCount] = useState(8);
  const { data: feedResponse, isLoading } = useGetDiscoveryFeedQuery([]);

  const rawItems = feedResponse?.data?.items || [];

  // Filter for liberations (card_type === 'liberation_journey' or story_type === 'liberation')
  const liberationItems = rawItems.filter(
    (item: any) =>
      item.card_type === 'liberation_journey' ||
      item.card_type === 'liberation' ||
      item.story_type === 'liberation',
  );

  const liberationsData: LiberationItem[] = liberationItems.map((item: any) => ({
    id: item.id || item.journey_code,
    journeyCode: item.journey_code,
    category: 'STORY',
    title: item.title,
    description: item.description,
    image: item.cover_image_url || fallbackCardImage,
    price: item.price_display
      ? `€${item.price_display}`
      : item.rating
        ? item.rating.toString()
        : '€47',
    listenedCount: item.listened_count ?? 277,
    isExplicit: item.is_explicit ?? false,
  }));

  const visibleLiberations = liberationsData.slice(0, visibleCount);
  const hasMore = liberationsData.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
      </div>
    );
  }

  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      {/* 3 Column Grid */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {visibleLiberations.length > 0 ? (
          visibleLiberations.map((item) => <LiberationsCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full py-12 text-center font-sans text-sm font-semibold text-[#777]">
            No liberations found.
          </div>
        )}
      </motion.div>

      {/* Load More Button (Only visible if there are more than visibleCount items) */}
      {hasMore && (
        <motion.div variants={FADE_IN_UP_ITEM} className="mt-8 flex w-full justify-center md:mt-10">
          <div>
            <DynamicActionButton
              text="LOAD MORE"
              onClick={handleLoadMore}
              bgColor="#4A229D"
              textColor="white"
            />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
