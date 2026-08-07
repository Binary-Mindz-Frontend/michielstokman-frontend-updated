'use client';

import { FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets from src/assets/safety/freedom-section & share
import freedomSectionIcon from '@/assets/safety/freedom-section/freedom-icon.svg';
import freedomSectionImg from '@/assets/safety/freedom-section/freedom-image.png';
import titleUnderline from '@/assets/safety/share/title-underline.png';

const FreedomSection = () => {
  return (
    <motion.div
      variants={FADE_IN_UP_ITEM}
      className="flex w-full flex-col-reverse items-center justify-between gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16"
    >
      {/* --- LEFT IMAGE COLUMN --- */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="relative w-full max-w-110 sm:max-w-120 md:max-w-135">
          <Image
            src={freedomSectionImg}
            alt="Freedom Section Dancing Woman"
            width={600}
            height={600}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>

      {/* --- RIGHT CONTENT COLUMN --- */}
      <div className="flex w-full flex-col items-start text-left md:w-1/2">
        {/* Heading Unit */}
        <div className="flex w-full items-center justify-center gap-3 md:w-auto md:justify-start md:gap-4">
          {/* 1. Dove Icon */}
          <div className="relative h-10 w-10 shrink-0 md:h-12 md:w-12">
            <Image
              src={freedomSectionIcon}
              alt="Freedom Dove Icon"
              fill
              className="object-contain"
            />
          </div>

          {/* 2. Rotated '02' with Playpen Sans */}
          <div className="relative flex items-center justify-center px-2">
            <span
              className="font-playpen text-xl font-bold text-[#E81A66] md:text-2xl"
              style={{ transform: 'rotate(-19.389deg)' }}
            >
              02
            </span>

            {/* The thin pink underline under '02' */}
            <div
              className="absolute -right-4 -bottom-1 -left-2 h-0.5 bg-[#E81A66]"
              style={{ transform: 'rotate(-19.389deg)' }}
            />
          </div>

          {/* 3. FREEDOM Title with Brush Underline */}
          <div className="relative ml-2 flex flex-col items-center">
            <h2 className="font-edo text-4xl font-medium tracking-wide text-black uppercase md:text-5xl">
              FREEDOM
            </h2>

            {/* Pink Curved Underline */}
            <div className="absolute -bottom-3 left-1/2 w-[110%] -translate-x-1/2">
              <Image
                src={titleUnderline}
                alt="pink underline"
                width={150}
                height={15}
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Text Paragraphs */}
        <div className="mt-8 space-y-5 font-sans text-sm leading-relaxed font-semibold text-[#1A1A1A] sm:text-base md:text-[17px] md:leading-relaxed">
          <p>
            At Transform To Liberation, We Act From Freedom. We Explore Freedom. We Practice It.
          </p>
          <p>
            And Freedom Only Exists Alongside Responsibility. One Without The Other Collapses Into
            Either Tyranny Or Chaos. Together. They Become A Way Of Living.
          </p>
          <p>
            Act In The Spirit Of Transform To Liberation. Help Each Other. Hold Each Other
            Accountable, And Embrace Each Other In The Same Breath. We Are Here To Liberate Not To
            Perform Liberation While Binding The Person Beside Us.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FreedomSection;
