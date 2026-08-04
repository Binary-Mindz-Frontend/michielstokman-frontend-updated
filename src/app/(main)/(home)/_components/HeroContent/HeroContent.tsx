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
      className="mx-auto flex w-full flex-col items-center gap-8 px-4 py-4 md:flex-row md:items-center md:gap-12 lg:gap-20"
    >
      {/* ===== LEFT COLUMN: Text ===== */}
      <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full flex-col items-start md:w-1/2">
        {/* Title */}

        <div className="font-edo flex flex-col items-start leading-none font-black uppercase">
          <span className="-rotate-3 transform text-[100px] tracking-wider text-[#486221]">
            Transform
          </span>
          <span className="mt-2 -rotate-3 transform text-[100px] tracking-wide text-[#E81A66]">
            To
          </span>
          <span className="-rotate-3 transform text-[100px] tracking-normal text-[#F3A134]">
            Liberation
          </span>
        </div>

        {/* Brush stroke subtitle */}
        <div className="relative mt-8 flex min-h-22.5 w-full max-w-105 -rotate-1 transform items-center justify-center">
          {/* Black brush background */}
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>
          <p className="relative z-10 px-6 py-2 text-center font-sans text-[13px] font-semibold tracking-wide text-white uppercase sm:text-[14px]">
            A space to <span className="text-[#E81A66]">be real,</span>
            <br />
            to feel deep, to <span className="text-[#F3A134]">transform.</span>
          </p>
        </div>

        {/* READ CONFESSIONS Button */}
        <div className="relative mt-8 h-13 w-55 sm:w-62.5">
          <Image src={btnBg} alt="Button background" fill className="object-fill" />
          <Link
            href="/confessions"
            className="relative z-10 flex h-full w-full items-center justify-center gap-2"
          >
            <span className="font-edo text-[13px] font-black tracking-widest text-[#3a2200] uppercase sm:text-[14px]">
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
        <div className="absolute top-10 -right-10 z-20 h-16 w-16">
          <Image src={starDeco} alt="Pink star decoration" fill className="object-contain" />
        </div>

        {/* Pink Heart — right middle, outside image */}
        <div className="absolute top-1/2 -right-8 z-20 h-14 w-14 -translate-y-1/2">
          <Image src={heartPink} alt="Pink heart decoration" fill className="object-contain" />
        </div>

        {/* Green Heart — bottom right, outside image */}
        <div className="absolute -right-8 bottom-10 z-20 h-14 w-14">
          <Image src={heartGreen} alt="Green heart decoration" fill className="object-contain" />
        </div>

        {/* Main Hero Collage Image */}
        <div style={{ width: '750px', height: '700px', position: 'relative', flexShrink: 0 }}>
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
