'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Assets
import brushTextBg from '@/assets/account/brush-text-bg.png';
import btnBg from '@/assets/home/btnBg.png';
import heartGreen from '@/assets/home/heart-green.png';
import heartPink from '@/assets/home/heart-pink.png';
import heroImage from '@/assets/home/heroImage.png';
import starDeco from '@/assets/home/star-deco.png';

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="mx-auto flex w-full flex-col items-center gap-8 md:flex-row md:items-center md:gap-8 lg:gap-12 xl:gap-20"
    >
      {/* ===== LEFT COLUMN: Text ===== */}
      <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full flex-col items-start md:w-1/2">
        {/* Title */}
        <div className="font-edo flex flex-col items-start leading-none font-medium uppercase">
          <span className="-rotate-3 transform text-[42px] tracking-wider text-[#486221] sm:text-[60px] md:text-[72px] lg:text-[85px] xl:text-[100px]">
            Transform
          </span>
          <span className="mt-1 -rotate-3 transform text-[42px] tracking-wide text-[#E81A66] sm:mt-2 sm:text-[60px] md:text-[72px] lg:text-[85px] xl:text-[100px]">
            To
          </span>
          <span className="-rotate-3 transform text-[42px] tracking-normal text-[#F3A134] sm:text-[60px] md:text-[72px] lg:text-[85px] xl:text-[100px]">
            Liberation
          </span>
        </div>

        {/* Brush stroke subtitle */}
        <div className="relative mt-6 flex min-h-18 w-full max-w-[320px] -rotate-1 transform items-center justify-center sm:mt-8 sm:min-h-22.5 sm:max-w-105">
          {/* Black brush background */}
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>
          <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-white uppercase sm:px-6 sm:text-[14px]">
            A space to <span className="text-[#E81A66]">be real,</span>
            <br />
            to feel deep, to <span className="text-[#F3A134]">transform.</span>
          </p>
        </div>

        {/* READ CONFESSIONS Button */}
        <div className="relative mt-6 h-12 w-52 sm:mt-8 sm:h-13 sm:w-62.5">
          <Image src={btnBg} alt="Button background" fill className="object-fill" />
          <Link
            href="/confessions"
            className="relative z-10 flex h-full w-full items-center justify-center gap-2"
          >
            <span className="font-edo text-[12px] font-semibold tracking-widest text-[#3a2200] uppercase sm:text-[14px]">
              Read Confessions →
            </span>
          </Link>
        </div>
      </motion.div>

      {/* ===== RIGHT COLUMN: Hero Image + Decorations ===== */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="relative flex w-full justify-center md:w-1/2"
      >
        {/* Pink Star — top right, outside image */}
        <div className="absolute top-4 -right-2 z-20 h-10 w-10 sm:top-10 sm:-right-6 sm:h-14 sm:w-14 lg:-right-10 xl:h-16 xl:w-16">
          <Image src={starDeco} alt="Pink star decoration" fill className="object-contain" />
        </div>

        {/* Pink Heart — right middle, outside image */}
        <div className="absolute top-1/2 -right-2 z-20 h-8 w-8 -translate-y-1/2 sm:-right-6 sm:h-12 sm:w-12 lg:-right-8 xl:h-14 xl:w-14">
          <Image src={heartPink} alt="Pink heart decoration" fill className="object-contain" />
        </div>

        {/* Green Heart — bottom right, outside image */}
        <div className="absolute -right-2 bottom-4 z-20 h-8 w-8 sm:-right-6 sm:bottom-10 sm:h-12 sm:w-12 lg:-right-8 xl:h-14 xl:w-14">
          <Image src={heartGreen} alt="Green heart decoration" fill className="object-contain" />
        </div>

        {/* Main Hero Collage Image */}
        <div className="relative h-80 w-full max-w-85 shrink-0 sm:h-112.5 sm:max-w-125 md:h-137.5 md:max-w-150 lg:h-155 lg:max-w-170 xl:h-175 xl:max-w-187.5">
          <Image
            src={heroImage}
            alt="Transform to Liberation - Real Stories, Real People"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
