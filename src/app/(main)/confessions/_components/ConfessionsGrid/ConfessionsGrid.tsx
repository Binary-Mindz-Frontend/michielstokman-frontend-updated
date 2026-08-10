/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ConfessionsCard, { ConfessionItem } from './_components/ConfessionsCard/ConfessionsCard';

// Fallback Asset
import fallbackCardImage from '@/assets/shared/confession-card-1.png';

export default function ConfessionsGrid() {
  const [visibleCount, setVisibleCount] = useState(8);
  const { data: feedResponse, isLoading } = useGetDiscoveryFeedQuery(['confession']);

  const rawItems = feedResponse?.data?.items || [];

  // Filter for confessions (story_type === 'confession')
  const confessionItems = rawItems.filter(
    (item: any) =>
      item.story_type === 'confession' ||
      item.card_type === 'confession' ||
      (item.card_type === 'story' && item.story_type === 'confession'),
  );

  const confessionsData: ConfessionItem[] = confessionItems.map((item: any) => ({
    id: item.id,
    category: 'STORY',
    title: item.title,
    description: item.description,
    image: item.cover_image_url || fallbackCardImage,
    rating: item.rating ? item.rating.toString() : '4.8',
    listenedCount: item.listened_count ?? 0,
    isExplicit: item.is_explicit ?? false,
  }));

  const visibleConfessions = confessionsData.slice(0, visibleCount);
  const hasMore = confessionsData.length > visibleCount;

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
        {visibleConfessions.length > 0 ? (
          visibleConfessions.map((item) => <ConfessionsCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full py-12 text-center font-sans text-sm font-semibold text-[#777]">
            No confessions found.
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
              bgColor="#D22D4C"
              textColor="white"
            />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
