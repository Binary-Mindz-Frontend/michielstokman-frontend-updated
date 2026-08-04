'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';

// Assets
import belongMan from '@/assets/home/belong-man.png';
import belongWoman from '@/assets/home/belong-woman.png';
import heartPinkDeco from '@/assets/home/heart-pink.png';
import iconButterfly from '@/assets/home/icon-butterfly.png';
import iconGlobe from '@/assets/home/icon-globe.png';
import iconPerson from '@/assets/home/icon-person.png';
import pinkUnderline from '@/assets/home/pink-underline.png';

const YouBelongHere = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="w-full py-12"
    >
      <div className="mx-auto flex w-full flex-col items-center justify-between gap-6 lg:flex-row lg:items-stretch">
        {/* ===== Column 1: Left (Title, Stats & CTA) ===== */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="flex w-full flex-col justify-between gap-6 lg:w-[32%]"
        >
          {/* Header with underline and pink heart */}
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <h2 className="font-edo text-[2.2rem] font-black tracking-wide uppercase sm:text-[2.5rem]">
                  You Belong Here.
                </h2>
                <div className="relative mt-1 h-1.5 w-full">
                  <Image src={pinkUnderline} alt="underline" fill className="object-cover" />
                </div>
              </div>
              <div className="relative h-8 w-8 shrink-0 -translate-y-2">
                <Image src={heartPinkDeco} alt="Heart" fill className="object-contain" />
              </div>
            </div>

            <p className="font-playpen mt-4 text-center text-lg font-bold text-[#1A1A1A]">
              It&apos;s Free
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <div className="relative h-12 w-12 shrink-0">
                <Image src={iconPerson} alt="Person icon" fill className="object-contain" />
              </div>
              <span className="mt-2 font-sans text-base font-extrabold text-[#1A1A1A] sm:text-lg">
                272.00+
              </span>
              <span className="font-playpen text-xs font-semibold text-[#555]">Memebers</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <div className="relative h-12 w-12 shrink-0">
                <Image src={iconGlobe} alt="Globe icon" fill className="object-contain" />
              </div>
              <span className="mt-2 font-sans text-base font-extrabold text-[#1A1A1A] sm:text-lg">
                42
              </span>
              <span className="font-playpen text-xs font-semibold text-[#555]">
                Countries Worldwide
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <div className="relative h-12 w-12 shrink-0">
                <Image src={iconButterfly} alt="Butterfly icon" fill className="object-contain" />
              </div>
              <span className="mt-2 font-sans text-base font-extrabold text-[#1A1A1A] sm:text-lg">
                Thousands
              </span>
              <span className="font-playpen text-xs font-semibold text-[#555]">
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
          className="relative h-120 w-full shrink-0 overflow-hidden rounded-xl sm:h-130 lg:h-100 lg:w-[22%]"
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
          className="flex w-full flex-col justify-center gap-6 px-2 lg:w-[23%]"
        >
          <p className="font-playpen text-lg font-bold text-[#1A1A1A]">
            The Truth Doesn&apos;t Set You Free.
          </p>

          <h3 className="font-edo text-[2rem] leading-tight font-black text-[#E81A66] uppercase sm:text-[2.4rem]">
            First It Messes Everything Up.
          </h3>

          <p className="font-playpen text-base leading-relaxed font-bold text-[#1A1A1A]">
            A Place For People Who Want To Feel More Alive.
          </p>
        </motion.div>

        {/* ===== Column 4: Man Photo ===== */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="relative h-120 w-full shrink-0 overflow-hidden rounded-xl sm:h-130 lg:h-100 lg:w-[22%]"
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
