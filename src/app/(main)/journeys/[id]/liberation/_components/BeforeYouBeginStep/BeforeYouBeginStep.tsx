/* eslint-disable no-unused-vars */

'use client';

import beforeYourBeginImg from '@/assets/liberations/liberation-steps/before-your-begin.png';
import greenHeartIcon from '@/assets/shared/green-pink-icon.png';
import starIcon from '@/assets/shared/star-icon.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export interface BeforeYouBeginStepProps {
  preparations: Array<{ id: string; label: string }>;
  checkedPreps: string[];
  togglePrep: (id: string) => void;
  reminders: Array<{ id: string; label: string; time: string }>;
  selectedReminder: string;
  setSelectedReminder: (id: string) => void;
  calendarAdded: boolean;
  handleAddToCalendar: () => void;
  handleStartDay: () => void;
  allPrepsChecked: boolean;
  isEnrolling: boolean;
  onBack: () => void;
}

export default function BeforeYouBeginStep({
  preparations = [],
  checkedPreps = [],
  togglePrep,
  reminders = [],
  selectedReminder,
  setSelectedReminder,
  calendarAdded,
  handleAddToCalendar,
  handleStartDay,
  allPrepsChecked,
  isEnrolling,
  onBack,
}: BeforeYouBeginStepProps) {
  return (
    <motion.section
      key="before-begin"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F2] px-4 py-8 md:px-8 md:py-12"
    >
      {/* Top-Left Back Button using dedicated DynamicBackButton */}
      <div className="absolute top-4 left-4 z-20 sm:top-6 sm:left-8 md:top-8 md:left-10">
        <DynamicBackButton
          text="Back"
          onClick={onBack}
          bgColor="#52277F"
          textColor="white"
          className="rounded-xs! border-0! shadow-none!"
        />
      </div>

      {/* Centered Main Layout Stack */}
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-2xl flex-col items-center justify-center pt-10 pb-12">
        {/* ── TOP SECTION: Torn Paper Card ("Before You Begin" Checklist) ── */}
        <div className="relative mx-auto flex min-h-90 w-[92%] max-w-140 flex-col items-center justify-center p-8 text-center sm:min-h-100 sm:w-[96%] sm:p-14 md:w-full">
          {/* Torn Paper Background Image */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={beforeYourBeginImg}
              alt="Paper background"
              fill
              className="object-fill drop-shadow-sm"
              priority
            />
          </div>

          {/* Green Heart Doodle Top-Right of Card */}
          <div className="absolute top-20 right-4 z-20 h-8 w-8 sm:top-24 sm:right-10 sm:h-11 sm:w-11">
            <Image src={greenHeartIcon} alt="Green Heart" fill className="object-contain" />
          </div>

          {/* Card Content Layer */}
          <div className="relative z-10 flex w-full max-w-95 flex-col items-center">
            <h1 className="font-edo mb-1 text-2xl font-bold text-[#52277F] sm:text-3xl">
              Before You Begin
            </h1>
            <p className="font-playpen mb-6 text-xs text-[#344054] sm:text-sm">
              Set yourself up for 7 days of gentle liberation.
            </p>

            {/* Preparation Checklist */}
            <div className="w-full space-y-3.5">
              {preparations.map((prep) => {
                const isChecked = checkedPreps.includes(prep.id);
                return (
                  <button
                    key={prep.id}
                    type="button"
                    onClick={() => togglePrep(prep.id)}
                    className="flex w-full cursor-pointer items-center justify-start gap-3.5 text-left transition-all duration-200 hover:opacity-90"
                  >
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                        isChecked
                          ? 'border-[#52277F] bg-[#52277F] text-white'
                          : 'border-[#52277F] bg-transparent',
                      )}
                    >
                      {isChecked && <div className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                    <span className="font-playpen text-sm font-semibold text-[#2E1065] sm:text-base">
                      {prep.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: Daily Reminders, Calendar & Start Day Button ── */}
        <div className="relative mt-8 flex w-[92%] max-w-95 flex-col items-center text-center sm:w-full">
          {/* Green Heart Doodle to the Left of Bottom Title */}
          <div className="absolute -top-2 -left-2 z-20 h-7 w-7 sm:-top-2 sm:-left-12 sm:h-9 sm:w-9">
            <Image src={greenHeartIcon} alt="Green Heart" fill className="object-contain" />
          </div>

          {/* Pink Star Doodle to the Right of Reminders Area */}
          <div className="absolute top-24 -right-2 z-20 h-9 w-9 sm:top-28 sm:-right-16 sm:h-12 sm:w-12">
            <Image src={starIcon} alt="Pink Star" fill className="object-contain" />
          </div>

          {/* Section Title */}
          <h2 className="font-edo mb-4 text-xl font-bold text-[#F5B83D] sm:text-2xl">
            Before You Begin
          </h2>

          {/* Reminder Options */}
          <div className="mb-6 w-full space-y-3">
            {reminders.map((reminder) => {
              const isSelected = selectedReminder === reminder.id;
              return (
                <button
                  key={reminder.id}
                  type="button"
                  onClick={() => setSelectedReminder(reminder.id)}
                  className="flex w-full cursor-pointer items-center justify-start gap-3.5 text-left transition-all duration-200 hover:opacity-90"
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                      isSelected
                        ? 'border-[#F5B83D] bg-[#F5B83D]'
                        : 'border-[#F5B83D] bg-transparent',
                    )}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span className="font-playpen text-sm font-semibold text-[#2E1065] sm:text-base">
                    {reminder.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Add To Calendar Button */}
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="font-playpen mb-3.5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xs border-2 border-[#FDE68A] bg-[#FEFCE8]/80 px-6 py-3 text-sm font-semibold text-[#F5B83D] transition-all hover:bg-[#FEFCE8]"
          >
            <span>{calendarAdded ? '✓ Added To Calendar' : 'Add To Calender'}</span>
            <span className="text-base leading-none">➔</span>
          </button>

          {/* Start Day 1 Button */}
          <div className="w-full">
            <DynamicActionButton
              text={
                isEnrolling
                  ? 'Starting...'
                  : allPrepsChecked
                    ? 'Start Day1'
                    : `Check ${preparations.length - checkedPreps.length} item${
                        preparations.length - checkedPreps.length === 1 ? '' : 's'
                      } above`
              }
              onClick={handleStartDay}
              bgColor="#52277F"
              textColor="white"
              showArrow={allPrepsChecked}
              fullWidth={true}
              className="rounded-xs! border-0! py-3.5! text-sm font-semibold tracking-normal normal-case shadow-none! sm:text-base"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
