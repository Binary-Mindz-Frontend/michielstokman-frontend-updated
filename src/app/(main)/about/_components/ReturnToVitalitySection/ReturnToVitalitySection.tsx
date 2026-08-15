'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Asset from src/assets/about
import vitalityImg from '@/assets/about/vitality-image.png';

const ReturnToVitalitySection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16"
    >
      {/* --- LEFT CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left md:w-1/2">
        {/* Section Heading */}
        <h2 className="font-edo text-2xl font-normal text-[#E81A66] uppercase sm:text-3xl md:text-3xl lg:text-4xl">
          03. THE RETURN TO VITALITY
        </h2>

        {/* Text Paragraphs */}
        <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed font-normal text-[#333333] sm:text-base md:text-[17px]">
          <p>
            Transform to Liberation is not a program for self-improvement. It is a return to what is
            real. It is the recognition that maturity is not about control, but about the courage to
            be fully present.
          </p>
          <p>
            To be truly liberated is to embrace your sensuality and sexuality not as a performance,
            but as the sacred fire of your existence. It is the energy that allows a human being to
            truly shine. It is the integration of the feminine power within the masculine frame—a
            state where we no longer just manage life, but actually live it.
          </p>
        </div>
      </div>

      {/* --- RIGHT IMAGE COLUMN --- */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="relative w-full max-w-110 sm:max-w-125 md:max-w-140">
          <Image
            src={vitalityImg}
            alt="The Return to Vitality Section Image"
            width={650}
            height={650}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ReturnToVitalitySection;
