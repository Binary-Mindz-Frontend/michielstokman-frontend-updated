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
      className="relative flex w-full flex-col items-center justify-between gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16"
    >
      {/* ================= MOBILE LAYOUT (< md) ================= */}
      <div className="flex w-full flex-col items-center text-center md:hidden">
        {/* Mobile Title Stack */}
        <div className="font-edo flex flex-col items-center leading-none font-medium uppercase">
          {/* Line 1: WHY TRANSFORM */}
          <div className="-rotate-2 transform text-3xl font-medium tracking-wider min-[400px]:text-4xl sm:text-4xl">
            <span className="text-[#486221]">WHY </span>
            <span className="text-[#E81A66]">TRANSFORM</span>
          </div>

          {/* Line 2: TO LIBERATION */}
          <div className="relative mt-2 -rotate-2 transform text-3xl font-medium tracking-wider min-[400px]:text-4xl sm:text-4xl">
            <span className="text-[#E81A66]">TO </span>
            <span className="text-[#F3A134]">LIBERATION</span>
          </div>

          {/* Line 3: Floating Quote Text ("Say what's real." ❤️) */}
          <div className="font-playpen mt-2 flex w-full flex-col items-end pr-4 text-right">
            <div className="-rotate-6 transform text-xs leading-tight font-bold text-[#1A1A1A] italic sm:text-sm">
              <p>&quot;Say</p>
              <p>what&apos;s real.&quot;</p>
              <p className="mt-0.5 text-sm not-italic">❤️</p>
            </div>
          </div>
        </div>

        {/* Mobile Hero Image (Middle) */}
        <div className="relative mt-4 w-full max-w-95 sm:max-w-110">
          <Image
            src={aboutHeroImg}
            alt="Why Transform To Liberation Hero Image"
            width={600}
            height={600}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        {/* Mobile Brush Text Container (Bottom) */}
        <div className="relative mt-6 flex min-h-22 w-full max-w-100 -rotate-2 transform items-center justify-center px-6 py-4 sm:mt-8 sm:min-h-26">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={aboutHeroBrush}
              alt="Black brush background"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative z-10 px-4 text-center font-sans text-xs leading-snug font-semibold text-white sm:text-sm">
            <p>A Story About The Day Fear</p>
            <p className="mt-0.5">
              <span className="font-bold text-[#E81A66]">Loosened</span> Its Grip
            </p>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP LAYOUT (>= md) ================= */}
      <div className="hidden w-full flex-col items-start text-left md:flex md:w-1/2">
        {/* Desktop Title Header */}
        <div className="relative flex w-full flex-col items-start">
          <div className="font-edo flex -rotate-6 transform flex-col items-start leading-none font-medium uppercase">
            <span className="text-5xl tracking-wider text-[#486221] lg:text-6xl xl:text-7xl">
              WHY
            </span>
            <span className="mt-3 text-5xl tracking-wider whitespace-nowrap text-[#E81A66] lg:text-6xl xl:text-7xl">
              TRANSFORM TO
            </span>
            <div className="relative mt-3 inline-block">
              <span className="text-5xl tracking-wider whitespace-nowrap text-[#F3A134] lg:text-6xl xl:text-7xl">
                LIBERATION
              </span>

              {/* Quote Text */}
              <div className="font-playpen absolute -right-16 -bottom-12 z-10 shrink-0 -rotate-6 transform text-center text-sm leading-tight font-bold text-[#1A1A1A] lg:-right-24 lg:-bottom-14 lg:text-base">
                <p className="whitespace-nowrap">&quot;Say</p>
                <p className="whitespace-nowrap">what&apos;s real.&quot;</p>
                <p className="mt-0.5 text-sm lg:text-base">❤️</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Brush Text Container */}
        <div className="relative mt-20 flex min-h-26 w-full max-w-105 -rotate-2 transform items-center justify-center px-6 py-5 md:mt-24 lg:mt-28">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={aboutHeroBrush}
              alt="Black brush background"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative z-10 px-4 text-center font-sans text-sm leading-snug font-semibold text-white md:text-base">
            <p>A Story About The Day Fear</p>
            <p className="mt-0.5">
              <span className="font-bold text-[#E81A66]">Loosened</span> Its Grip
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Right Hero Image */}
      <div className="hidden w-full items-center justify-center md:flex md:w-1/2">
        <div className="relative w-full max-w-130 md:max-w-145 lg:max-w-160">
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
