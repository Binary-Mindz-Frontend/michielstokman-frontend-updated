'use client';

import StoryListingCard, {
  StoryListingItem,
} from '@/components/main/StoryListingCard/StoryListingCard';
import React from 'react';

export type MeditationItem = StoryListingItem;

interface MeditationsCardProps {
  item: MeditationItem;
}

const MeditationsCard: React.FC<MeditationsCardProps> = ({ item }) => {
  return (
    <StoryListingCard
      item={item}
      href={`/details/${item.id}`}
      accentColor="#EEA13D"
      buttonBg="#EEA13D"
      ratingColor="#EEA13D"
    />
  );
};

export default MeditationsCard;
