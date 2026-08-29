/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { resolveStoryCoverSrc } from '@/utils/storyCover.utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import MeditationsCard, { MeditationItem } from './_components/MeditationsCard/MeditationsCard';

export default function MeditationsGrid() {
  const [visibleCount, setVisibleCount] = useState(8);
  const { data: feedResponse, isLoading } = useGetDiscoveryFeedQuery(['meditation']);

  const rawItems = feedResponse?.data?.items || [];

  // Filter for meditations (story_type === 'meditation')
  const meditationItems = rawItems.filter(
    (item: any) =>
      item.story_type === 'meditation' ||
      item.card_type === 'meditation' ||
      (item.card_type === 'story' && item.story_type === 'meditation'),
  );

  const meditationsData: MeditationItem[] = meditationItems.map((item: any) => ({
    id: item.id,
    category: 'STORY',
    title: item.title,
    description: item.excerpt || item.description,
    image: resolveStoryCoverSrc(item.cover_image_url, 'meditation'),
    rating: item.rating ? item.rating.toString() : '4.8',
    listenedCount: item.listened_count ?? 0,
    isExplicit: item.is_explicit ?? false,
  }));

  const visibleMeditations = meditationsData.slice(0, visibleCount);
  const hasMore = meditationsData.length > visibleCount;

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
    <motion.section
      id="stories"
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="scroll-mt-24"
    >
      {/* 3 Column Grid */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {visibleMeditations.length > 0 ? (
          visibleMeditations.map((item) => <MeditationsCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full py-12 text-center font-sans text-sm font-medium text-[#777]">
            No meditations found.
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
              bgColor="#EEA13D"
              textColor="white"
            />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
