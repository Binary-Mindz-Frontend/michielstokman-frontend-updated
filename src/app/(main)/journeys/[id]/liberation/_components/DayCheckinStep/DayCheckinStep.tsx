/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client';

import awakingLeftIcon from '@/assets/liberations/liberation-steps/awaking-left-icon.png';
import awakingRightIcon from '@/assets/liberations/liberation-steps/awaking-right-icon.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

export interface DayCheckinStepProps {
  dayNumber?: number;
  dayTitle?: string;
  checkinPrompt?: string;
  register: UseFormRegister<any>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isGenerating?: boolean;
  onBack: () => void;
}

export default function DayCheckinStep({
  dayNumber = 1,
  dayTitle = 'AWAKENING',
  checkinPrompt = 'How Are You Feeling This Morning?',
  register,
  onSubmit,
  isGenerating = false,
  onBack,
}: DayCheckinStepProps) {
  return (
    <motion.section
      key="day-checkin"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] px-4 py-6 md:px-8 md:py-10"
    >
      {/* ── Top Navigation Row: Back Button Left, 2-Line Progress Bar Centered ── */}
      <div className="relative mx-auto mb-6 flex max-w-4xl items-center justify-center pt-2 sm:mb-8">
        {/* Left: DynamicBackButton */}
        <div className="absolute top-1/2 left-0 z-20 -translate-y-1/2">
          <DynamicBackButton
            text="Back"
            onClick={onBack}
            bgColor="#52277F"
            textColor="white"
            className="rounded-xs! border-0! px-3! py-2! text-xs shadow-none! sm:px-4! sm:py-2.5! sm:text-sm"
          />
        </div>

        {/* Center: 2-Line Step Progress Indicator with Safe Mobile Clearance */}
        <div className="flex w-full max-w-35 items-center gap-2 pl-16 sm:max-w-md sm:gap-3 sm:pl-0">
          {/* Line 1: Active Step (Solid Purple) */}
          <div className="h-1.5 flex-1 rounded-full bg-[#52277F]" />
          {/* Line 2: Remaining Step (Light Purple) */}
          <div className="h-1.5 flex-1 rounded-full bg-[#52277F]/30" />
        </div>
      </div>

      {/* ── Left Awaking Bird Doodle Icon ── */}
      <div className="pointer-events-none absolute top-20 left-1 z-10 h-24 w-24 opacity-60 sm:top-24 sm:left-4 sm:h-44 sm:w-44 sm:opacity-80 md:left-8 md:h-56 md:w-56 md:opacity-100 lg:left-16 lg:h-64 lg:w-64">
        <Image src={awakingLeftIcon} alt="Awakening Left Bird" fill className="object-contain" />
      </div>

      {/* ── Right Awaking Bird Doodle Icon ── */}
      <div className="pointer-events-none absolute top-52 right-1 z-10 h-14 w-14 opacity-70 sm:top-64 sm:right-4 sm:h-20 sm:w-20 sm:opacity-100 md:right-8 md:h-24 md:w-24 lg:right-16 lg:h-28 lg:w-28">
        <Image src={awakingRightIcon} alt="Awakening Right Bird" fill className="object-contain" />
      </div>

      {/* ── Centered Content Stack ── */}
      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col items-center justify-center pt-2 pb-10 text-center">
        {/* Header Title Section */}
        <div className="mb-5 sm:mb-6">
          <p className="font-playpen mb-1 text-[11px] font-semibold tracking-widest text-[#667085] uppercase sm:text-sm">
            DAY {dayNumber}
          </p>
          <h1 className="font-edo text-2xl font-bold tracking-wider text-[#52277F] uppercase sm:text-4xl md:text-5xl lg:text-6xl">
            {dayTitle}
          </h1>
        </div>

        {/* Check-in Form Card */}
        <div className="w-full max-w-130 rounded-lg border border-[#EFE9DE] bg-[#FDFBF7] p-5 shadow-xs sm:p-8">
          <p className="font-playpen mb-3 text-left text-xs font-semibold text-[#344054] sm:mb-4 sm:text-base">
            {checkinPrompt}
          </p>

          <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
            {/* Lined Notebook Style Textarea Container */}
            <div className="relative min-h-30 w-full rounded-md border border-[#E5E0D8] bg-[#FEFCE8]/40 p-3 text-left sm:min-h-35 sm:p-4">
              <textarea
                {...register('feeling')}
                placeholder="Message......"
                rows={5}
                className="font-playpen min-h-25 w-full resize-none bg-transparent text-xs leading-relaxed text-[#2E1065] placeholder-[#A39E93] focus:outline-none sm:min-h-30 sm:text-sm"
              />
              {/* Decorative Notebook Lines */}
              <div className="pointer-events-none absolute inset-x-3 top-10 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
              <div className="pointer-events-none absolute inset-x-3 top-17 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
              <div className="pointer-events-none absolute inset-x-3 top-24 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
              <div className="pointer-events-none absolute inset-x-3 top-31 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
            </div>

            {/* Begin Exercises Button */}
            <div>
              <button type="submit" disabled={isGenerating} className="w-full cursor-pointer">
                <DynamicActionButton
                  text={isGenerating ? 'Generating...' : 'Begin Exercises'}
                  bgColor="#52277F"
                  textColor="white"
                  showArrow={true}
                  fullWidth={true}
                  className="rounded-xs! border-0! py-3! text-xs font-semibold tracking-normal normal-case shadow-none! sm:py-3.5! sm:text-base"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
}
