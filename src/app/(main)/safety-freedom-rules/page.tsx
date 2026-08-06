'use client';

import { FADE_IN_UP_CONTAINER } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import FooterNoteSection from './_components/FooterNoteSection/FooterNoteSection';
import FreedomSection from './_components/FreedomSection/FreedomSection';
import RulesSection from './_components/RulesSection/RulesSection';
import SafetyHeroSection from './_components/SafetyHeroSection/SafetyHeroSection';
import SafetySection from './_components/SafetySection/SafetySection';

function SafetyFreedomRulesPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="min-h-screen w-full px-4 py-8 md:py-14"
    >
      <div className="mx-auto max-w-350 space-y-16 sm:space-y-20">
        {/* ================= HERO SECTION ================= */}
        <SafetyHeroSection />

        {/* --- Safety Section --- */}
        <SafetySection />

        {/* --- Freedom Section --- */}
        <FreedomSection />

        {/* --- Rules Section --- */}
        <RulesSection />

        {/* --- Footer Note --- */}
        <FooterNoteSection />
      </div>
    </motion.div>
  );
}

export default SafetyFreedomRulesPage;
