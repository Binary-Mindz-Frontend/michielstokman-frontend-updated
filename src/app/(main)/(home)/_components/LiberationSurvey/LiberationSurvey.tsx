'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets
import brushBg from '@/assets/home/Vector (2).png';
import heartPinkDeco from '@/assets/home/heart-pink.png';
import iconCocktail from '@/assets/home/icon-cocktail.png';
import iconFlame from '@/assets/home/icon-flame.png';
import iconHeartArrow from '@/assets/home/icon-heart-arrow.png';
import iconLips from '@/assets/home/icon-lips.png';
import iconPeach from '@/assets/home/icon-peach.png';

const stats = [
  {
    icon: iconLips,
    percent: '87%',
    label: 'Want More Connection In Their Lives',
  },
  {
    icon: iconCocktail,
    percent: '79%',
    label: 'Want More Desire And Intimacy',
  },
  {
    icon: iconPeach,
    percent: '76%',
    label: 'Want More Honesty In Relationships',
  },
  {
    icon: iconFlame,
    percent: '71%',
    label: 'Want More Aliveness And Excitement',
  },
  {
    icon: iconHeartArrow,
    percent: '68%',
    label: 'Want More Freedom To Be Themselves',
  },
];

const LiberationSurvey = () => {
  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      {/* Title */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="flex items-center justify-center gap-2 sm:gap-3"
      >
        <h2 className="font-edo text-center text-2xl font-medium uppercase lg:text-[2.2rem]">
          Liberation Survey 2026
        </h2>
        <div className="relative h-8 w-8 shrink-0 lg:h-9 lg:w-9">
          <Image src={heartPinkDeco} alt="heart" fill className="object-contain" />
        </div>
      </motion.div>

      {/* "The Juicy Research" brush subtitle */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="relative mx-auto mt-2.5 flex h-10 w-full max-w-60 items-center justify-center sm:mt-4 sm:h-12 sm:max-w-75 lg:h-13 lg:max-w-85"
      >
        <div className="absolute inset-0 h-full w-full">
          <Image src={brushBg} alt="Brush background" fill className="object-fill" />
        </div>
        <p className="relative z-10 font-sans text-sm font-medium text-white lg:text-base">
          The <span className="text-[#F83871]">Juicy</span> Research —
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto mt-6 grid w-full grid-cols-2 gap-4 rounded-md bg-[#F9F4EE] px-4 py-5 sm:grid-cols-3 sm:gap-5 sm:px-6 sm:py-6 md:mt-8 lg:flex lg:flex-nowrap lg:items-start lg:justify-between lg:gap-2 lg:px-6 lg:py-7 xl:gap-3"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center ${
              index === 4 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            {/* Icon */}
            <div className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10 xl:h-12 xl:w-12">
              <Image src={stat?.icon} alt={stat?.label} fill className="object-contain" />
            </div>

            {/* Percent */}
            <span className="mt-1.5 font-sans text-2xl font-semibold text-[#1A1A1A] xl:text-[2.1rem]">
              {stat?.percent}
            </span>

            {/* Label */}
            <p className="mt-1 max-w-40 text-center font-sans text-xs leading-snug font-medium text-[#272626] capitalize lg:max-w-32 lg:text-[11px] xl:max-w-40 xl:text-xs">
              {stat?.label}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default LiberationSurvey;
