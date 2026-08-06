'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      {/* Title with green wave decorations */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-5"
      >
        <div className="relative h-4 w-10 shrink-0 sm:h-5 sm:w-16 lg:h-6 lg:w-18 xl:h-7 xl:w-20">
          <Image src={greenWaves} alt="Green wave decoration" fill className="object-contain" />
        </div>

        <h2 className="font-edo text-center text-2xl font-medium uppercase lg:text-[2.2rem]">
          Latest Confessions
        </h2>

        <div className="relative h-4 w-10 shrink-0 sm:h-5 sm:w-16 lg:h-6 lg:w-18 xl:h-7 xl:w-20">
          <Image src={greenWaves} alt="Green wave decoration" fill className="object-contain" />
        </div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto mt-6 grid w-full grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5"
      >
        {confessions.map((item, index) => (
          <div
            key={index}
            className={`relative flex min-h-40 w-full overflow-hidden rounded-xl sm:min-h-44 lg:min-h-46 xl:min-h-48 ${item?.bg} p-4 xl:p-5`}
          >
            {/* Left Content */}
            <div className="z-10 flex w-[60%] flex-col justify-between pr-2 lg:w-[62%]">
              <p className="font-sans text-base leading-snug font-semibold text-[#1A1A1A] xl:text-lg">
                {item?.text}
              </p>

              {/* Bottom Icon */}
              <div className="relative mt-2.5 h-10 w-10 shrink-0 xl:h-12 xl:w-12">
                <Image src={item?.icon} alt={item?.iconAlt} fill className="object-contain" />
              </div>
            </div>

            {/* Right Photo */}
            <div className="relative my-auto h-32 w-[40%] shrink-0 overflow-hidden sm:h-38 lg:h-38 lg:w-[38%] xl:h-42">
              <Image
                src={item?.image}
                alt="Confession photo"
                fill
                className="object-right-center object-contain"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* SEE ALL Button */}
      <motion.div variants={FADE_IN_UP_ITEM} className="mt-8 flex justify-center">
        <div className="w-fit">
          <DynamicActionButton
            text="SEE ALL CONFESSIONS"
            href="/confessions"
            bgColor="#D22D4C"
            textColor="white"
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default LatestConfessions;
