'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';

const FooterNoteSection = () => {
  return (
    <motion.div variants={FADE_IN_UP_ITEM} className="border-t border-gray-200/60 pt-6">
      <p className="text-primary/90 text-center font-serif text-base leading-relaxed font-medium tracking-wide md:text-left md:text-lg">
        Safe enough to be honest. Free enough to be whole. Kind enough to keep each other here.
      </p>
    </motion.div>
  );
};

export default FooterNoteSection;
