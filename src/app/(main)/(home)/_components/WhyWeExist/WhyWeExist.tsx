'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets
import iconCocktail from '@/assets/home/icon-cocktail.png';
import iconFlame from '@/assets/home/icon-flame.png';
import iconLips from '@/assets/home/icon-lips.png';
import womanPhoto from '@/assets/home/image 117.png';
import pinkUnderline from '@/assets/home/pink-underline.png';
import iconBird from '@/assets/home/Vector (1).png';

const cards = [
  {
    number: '01',
    icon: iconBird,
    title: 'A Place To Be Free',
    desc: 'To Speak.\nTo Explore.\nTo Become\nWithout Asking Permission.',
  },
  {
    number: '02',
    icon: iconLips,
    title: 'Uncensored Language & Feelings',
    desc: 'We Chase Love Within Love. There Is No Shame. No Judgment.',
  },
  {
    number: '03',
    icon: iconCocktail,
    title: 'Learn From Each Other',
    desc: 'No Gurus\nNo Leaders\nOnly Wisdom\nWe Share',
  },
  {
    number: '04',
    icon: iconFlame,
    title: 'Became Who You Really Are',
    desc: 'This Is A Place To Grow And To Became Your True Self',
  },
];

const WhyWeExist = () => {
  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      {/* Title */}
      <motion.div variants={FADE_IN_UP_ITEM} className="mb-10 flex flex-col items-center">
        <div className="relative">
          <h2 className="font-edo text-center text-[2rem] font-black text-[#1a1a1a] uppercase sm:text-[2.4rem] lg:text-[2.8rem]">
            Why We Exist
          </h2>
          {/* Pink underline decoration image */}
          <div className="relative mt-1 h-1.5 w-full">
            <Image src={pinkUnderline} alt="underline" fill className="object-cover" />
          </div>
        </div>
      </motion.div>

      {/* Content Row: Photo + Cards */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto flex w-full flex-col items-start gap-6 md:flex-row md:items-start md:gap-4 lg:gap-3 xl:items-end"
      >
        <div className="relative h-70 w-full shrink-0 overflow-hidden rounded-xl md:h-65 md:w-55 lg:w-56 xl:h-65 xl:w-65">
          <Image
            src={womanPhoto}
            alt="Woman smiling — Why We Exist"
            fill
            className="object-contain object-center"
            priority
          />
        </div>

        {/* Right: 4 Cards */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3 xl:gap-4">
          {cards.map((card) => (
            <div
              key={card?.number}
              className="flex flex-col gap-3 rounded-sm bg-[#F8F4ED] p-4 lg:p-3.5 xl:p-5"
            >
              {/* Number + Icon Row */}
              <div className="flex items-center justify-between">
                <span className="font-sans text-base font-semibold text-[#301C05]">
                  {card?.number}
                </span>
                <div className="relative h-8 w-8 shrink-0 lg:h-8 lg:w-8 xl:h-9 xl:w-9">
                  <Image src={card?.icon} alt={card?.title} fill className="object-contain" />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-edo text-[1rem] leading-tight font-semibold uppercase lg:text-[0.92rem] xl:text-[1.2rem]">
                {card?.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-[12px] leading-relaxed whitespace-pre-line sm:text-sm lg:text-[11px] xl:text-sm">
                {card?.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default WhyWeExist;
