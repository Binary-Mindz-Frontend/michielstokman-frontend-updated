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
      className="mx-auto flex w-full flex-col items-center gap-8 md:flex-row md:items-center md:gap-8 lg:gap-12 xl:gap-20"
    >
      {/* ===== LEFT COLUMN: Text & Subtitle ===== */}
      <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full flex-col items-start md:w-1/2">
        {/* Title */}
        <div className="font-edo relative leading-none font-black uppercase">
          <h1 className="-rotate-3 transform text-[42px] tracking-wider text-[#D22D4C] sm:text-[60px] md:text-[72px] lg:text-[85px] xl:text-[100px]">
            CONFESSIONS
          </h1>

          {/* Decorative Pink Heart Top-Right of Title */}
          <div className="absolute -top-3 -right-6 h-8 w-8 sm:-top-5 sm:-right-8 sm:h-10 sm:w-10">
            <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
          </div>
        </div>

        {/* Brush Stroke Subtitle */}
        <div className="relative mt-6 flex min-h-18 w-full max-w-[320px] -rotate-1 transform items-center justify-center sm:mt-8 sm:min-h-22.5 sm:max-w-105">
          {/* Black brush background */}
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>

          <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-semibold tracking-wide text-white uppercase sm:px-6 sm:text-[14px]">
            A SPACE TO SAY WHAT <br /> YOU&apos;VE <span className="text-[#E81A66]">NEVER </span>
            DARED TO SAY.
          </p>
        </div>

        {/* Share Your Story Button */}
        <div className="mt-8 w-56 sm:w-64">
          <DynamicActionButton
            text="Share Your Story"
            href="/create?type=Confessions"
            bgColor="#D22D4C"
            textColor="white"
          />
        </div>

        {/* Bottom Left Pink Heart Deco */}
        <div className="relative mt-6 ml-2 h-7 w-7 sm:h-9 sm:w-9">
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
