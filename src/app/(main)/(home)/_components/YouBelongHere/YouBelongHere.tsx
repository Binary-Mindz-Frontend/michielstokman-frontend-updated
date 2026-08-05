'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets
import belongMan from '@/assets/home/belong-man.png';
import belongWoman from '@/assets/home/belong-woman.png';
import iconButterfly from '@/assets/home/icon-butterfly.png';
import iconGlobe from '@/assets/home/icon-globe.png';
import iconPerson from '@/assets/home/icon-person.png';
import pinkHeartDrawn from '@/assets/home/pink-heart-drawn.png';
import pinkUnderline from '@/assets/home/pink-underline.png';

const YouBelongHere = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="w-full py-6 sm:py-8 lg:py-10"
    >
      {/* Container: 1-col mobile, 2x2 Grid on tablet & laptop (768px - 1279px), 4-col flex on large screens (1280px+) */}
      <div className="mx-auto flex w-full flex-col items-center justify-between gap-6 md:grid md:grid-cols-2 md:gap-6 lg:gap-8 xl:flex xl:flex-row xl:items-stretch xl:gap-6">
        {/* ===== Column 1: Left (Title, Stats & CTA) ===== */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="flex w-full flex-col justify-between gap-5 md:col-span-1 xl:w-[31%]"
        >
          {/* Header with underline and pink heart */}
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <h2 className="font-edo text-2xl font-medium tracking-wide uppercase sm:text-[2.2rem] lg:text-[2.4rem] xl:text-[2.5rem]">
                  You Belong Here.
                </h2>
                <div className="relative mt-1 h-1.5 w-full">
                  <Image src={pinkUnderline} alt="underline" fill className="object-cover" />
                </div>
              </div>
              <div className="relative h-7 w-7 shrink-0 -translate-y-2 sm:h-9 sm:w-9 lg:h-9 lg:w-9 xl:h-10 xl:w-10">
                <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
              </div>
            </div>

            <p className="mt-3 text-center font-sans text-base font-semibold text-[#1A1A1A] sm:text-lg">
              It&apos;s Free
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-1 text-center sm:gap-2">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <div className="relative h-9 w-9 shrink-0 sm:h-11 sm:w-11 xl:h-12 xl:w-12">
                <Image src={iconPerson} alt="Person icon" fill className="object-contain" />
              </div>
              <span className="mt-1.5 font-sans text-sm font-extrabold text-[#1A1A1A] sm:text-base xl:text-lg">
                272.00+
              </span>
              <span className="font-sans text-[11px] font-semibold text-[#555] sm:text-xs">
                Memebers
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <div className="relative h-9 w-9 shrink-0 sm:h-11 sm:w-11 xl:h-12 xl:w-12">
                <Image src={iconGlobe} alt="Globe icon" fill className="object-contain" />
              </div>
              <span className="mt-1.5 font-sans text-sm font-extrabold text-[#1A1A1A] sm:text-base xl:text-lg">
                42
              </span>
              <span className="font-sans text-[11px] font-semibold text-[#555] sm:text-xs">
                Countries Worldwide
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <div className="relative h-9 w-9 shrink-0 sm:h-11 sm:w-11 xl:h-12 xl:w-12">
                <Image src={iconButterfly} alt="Butterfly icon" fill className="object-contain" />
              </div>
              <span className="mt-1.5 font-sans text-sm font-extrabold text-[#1A1A1A] sm:text-base xl:text-lg">
                Thousands
              </span>
              <span className="font-sans text-[11px] font-semibold text-[#555] sm:text-xs">
                Of Stories Shared
              </span>
            </div>
          </div>

          {/* CREATE FREE ACCOUNT Button */}
          <DynamicActionButton
            text="CREATE FREE ACCOUNT"
            href="/register"
            bgColor="#D22D4C"
            textColor="white"
          />
        </motion.div>

        {/* ===== Column 2: Woman Photo ===== */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="relative h-80 w-full shrink-0 overflow-hidden rounded-xl sm:h-95 md:col-span-1 lg:h-105 xl:h-120 xl:w-[22%]"
        >
          <Image
            src={belongWoman}
            alt="Woman with arms wide open"
            fill
            className="object-contain object-center"
            priority
          />
        </motion.div>

        {/* ===== Column 3: Quote Text ===== */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="flex w-full flex-col justify-around gap-4 px-1 sm:gap-5 md:col-span-1 xl:w-[23%]"
        >
          <p className="font-sans text-base font-medium text-[#1A1A1A] sm:text-lg lg:text-xl">
            The Truth Doesn&apos;t Set You Free.
          </p>

          <h3 className="font-edo text-2xl leading-relaxed font-medium text-[#E81A66] uppercase sm:text-[2.2rem] lg:text-[2.4rem]">
            First It <br /> Messes <br /> Everything Up.
          </h3>

          <p className="font-sans text-sm leading-relaxed font-medium text-[#1A1A1A] sm:text-base lg:text-lg">
            A Place For People Who Want To Feel More Alive.
          </p>
        </motion.div>

        {/* ===== Column 4: Man Photo ===== */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="relative h-80 w-full shrink-0 overflow-hidden rounded-xl sm:h-95 md:col-span-1 lg:h-105 xl:h-120 xl:w-[22%]"
        >
          <Image
            src={belongMan}
            alt="Man looking to the side"
            fill
            className="object-contain object-center"
            priority
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default YouBelongHere;
