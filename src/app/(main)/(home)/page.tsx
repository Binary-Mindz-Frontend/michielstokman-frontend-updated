'use client';
import BGImage from '@/assets/home/bgImage.png';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import HeroContent from './_components/HeroContent/HeroContent';
import ResonanceGrid from './_components/ResonanceGrid/ResonanceGrid';

const Homepage = () => {
  return (
    <section className="relative w-full bg-[#FAF7F5]">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(${BGImage?.src})`,
          height: '703px',
          opacity: '0.8',
        }}
      />

      {/* Overlay Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          height: '703px',
          background: `linear-gradient(
            to bottom, 
            #FAF7F5 10%, 
            rgba(250, 247, 245, 0.3) 40%, 
            rgba(250, 247, 245, 0.6) 70%, 
            #FAF7F5 100%
          )`,
        }}
      />

      {/* Content Area */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="relative z-10 mx-auto max-w-400 space-y-10 px-4 py-20 lg:space-y-20"
      >
        <motion.div variants={FADE_IN_UP_ITEM}>
          <HeroContent />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
          <ResonanceGrid />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Homepage;
