'use client';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="mx-auto max-w-3xl space-y-4 py-8 text-center sm:py-20 lg:py-28"
    >
      <motion.p variants={FADE_IN_UP_ITEM} className="text-dark-primary tracking-wide lg:text-lg">
        85,000 daring souls from 18 countries are already here — feeling deeply, releasing freely,
        rising bolder together.
      </motion.p>

      <motion.h1
        variants={FADE_IN_UP_ITEM}
        className="text-dark-primary text-4xl font-semibold sm:text-5xl xl:text-7xl"
      >
        Transform to Liberation
      </motion.h1>

      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="text-dark-primary/80 space-y-4 leading-relaxed lg:text-lg"
      >
        <p>
          Raw confessions that quicken your breath. Meditations that awaken every hidden pulse.
          Journeys that dare you to claim more — more aliveness, more pleasure, more
          unapologetically vibrant you.
        </p>
        <p className="text-muted">
          A quiet revolution to soften what&apos;s hardened... feel what&apos;s been waiting... and
          bloom into the richer, wilder life that already knows your name.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
