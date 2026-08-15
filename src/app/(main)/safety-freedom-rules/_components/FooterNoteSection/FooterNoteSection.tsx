'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';

const FooterNoteSection = () => {
  return (
    <motion.div variants={FADE_IN_UP_ITEM} className="w-full text-center">
      <p className="font-playpen text-center text-base leading-relaxed font-bold text-[#D22D4C] sm:text-lg md:text-xl">
        Safe enough to be honest. Free enough to be whole. Kind enough to keep each other here.
      </p>
    </motion.div>
  );
};

export default FooterNoteSection;
