'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets from src/assets/safety/hero-section
import greenLoveImg from '@/assets/safety/hero-section/green-love-image.png';
import pinkLoveImg from '@/assets/safety/hero-section/pink-love-image.png';
import safetyBrushBg from '@/assets/safety/hero-section/safety-brush-bg.png';
import safetyHeroImg from '@/assets/safety/hero-section/safety-hero-image.png';
import starImg from '@/assets/safety/hero-section/star-image.png';

const SafetyHeroSection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="relative flex w-full flex-col items-center justify-between gap-0 md:flex-row md:gap-12"
    >
      {/* --- LEFT TEXT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left md:w-1/2">
        {/* Title Header with Floating Heart */}
        <div className="relative flex w-full flex-col items-start">
          {/* Floating Pink Heart (Top Right of Title) */}
          <div className="absolute top-2 right-4 h-7 w-7 sm:right-12 sm:h-8 sm:w-8 md:top-0 md:right-6 lg:right-12">
            <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
          </div>

          {/* Title Text */}
          <div className="font-edo flex flex-col items-start leading-none font-medium uppercase">
            <span className="-rotate-2 transform text-[2.75rem] tracking-wider text-[#486221] sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem]">
              SAFETY.
            </span>
            <span className="mt-2 -rotate-2 transform text-[2.75rem] tracking-wider text-[#E81A66] sm:mt-3 sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem]">
              FREEDOM.
            </span>
            <span className="mt-2 -rotate-2 transform text-[2.75rem] tracking-wider text-[#F3A134] sm:mt-3 sm:text-5xl md:text-[3.5rem] lg:text-[4.5rem]">
              RULES.
            </span>
          </div>
        </div>

        {/* Brush Text Container */}
        <div className="relative mt-8 flex min-h-25 w-full max-w-105 -rotate-1 transform items-center justify-center px-4 py-6 sm:mt-10 sm:px-6">
          {/* Brush Image Background */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={safetyBrushBg}
              alt="Brush background"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Text inside Brush */}
          <div className="relative z-10 px-4 text-center font-sans text-[11px] leading-relaxed font-medium text-white sm:text-xs md:text-sm">
            <p>
              The Ground We <span className="text-[#E81A66]">Stand On</span> Together.
            </p>
            <p className="mt-0.5">Read It Once. Carry It With You.</p>
          </div>

          {/* Floating Pink Hearts around Brush Box (Desktop) */}
          <div className="absolute -bottom-5 left-4 hidden h-5 w-5 sm:h-6 sm:w-6 md:block">
            <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
          </div>
          <div className="absolute -bottom-6 left-1/2 hidden h-5 w-5 -translate-x-1/2 sm:h-6 sm:w-6 md:block">
            <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
          </div>
          <div className="absolute right-6 -bottom-5 hidden h-5 w-5 sm:h-6 sm:w-6 md:block">
            <Image src={pinkLoveImg} alt="pink heart" fill className="object-contain" />
          </div>
        </div>
      </div>

      {/* --- RIGHT IMAGE COLUMN --- */}
      <div className="relative flex w-full justify-center md:w-1/2 md:pr-6">
        {/* Hero Image Container */}
        <div className="relative aspect-4/5 w-full max-w-90 sm:max-w-105">
          <Image
            src={safetyHeroImg}
            alt="Safety Hero Reflecting Woman"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right Side Floating Icons (Star, Pink Heart, Green Heart - Desktop) */}
        <div className="absolute top-1/2 -right-1 z-10 hidden -translate-y-1/2 flex-col items-center gap-6 sm:right-0 md:flex">
          {/* Star Icon */}
          <div className="relative h-6 w-6 sm:h-7 sm:w-7">
            <Image src={starImg} alt="star icon" fill className="object-contain" />
          </div>

          {/* Pink Heart Icon */}
          <div className="relative h-6 w-6 sm:h-7 sm:w-7">
            <Image src={pinkLoveImg} alt="pink heart icon" fill className="object-contain" />
          </div>

          {/* Green Heart Icon */}
          <div className="relative h-6 w-6 sm:h-7 sm:w-7">
            <Image src={greenLoveImg} alt="green heart icon" fill className="object-contain" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SafetyHeroSection;
