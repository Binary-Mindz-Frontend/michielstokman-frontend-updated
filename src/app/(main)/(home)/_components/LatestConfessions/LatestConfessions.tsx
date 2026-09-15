'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { formatListenLength } from '@/utils/memberStory.utils';
import { resolveStoryCoverSrc, shouldUnoptimizeStoryImage } from '@/utils/storyCover.utils';
import { publicDisplayName, storyIdentityLines } from '@/utils/storyIdentity.utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import greenWaves from '@/assets/shared/green-waves.png';
import iconBirdWhite from '@/assets/home/icon-bird-white.png';
import iconHeartWhite from '@/assets/home/icon-heart-white.png';
import iconLotusWhite from '@/assets/home/icon-lotus-white.png';

const CARD_THEMES = [
  { bg: 'bg-[#E4A19D]', icon: iconHeartWhite, iconAlt: 'Heart icon' },
  { bg: 'bg-[#EBC98F]', icon: iconLotusWhite, iconAlt: 'Lotus icon' },
  { bg: 'bg-[#C7B3D2]', icon: iconBirdWhite, iconAlt: 'Bird icon' },
];

const LatestConfessions = () => {
  const { data: feedResponse, isLoading } = useGetDiscoveryFeedQuery(['confession']);
  const rawItems = feedResponse?.data?.items || [];

  const confessions = rawItems
    .filter(
      (item: { story_type?: string; card_type?: string }) =>
        item.story_type === 'confession' ||
        item.card_type === 'confession' ||
        (item.card_type === 'story' && item.story_type === 'confession'),
    )
    .slice(0, 3);

  return (
    <motion.section initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-5"
      >
        <div className="relative h-4 w-10 shrink-0 sm:h-5 sm:w-16 lg:h-6 lg:w-18 xl:h-7 xl:w-20">
          <Image src={greenWaves} alt="" fill className="object-contain" />
        </div>

        <h2 className="font-edo text-center text-2xl font-medium uppercase lg:text-[2.2rem]">
          Latest Confessions
        </h2>

        <div className="relative h-4 w-10 shrink-0 sm:h-5 sm:w-16 lg:h-6 lg:w-18 xl:h-7 xl:w-20">
          <Image src={greenWaves} alt="" fill className="object-contain" />
        </div>
      </motion.div>

      <motion.div
        variants={FADE_IN_UP_ITEM}
        className="mx-auto mt-6 grid w-full grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5"
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="min-h-40 animate-pulse rounded-xl bg-[#EADED5] sm:min-h-44 lg:min-h-46 xl:min-h-48"
              />
            ))
          : confessions.map(
              (
                item: {
                  id: string;
                  title?: string;
                  author_name?: string | null;
                  location?: string | null;
                  gender?: string | null;
                  sexual_orientation?: string | null;
                  occupation?: string | null;
                  age?: number | null;
                  audio_duration_seconds?: number | null;
                  cover_image_url?: string | null;
                },
                index: number,
              ) => {
                const theme = CARD_THEMES[index % CARD_THEMES.length];
                const coverSrc = resolveStoryCoverSrc(item.cover_image_url, 'confession');
                const { nameLine, detailLine } = storyIdentityLines({
                  authorName: publicDisplayName(item.author_name),
                  location: item.location,
                  gender: item.gender,
                  sexualOrientation: item.sexual_orientation,
                  occupation: item.occupation,
                  age: item.age,
                });
                const duration = formatListenLength(item.audio_duration_seconds);
                const meta = [detailLine, duration].filter(Boolean).join(' · ');

                return (
                  <Link
                    key={item.id}
                    href={`/details/${item.id}`}
                    className={`group relative flex min-h-40 w-full overflow-hidden rounded-xl p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D22D4C] sm:min-h-44 lg:min-h-46 xl:min-h-48 xl:p-5 ${theme.bg}`}
                  >
                    <div className="z-10 flex w-[60%] flex-col justify-between pr-2 lg:w-[62%]">
                      <div>
                        <p className="line-clamp-3 font-sans text-base leading-snug font-semibold text-[#1A1A1A] xl:text-lg">
                          {item.title}
                        </p>
                        {nameLine ? (
                          <p className="mt-2 font-serif text-sm text-[#1A1A1A]/80 italic">
                            {nameLine}
                          </p>
                        ) : null}
                        {meta ? (
                          <p className="mt-0.5 line-clamp-2 font-sans text-xs text-[#1A1A1A]/70">
                            {meta}
                          </p>
                        ) : null}
                      </div>

                      <div className="relative mt-2.5 h-10 w-10 shrink-0 xl:h-12 xl:w-12">
                        <Image src={theme.icon} alt="" fill className="object-contain" />
                      </div>
                    </div>

                    <div className="relative my-auto h-32 w-[40%] shrink-0 overflow-hidden rounded-md bg-[#E8DFD4] sm:h-38 lg:h-38 lg:w-[38%] xl:h-42">
                      <Image
                        src={coverSrc}
                        alt={item.title || 'Confession'}
                        fill
                        sizes="(max-width: 1024px) 40vw, 20vw"
                        quality={90}
                        unoptimized={shouldUnoptimizeStoryImage(coverSrc)}
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </Link>
                );
              },
            )}
      </motion.div>

      {!isLoading && confessions.length === 0 ? (
        <p className="mt-6 text-center font-sans text-sm text-[#777]">No confessions yet.</p>
      ) : null}

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
