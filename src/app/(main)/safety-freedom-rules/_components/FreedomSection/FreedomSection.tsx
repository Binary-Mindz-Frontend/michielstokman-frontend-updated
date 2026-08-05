'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';

const FreedomSection = () => {
  return (
    <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
      <div className="flex items-center gap-3 text-[#486221]">
        <Wind size={24} strokeWidth={2} />
        <h2 className="font-serif text-xl font-medium md:text-2xl">Freedom</h2>
      </div>
      <div className="space-y-4 font-sans leading-relaxed text-[#2D2D2D]">
        <p>At Transform to Liberation, we act from freedom. We explore freedom. We practice it.</p>
        <p>
          And freedom only exists alongside responsibility. One without the other collapses into
          either tyranny or chaos. Together, they become a way of living.
        </p>
        <p>
          Act in the spirit of Transform to Liberation. Help each other. Hold each other
          accountable, and embrace each other in the same breath. We are here to liberate — not to
          perform liberation while binding the person beside us.
        </p>
      </div>
    </motion.div>
  );
};

export default FreedomSection;
