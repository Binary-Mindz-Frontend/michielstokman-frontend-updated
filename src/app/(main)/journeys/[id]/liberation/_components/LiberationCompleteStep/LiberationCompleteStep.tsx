'use client';

import awakingRightIcon from '@/assets/shared/awaking-right-icon.png';
import greenHeartIcon from '@/assets/shared/green-pink-icon.png';
import lovePinkIcon from '@/assets/shared/love-pink-icon.png';
import starIcon from '@/assets/shared/star-icon.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export interface LiberationCompleteStepProps {
  onExploreMore: () => void;
  onRepeatLiberation: () => void;
  isRepeating?: boolean;
  onBack: () => void;
}

export default function LiberationCompleteStep({
  onExploreMore,
  onRepeatLiberation,
  isRepeating = false,
  onBack,
}: LiberationCompleteStepProps) {
  return (
    <motion.section
      key="liberation-complete"
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

      {/* ── Floating Doodle Background Assets ── */}
      {/* 1. Top-Right Purple Bird Doodle */}
      <div className="pointer-events-none absolute top-[22%] right-[12%] z-10 h-16 w-16 opacity-90 sm:right-[18%] sm:h-20 sm:w-20 lg:right-[24%] lg:h-24 lg:w-24">
        <Image src={awakingRightIcon} alt="Bird Doodle" fill className="object-contain" />
      </div>

      {/* 2. Middle-Left Pink Outline Heart Doodle */}
      <div className="pointer-events-none absolute top-[40%] left-[10%] z-10 h-12 w-12 opacity-80 sm:left-[15%] sm:h-16 sm:w-16 lg:left-[22%] lg:h-20 lg:w-20">
        <Image src={lovePinkIcon} alt="Pink Heart Doodle" fill className="object-contain" />
      </div>

      {/* 3. Middle-Right Green Outline Heart Doodle */}
      <div className="pointer-events-none absolute top-[52%] right-[10%] z-10 h-10 w-10 opacity-80 sm:right-[15%] sm:h-14 sm:w-14 lg:right-[22%] lg:h-16 lg:w-16">
        <Image src={greenHeartIcon} alt="Green Heart Doodle" fill className="object-contain" />
      </div>

      {/* 4. Bottom-Left Pink Star Doodle */}
      <div className="pointer-events-none absolute top-[72%] left-[12%] z-10 h-12 w-12 opacity-80 sm:left-[18%] sm:h-16 sm:w-16 lg:left-[25%] lg:h-20 lg:w-20">
        <Image src={starIcon} alt="Pink Star Doodle" fill className="object-contain" />
      </div>

      {/* ── Centered Content Stack ── */}
      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col items-center justify-center pt-2 pb-12 text-center">
        {/* Main Title Section */}
        <div className="mb-4 text-center">
          <h1 className="font-edo text-3xl leading-tight font-bold tracking-wider text-[#52277F] uppercase sm:text-4xl md:text-5xl lg:text-6xl">
            YOUR LIBERATION <br /> IS COMPLETE
          </h1>
        </div>

        {/* Subtext Paragraphs */}
        <div className="font-playpen mb-8 max-w-md text-xs leading-relaxed font-normal text-[#344054] sm:text-sm md:text-base">
          <p>Seven days of showing up for yourself. Seven petals bloomed.</p>
          <p>This energy is yours to keep.</p>
        </div>

        {/* CTA Buttons Block */}
        <div className="w-full max-w-[320px] space-y-3.5 sm:max-w-[380px]">
          {/* Explore More Liberations */}
          <DynamicActionButton
            text="Explore More Liberations"
            onClick={onExploreMore}
            bgColor="#52277F"
            textColor="white"
            showArrow={false}
            fullWidth={true}
            className="rounded-xs! border-0! py-3.5! text-sm font-semibold tracking-normal normal-case shadow-none! sm:text-base"
          />

          {/* Repeat This Liberation Button */}
          <button
            type="button"
            onClick={onRepeatLiberation}
            disabled={isRepeating}
            className="font-playpen flex w-full cursor-pointer items-center justify-center gap-2 rounded-xs border-2 border-[#52277F] bg-white/80 px-6 py-3 text-sm font-semibold text-[#52277F] transition-all hover:bg-white sm:text-base"
          >
            <span>{isRepeating ? 'Resetting...' : 'Repeat This Liberation'}</span>
            <span className="text-base leading-none">➔</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
