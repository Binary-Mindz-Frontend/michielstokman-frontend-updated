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
    <div className="relative mb-8 flex w-full flex-col items-center justify-center rounded-2xl bg-[#F7F3EC] px-3 py-8 shadow-sm sm:px-6 sm:py-12 md:py-16">
      {/* Brushes Container - Rendered side-by-side on mobile and desktop */}
      <div className="flex w-full flex-row items-center justify-center gap-2 px-1 sm:gap-6 md:gap-12 lg:gap-16">
        {/* Left Brush - Confession */}
        <div className="relative flex min-h-[75px] w-1/2 max-w-[260px] items-center justify-center min-[380px]:min-h-[85px] sm:min-h-[100px] sm:max-w-[320px] md:min-h-[115px]">
          <Image
            src={reflectionBrush}
            alt="Confession Brush Background"
            fill
            className="object-contain"
            priority
          />
          <div className="relative z-10 -mt-3.5 pb-0.5 text-center text-white sm:mt-0">
            <p className="font-playpen text-xl font-bold min-[380px]:text-2xl sm:text-3xl md:text-4xl">
              {confessionsCount}
            </p>
            <p className="font-playpen mt-0 text-[8px] font-semibold tracking-wider uppercase min-[380px]:text-[10px] sm:mt-0.5 sm:text-xs md:text-[13px]">
              CONFESSION
            </p>
          </div>
        </div>

        {/* Right Brush - Meditation */}
        <div className="relative flex min-h-[75px] w-1/2 max-w-[260px] items-center justify-center min-[380px]:min-h-[85px] sm:min-h-[100px] sm:max-w-[320px] md:min-h-[115px]">
          <Image
            src={resonanceBrush}
            alt="Meditation Brush Background"
            fill
            className="object-contain"
            priority
          />
          <div className="relative z-10 -mt-3.5 pb-0.5 text-center text-white sm:mt-0">
            <p className="font-playpen text-xl font-bold min-[380px]:text-2xl sm:text-3xl md:text-4xl">
              {meditationsCount}
            </p>
            <p className="font-playpen mt-0 text-[8px] font-semibold tracking-wider uppercase min-[380px]:text-[10px] sm:mt-0.5 sm:text-xs md:text-[13px]">
              MEDITATION
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
