'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets from src/assets/safety/rules-section & share
import rulesSectionIcon from '@/assets/safety/rules-section/rules-icon.svg';
import rulesSectionImg from '@/assets/safety/rules-section/rules-image.png';
import titleUnderline from '@/assets/safety/share/title-underline.png';

const RulesSection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16"
    >
      {/* --- LEFT CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left md:w-1/2">
        {/* Heading Unit */}
        <div className="flex w-full items-center justify-center gap-3 md:w-auto md:justify-start md:gap-4">
          {/* 1. Sun/Eye Icon */}
          <div className="relative h-10 w-10 shrink-0 md:h-12 md:w-12">
            <Image src={rulesSectionIcon} alt="Rules Icon" fill className="object-contain" />
          </div>

          {/* 2. Rotated '03' with Playpen Sans */}
          <div className="relative flex items-center justify-center px-2">
            <span
              className="font-playpen text-xl font-bold text-[#E81A66] md:text-2xl"
              style={{ transform: 'rotate(-19.389deg)' }}
            >
              03
            </span>

            {/* The thin pink underline under '03' */}
            <div
              className="absolute -right-4 -bottom-1 -left-2 h-0.5 bg-[#E81A66]"
              style={{ transform: 'rotate(-19.389deg)' }}
            />
          </div>

          {/* 3. RULES Title with Brush Underline */}
          <div className="relative ml-2 flex flex-col items-center">
            <h2 className="font-edo text-4xl font-medium tracking-wide text-black uppercase md:text-5xl">
              RULES
            </h2>

            {/* Pink Curved Underline */}
            <div className="absolute -bottom-3 left-1/2 w-[110%] -translate-x-1/2">
              <Image
                src={titleUnderline}
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
            Our Editorial Team Curates Language That Divides. The Kind Of Language That Puts Human
            Above Another, Or Strips Someone Of Their Dignity. That Is What We Filter — Not The
            Truth, Not The Body, Not Desire.
          </p>
          <p>
            You Can Break The Rules Of Polite Society. You Can Name Any Body Part You Like. You Can
            Speak About Pleasure, Grief, Rage, Hunger, Tenderness — Without Apology.
          </p>
          <p>
            What You Cannot Do Is Talk People Down. Not Yourself, Not Anyone Else. We All Are
            Worthy. That Is The One Line, And It Holds Everything Else In Place.
          </p>
        </div>
      </div>

      {/* --- RIGHT IMAGE COLUMN --- */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="relative w-full max-w-110 sm:max-w-120 md:max-w-135">
          <Image
            src={rulesSectionImg}
            alt="Rules Section Photo Grid Collage"
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

export default RulesSection;
