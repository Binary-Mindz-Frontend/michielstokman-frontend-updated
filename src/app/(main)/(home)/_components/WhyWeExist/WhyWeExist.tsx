'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets
import iconCocktail from '@/assets/shared/icon-cocktail.png';
import iconFlame from '@/assets/shared/icon-flame.png';
import iconLips from '@/assets/shared/icon-lips.png';
import womanPhoto from '@/assets/home/why-we-exist-image.png';
import pinkUnderline from '@/assets/shared/pink-underline.png';
import iconBird from '@/assets/home/why-we-exist-vector.png';

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
      <motion.div variants={FADE_IN_UP_ITEM} className="mb-4 flex flex-col items-center">
        <div className="relative">
          <h2 className="font-edo text-center text-2xl font-medium uppercase lg:text-[2.2rem]">
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
        className="mx-auto flex w-full flex-col items-start gap-5 md:flex-row md:gap-4 lg:gap-3 xl:items-end"
      >
        <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-xl md:h-60 md:w-52 lg:w-54 xl:h-60 xl:w-60">
          <Image
            src={womanPhoto}
            alt="Woman smiling — Why We Exist"
            fill
            className="object-contain object-center"
            priority
          />
        </div>

        {/* Right: 4 Cards */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3 xl:gap-4">
          {cards.map((card) => (
            <div key={card?.number} className="flex flex-col gap-2.5 rounded-sm bg-[#F8F4ED] p-4">
              {/* Number + Icon Row */}
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-semibold text-[#301C05] sm:text-sm">
                  {card?.number}
                </span>
                <div className="relative h-7 w-7 shrink-0 xl:h-8 xl:w-8">
                  <Image src={card?.icon} alt={card?.title} fill className="object-contain" />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-edo text-base leading-tight font-medium uppercase xl:text-[1.05rem]">
                {card?.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs leading-relaxed font-semibold whitespace-pre-line md:text-sm">
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
