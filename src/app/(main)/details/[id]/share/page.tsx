'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicSkipButton from '@/components/main/DynamicSkipButton/DynamicSkipButton';
import StoryShareActions from '@/components/main/StoryShareActions/StoryShareActions';
import { useAuthState } from '@/redux/features/auth/authSlice';
import {
  useGetDiscoveryFeedQuery,
  useGetStoryDetailsQuery,
} from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { useAppSelector } from '@/redux/hooks';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import {
  getNextStoryLabel,
  getOverviewHref,
  getPersonalizedNextStoryId,
} from '@/utils/storyListenLoop.utils';

import brushTextBg from '@/assets/shared/brush-text-bg.png';
import vectorUnderline from '@/assets/reflect/reflect-vector.png';

export default function StorySharePage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params?.id as string;

  const { user } = useAppSelector(useAuthState);
  const { data: response } = useGetStoryDetailsQuery(storyId, { skip: !storyId });
  const feedData = response?.data;
  const isMeditation = feedData?.story_type === 'meditation';
  const themeColor = isMeditation ? '#E9A139' : '#D22D4C';
  const overviewHref = getOverviewHref(feedData?.story_type);
  const nextLabel = getNextStoryLabel(feedData?.story_type);

  const { data: profileResponse } = useGetProfileQuery(undefined, {
    skip: !user || Boolean(user?.is_guest),
  });
  const profile = profileResponse?.data;

  const { data: feedResponse } = useGetDiscoveryFeedQuery([]);
  const nextStoryId = useMemo(() => {
    const items = (feedResponse?.data?.items || []) as any[];
    const sorted = [...items].sort((a, b) => (b.has_access ? 1 : 0) - (a.has_access ? 1 : 0));
    return getPersonalizedNextStoryId(sorted, storyId, feedData?.story_type, profile);
  }, [feedResponse, storyId, feedData?.story_type, profile]);

  const detailsShareUrl = `/details/${storyId}`;

  if (!storyId) return null;

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:pt-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP_CONTAINER}
          className="flex flex-col items-center gap-8"
        >
          <motion.div variants={FADE_IN_UP_ITEM} className="w-full text-center">
            <div className="font-edo relative inline-block leading-none font-medium uppercase">
              <h1 className="-rotate-2 transform text-3xl tracking-wider sm:text-4xl md:text-5xl">
                <span className="block text-[#4D6E26]">THANK YOU</span>
                <span className="relative block text-[#E81A66]">FOR LISTENING</span>
              </h1>
              <div className="relative mx-auto mt-2 h-4 w-full max-w-70">
                <Image src={vectorUnderline} alt="" fill className="object-contain" />
              </div>
            </div>

            <div className="relative mx-auto mt-6 flex min-h-16 w-full max-w-[320px] -rotate-1 items-center justify-center sm:min-h-20 sm:max-w-105">
              <div className="absolute inset-0">
                <Image src={brushTextBg} alt="" fill className="object-fill" />
              </div>
              <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-white uppercase sm:text-sm">
                {feedData?.title || 'Your story'}
              </p>
            </div>
          </motion.div>

          <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
            <StoryShareActions
              size="large"
              shareUrl={detailsShareUrl}
              trailingAction={
                <button
                  type="button"
                  onClick={() => router.push(overviewHref)}
                  className="border-primary/25 text-secondary hover:border-primary/40 inline-flex min-h-14 min-w-[140px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border bg-[#F8F3ED] px-5 py-3.5 font-sans text-sm font-semibold uppercase transition-transform hover:scale-[1.02] active:scale-100 sm:min-w-[160px] sm:flex-none sm:text-base"
                  style={{ borderColor: `${themeColor}66`, color: themeColor }}
                >
                  Skip
                </button>
              }
            />
          </motion.div>

          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="flex w-full max-w-xl flex-col items-stretch gap-3 pt-4 sm:flex-row sm:gap-4"
          >
            <div className="flex-1">
              <DynamicActionButton
                text="Back to Overview"
                href={overviewHref}
                bgColor={themeColor}
                textColor="white"
                fullWidth
              />
            </div>
            <div className="flex-1">
              {nextStoryId ? (
                <DynamicSkipButton
                  text={nextLabel}
                  href={`/details/${nextStoryId}`}
                  borderColor={themeColor}
                  textColor={themeColor}
                  showArrow
                  fullWidth
                />
              ) : (
                <DynamicSkipButton
                  text={nextLabel}
                  href={overviewHref}
                  borderColor={themeColor}
                  textColor={themeColor}
                  showArrow
                  fullWidth
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
