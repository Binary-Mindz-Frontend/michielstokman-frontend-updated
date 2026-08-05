'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Asset from src/assets/about
import sovereignTextBg from '@/assets/about/sovereign-text-bg.png';

const SovereignTruthSection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16"
    >
      {/* --- LEFT CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left md:w-1/2">
        {/* Section Heading */}
        <h2 className="font-edo text-2xl font-normal text-[#D84A7A] uppercase sm:text-3xl md:text-3xl lg:text-4xl">
          01. THE SOVEREIGN TRUTH
        </h2>

        {/* Subheading Quote Line */}
        <div className="mt-6 flex items-start gap-2">
          <span className="font-serif text-2xl leading-none font-bold text-[#E81A66] sm:text-3xl md:text-4xl">
            &#8220;
          </span>
          <p className="font-playpen text-lg leading-snug font-normal text-[#1A1A1A] sm:text-xl md:text-2xl">
            The world we have built is a world of the surface.
          </p>
        </div>

        {/* Text Paragraphs */}
        <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed font-normal text-[#333333] sm:text-base md:text-[17px]">
          <p>
            We live at the narrow edge, where the waves of reaction constantly crash against the
            rocks. We define ourselves by opposition: right or wrong, success or failure, us versus
            them.
          </p>
          <p>
            For many of us—especially those who have achieved much and given more—there comes a
            moment of silent realization: This friction is not all there is.
          </p>
        </div>
      </div>

      {/* --- RIGHT TORN PAPER CARD COLUMN --- */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="relative flex w-full max-w-115 items-center justify-center sm:max-w-130 md:max-w-145">
          {/* Background Torn Paper Image */}
          <div className="relative aspect-4/3 w-full">
            <Image
              src={sovereignTextBg}
              alt="Sovereign truth torn paper background"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Overlaid Text inside Paper */}
          <div className="absolute inset-0 flex items-center justify-center px-12 py-8 sm:px-16 sm:py-10 md:px-20 md:py-12 lg:px-24">
            <p className="font-playpen text-center text-xs leading-relaxed font-semibold text-[#2D2D2D] sm:text-sm md:text-base">
              We are breaking the greatest taboo of our time: the artificial separation of our
              intellect from our life force. We have lived too long in a &quot;Childish
              Duality&quot; that ignores our deepest essence.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SovereignTruthSection;
