'use client';

import Image from 'next/image';
import creditBg from '@/assets/profile/credit-bg.png';
import creditIcon from '@/assets/profile/credit-icon.png';
import reflectionBrush from '@/assets/profile/reflection-brush-bg.png';
import resonanceBrush from '@/assets/profile/resonence-brush-bg.png';
import usernameBrush from '@/assets/profile/username-brush-bg.png';

interface ProfileHeroProps {
  trueName?: string;
  lifePhase?: string;
  dailyCredits?: number;
  reflectionsCount?: number;
  avgResonance?: number;
}

export default function ProfileHero({
  trueName = 'Michiel Stockman',
  lifePhase = 'Discovering',
  dailyCredits = 3,
  reflectionsCount = 7,
  avgResonance = 8.3,
}: ProfileHeroProps) {
  return (
    <div className="relative mb-8 flex w-full flex-col items-center justify-center rounded-2xl bg-[#F7F3EC] px-3 py-8 shadow-sm sm:px-6 sm:py-12 md:py-16">
      {/* Top Username Brush Container */}
      <div className="relative flex min-h-[110px] w-full max-w-[550px] items-center justify-center text-center sm:min-h-[135px] md:min-h-[150px]">
        <Image
          src={usernameBrush}
          alt="Username Brush Background"
          fill
          className="object-contain"
          priority
        />

        {/* Credit Badge - Positioned on the top right edge of the purple brush */}
        <div className="absolute top-1 right-2 z-20 flex h-6 w-[60px] items-center justify-center min-[400px]:top-2 min-[400px]:right-4 sm:top-4 sm:right-10 sm:h-7 sm:w-[72px] md:top-5 md:right-14">
          <Image src={creditBg} alt="Credit Badge BG" fill className="object-contain" />
          <div className="relative z-10 flex items-center gap-1 pl-1 text-[10px] font-bold text-white sm:text-[11px]">
            <Image
              src={creditIcon}
              alt="Coin Icon"
              width={14}
              height={14}
              className="h-3 w-3 object-contain sm:h-3.5 sm:w-3.5"
            />
            <span>{dailyCredits}/3</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center pb-2 text-white">
          <h2 className="font-playpen text-xl font-bold text-white min-[380px]:text-2xl sm:text-3xl md:text-4xl">
            {trueName}
          </h2>
          <p className="font-playpen mt-0.5 text-xs font-medium tracking-wide text-white/90 sm:mt-1 sm:text-[13px]">
            {lifePhase}
          </p>
        </div>
      </div>

      {/* Bottom Brushes Container - Rendered side-by-side on mobile and desktop */}
      <div className="mt-6 flex w-full flex-row items-center justify-center gap-2 px-1 sm:mt-10 sm:gap-6 md:gap-12 lg:gap-16">
        {/* Left Brush - Reflections */}
        <div className="relative flex min-h-[75px] w-1/2 max-w-[260px] items-center justify-center min-[380px]:min-h-[85px] sm:min-h-[100px] sm:max-w-[320px] md:min-h-[115px]">
          <Image src={reflectionBrush} alt="Reflection Brush" fill className="object-contain" />
          <div className="relative z-10 -mt-3.5 pb-0.5 text-center text-white sm:mt-0">
            <p className="font-playpen text-xl font-bold min-[380px]:text-2xl sm:text-3xl md:text-4xl">
              {reflectionsCount}
            </p>
            <p className="font-playpen mt-0 text-[8px] font-semibold tracking-wider uppercase min-[380px]:text-[10px] sm:mt-0.5 sm:text-xs md:text-[13px]">
              REFLECTIONS
            </p>
          </div>
        </div>

        {/* Right Brush - Resonance */}
        <div className="relative flex min-h-[75px] w-1/2 max-w-[260px] items-center justify-center min-[380px]:min-h-[85px] sm:min-h-[100px] sm:max-w-[320px] md:min-h-[115px]">
          <Image src={resonanceBrush} alt="Resonance Brush" fill className="object-contain" />
          <div className="relative z-10 -mt-3.5 pb-0.5 text-center text-white sm:mt-0">
            <p className="font-playpen text-xl font-bold min-[380px]:text-2xl sm:text-3xl md:text-4xl">
              {avgResonance}
            </p>
            <p className="font-playpen mt-0 text-[8px] font-semibold tracking-wider uppercase min-[380px]:text-[10px] sm:mt-0.5 sm:text-xs md:text-[13px]">
              AVG. RESONANCE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
