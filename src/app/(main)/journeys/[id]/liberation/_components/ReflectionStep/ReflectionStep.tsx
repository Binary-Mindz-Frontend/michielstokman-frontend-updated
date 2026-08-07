/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client';

import awakingLeftIcon from '@/assets/shared/awaking-left-icon.png';
import awakingRightIcon from '@/assets/shared/awaking-right-icon.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

export interface ReflectionStepProps {
  dayNumber?: number;
  energyLevel?: number;
  setEnergyLevel?: (val: number) => void;
  register: UseFormRegister<any>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isCompleting?: boolean;
  onBack: () => void;
}

export default function ReflectionStep({
  dayNumber = 1,
  energyLevel = 5,
  setEnergyLevel,
  register,
  onSubmit,
  isCompleting = false,
  onBack,
}: ReflectionStepProps) {
  return (
    <motion.section
      key="reflection"
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

      {/* ── Left Awaking Bird Doodle Icon ── */}
      <div className="pointer-events-none absolute top-[28%] -left-4 z-10 h-32 w-32 opacity-60 sm:left-0 sm:h-48 sm:w-48 sm:opacity-80 md:left-4 md:h-64 md:w-64 md:opacity-100 lg:left-[8%] lg:h-80 lg:w-[320px]">
        <Image src={awakingLeftIcon} alt="Awakening Left Bird" fill className="object-contain" />
      </div>

      {/* ── Right Awaking Bird Doodle Icon ── */}
      <div className="pointer-events-none absolute top-[55%] right-2 z-10 h-16 w-16 opacity-70 sm:right-4 sm:h-20 sm:w-20 sm:opacity-100 md:right-8 md:h-24 md:w-24 lg:right-[12%] lg:h-32 lg:w-32">
        <Image src={awakingRightIcon} alt="Awakening Right Bird" fill className="object-contain" />
      </div>

      {/* ── Centered Content Stack ── */}
      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col items-center justify-center pt-2 pb-10 text-center">
        {/* Header Title Section */}
        <div className="mb-6">
          <p className="font-playpen mb-1 text-[11px] font-semibold tracking-widest text-[#667085] uppercase sm:text-sm">
            DAY {dayNumber} COMPLETE
          </p>
          <h1 className="font-edo text-2xl font-bold tracking-wider whitespace-nowrap text-[#52277F] uppercase sm:text-4xl md:text-5xl lg:text-6xl">
            HOW DID TODAY LAND?
          </h1>
        </div>

        {/* Energy Level Slider Container */}
        <div className="mb-8 w-full max-w-130 px-2 text-left">
          {setEnergyLevel ? (
            <div className="w-full">
              <div className="font-playpen mb-2 flex items-center justify-between text-base font-bold text-[#52277F]">
                <span>Energy Level</span>
                <span>{Math.round(energyLevel)}</span>
              </div>
              <div className="relative flex h-4 w-full items-center">
                {/* Custom Track Background */}
                <div className="absolute h-2 w-full rounded-full bg-[#EADDFF]/50" />
                {/* Active Purple Track Fill */}
                <div
                  className="absolute h-2 rounded-full bg-[#B69DF8] transition-[width] duration-75 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, ((energyLevel - 1) / 9) * 100))}%` }}
                />
                {/* Actual Range Input */}
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.1}
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="relative z-10 h-2 w-full cursor-pointer appearance-none bg-transparent accent-[#52277F] focus:outline-none [&::-moz-range-thumb]:h-4.5 [&::-moz-range-thumb]:w-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#52277F] [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:w-4.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#52277F] [&::-webkit-slider-thumb]:shadow-xs"
                />
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="font-playpen mb-2 flex items-center justify-between text-base font-bold text-[#52277F]">
                <span>Energy Level</span>
                <span>{Math.round(energyLevel)}</span>
              </div>
              <div className="relative flex h-4 w-full items-center">
                {/* Custom Track Background */}
                <div className="absolute h-2 w-full rounded-full bg-[#EADDFF]/50" />
                {/* Active Purple Track Fill */}
                <div
                  className="absolute h-2 rounded-full bg-[#B69DF8] transition-[width] duration-75 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, ((energyLevel - 1) / 9) * 100))}%` }}
                />
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.1}
                  value={energyLevel}
                  readOnly
                  className="relative z-10 h-2 w-full appearance-none bg-transparent accent-[#52277F] focus:outline-none [&::-moz-range-thumb]:h-4.5 [&::-moz-range-thumb]:w-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#52277F] [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:w-4.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#52277F]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Reflection Form Card */}
        <div className="w-full max-w-130 rounded-lg border border-[#EFE9DE] bg-[#FDFBF7] p-5 shadow-xs sm:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Question 1: What Opened Today? */}
            <div className="text-left">
              <label className="font-playpen mb-3 block text-xs font-semibold text-[#344054] sm:text-base">
                What Opened Today?
              </label>
              <div className="relative min-h-30 w-full rounded-md border border-[#E5E0D8] bg-[#FEFCE8]/40 p-3 text-left sm:min-h-35 sm:p-4">
                <textarea
                  {...register('whatOpened')}
                  placeholder="A Feeling, A Realization, A Release"
                  rows={4}
                  className="font-playpen min-h-25 w-full resize-none bg-transparent text-xs leading-relaxed text-[#2E1065] placeholder-[#A39E93] focus:outline-none sm:min-h-30 sm:text-sm"
                />
                {/* Decorative Notebook Lines */}
                <div className="pointer-events-none absolute inset-x-3 top-10 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
                <div className="pointer-events-none absolute inset-x-3 top-17 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
                <div className="pointer-events-none absolute inset-x-3 top-24 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
                <div className="pointer-events-none absolute inset-x-3 top-31 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
              </div>
            </div>

            {/* Question 2: One Key Takeaway */}
            <div className="text-left">
              <label className="font-playpen mb-3 block text-xs font-semibold text-[#344054] sm:text-base">
                One Key Takeaway
              </label>
              <div className="relative min-h-30 w-full rounded-md border border-[#E5E0D8] bg-[#FEFCE8]/40 p-3 text-left sm:min-h-35 sm:p-4">
                <textarea
                  {...register('keyTakeaway')}
                  placeholder="What Will You Carry Forward"
                  rows={4}
                  className="font-playpen min-h-25 w-full resize-none bg-transparent text-xs leading-relaxed text-[#2E1065] placeholder-[#A39E93] focus:outline-none sm:min-h-30 sm:text-sm"
                />
                {/* Decorative Notebook Lines */}
                <div className="pointer-events-none absolute inset-x-3 top-10 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
                <div className="pointer-events-none absolute inset-x-3 top-17 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
                <div className="pointer-events-none absolute inset-x-3 top-24 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
                <div className="pointer-events-none absolute inset-x-3 top-31 border-b border-dashed border-[#E5E0D8] sm:inset-x-4" />
              </div>
            </div>

            {/* Complete Day Button */}
            <div>
              <button type="submit" disabled={isCompleting} className="w-full cursor-pointer">
                <DynamicActionButton
                  text={isCompleting ? 'Completing...' : `Complete Day ${dayNumber}`}
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
