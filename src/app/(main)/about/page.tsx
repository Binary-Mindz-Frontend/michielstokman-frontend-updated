'use client';

import { FADE_IN_UP_CONTAINER } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import AboutHeroSection from './_components/AboutHeroSection/AboutHeroSection';
import CostOfAdaptationSection from './_components/CostOfAdaptationSection/CostOfAdaptationSection';
import ReturnToVitalitySection from './_components/ReturnToVitalitySection/ReturnToVitalitySection';
import SovereignTruthSection from './_components/SovereignTruthSection/SovereignTruthSection';
import SpaceToBeSeenSection from './_components/SpaceToBeSeenSection/SpaceToBeSeenSection';
import YourInvitationSection from './_components/YourInvitationSection/YourInvitationSection';

function WhyTransformToLiberationPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="min-h-screen w-full px-4 py-8 md:py-14"
    >
      <div className="mx-auto max-w-350 space-y-16 sm:space-y-24">
        {/* ================= HERO SECTION ================= */}
        <AboutHeroSection />

        {/* ================= SECTION 1: SOVEREIGN TRUTH ================= */}
        <SovereignTruthSection />

        {/* ================= SECTION 2: COST OF ADAPTATION ================= */}
        <CostOfAdaptationSection />

        {/* ================= SECTION 3: RETURN TO VITALITY ================= */}
        <ReturnToVitalitySection />

        {/* ================= SECTION 4: THE SPACE TO BE SEEN ================= */}
        <SpaceToBeSeenSection />

        {/* ================= SECTION 5: YOUR INVITATION ================= */}
        <YourInvitationSection />
      </div>
    </motion.div>
  );
}

export default WhyTransformToLiberationPage;
