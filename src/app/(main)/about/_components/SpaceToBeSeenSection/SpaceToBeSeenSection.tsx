'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets from src/assets/about
import founderBg from '@/assets/about/founder-bg.png';
import founderImg from '@/assets/about/founder-image.png';
import spaceImg from '@/assets/about/space-to-be-seen-image.png';

const SpaceToBeSeenSection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="relative flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:items-center lg:gap-12"
    >
      {/* --- LEFT TORN PAPER IMAGE COLUMN --- */}
      <div className="flex w-full items-center justify-center lg:w-5/12">
        <div className="relative w-full max-w-105 sm:max-w-120 lg:max-w-135">
          <Image
            src={spaceImg}
            alt="The Space to Be Seen Image"
            width={600}
            height={600}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>

      {/* --- MIDDLE CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left lg:w-4/12">
        {/* Section Heading */}
        <h2 className="font-edo text-2xl font-normal text-[#6242A5] uppercase sm:text-3xl md:text-3xl lg:text-4xl">
          04. THE SPACE TO BE SEEN
        </h2>

        {/* Text Paragraphs */}
        <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed font-normal text-[#333333] sm:text-base md:text-[17px]">
          <p>
            This is not a commercial product. It is a space for honest expression. Through
            &quot;Confessions&quot; and shared &quot;Transformations,&quot; we dissolve the distance
            between us. We move from the isolation of perfection to the abundance of greatness.
          </p>
          <p>
            I started this because the path appeared beneath my feet. I realized that our current
            leaders are not ready to guide us; they are trapped in the same surface-level reactions.
            We cannot wait for wise elders. We must become them.
          </p>
        </div>
      </div>

      {/* --- RIGHT DYNAMIC FOUNDER POLAROID CARD COLUMN --- */}
      <div className="flex w-full items-center justify-center lg:w-3/12">
        <div className="relative aspect-[490/758] w-full max-w-72 rotate-[3.429deg] transform drop-shadow-md sm:max-w-80 lg:max-w-85">
          {/* Polaroid Paper Background Image */}
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={founderBg}
              alt="Founder polaroid card background"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Overlaid Dynamic Content inside Polaroid Card */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-6 pt-7 pb-8 text-center">
            {/* Header: FOUNDER ❤️ */}
            <div className="font-edo flex items-center justify-center gap-1 text-sm font-normal text-[#D84A7A] not-italic sm:text-base md:text-lg">
              <span>FOUNDER</span>
              <span className="text-red-500">❤️</span>
            </div>

            {/* Founder Single Portrait Image */}
            <div className="relative my-2 aspect-square w-[75%] overflow-hidden rounded-sm border border-black/10">
              <Image
                src={founderImg}
                alt="Michiel Stokman Founder Portrait"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Founder Details & Quote */}
            <div className="flex flex-col items-center text-center">
              {/* Name */}
              <h4 className="font-playpen text-center text-xs leading-tight font-normal text-[#D84A7A] uppercase not-italic sm:text-sm md:text-base">
                MICHEL
                <br />
                STOKMAN
              </h4>

              {/* Subtitle */}
              <p className="font-playpen mt-1 text-center text-[9px] leading-none font-normal text-[#6B7280] not-italic sm:text-[10px]">
                Transform to Liberation
              </p>

              {/* Quote */}
              <p className="font-playpen mt-2 text-center text-[11px] leading-snug font-normal text-[#1A1A1A] not-italic sm:text-xs">
                &quot;I started this because the
                <br />
                ground
                <br />
                disappeared beneath my
                <br />
                feet.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceToBeSeenSection;
