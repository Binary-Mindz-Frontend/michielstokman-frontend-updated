/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  useGetDiscoveryFeedQuery,
  useGetStoryDetailsQuery,
} from '@/redux/features/discoveryFeed/discoveryFeed.api';

import { motion } from 'framer-motion';

import Image from 'next/image';

import { useParams, useRouter } from 'next/navigation';

import { useEffect, useMemo, useState } from 'react';

import LoginRequiredModal from '@/app/(main)/create/CreateForm/_components/LoginRequiredModal/LoginRequiredModal';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { StoryDetailSkeleton } from '@/components/main/Skeletons/StoryDetailSkeleton';
import { useCurrentUser, useIsAuthenticated } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import StoryPlayer from '../StoryPlayer/StoryPlayer';

import brushTextBg from '@/assets/account/brush-text-bg.png';
import confessionsHero from '@/assets/confessions/confessions-hero.png';
import pinkHeartDrawn from '@/assets/home/pink-heart-drawn.png';
import meditationsHero from '@/assets/meditations/meditations-hero.png';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();

  const storyId = params?.id as string;

  const { data: response, isLoading } = useGetStoryDetailsQuery(storyId, {
    skip: !storyId,
  });

  const feedData = response?.data;

  const isAuthenticated = useAppSelector(useIsAuthenticated);
  const user = useAppSelector(useCurrentUser) as any;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.is_guest && storyId) {
      const guestReadsStr = localStorage.getItem('guest_reads') || '{}';
      let guestReads;
      try {
        guestReads = JSON.parse(guestReadsStr);
      } catch {
        guestReads = {};
      }

      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (guestReads.timestamp && guestReads.storyId) {
        const timePassed = now - guestReads.timestamp;
        if (timePassed < twentyFourHours) {
          if (guestReads.storyId !== storyId) {
            // Block: trying to access a different story directly
            setPendingRedirectUrl(`/details/${storyId}`);
            setShowLoginModal(true);
            return;
          } else {
            return;
          }
        }
      }

      // Lock in the current story if none is active or 24 hours have passed
      localStorage.setItem(
        'guest_reads',
        JSON.stringify({
          timestamp: now,
          storyId: storyId,
        }),
      );
    }
  }, [isAuthenticated, user, storyId]);

  const handleReflectClick = (e?: React.MouseEvent) => {
    if (!isAuthenticated || user?.is_guest) {
      if (e) e.preventDefault();
      setPendingRedirectUrl(`/details/${storyId}/reflect`);
      setShowLoginModal(true);
    }
  };

  // Fetch all feed items to support previous / next story navigation
  const { data: feedResponse } = useGetDiscoveryFeedQuery([]);

  const stories = useMemo(() => {
    const items = feedResponse?.data?.items || [];
    const sorted = [...items].sort((a, b) => {
      return (b.has_access ? 1 : 0) - (a.has_access ? 1 : 0);
    });
    return sorted.filter((item: any) => item?.card_type !== 'liberation_journey');
  }, [feedResponse]);

  const currentIndex = useMemo(() => {
    return stories.findIndex((item: any) => item?.id === storyId);
  }, [stories, storyId]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < stories.length - 1;

  const handlePrev = () => {
    if (!hasPrev) return;
    const targetStoryId = stories[currentIndex - 1].id;
    const detailPath = `/details/${targetStoryId}`;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(detailPath)}`);
      return;
    }

    if (user?.is_guest) {
      const guestReadsStr = localStorage.getItem('guest_reads') || '{}';
      let guestReads;
      try {
        guestReads = JSON.parse(guestReadsStr);
      } catch {
        guestReads = {};
      }

      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (guestReads.timestamp && guestReads.storyId) {
        const timePassed = now - guestReads.timestamp;
        if (timePassed < twentyFourHours) {
          if (guestReads.storyId !== targetStoryId) {
            // Block: different story within 24 hours
            setPendingRedirectUrl(detailPath);
            setShowLoginModal(true);
            return;
          }
        }
      }

      // If allowed, lock in the new story
      localStorage.setItem(
        'guest_reads',
        JSON.stringify({
          timestamp: now,
          storyId: targetStoryId,
        }),
      );
    }

    router.push(detailPath);
  };

  const handleNext = () => {
    if (!hasNext) return;
    const targetStoryId = stories[currentIndex + 1].id;
    const detailPath = `/details/${targetStoryId}`;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(detailPath)}`);
      return;
    }

    if (user?.is_guest) {
      const guestReadsStr = localStorage.getItem('guest_reads') || '{}';
      let guestReads;
      try {
        guestReads = JSON.parse(guestReadsStr);
      } catch {
        guestReads = {};
      }

      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (guestReads.timestamp && guestReads.storyId) {
        const timePassed = now - guestReads.timestamp;
        if (timePassed < twentyFourHours) {
          if (guestReads.storyId !== targetStoryId) {
            // Block: different story within 24 hours
            setPendingRedirectUrl(detailPath);
            setShowLoginModal(true);
            return;
          }
        }
      }

      // If allowed, lock in the new story
      localStorage.setItem(
        'guest_reads',
        JSON.stringify({
          timestamp: now,
          storyId: targetStoryId,
        }),
      );
    }

    router.push(detailPath);
  };

  // audio current and duration time tracker
  const [audioProgress, setAudioProgress] = useState({ current: 0, duration: 0, speed: 1 });

  // Paragraphs of the story
  const paragraphs = useMemo(() => {
    return feedData?.story_text?.split('\n').filter((p: string) => p.trim() !== '') || [];
  }, [feedData?.story_text]);

  // Word timings based on API alignment data
  const wordTimings = useMemo(() => {
    if (!feedData) return [];

    // 1. Flatten all words from paragraphs
    const flatTextWords: { word: string; pIdx: number; wIdx: number }[] = [];
    paragraphs.forEach((paragraph: string, pIdx: number) => {
      const words = paragraph.split(/\s+/);
      words.forEach((word: string, wIdx: number) => {
        flatTextWords.push({ word, pIdx, wIdx });
      });
    });

    const alignment = feedData?.alignment;
    const duration = audioProgress.duration || feedData?.audio_duration_seconds || 0;
    const totalWords = flatTextWords.length;

    // Initialize timings array structure
    const timings: { start: number; end: number }[][] = paragraphs.map((paragraph: string) => {
      return paragraph.split(/\s+/).map(() => ({ start: 0, end: 0 }));
    });

    // Helper to clean a word for matching
    const cleanWord = (w: string) => {
      if (!w) return '';
      return w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    };

    // If no alignment data is available, fall back to uniform calculation
    if (!alignment || !Array.isArray(alignment) || alignment.length === 0) {
      let counter = 0;
      paragraphs.forEach((paragraph: string, pIdx: number) => {
        const words = paragraph.split(/\s+/);
        words.forEach((_: string, wIdx: number) => {
          const start = duration ? (duration / totalWords) * counter : 0;
          const end = duration ? (duration / totalWords) * (counter + 1) : 0;
          timings[pIdx][wIdx] = { start, end };
          counter++;
        });
      });
      return timings;
    }

    // 2. Perform greedy alignment matching
    const matchedTimings: ({ start: number; end: number } | null)[] = new Array(totalWords).fill(
      null,
    );
    let aIdx = 0;

    for (let tIdx = 0; tIdx < totalWords; tIdx++) {
      const textWord = flatTextWords[tIdx];
      const cleanText = cleanWord(textWord.word);
      if (!cleanText) continue;

      const lookahead = Math.min(alignment.length - aIdx, 40);
      for (let k = 0; k < lookahead; k++) {
        const entryIdx = aIdx + k;
        const entry = alignment[entryIdx];
        const cleanAlign = cleanWord(entry.word);

        if (
          cleanText === cleanAlign ||
          (cleanAlign && (cleanText.includes(cleanAlign) || cleanAlign.includes(cleanText)))
        ) {
          matchedTimings[tIdx] = {
            start: Number(entry.start),
            end: Number(entry.end),
          };
          aIdx = entryIdx + 1;
          break;
        }
      }
    }

    // 3. Interpolate unmatched words to ensure every word has a timestamp
    let lastEnd = 0;
    let i = 0;

    while (i < totalWords) {
      if (matchedTimings[i] !== null) {
        lastEnd = matchedTimings[i]!.end;
        i++;
      } else {
        // Find the next matched word
        let j = i;
        while (j < totalWords && matchedTimings[j] === null) {
          j++;
        }

        const nextStart = j < totalWords ? matchedTimings[j]!.start : duration || lastEnd;
        const count = j - i;

        // Interpolate the timings for unmatched words between i and j-1
        for (let u = 0; u < count; u++) {
          const idx = i + u;
          const start = lastEnd + ((nextStart - lastEnd) * u) / (count + 1);
          const end = lastEnd + ((nextStart - lastEnd) * (u + 1)) / (count + 1);
          matchedTimings[idx] = { start, end };
        }

        i = j;
      }
    }

    // 4. Map the flat matched/interpolated timings back to 2D structure
    let flatIdx = 0;
    paragraphs.forEach((paragraph: string, pIdx: number) => {
      const words = paragraph.split(/\s+/);
      words.forEach((_: string, wIdx: number) => {
        if (matchedTimings[flatIdx]) {
          timings[pIdx][wIdx] = matchedTimings[flatIdx]!;
        }
        flatIdx++;
      });
    });

    return timings;
  }, [feedData, paragraphs, audioProgress.duration]);

  if (!storyId || isLoading) return <StoryDetailSkeleton />;

  const isMeditation = feedData?.story_type === 'meditation';
  const themeColor = isMeditation ? '#E9A139' : '#D22D4C';
  const heroImageSrc = feedData?.cover_image_url
    ? feedData?.cover_image_url
    : isMeditation
      ? meditationsHero
      : confessionsHero;

  return (
    <div className="min-h-screen">
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingRedirectUrl('');
          const guestReadsStr = localStorage.getItem('guest_reads') || '{}';
          let guestReads;
          try {
            guestReads = JSON.parse(guestReadsStr);
          } catch {
            guestReads = {};
          }
          if (guestReads.storyId && guestReads.storyId !== storyId) {
            router.push('/');
          }
        }}
        redirectUrl={
          pendingRedirectUrl
            ? `/login?redirect=${encodeURIComponent(pendingRedirectUrl)}`
            : '/login'
        }
      />
      <LoginRequiredModal
        isOpen={!isAuthenticated}
        redirectUrl={`/login?redirect=/details/${storyId}`}
      />
      {/* Brand Hero Section */}
      <div className="mx-auto w-full max-w-350 px-4 pt-4 pb-8">
        <div className="mb-6 sm:mb-8">
          <DynamicBackButton href="/" bgColor={themeColor} />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP_CONTAINER}
          className="flex w-full flex-col items-center justify-between gap-8 md:flex-row md:items-center"
        >
          {/* LEFT COLUMN: Title & Brush Subtitle */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="flex w-full flex-col items-start md:w-1/2"
          >
            {/* Title */}
            <div className="font-edo relative leading-none font-medium uppercase">
              <h1
                style={{ color: themeColor }}
                className="-rotate-3 transform text-3xl tracking-wider sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              >
                {feedData?.title}
              </h1>

              {/* Decorative Pink Heart Top-Right of Title */}
              <div className="absolute -top-12 right-6 h-8 w-8 sm:-top-6 sm:right-8 sm:h-10 sm:w-10">
                <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
              </div>
            </div>

            {/* Brush Stroke Subtitle */}
            <div className="relative mt-6 flex min-h-18 w-full max-w-[320px] -rotate-1 transform items-center justify-center sm:mt-8 sm:min-h-22.5 sm:max-w-105">
              {/* Black brush background */}
              <div className="absolute inset-0 h-full w-full">
                <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
              </div>

              <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-white uppercase sm:px-6 sm:text-sm">
                A Story About The Day Fear <br /> <span className="text-[#E81A66]">Loosened</span>{' '}
                Its Grip
              </p>
            </div>

            {/* Bottom Left Pink Heart Deco */}
            <div className="relative mt-6 ml-4 h-7 w-7 sm:ml-8 sm:h-9 sm:w-9">
              <Image src={pinkHeartDrawn} alt="Heart" fill className="object-contain" />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Hero Collage Image */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="relative flex w-full justify-center md:w-1/2"
          >
            <div className="relative h-80 w-full max-w-85 shrink-0 sm:h-112.5 sm:max-w-125 md:max-w-150 lg:h-120 lg:max-w-170 xl:h-150 xl:max-w-187.5">
              <Image
                src={heroImageSrc}
                alt={feedData?.title || 'Story Hero Image'}
                fill
                className="object-contain"
                priority
                unoptimized={typeof feedData?.cover_image_url === 'string'}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-350 px-4">
        <div className="space-y-0.5">
          {/* Info Bar Matching Screenshot: Left Author Info | Right Resonance & Rating */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Author & Listened Info */}
            <p className="text-secondary font-sans text-sm font-medium">
              {feedData?.author_name || 'Hero'} • Listened to {feedData?.listened_count || 0} times
              • Explicit
            </p>

            {/* Right: Resonance & Rating Badge */}
            <div className="flex items-center gap-4 text-sm">
              <p className="text-secondary font-sans font-medium">
                Resonance:{' '}
                <span className="font-semibold text-[#503225]">
                  {feedData?.avg_resonance || '0'}
                </span>{' '}
                from{' '}
                <span className="font-semibold text-[#503225]">
                  {feedData?.total_reflections || '0'}
                </span>{' '}
                reflections
              </p>

              {feedData?.avg_rating && (
                <span className="rounded-sm bg-[#D22D4C] px-3 py-1 text-xs font-medium text-white uppercase">
                  {feedData?.avg_rating} ★ (
                  {feedData?.total_ratings || feedData?.total_reflections || 0} RATINGS)
                </span>
              )}
            </div>
          </div>

          {/* Tags Row */}
          {feedData?.top_tags && feedData?.top_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {feedData?.top_tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-secondary rounded-xs border border-[#EBE4D5] bg-[#FAF7F2] px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Audio Player */}

          <StoryPlayer
            story={feedData?.audio_path || ''}
            onTimeUpdateCallback={(current, duration, speed) =>
              setAudioProgress({ current, duration, speed: speed || 1 })
            }
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />

          {/* Paragraphs and Typewriter Effect*/}

          <div className="mx-auto w-full pt-6 md:pt-10">
            <div className="text-dark-primary space-y-8 text-lg leading-relaxed font-light">
              {paragraphs.map((paragraph: string, pIdx: number) => {
                const words = paragraph.split(/\s+/);

                return (
                  <p key={pIdx} className="flex flex-wrap gap-x-1.5">
                    {words.map((word: string, wIdx: number) => {
                      const timing = wordTimings[pIdx]?.[wIdx];
                      const isVisible = timing ? audioProgress.current >= timing.start : false;

                      return (
                        <motion.span
                          key={`${pIdx}-${wIdx}`}
                          initial={{ opacity: 0.1 }}
                          animate={{
                            opacity: isVisible ? 1 : 0.3,

                            color: isVisible ? themeColor : '#414651',
                          }}
                          transition={{ duration: 0.2 / audioProgress.speed }}
                          className="inline-block"
                        >
                          {word}
                        </motion.span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pt-10 pb-20">
            <div className="w-56 sm:w-64">
              <DynamicActionButton
                text="Rate This Story"
                href={`/details/${storyId}/reflect`}
                onClick={handleReflectClick}
                bgColor={themeColor}
                textColor="white"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
