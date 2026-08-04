'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MeditationsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 py-20 text-center"
    >
      <motion.div variants={FADE_IN_UP_ITEM} className="mx-auto max-w-lg space-y-4">
        <span className="inline-block rounded-full bg-[#E5E7EB] px-4 py-1.5 text-xs font-semibold tracking-widest text-gray-700 uppercase">
          Meditations
        </span>
        <h1 className="font-serif text-4xl font-semibold text-black sm:text-5xl">Coming Soon</h1>
        <p className="font-sans leading-relaxed text-gray-600">
          This section is currently under creation. Check back soon for awakening meditations.
        </p>
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
