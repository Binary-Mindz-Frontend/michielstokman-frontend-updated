'use client';

import Image from 'next/image';
import reflectionBrush from '@/assets/profile/reflection-brush-bg.png';
import resonanceBrush from '@/assets/profile/resonence-brush-bg.png';

interface UserDashboardHeroProps {
  confessionsCount?: number;
  meditationsCount?: number;
}

export default function UserDashboardHero({
  confessionsCount = 7,
  meditationsCount = 8,
}: UserDashboardHeroProps) {
  return (
    <div className="relative mb-8 flex w-full flex-col items-center justify-center rounded-2xl bg-[#F7F3EC] px-4 py-8 shadow-sm sm:px-8 sm:py-12 md:py-16 lg:py-20">
      {/* Brushes Container - Rendered side-by-side on mobile and desktop */}
      <div className="flex w-full flex-row items-center justify-center gap-3 px-2 sm:gap-8 md:gap-14 lg:gap-20">
        {/* Left Brush - Confession */}
        <div className="relative flex min-h-[85px] w-1/2 max-w-[340px] items-center justify-center min-[380px]:min-h-[100px] sm:min-h-[125px] sm:max-w-[420px] md:min-h-[150px] lg:max-w-[480px]">
          <Image
            src={reflectionBrush}
            alt="Confession Brush Background"
            fill
            className="object-contain"
            priority
          />
          <div className="relative z-10 -mt-3 pb-0.5 text-center text-white sm:mt-0">
            <p className="font-playpen text-2xl font-bold min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {confessionsCount ?? 7}
            </p>
            <p className="font-playpen mt-0.5 text-[9px] font-semibold tracking-wider uppercase min-[380px]:text-[11px] sm:mt-1 sm:text-xs md:text-sm lg:text-base">
              CONFESSION
            </p>
          </div>
        </div>

        {/* Right Brush - Meditation */}
        <div className="relative flex min-h-[85px] w-1/2 max-w-[340px] items-center justify-center min-[380px]:min-h-[100px] sm:min-h-[125px] sm:max-w-[420px] md:min-h-[150px] lg:max-w-[480px]">
          <Image
            src={resonanceBrush}
            alt="Meditation Brush Background"
            fill
            className="object-contain"
            priority
          />
          <div className="relative z-10 -mt-3 pb-0.5 text-center text-white sm:mt-0">
            <p className="font-playpen text-2xl font-bold min-[380px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {meditationsCount ?? 8}
            </p>
            <p className="font-playpen mt-0.5 text-[9px] font-semibold tracking-wider uppercase min-[380px]:text-[11px] sm:mt-1 sm:text-xs md:text-sm lg:text-base">
              MEDITATION
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
