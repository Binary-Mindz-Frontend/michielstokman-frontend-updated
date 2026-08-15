/* eslint-disable no-unused-vars */

'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export interface ExerciseStepProps {
  exerciseType?: string;
  imageUrl?: string;
  title?: string;
  greeting?: string;
  whatToDo?: string;
  whyThis?: string;
  duration?: string;
  secondsElapsed?: number;
  timerRunning?: boolean;
  setTimerRunning?: (running: boolean | ((prev: boolean) => boolean)) => void;
  formatTime?: (secs: number) => string;
  onNextExercise: () => void;
  onBack: () => void;
}

export default function ExerciseStep({
  exerciseType = 'Morning Exercise',
  imageUrl,
  title = 'Welcome The Light',
  greeting = `"Hey Friend, Let's Do Something Simple That Lets Your Body Sing Again."`,
  whatToDo = 'Find The Nearest Source Of Light — A Window, The Sky, Even A Lamp. Look Up Toward It. Take 3 Slow Breaths. Then Gently Turn Your Head Left… Center.. Right. Drop Your Shoulders. Reach Your Arms Up For A 10-Second Gratitude Stretch.\n\n1. Look Up Toward The Nearest Light Source\n2. Take 3 Slow, Deep Breaths — Thank The New Day\n3. Gentle Neck Turns: Slowly Left, Center, Right\n4. Drop Your Shoulders And Release Tension\n5. Arms Up For A 10-Second Gratitude Stretch',
  whyThis = "Light Is The Oldest Signal To Your Body That A New Day Has Begun. This Simple Act Resets Your Nervous System And Tells Your Cells: We're Alive.",
  duration = '2 Min',
  secondsElapsed = 0,
  timerRunning = false,
  setTimerRunning,
  formatTime,
  onNextExercise,
  onBack,
}: ExerciseStepProps) {
  // Torn paper / deckle edge polygon clip path for hero photo
  const tornPaperClipPath =
    'polygon(0% 2%, 2% 0%, 5% 2%, 8% 0%, 12% 2%, 15% 0%, 18% 1%, 22% 0%, 26% 2%, 30% 0%, 34% 1%, 38% 0%, 42% 2%, 46% 0%, 50% 1%, 54% 0%, 58% 2%, 62% 0%, 66% 1%, 70% 0%, 74% 2%, 78% 0%, 82% 1%, 86% 0%, 90% 2%, 94% 0%, 98% 1%, 100% 3%, 99% 7%, 100% 12%, 98% 16%, 100% 20%, 98% 25%, 100% 30%, 99% 35%, 100% 40%, 98% 45%, 100% 50%, 99% 55%, 100% 60%, 98% 65%, 100% 70%, 99% 75%, 100% 80%, 98% 85%, 100% 90%, 99% 95%, 97% 100%, 93% 98%, 89% 100%, 85% 98%, 81% 100%, 77% 99%, 73% 100%, 69% 98%, 65% 100%, 61% 99%, 57% 100%, 53% 98%, 49% 100%, 45% 98%, 41% 100%, 37% 99%, 33% 100%, 29% 98%, 25% 100%, 21% 99%, 17% 100%, 13% 98%, 9% 100%, 5% 98%, 1% 100%, 0% 97%, 1% 92%, 0% 87%, 2% 82%, 0% 77%, 1% 72%, 0% 67%, 2% 62%, 0% 57%, 1% 52%, 0% 47%, 2% 42%, 0% 37%, 1% 32%, 0% 27%, 2% 22%, 0% 17%, 1% 12%, 0% 7%)';

  return (
    <motion.section
      key="exercise"
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

        {/* Center: 2-Line Step Progress Indicator */}
        <div className="flex w-full max-w-35 items-center gap-2 pl-16 sm:max-w-md sm:gap-3 sm:pl-0">
          {/* Line 1: Active Step (Solid Purple) */}
          <div className="h-1.5 flex-1 rounded-full bg-[#52277F]" />
          {/* Line 2: Active Step 2 (Solid Purple) */}
          <div className="h-1.5 flex-1 rounded-full bg-[#52277F]" />
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="mx-auto w-full max-w-3xl pb-12">
        {/* Exercise Type Subtitle Label */}
        <p className="font-playpen mt-8 mb-6 text-left text-base font-semibold text-[#4A229D] not-italic sm:mt-10 sm:text-lg md:mt-12 md:text-xl">
          {exerciseType}
        </p>

        {/* ── Hero Image with Torn Paper / Deckle Edge Frame ── */}
        <div className="relative mb-12 w-full">
          {/* Torn Paper Outer Shadow Wrapper */}
          <div
            className="relative h-64 w-full overflow-hidden bg-[#D4C3A3] shadow-md sm:h-80 md:h-96 lg:h-105"
            style={{ clipPath: tornPaperClipPath }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title || 'Exercise illustration'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                unoptimized
              />
            ) : (
              /* Default fallback photo matching window morning sunlight aesthetic */
              <div className="relative flex h-full w-full items-center justify-center bg-[#E5D5C0]">
                <Image
                  src="/og-image.jpg"
                  alt={title || 'Exercise illustration'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Exercise Title ── */}
        {title && (
          <h2 className="font-playpen mb-4 text-left text-xl font-semibold text-black not-italic sm:text-2xl">
            {title}
          </h2>
        )}

        {/* ── Quote Box (Input Field Style) ── */}
        {greeting && (
          <div className="mb-8 w-full border border-[#B39B7F] bg-transparent px-4 py-3 text-left sm:px-5 sm:py-4">
            <p className="font-playpen text-sm font-normal text-[#7042D0] not-italic sm:text-base">
              {greeting}
            </p>
          </div>
        )}

        {/* ── WHAT TO DO Section ── */}
        {whatToDo && (
          <div className="mb-6 text-left">
            <h3 className="font-playpen mb-3 text-left text-xl font-semibold text-black not-italic sm:text-2xl">
              WHAT TO DO
            </h3>
            <div className="font-playpen text-xs leading-relaxed font-normal text-[#344054] not-italic sm:text-sm">
              <div
                className="space-y-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: whatToDo }}
              />
            </div>
          </div>
        )}

        {/* ── WHY THIS EXERCISE Section ── */}
        {whyThis && (
          <div className="mb-10 text-left">
            <h3 className="font-playpen mb-3 text-left text-xl font-semibold text-black not-italic sm:text-2xl">
              WHY THIS EXERCISE
            </h3>
            <div className="font-playpen text-xs leading-relaxed font-normal text-[#344054] not-italic sm:text-sm">
              <div className="space-y-3" dangerouslySetInnerHTML={{ __html: whyThis }} />
            </div>
          </div>
        )}

        {/* ── Bottom Section: Duration, Timer Button & CTA Button ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-playpen text-xs font-semibold text-[#667085] sm:text-sm">
              {duration}
            </span>

            {/* Timer Toggle Button */}
            {setTimerRunning && (
              <button
                type="button"
                onClick={() => setTimerRunning((prev) => !prev)}
                className="font-playpen rounded-xs border border-[#D8B4FE] bg-transparent px-3 py-1.5 text-xs font-semibold tracking-wider text-[#7042D0] uppercase transition-all hover:bg-[#F3E8FF]/60"
              >
                {timerRunning && formatTime ? formatTime(secondsElapsed) : 'START TIMER'}
              </button>
            )}
          </div>

          {/* Primary CTA Button */}
          <DynamicActionButton
            text="Done — Next Exercise"
            onClick={onNextExercise}
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
