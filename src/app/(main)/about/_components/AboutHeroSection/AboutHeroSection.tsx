'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets from src/assets/about
import aboutHeroBrush from '@/assets/about/about-hero-brush.png';
import aboutHeroImg from '@/assets/about/about-hero-image.png';

const AboutHeroSection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="relative flex w-full flex-col items-center justify-between gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16"
    >
      {/* --- LEFT CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
        {/* Title Header with Floating Quote Text */}
        <div className="relative flex w-full flex-col items-center md:items-start">
          {/* Main Title Stack */}
          <div className="font-edo flex flex-col items-center leading-none font-black uppercase md:items-start">
            <span className="-rotate-2 transform text-3xl tracking-wider text-[#486221] min-[380px]:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
              WHY
            </span>
            <span className="mt-2 -rotate-2 transform text-3xl tracking-wider whitespace-nowrap text-[#E81A66] min-[380px]:text-4xl sm:mt-3 sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
              TRANSFORM TO
            </span>
            <div className="relative mt-2 inline-block sm:mt-3">
              <span className="-rotate-2 transform text-3xl tracking-wider whitespace-nowrap text-[#F3A134] min-[380px]:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl">
                LIBERATION
              </span>

              {/* Floating Quote Text ("Say what's real." ❤️) - Absolute Placement */}
              <div className="font-playpen absolute -right-8 -bottom-8 z-10 shrink-0 -rotate-6 transform text-center text-[10px] leading-tight font-bold text-[#1A1A1A] min-[380px]:-right-10 min-[380px]:-bottom-9 min-[380px]:text-xs sm:-right-16 sm:-bottom-11 sm:text-sm md:-right-20 md:-bottom-12 md:text-sm lg:-right-24 lg:-bottom-14 lg:text-base">
                <p className="whitespace-nowrap">&quot;Say</p>
                <p className="whitespace-nowrap">what&apos;s real.&quot;</p>
                <p className="mt-0.5 text-[10px] min-[380px]:text-xs sm:text-sm md:text-sm lg:text-base">
                  ❤️
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brush Text Container (Bottom Left) */}
        <div className="relative mt-16 flex min-h-24 w-full max-w-105 -rotate-2 transform items-center justify-center px-6 py-5 sm:mt-20 sm:min-h-28 md:mt-24 lg:mt-28">
          {/* Brush Background Image */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={aboutHeroBrush}
              alt="Black brush background"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Text inside Brush */}
          <div className="relative z-10 px-4 text-center font-sans text-xs leading-snug font-semibold text-white sm:text-sm md:text-base">
            <p>A Story About The Day Fear</p>
            <p className="mt-0.5">
              <span className="font-bold text-[#E81A66]">Loosened</span> Its Grip
            </p>
          </div>
        </div>
      </div>

      {/* --- RIGHT HERO IMAGE COLUMN --- */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="relative w-full max-w-115 sm:max-w-130 md:max-w-145 lg:max-w-160">
          <Image
            src={aboutHeroImg}
            alt="Why Transform To Liberation Hero Image"
            width={700}
            height={700}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AboutHeroSection;
