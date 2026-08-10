'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets
import brushTextBg from '@/assets/shared/brush-text-bg.png';
import greenWaves from '@/assets/shared/green-waves.png';
import pinkHeartDrawn from '@/assets/shared/pink-heart-drawn.png';
import starDeco from '@/assets/shared/star-deco.png';
import iconBirdPurple from '@/assets/shared/icon-bird-purple.png';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-[#FAF7F2] px-4 py-16 text-center">
      {/* Decorative Floating Elements */}
      <div className="absolute top-12 left-8 h-10 w-10 opacity-80 sm:left-20 sm:h-14 sm:w-14">
        <Image src={starDeco} alt="Star Deco" fill className="object-contain" />
      </div>

      <div className="absolute top-20 right-8 h-10 w-10 opacity-80 sm:right-24 sm:h-12 sm:w-12">
        <Image src={iconBirdPurple} alt="Bird Deco" fill className="object-contain" />
      </div>

      <div className="absolute bottom-16 left-12 h-8 w-8 opacity-80 sm:h-10 sm:w-10">
        <Image src={pinkHeartDrawn} alt="Heart Deco" fill className="object-contain" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="relative z-10 flex max-w-xl flex-col items-center"
      >
        {/* 404 Large Title */}
        <motion.div variants={FADE_IN_UP_ITEM} className="font-edo relative leading-none">
          <h1 className="-rotate-3 transform text-8xl font-black tracking-widest text-[#D22D4C] sm:text-9xl md:text-[140px]">
            404
          </h1>
          <div className="absolute -top-4 -right-6 h-8 w-8 sm:-top-6 sm:-right-8 sm:h-10 sm:w-10">
            <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
          </div>
        </motion.div>

        {/* Page Not Found Subtitle */}
        <motion.h2
          variants={FADE_IN_UP_ITEM}
          className="font-edo mt-2 text-2xl font-black tracking-wide text-[#1A1A1A] uppercase sm:text-3xl lg:text-4xl"
        >
          <span className="text-[#486221]">LOST IN</span>{' '}
          <span className="text-[#E81A66]">LIBERATION</span>
        </motion.h2>

        {/* Green Waves Deco */}
        <motion.div variants={FADE_IN_UP_ITEM} className="relative mt-2 h-4 w-16">
          <Image src={greenWaves} alt="Decoration" fill className="object-contain" />
        </motion.div>

        {/* Brush Stroke Subtitle */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="relative mt-6 flex min-h-18 w-full max-w-[340px] -rotate-1 transform items-center justify-center sm:min-h-20 sm:max-w-105"
        >
          <div className="absolute inset-0 h-full w-full">
            <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
          </div>
          <p className="font-playpen relative z-10 px-6 py-2 text-center text-xs font-bold tracking-wide text-white uppercase sm:text-sm">
            This Path Leads Nowhere.{' '}
            <span className="text-[#F3A134]">Let&apos;s Guide You Back.</span>
          </p>
        </motion.div>

        {/* Return to Home Action Button */}
        <motion.div variants={FADE_IN_UP_ITEM} className="mt-8 w-60 sm:w-68">
          <DynamicActionButton
            text="RETURN TO HOMEPAGE"
            href="/"
            bgColor="#D22D4C"
            textColor="white"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
