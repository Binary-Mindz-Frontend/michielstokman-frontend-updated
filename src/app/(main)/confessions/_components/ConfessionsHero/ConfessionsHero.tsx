'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

import brushTextBg from '@/assets/account/brush-text-bg.png';
import confessionsHero from '@/assets/confessions/confessions-hero.png';
import pinkHeartDrawn from '@/assets/home/pink-heart-drawn.png';

export default function ConfessionsHero() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="mx-auto flex w-full flex-col items-center gap-8 pt-10 sm:pt-0 md:flex-row md:items-center lg:gap-12 xl:gap-20"
    >
      {/* ===== LEFT COLUMN: Text & Subtitle ===== */}
      <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full flex-col items-start md:w-1/2">
        {/* Title */}
        <div className="font-edo relative leading-none font-medium uppercase">
          <h1 className="-rotate-4 transform text-5xl tracking-wider text-[#D22D4C] md:text-6xl lg:text-7xl xl:text-8xl">
            CONFESSIONS
          </h1>

          {/* Decorative Pink Heart Top-Right of Title */}
          <div className="absolute -top-3 -right-6 h-8 w-8 sm:-top-5 sm:-right-8 sm:h-10 sm:w-10">
            <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
          </div>
        </div>

        {/* Brush Stroke Subtitle */}
        <div className="relative mt-6 flex min-h-18 w-full max-w-[320px] -rotate-2 transform items-center justify-center sm:mt-8 sm:min-h-22.5 sm:max-w-105">
          {/* Black brush background */}
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>

          <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium text-white uppercase sm:px-6 sm:text-sm">
            A SPACE TO SAY WHAT <br /> YOU&apos;VE <span className="text-[#E81A66]">NEVER </span>
            DARED TO SAY.
          </p>
        </div>

        {/* Share Your Story Button */}
        <div className="mt-6 ml-4 w-56 sm:mt-8 sm:ml-8 sm:w-64 lg:ml-20">
          <DynamicActionButton
            text="Share Your Story"
            href="/create?type=Confessions"
            bgColor="#D22D4C"
            textColor="white"
          />
        </div>

        {/* Bottom Left Pink Heart Deco */}
        <div className="relative mt-6 ml-6 h-7 w-7 sm:ml-10 sm:h-9 sm:w-9 lg:ml-22">
          <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
        </div>
      </motion.div>

      {/* ===== RIGHT COLUMN: Hero Collage Image ===== */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="relative flex w-full justify-center md:w-1/2"
      >
        <div className="relative h-80 w-full max-w-85 shrink-0 sm:h-112.5 sm:max-w-125 md:h-137.5 md:max-w-150 lg:h-155 lg:max-w-170 xl:h-175 xl:max-w-187.5">
          <Image
            src={confessionsHero}
            alt="Confessions - Real Stories, Real People, Real Transformation"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
