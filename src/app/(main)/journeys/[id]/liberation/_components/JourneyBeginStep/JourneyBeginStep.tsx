'use client';

import greenHeartIcon from '@/assets/liberations/liberation-steps/green-pink-icon.png';
import pinkHeartIcon from '@/assets/liberations/liberation-steps/love-pink-icon.png';
import starIcon from '@/assets/liberations/liberation-steps/star-icon.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export interface JourneyBeginStepProps {
  title?: string;
  subtitle?: string;
  stats?: string;
  onBeginLiberation: () => void;
  onBack: () => void;
}

export default function JourneyBeginStep({
  title,
  subtitle,
  stats,
  onBeginLiberation,
  onBack,
}: JourneyBeginStepProps) {
  return (
    <motion.section
      key="landing"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] px-4 py-8 md:px-8 md:py-12"
    >
      {/* Top-Left Back Button using dedicated DynamicBackButton */}
      <div className="absolute top-4 left-4 z-10 sm:top-6 sm:left-8 md:top-8 md:left-10">
        <DynamicBackButton
          text="Back"
          onClick={onBack}
          bgColor="#52277F"
          textColor="white"
          className="rounded-xs! border-0! shadow-none!"
        />
      </div>

      {/* Centered Content Container */}
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-4xl flex-col items-center justify-center text-center">
        {/* Title Block with Pink Heart Doodle Top-Right - Single Line */}
        <div className="relative mb-3 inline-block max-w-full px-4">
          <h1 className="font-edo text-3xl leading-normal font-normal tracking-wider whitespace-nowrap text-[#52277F] uppercase sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>

          {/* Pink Heart Doodle (love-pink-icon) top-right position */}
          <div className="absolute top-1/2 -right-8 h-8 w-8 -translate-y-1/2 sm:-right-16 sm:h-12 sm:w-12 md:-right-24 md:h-16 md:w-16">
            <Image src={pinkHeartIcon} alt="Pink Heart" fill className="object-contain" />
          </div>
        </div>

        {/* Subtitle & Subtext Block with Green Heart Doodle Left - Single Line Subtitle */}
        <div className="relative inline-block max-w-full px-4">
          {/* Green Heart Doodle (green-pink-icon) positioned bottom-left relative to text */}
          <div className="absolute bottom-2 -left-8 h-8 w-8 sm:bottom-4 sm:-left-16 sm:h-11 sm:w-11 md:bottom-6 md:-left-24 md:h-14 md:w-14">
            <Image src={greenHeartIcon} alt="Green Heart" fill className="object-contain" />
          </div>

          {/* Subtitle: Single line text, Playpen Sans 400, Gray-700 (#344054) */}
          <p className="font-playpen mb-2 text-xs leading-normal font-normal whitespace-nowrap text-[#344054] sm:text-base md:text-lg lg:text-xl">
            {subtitle}
          </p>
          {/* Stats: Playpen Sans, 400 */}
          <p className="font-playpen mb-8 text-xs leading-normal font-normal whitespace-nowrap text-[#667085] sm:text-sm md:mb-10">
            {stats}
          </p>
        </div>

        {/* CTA Button Block with Pink Star Doodle Bottom-Right */}
        <div className="relative">
          <DynamicActionButton
            text="Begin Your Liberation"
            onClick={onBeginLiberation}
            bgColor="#52277F"
            textColor="white"
            showArrow={true}
            fullWidth={false}
            className="rounded-xs! border-0! px-6! py-3! text-sm font-semibold tracking-normal normal-case shadow-none! sm:px-8! sm:py-3.5! sm:text-base"
          />

          {/* Star Doodle (star-icon) bottom-right of button */}
          <div className="absolute -right-12 -bottom-12 h-9 w-9 sm:-right-20 sm:-bottom-16 sm:h-13 sm:w-13 md:-right-28 md:-bottom-20 md:h-16 md:w-16">
            <Image src={starIcon} alt="Star" fill className="object-contain" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
