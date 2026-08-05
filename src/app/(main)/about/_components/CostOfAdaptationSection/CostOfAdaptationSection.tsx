'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Asset from src/assets/about
import adaptationImg from '@/assets/about/adaptation-image.png';

const CostOfAdaptationSection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16"
    >
      {/* --- LEFT IMAGE COLUMN --- */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="relative w-full max-w-110 sm:max-w-125 md:max-w-140">
          <Image
            src={adaptationImg}
            alt="The Cost of Adaptation Section Image"
            width={650}
            height={650}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>

      {/* --- RIGHT CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left md:w-1/2">
        {/* Section Heading */}
        <h2 className="font-edo text-2xl font-normal text-[#C47834] uppercase not-italic sm:text-3xl md:text-3xl lg:text-4xl">
          02. THE COST OF ADAPTATION
        </h2>

        {/* Text Paragraphs */}
        <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed font-normal text-[#333333] sm:text-base md:text-[17px]">
          <p>
            No one sets out to lose themselves. We simply learn to survive. We learn which parts of
            our soul are welcomed and which create friction. We adapt to keep our families, our
            companies, and our circles safe. We become the keepers of the peace, the managers of the
            status quo.
          </p>
          <p>
            But over time, these adjustments look like character. We lose track of the one question
            that can no longer be silenced:
          </p>
        </div>

        {/* Highlight Question Callout */}
        <h3 className="font-edo mt-6 text-xl font-normal text-[#C47834] uppercase not-italic sm:text-2xl md:text-2xl lg:text-3xl">
          WHAT IS ACTUALLY TRUE FOR ME?
        </h3>
      </div>
    </motion.div>
  );
};

export default CostOfAdaptationSection;
