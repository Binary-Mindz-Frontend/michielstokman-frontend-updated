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
      <motion.div variants={FADE_IN_UP_ITEM} className="flex items-center justify-center gap-3.5">
        <h2 className="font-edo text-center text-[2rem] font-black uppercase sm:text-[2.4rem] lg:text-[2.8rem]">
          Liberation Survey 2026
        </h2>
        <div className="relative h-10 w-10 shrink-0">
          <Image src={heartPinkDeco} alt="heart" fill className="object-contain" />
        </div>
      </motion.div>

      {/* "The Juicy Research" brush subtitle */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="relative mx-auto mt-4 flex h-15 w-full max-w-100 items-center justify-center"
      >
        <div className="absolute inset-0 h-full w-full">
          <Image src={brushBg} alt="Brush background" fill className="object-fill" />
        </div>
        <p className="font-playpen relative z-10 text-xl font-semibold text-white">
          The <span className="text-[#F83871]">Juicy</span> Research —
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto mt-10 flex w-full flex-wrap items-start justify-center gap-8 rounded-xl bg-[#F9F4EE] px-8 py-10 sm:flex-nowrap sm:gap-4 sm:px-12"
      >
        {stats.map((stat, index) => (
          <div key={index} className="flex min-w-30 flex-1 flex-col items-center gap-2 text-center">
            {/* Icon */}
            <div className="relative h-14 w-14">
              <Image src={stat?.icon} alt={stat?.label} fill className="object-contain" />
            </div>

            {/* Percent */}
            <span className="font-sans text-[2rem] font-black lg:text-[2.4rem]">
              {stat?.percent}
            </span>

            {/* Label */}
            <p className="max-w-50 text-center font-sans text-sm leading-snug text-[#272626] capitalize sm:text-base">
              {stat?.label}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default LiberationSurvey;
