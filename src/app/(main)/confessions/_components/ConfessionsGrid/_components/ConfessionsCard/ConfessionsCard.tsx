'use client';

import StoryListingCard, {
  StoryListingItem,
} from '@/components/main/StoryListingCard/StoryListingCard';
import React from 'react';

export type ConfessionItem = StoryListingItem;

interface ConfessionsCardProps {
  item: ConfessionItem;
}

const ConfessionsCard: React.FC<ConfessionsCardProps> = ({ item }) => {
  return (
    <StoryListingCard
      item={item}
      href={`/details/${item.id}`}
      accentColor="#D22D4C"
      buttonBg="#D22D4C"
      ratingColor="#D22D4C"
    />
  );
};

export default ConfessionsCard;
