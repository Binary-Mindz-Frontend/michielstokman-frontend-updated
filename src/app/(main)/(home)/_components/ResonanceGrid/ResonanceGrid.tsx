'use client';

import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import FeatureCard, { FeatureItem } from './_components/FeatureCard/FeatureCard';

// Feature Images
import featureConfession from '@/assets/home/feature-confession.png';
import featureLiberation from '@/assets/home/feature-liberation.png';
import featureMeditation from '@/assets/home/feature-meditation.png';

// Icons
import heartPinkDeco from '@/assets/shared/heart-pink.png';
import iconBirdPurple from '@/assets/home/icon-bird-purple.png';
import iconSun from '@/assets/shared/icon-sun.png';

const features: FeatureItem[] = [
  {
    number: '01',
    title: 'CONFESSIONS',
    titleColor: 'text-[#E81A66]',
    description: "You're Not Alone. Read What Others Never Dared To Say. Or Finally Tell Your Own.",
    image: featureConfession,
    link: '/confessions',
    btnText: 'OPEN CONFESSIONS',
    bgColor: '#D22D4C',
    textColor: 'white',
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
    textColor: 'black',
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
    link: '/liberations',
    btnText: 'BEGIN LIBERATIONS',
    bgColor: '#54318C',
    textColor: 'white',
    icon: iconBirdPurple,
    iconAlt: 'Bird icon',
  },
];

function ResonanceGrid() {
  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((item) => (
          <FeatureCard key={item.number} item={item} />
        ))}
      </motion.div>
    </motion.section>
  );
}

export default ResonanceGrid;
