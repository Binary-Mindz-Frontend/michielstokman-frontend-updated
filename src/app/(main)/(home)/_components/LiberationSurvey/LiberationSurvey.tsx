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
        className="flex items-center justify-center gap-2 sm:gap-3.5"
      >
        <h2 className="font-edo text-center text-xl font-black uppercase sm:text-3xl lg:text-3xl xl:text-[2.8rem]">
          Liberation Survey 2026
        </h2>
        <div className="relative h-7 w-7 shrink-0 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
          <Image src={heartPinkDeco} alt="heart" fill className="object-contain" />
        </div>
      </motion.div>

      {/* "The Juicy Research" brush subtitle */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="relative mx-auto mt-3 flex h-12 w-full max-w-70 items-center justify-center sm:mt-4 sm:h-14 sm:max-w-85 lg:h-15 lg:max-w-95"
      >
        <div className="absolute inset-0 h-full w-full">
          <Image src={brushBg} alt="Brush background" fill className="object-fill" />
        </div>
        <p className="font-playpen relative z-10 text-base font-semibold text-white sm:text-lg lg:text-xl">
          The <span className="text-[#F83871]">Juicy</span> Research —
        </p>
      </motion.div>

      {/* Stats Row: Fine-tuned for 1024px laptops & large desktop screens */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto mt-6 grid w-full grid-cols-2 gap-6 rounded-2xl bg-[#F9F4EE] px-4 py-6 sm:mt-8 sm:grid-cols-3 sm:gap-6 sm:px-8 sm:py-8 lg:mt-10 lg:flex lg:flex-nowrap lg:items-start lg:justify-between lg:gap-2 lg:px-6 lg:py-8 xl:gap-4 xl:px-10 xl:py-10"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center ${
              index === 4 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            {/* Icon */}
            <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12 lg:h-11 lg:w-11 xl:h-14 xl:w-14">
              <Image src={stat?.icon} alt={stat?.label} fill className="object-contain" />
            </div>

            {/* Percent */}
            <span className="mt-2 font-sans text-2xl font-black text-[#1A1A1A] sm:text-3xl lg:text-[1.9rem] xl:text-[2.4rem]">
              {stat?.percent}
            </span>

            {/* Label */}
            <p className="mt-1 max-w-45 text-center font-sans text-xs leading-snug font-semibold text-[#272626] capitalize sm:text-sm lg:max-w-36.25 lg:text-xs xl:max-w-45 xl:text-base">
              {stat?.label}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default LiberationSurvey;
