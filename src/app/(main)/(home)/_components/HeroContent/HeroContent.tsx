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
import arrowBlack from '@/assets/shared/arrow-black.png';

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="mx-auto flex w-full flex-col items-center gap-8 pt-10 sm:pt-0 md:flex-row md:items-center lg:gap-12 xl:gap-20"
    >
      {/* ===== LEFT COLUMN: Text ===== */}
      <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full flex-col items-start md:w-1/2">
        {/* Title */}
        <div className="font-edo flex -rotate-4 transform flex-col items-start gap-0.5 leading-none font-medium uppercase">
          <span className="text-5xl tracking-wider text-[#486221] md:text-6xl lg:text-7xl xl:text-8xl">
            Transform
          </span>
          <span className="text-5xl tracking-wide text-[#E81A66] sm:mt-2 md:text-6xl lg:text-7xl xl:text-8xl">
            To
          </span>
          <span className="text-5xl tracking-wider text-[#F3A134] md:text-6xl lg:text-7xl xl:text-8xl">
            Liberation
          </span>
        </div>

        {/* Brush stroke subtitle */}
        <div className="relative mt-6 flex min-h-18 w-full max-w-[320px] -rotate-2 transform items-center justify-center sm:mt-8 sm:min-h-22.5 sm:max-w-105">
          {/* Black brush background */}
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>
          <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium text-white uppercase sm:px-6 sm:text-sm">
            A space to <span className="text-[#E81A66]">be real,</span>
            <br />
            to feel deep, to <span className="text-[#F3A134]">transform.</span>
          </p>
        </div>

        {/* READ CONFESSIONS Button */}
        <div className="relative mt-6 ml-4 h-12 w-56 sm:mt-8 sm:ml-8 sm:h-13 sm:w-64 lg:ml-20">
          <Image src={btnBg} alt="Button background" fill className="object-fill" />
          <Link
            href="/confessions"
            className="relative z-10 flex h-full w-full items-center justify-center gap-2.5 px-4"
          >
            <span className="font-edo text-xs font-semibold text-[#3a2200] uppercase sm:text-sm">
              READ CONFESSIONS
            </span>
            <div className="relative h-3.5 w-7 shrink-0">
              <Image src={arrowBlack} alt="Arrow" fill className="object-contain" />
            </div>
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
