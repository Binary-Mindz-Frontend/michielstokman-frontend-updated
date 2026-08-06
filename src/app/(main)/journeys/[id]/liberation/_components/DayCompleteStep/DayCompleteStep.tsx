'use client';

import awakingRightIcon from '@/assets/liberations/liberation-steps/awaking-right-icon.png';
import greenHeartIcon from '@/assets/liberations/liberation-steps/green-pink-icon.png';
import lovePinkIcon from '@/assets/liberations/liberation-steps/love-pink-icon.png';
import starIcon from '@/assets/liberations/liberation-steps/star-icon.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export interface DayCompleteStepProps {
  dayNumber?: number;
  subtitle?: string;
  onContinue: () => void;
  onBack: () => void;
}

export default function DayCompleteStep({
  dayNumber = 1,
  subtitle = 'You let go of another layer today — beautiful.',
  onContinue,
  onBack,
}: DayCompleteStepProps) {
  return (
    <motion.section
      key="day-complete"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] px-4 py-6 md:px-8 md:py-10"
    >
      {/* ── Top Navigation Row: Back Button Left ── */}
      <div className="relative mx-auto mb-6 flex max-w-4xl items-center justify-start pt-2 sm:mb-8">
        <DynamicBackButton
          text="Back"
          onClick={onBack}
          bgColor="#52277F"
          textColor="white"
          className="rounded-xs! border-0! px-3! py-2! text-xs shadow-none! sm:px-4! sm:py-2.5! sm:text-sm"
        />
      </div>

      {/* ── Floating Doodle Icons ── */}

      {/* 1. Top Bird Doodle (flying top-left above title) */}
      <div className="pointer-events-none absolute top-[15%] left-[20%] z-10 h-16 w-16 opacity-90 sm:top-[18%] sm:left-[25%] md:top-[20%] md:left-[30%] md:h-24 md:w-24">
        <Image src={awakingRightIcon} alt="Bird Doodle" fill className="object-contain" />
      </div>

      {/* 2. Top-Right Pink Heart Doodle */}
      <div className="pointer-events-none absolute top-[25%] right-[15%] z-10 h-10 w-10 opacity-80 sm:top-[25%] sm:right-[20%] md:top-[28%] md:right-[26%] md:h-16 md:w-16">
        <Image src={lovePinkIcon} alt="Pink Heart Doodle" fill className="object-contain" />
      </div>

      {/* 3. Left Green Heart Doodle */}
      <div className="pointer-events-none absolute top-[48%] left-[15%] z-10 h-8 w-8 opacity-80 sm:top-[48%] sm:left-[18%] md:top-[50%] md:left-[22%] md:h-14 md:w-14">
        <Image src={greenHeartIcon} alt="Green Heart Doodle" fill className="object-contain" />
      </div>

      {/* 4. Bottom-Right Pink Star Doodle */}
      <div className="pointer-events-none absolute top-[62%] right-[15%] z-10 h-10 w-10 opacity-80 sm:top-[60%] sm:right-[20%] md:top-[60%] md:right-[26%] md:h-16 md:w-16">
        <Image src={starIcon} alt="Pink Star Doodle" fill className="object-contain" />
      </div>

      {/* ── Centered Content Stack ── */}
      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col items-center justify-center pt-2 pb-10 text-center">
        {/* Main Title Section */}
        <h1 className="font-edo mb-3 text-3xl font-bold tracking-wider whitespace-nowrap text-[#52277F] uppercase sm:text-4xl md:text-5xl lg:text-6xl">
          DAY {dayNumber} COMPLETE
        </h1>

        {/* Subtitle */}
        <p className="font-playpen mb-8 max-w-md text-xs font-normal text-[#344054] sm:text-sm md:text-base">
          {subtitle}
        </p>

        {/* Continue Button */}
        <div className="w-full max-w-[280px] sm:max-w-[320px]">
          <DynamicActionButton
            text="Continue"
            onClick={onContinue}
            bgColor="#52277F"
            textColor="white"
            showArrow={true}
            fullWidth={true}
            className="rounded-xs! border-0! py-3.5! text-sm font-semibold tracking-normal normal-case shadow-none! sm:text-base"
          />
        </div>
      </div>
    </motion.section>
  );
}
