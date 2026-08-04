'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Assets
import confession1 from '@/assets/home/confession1.png';
import confession2 from '@/assets/home/confession2.png';
import confession3 from '@/assets/home/confession3.png';
import greenWaves from '@/assets/home/green-waves.png';
import iconBirdWhite from '@/assets/home/icon-bird-white.png';
import iconHeartWhite from '@/assets/home/icon-heart-white.png';
import iconLotusWhite from '@/assets/home/icon-lotus-white.png';

const confessions = [
  {
    text: 'I Thought I Was Over Him, Turns Out I Just Buried It.',
    bg: 'bg-[#E4A19D]',
    image: confession1,
    icon: iconHeartWhite,
    iconAlt: 'Heart icon',
  },
  {
    text: 'I Thought I Was Over Him, Turns Out I Just Buried It.',
    bg: 'bg-[#EBC98F]',
    image: confession2,
    icon: iconLotusWhite,
    iconAlt: 'Lotus icon',
  },
  {
    text: 'I Thought I Was Over Him, Turns Out I Just Buried It.',
    bg: 'bg-[#C7B3D2]',
    image: confession3,
    icon: iconBirdWhite,
    iconAlt: 'Bird icon',
  },
];

const LatestConfessions = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="w-full py-10"
    >
      {/* Title with green wave decorations */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="flex items-center justify-center gap-4 sm:gap-6"
      >
        <div className="relative h-6 w-16 shrink-0 sm:h-8 sm:w-24">
          <Image src={greenWaves} alt="Green wave decoration" fill className="object-contain" />
        </div>

        <h2 className="font-edo text-center text-[2rem] font-black uppercase sm:text-[2.4rem] lg:text-[2.8rem]">
          Latest Confessions
        </h2>

        <div className="relative h-6 w-16 shrink-0 sm:h-8 sm:w-24">
          <Image src={greenWaves} alt="Green wave decoration" fill className="object-contain" />
        </div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-3"
      >
        {confessions.map((item, index) => (
          <div
            key={index}
            className={`relative flex min-h-55 w-full overflow-hidden rounded-md ${item?.bg} p-6`}
          >
            {/* Left Content */}
            <div className="z-10 flex w-[60%] flex-col justify-between pr-2">
              <p className="font-sans text-lg leading-snug font-black sm:text-2xl">{item?.text}</p>

              {/* Bottom Icon */}
              <div className="relative h-10 w-10 shrink-0">
                <Image src={item?.icon} alt={item?.iconAlt} fill className="object-contain" />
              </div>
            </div>

            {/* Right Photo */}
            <div className="relative my-auto h-50 w-[40%] shrink-0 overflow-hidden">
              <Image src={item?.image} alt="Confession photo" fill className="object-contain" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* SEE ALL Button */}
      <motion.div variants={FADE_IN_UP_ITEM} className="mt-10 flex justify-center">
        <Link
          href="/confessions"
          className="font-edo flex items-center justify-center rounded-sm bg-[#D22D4C] px-8 py-3.5 text-base font-bold tracking-widest text-white transition-all hover:bg-[#b5243f]"
        >
          SEE ALL —&gt;
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default LatestConfessions;
