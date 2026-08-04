'use client';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import HeroContent from './_components/HeroContent/HeroContent';
import LatestConfessions from './_components/LatestConfessions/LatestConfessions';
import LiberationSurvey from './_components/LiberationSurvey/LiberationSurvey';
import ResonanceGrid from './_components/ResonanceGrid/ResonanceGrid';
import WhyWeExist from './_components/WhyWeExist/WhyWeExist';
import YouBelongHere from './_components/YouBelongHere/YouBelongHere';

const Homepage = () => {
  return (
    <section className="relative w-full bg-[#FBF9F3]">
      {/* Content Area */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="relative z-10 mx-auto max-w-400 space-y-10 lg:space-y-25"
      >
        <motion.div variants={FADE_IN_UP_ITEM}>
          <HeroContent />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
          <ResonanceGrid />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
          <YouBelongHere />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
          <WhyWeExist />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
          <LiberationSurvey />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
          <LatestConfessions />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Homepage;
