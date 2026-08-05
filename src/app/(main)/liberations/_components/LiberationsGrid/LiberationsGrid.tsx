'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import LiberationsCard, { LiberationItem } from './_components/LiberationsCard/LiberationsCard';

// Assets
import card1 from '@/assets/confessions/confession-card-1.png';

const liberationsData: LiberationItem[] = [
  {
    id: 1,
    category: 'STORY',
    title: 'THE ART OF LETTING GO',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card1,
    price: '€47',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 2,
    category: 'STORY',
    title: 'THE MORNING I STOPPED RUNNING',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card1,
    price: '€47',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 3,
    category: 'STORY',
    title: 'THE ART OF LETTING GO',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card1,
    price: '€47',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 4,
    category: 'STORY',
    title: 'THE ART OF LETTING GO',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card1,
    price: '€47',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 5,
    category: 'STORY',
    title: 'THE MORNING I STOPPED RUNNING',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card1,
    price: '€47',
    listenedCount: 277,
    isExplicit: true,
  },
  {
    id: 6,
    category: 'STORY',
    title: 'THE ART OF LETTING GO',
    description: 'The First Time I Really Felt A Tree Was When I Was Ten...................',
    image: card1,
    price: '€47',
    listenedCount: 277,
    isExplicit: true,
  },
];

export default function LiberationsGrid() {
  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      {/* 3 Column Grid */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {liberationsData.map((item) => (
          <LiberationsCard key={item.id} item={item} />
        ))}
      </motion.div>

      {/* Load More Button */}
      <motion.div variants={FADE_IN_UP_ITEM} className="mt-8 flex w-full justify-center md:mt-10">
        <div>
          <DynamicActionButton text="LOAD MORE" bgColor="#54318C" textColor="white" />
        </div>
      </motion.div>
    </motion.section>
  );
}
