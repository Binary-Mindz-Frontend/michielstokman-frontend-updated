'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const RulesSection = () => {
  return (
    <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
      <div className="flex items-center gap-3 text-[#F3A134]">
        <FileText size={24} strokeWidth={2} />
        <h2 className="font-serif text-xl font-medium md:text-2xl">Rules</h2>
      </div>
      <div className="space-y-4 font-sans leading-relaxed text-[#2D2D2D]">
        <p>
          Our editorial team curates language that divides. The kind of language that puts one human
          above another, or strips someone of their dignity. That is what we filter — not the truth,
          not the body, not desire.
        </p>
        <p>
          You can break the rules of polite society. You can name any body part you like. You can
          speak about pleasure, grief, rage, hunger, tenderness — without apology.
        </p>
        <p>
          What you cannot do is talk people down. Not yourself. Not anyone else. We all are worthy.
          That is the one line, and it holds everything else in place.
        </p>
      </div>
    </motion.div>
  );
};

export default RulesSection;
