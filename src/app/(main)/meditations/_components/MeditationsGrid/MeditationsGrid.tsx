/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import MeditationsCard, { MeditationItem } from './_components/MeditationsCard/MeditationsCard';

// Fallback Asset
import fallbackCardImage from '@/assets/meditations/meditation-card-1.png';

export default function MeditationsGrid() {
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
    description: item.description,
    image: item.cover_image_url || fallbackCardImage,
    rating: item.rating ? item.rating.toString() : '4.8',
    listenedCount: item.listened_count ?? 0,
    isExplicit: item.is_explicit ?? false,
  }));

  if (isLoading) {
    return (
      <div className="py-16 text-center font-sans text-sm font-semibold text-[#777]">
        Loading Meditations...
      </div>
    );
  }

  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      {/* 3 Column Grid */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {meditationsData.length > 0 ? (
          meditationsData.map((item) => <MeditationsCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full py-12 text-center font-sans text-sm font-semibold text-[#777]">
            No meditations found.
          </div>
        )}
      </motion.div>

      {/* Load More Button */}
      {meditationsData.length > 0 && (
        <motion.div variants={FADE_IN_UP_ITEM} className="mt-8 flex w-full justify-center md:mt-10">
          <div>
            <DynamicActionButton text="LOAD MORE" bgColor="#EEA13D" textColor="white" />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
