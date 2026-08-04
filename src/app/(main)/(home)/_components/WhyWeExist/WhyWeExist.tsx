'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Assets
import iconCocktail from '@/assets/home/icon-cocktail.png';
import iconFlame from '@/assets/home/icon-flame.png';
import iconLips from '@/assets/home/icon-lips.png';
import womanPhoto from '@/assets/home/image 117.png';
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
    <motion.section
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="w-full py-12"
    >
      {/* Title */}
      <motion.div variants={FADE_IN_UP_ITEM} className="mb-10 flex flex-col items-center">
        <h2 className="font-edo text-center text-[2rem] font-black uppercase sm:text-[2.4rem] lg:text-[2.8rem]">
          Why We Exist
        </h2>
        {/* Pink underline decoration */}
        <div className="mt-2 h-0.75 w-30 rounded-full bg-[#E81A66]" />
      </motion.div>

      {/* Content Row: Photo + Cards */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto flex w-full flex-col items-start gap-6 md:flex-row md:items-end md:gap-6"
      >
        {/* Left: Woman Photo */}
        <div className="relative h-70 w-full shrink-0 overflow-hidden rounded-xl md:h-65 md:w-65">
          <Image
            src={womanPhoto}
            alt="Woman smiling — Why We Exist"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Right: 4 Cards */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card?.number} className="flex flex-col gap-3 rounded-sm bg-[#F8F4ED] p-5">
              {/* Number + Icon Row */}
              <div className="flex items-center justify-between">
                <span className="font-sans text-base font-semibold text-[#301C05]">
                  {card?.number}
                </span>
                <div className="relative h-9 w-9 shrink-0">
                  <Image src={card?.icon} alt={card?.title} fill className="object-contain" />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-edo text-[1rem] leading-tight font-semibold uppercase lg:text-[1.2rem]">
                {card?.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-[12px] leading-relaxed whitespace-pre-line sm:text-sm">
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
