'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Feature Images
import featureConfession from '@/assets/home/feature-confession.png';
import featureLiberation from '@/assets/home/feature-liberation.png';
import featureMeditation from '@/assets/home/feature-meditation.png';

// Icons
import heartPinkDeco from '@/assets/home/heart-pink.png';
import iconBirdPurple from '@/assets/home/icon-bird-purple.png';
import iconSun from '@/assets/home/icon-sun.png';

const features = [
  {
    number: '01',
    title: 'CONFESSIONS',
    titleColor: 'text-[#E81A66]',
    description: "You're Not Alone. Read What Others Never Dared To Say. Or Finally Tell Your Own.",
    image: featureConfession,
    link: '/confessions',
    btnText: 'OPEN CONFESSIONS',
    bgColor: '#D22D4C',
    textColor: 'white' as const,
    icon: heartPinkDeco,
    iconAlt: 'Heart icon',
  },
  {
    number: '02',
    title: 'MEDITATIONS',
    titleColor: 'text-[#F3A134]',
    description:
      'Meditations With Transformative Power. Reconnect With Your Body, Your Breath, And Your Truth.',
    image: featureMeditation,
    link: '/meditations',
    btnText: 'START MEDITATIONS',
    bgColor: '#F3A134',
    textColor: 'black' as const,
    icon: iconSun,
    iconAlt: 'Sun icon',
  },
  {
    number: '03',
    title: 'LIBERATIONS',
    titleColor: 'text-[#54318C]',
    description:
      'Transformative Liberation Courses. Break Old Patterns. Reclaim Your Freedom. Become Who You Truly Are.',
    image: featureLiberation,
    link: '/liberation',
    btnText: 'BEGIN LIBERATIONS',
    bgColor: '#54318C',
    textColor: 'white' as const,
    icon: iconBirdPurple,
    iconAlt: 'Bird icon',
  },
];

function ResonanceGrid() {
  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-3"
      >
        {features.map((item) => (
          <div
            key={item.number}
            className="relative flex min-h-95 flex-col justify-between overflow-hidden rounded-md bg-[#F8F3ED] p-6"
          >
            {/* Left Content Area */}
            <div className="relative z-10 max-w-[48%]">
              {/* Card Top: Number */}
              <span className="font-sans text-base font-semibold text-[#301C05]">
                {item.number}
              </span>

              {/* Title */}
              <h3
                className={`font-edo mt-0.5 text-[1.9rem] leading-tight font-black tracking-wide uppercase sm:text-[2.2rem] ${item.titleColor}`}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-4 font-sans text-xs leading-relaxed font-semibold text-black sm:text-sm">
                {item.description}
              </p>

              {/* Icon Bottom Right of Left Column (Next to image) */}
              <div className="mt-6 flex w-full justify-end">
                <div className="relative h-9 w-9 shrink-0">
                  <Image src={item.icon} alt={item.iconAlt} fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* Right Photo Layer - Absolute Positioned to Fill Right Side */}
            <div className="absolute top-10 right-2 bottom-20 z-0 w-[50%]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain object-bottom-right"
                priority
              />
            </div>

            {/* Reusable Dynamic Action Button */}
            <div className="relative z-10 mt-6">
              <DynamicActionButton
                text={item.btnText}
                href={item.link}
                bgColor={item.bgColor}
                textColor={item.textColor}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default ResonanceGrid;
