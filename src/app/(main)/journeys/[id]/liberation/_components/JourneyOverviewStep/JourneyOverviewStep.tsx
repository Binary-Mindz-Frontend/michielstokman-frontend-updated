/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client';

import completeIcon from '@/assets/liberations/liberation-steps/complete-icon.png';
import greenHeartIcon from '@/assets/shared/green-pink-icon.png';
import lovePinkIcon from '@/assets/shared/love-pink-icon.png';
import starIcon from '@/assets/shared/star-icon.png';
import unlockIcon from '@/assets/liberations/liberation-steps/unlock-icon.png';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Image from 'next/image';

export interface JourneyOverviewStepProps {
  journeyDays?: Array<{ day: number; title: string }>;
  journeyStatus?: any;
  completedDays?: number[];
  handleStartNextDay: (dayIndex: number) => void;
  onBack: () => void;
}

export default function JourneyOverviewStep({
  journeyDays = [],
  journeyStatus,
  completedDays = [],
  handleStartNextDay,
  onBack,
}: JourneyOverviewStepProps) {
  return (
    <motion.section
      key="overview"
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

      {/* ── Floating Doodle Icons Background ── */}
      {/* 1. Top-Left Green Heart Doodle */}
      <div className="pointer-events-none absolute top-[22%] left-[10%] z-10 h-10 w-10 opacity-70 sm:left-[15%] sm:h-14 sm:w-14 lg:left-[22%] lg:h-16 lg:w-16">
        <Image src={greenHeartIcon} alt="Green Heart Doodle" fill className="object-contain" />
      </div>

      {/* 2. Top-Right Pink Heart Doodle */}
      <div className="pointer-events-none absolute top-[18%] right-[10%] z-10 h-12 w-12 opacity-80 sm:right-[15%] sm:h-16 sm:w-16 lg:right-[20%] lg:h-20 lg:w-20">
        <Image src={lovePinkIcon} alt="Pink Heart Doodle" fill className="object-contain" />
      </div>

      {/* 3. Middle-Left Pink Heart Doodle */}
      <div className="pointer-events-none absolute top-[52%] left-[8%] z-10 h-12 w-12 opacity-80 sm:left-[12%] sm:h-16 sm:w-16 lg:left-[18%] lg:h-20 lg:w-20">
        <Image src={lovePinkIcon} alt="Pink Heart Doodle" fill className="object-contain" />
      </div>

      {/* 4. Middle-Right Pink Star Doodle */}
      <div className="pointer-events-none absolute top-[55%] right-[10%] z-10 h-10 w-10 opacity-80 sm:right-[14%] sm:h-14 sm:w-14 lg:right-[22%] lg:h-16 lg:w-16">
        <Image src={starIcon} alt="Pink Star Doodle" fill className="object-contain" />
      </div>

      {/* 5. Bottom-Right Green Heart Doodle */}
      <div className="pointer-events-none absolute top-[75%] right-[12%] z-10 h-10 w-10 opacity-70 sm:right-[16%] sm:h-14 sm:w-14 lg:right-[24%] lg:h-16 lg:w-16">
        <Image src={greenHeartIcon} alt="Green Heart Doodle" fill className="object-contain" />
      </div>

      {/* ── Centered Content Stack ── */}
      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl flex-col items-center justify-start pt-2 pb-12 text-center">
        {/* Main Title Section */}
        <div className="mb-8">
          <h1 className="font-edo mb-1 text-3xl font-medium tracking-wider whitespace-nowrap text-[#52277F] uppercase sm:text-4xl md:text-5xl lg:text-6xl">
            THE JOURNEY
          </h1>
          <p className="font-playpen text-xs font-semibold tracking-widest text-[#667085] uppercase sm:text-sm">
            7 DAYS OF INNER RELEASE
          </p>
        </div>

        {/* Days List Container */}
        <div className="w-full max-w-130 space-y-4">
          {journeyDays.map((dayItem, i) => {
            const stepFromApi = journeyStatus?.steps?.find(
              (s: any) => s.day_number === dayItem.day,
            );
            const apiStatus = stepFromApi?.status;

            const isCompleted = apiStatus ? apiStatus === 'completed' : completedDays.includes(i);
            const isReadyToStart = apiStatus
              ? apiStatus === 'available'
              : i === 0 || completedDays.includes(i - 1);
            const isLocked = apiStatus ? apiStatus === 'locked' : !isCompleted && !isReadyToStart;

            const dayNumberFormatted = String(dayItem.day).padStart(2, '0');

            return (
              <div
                key={dayItem.day || i}
                onClick={() => isReadyToStart && !isCompleted && handleStartNextDay(i)}
                style={
                  isCompleted
                    ? {
                        border: '1px solid rgba(22, 163, 74, 0.20)',
                        background: 'rgba(248, 244, 237, 0.60)',
                      }
                    : isReadyToStart
                      ? {
                          border: '1px solid rgba(74, 34, 157, 0.10)',
                          background: '#F8F4ED',
                        }
                      : {
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          background: 'rgba(255, 255, 255, 0.40)',
                        }
                }
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-5 py-4 text-left transition-all duration-200',
                  isReadyToStart && !isCompleted && 'cursor-pointer hover:shadow-xs',
                  isCompleted && 'cursor-default',
                  isLocked && 'cursor-default opacity-50',
                )}
              >
                {/* Left Side: Day Number Circle & Title Block */}
                <div className="flex items-center gap-4">
                  {/* Number Badge / Icon Circle */}
                  <div className="flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        'font-playpen mb-0.5 text-[11px] font-medium',
                        isCompleted && 'text-[#16A34A]',
                        isReadyToStart && !isCompleted && 'text-[#52277F]',
                        isLocked && 'text-[#A0AEC0]',
                      )}
                    >
                      {dayNumberFormatted}
                    </span>

                    {isCompleted ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16A34A]/10">
                        <Image src={completeIcon} alt="Completed" width={16} height={16} />
                      </div>
                    ) : isReadyToStart ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#52277F]">
                        <Image src={unlockIcon} alt="Unlocked" width={16} height={16} />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-transparent text-gray-400">
                        <Lock size={12} />
                      </div>
                    )}
                  </div>

                  {/* Title & Status */}
                  <div>
                    <h2
                      className={cn(
                        'font-edo text-base font-medium tracking-wider uppercase sm:text-lg',
                        isCompleted && 'text-[#16A34A]',
                        isReadyToStart && !isCompleted && 'text-[#52277F]',
                        isLocked && 'text-[#A0AEC0]',
                      )}
                    >
                      {dayItem.title}
                    </h2>
                    <p
                      className={cn(
                        'font-playpen text-xs font-normal',
                        isCompleted && 'text-[#16A34A]',
                        isReadyToStart && !isCompleted && 'font-semibold text-[#52277F]',
                        isLocked && 'text-[#A0AEC0]',
                      )}
                    >
                      {isCompleted ? 'Completed' : isReadyToStart ? '• READY TO START' : 'LOCKED'}
                    </p>
                  </div>
                </div>

                {/* Right Side: Icon / Action Button */}
                <div>
                  {isCompleted ? (
                    <div className="flex h-6 w-6 items-center justify-center">
                      <Image src={completeIcon} alt="Completed checkmark" width={18} height={18} />
                    </div>
                  ) : isReadyToStart ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartNextDay(i);
                      }}
                      className="font-playpen cursor-pointer rounded-xs bg-[#52277F] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Begin Now
                    </button>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center text-gray-300">
                      <Lock size={14} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
