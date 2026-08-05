'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import ConfessionsCard, { ConfessionItem } from './_components/ConfessionsCard/ConfessionsCard';

// Assets
import {
  default as card1,
  default as card2,
  default as card3,
  default as card4,
  default as card5,
  default as card6,
} from '@/assets/confessions/confession-card-1.png';

const confessionsData: ConfessionItem[] = [
  {
    id: 1,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card1,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 2,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card2,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 3,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card3,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 4,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card4,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 5,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card5,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 6,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card6,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 7,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card6,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 8,
    category: 'STORY',
    title: 'CONTACT WITH THE TREES',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card6,
    rating: '4.8',
    listenedCount: 277,
    isExplicit: true,
  },
];

export default function ConfessionsGrid() {
  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      {/* 3 Column Grid */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {confessionsData.map((item) => (
          <ConfessionsCard key={item.id} item={item} />
        ))}
      </motion.div>

      {/* Load More Button */}
      <motion.div variants={FADE_IN_UP_ITEM} className="mt-8 flex w-full justify-center md:mt-10">
        <div>
          <DynamicActionButton text="LOAD MORE" bgColor="#D22D4C" textColor="white" />
        </div>
      </motion.div>
    </motion.section>
  );
}
