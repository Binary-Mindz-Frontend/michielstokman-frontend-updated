'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets from src/assets/safety/safety-section
import safetyLine from '@/assets/safety/share/title-underline.png';
import safetySectionIcon from '@/assets/safety/safety-section/safety-section-icon.svg';
import safetySectionImg from '@/assets/safety/safety-section/safety-section-image.png';

const SafetySection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16"
    >
      {/* --- LEFT CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left md:w-1/2">
        {/* Heading Unit */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* 1. Shield Icon */}
          <div className="relative h-10 w-10 shrink-0 md:h-12 md:w-12">
            <Image src={safetySectionIcon} alt="Safety Shield" fill className="object-contain" />
          </div>

          {/* 2. Rotated '01' with Playpen Sans */}
          <div className="relative flex items-center justify-center px-2">
            <span
              className="font-playpen text-xl font-bold text-[#E81A66] md:text-2xl"
              style={{ transform: 'rotate(-19.389deg)' }}
            >
              01
            </span>

            {/* The thin pink underline under '01' */}
            <div
              className="absolute -right-4 -bottom-1 -left-2 h-0.5 bg-[#E81A66]"
              style={{ transform: 'rotate(-19.389deg)' }}
            />
          </div>

          {/* 3. SAFETY Title with Brush Underline */}
          <div className="relative ml-2 flex flex-col items-center">
            <h2 className="font-edo text-4xl font-black tracking-wide text-black uppercase md:text-5xl">
              SAFETY
            </h2>

            {/* Pink Curved Underline */}
            <div className="absolute -bottom-3 left-1/2 w-[110%] -translate-x-1/2">
              <Image
                src={safetyLine}
                alt="pink underline"
                width={150}
                height={15}
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Text Paragraphs */}
        <div className="mt-8 space-y-5 font-sans text-sm leading-relaxed font-semibold text-[#1A1A1A] sm:text-base md:text-[17px] md:leading-relaxed">
          <p>
            Safety Is Technical Encrypted Accounts, Protected Submissions, Careful Handling Of Your
            Data. But Mostly, Safety Is Human.
          </p>
          <p>
            You Can Only Express What Is True When You Feel Safe, So If You Need To. Use A Nickname.
            Hide Behind A Name That Lets Your Real Voice Come Forward. There Is No Shame In That —
            It Is Wisdom.
          </p>
          <p>
            Safety Also Means We Do Not Scream At Each Other. We Do Not Yell. We Do Not Weaponize
            Our Pain Against Another Person. Inside That Container, You Are Free To Name Your
            Deepest Desires, Your Longings, The Things You Have Never Said Out Loud.
          </p>
        </div>
      </div>

      {/* --- RIGHT IMAGE COLUMN --- */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="relative w-full max-w-110 sm:max-w-120 md:max-w-135">
          <Image
            src={safetySectionImg}
            alt="Safety Section Woman Reflecting"
            width={600}
            height={600}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SafetySection;
