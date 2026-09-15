/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  useGetDiscoveryFeedQuery,
  useGetStoryDetailsQuery,
} from '@/redux/features/discoveryFeed/discoveryFeed.api';

import { motion } from 'framer-motion';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { Fragment, useEffect, useMemo, useState } from 'react';

import LoginRequiredModal from '@/app/(main)/create/CreateForm/_components/LoginRequiredModal/LoginRequiredModal';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import { StoryDetailSkeleton } from '@/components/main/Skeletons/StoryDetailSkeleton';
import { useCurrentUser, useIsAuthenticated } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import StoryPlayer from '../StoryPlayer/StoryPlayer';

import brushTextBg from '@/assets/shared/brush-text-bg.png';
import confessionsHero from '@/assets/shared/confessions-hero.png';
import pinkHeartDrawn from '@/assets/shared/pink-heart-drawn.png';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { resolveStoryCoverSrc } from '@/utils/storyCover.utils';

function BrushTagline({
  tagline,
  title,
  isMeditation,
}: {
  tagline?: string | null;
  title?: string | null;
  isMeditation: boolean;
}) {
  const accent = isMeditation ? 'text-[#E9A139]' : 'text-[#E81A66]';
  const raw = (tagline || title || '').trim();

  if (!raw) {
    return isMeditation ? (
      <>
        You&apos;re Not Alone. Read What Others
        <br /> Have <span className={accent}>Never </span>
        Dared To Say.
      </>
    ) : (
      <>
        A SPACE TO SAY WHAT <br /> YOU&apos;VE <span className={accent}>NEVER </span>
        DARED TO SAY.
      </>
    );
  }

  return (
    <>
      {raw.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
        const marked = part.match(/^\*\*([^*]+)\*\*$/);
        if (marked) {
          return (
            <span key={index} className={accent}>
              {marked[1]}
            </span>
          );
        }

        return (
          <Fragment key={index}>
            {part.split('\n').map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

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

  const goToReflect = () => {
    if (!isAuthenticated || user?.is_guest) {
      setPendingRedirectUrl(`/details/${storyId}/reflect`);
      setShowLoginModal(true);
      return;
    }
    router.push(`/details/${storyId}/reflect`);
  };

  const handleAudioEnded = () => {
    goToReflect();
  };

  // Fetch all feed items to support previous / next story navigation
  const { data: feedResponse } = useGetDiscoveryFeedQuery([]);

  const stories = useMemo(() => {
    const items = feedResponse?.data?.items || [];
    const sorted = [...items].sort((a, b) => {
      return (b.has_access ? 1 : 0) - (a.has_access ? 1 : 0);
    });
    const storyItems = sorted.filter((item: any) => item?.card_type !== 'liberation_journey');
    const currentType = feedData?.story_type;
    if (!currentType) return storyItems;
    return storyItems.filter((item: any) => item?.story_type === currentType);
  }, [feedResponse, feedData?.story_type]);

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
  const heroImageSrc = feedData?.story_type
    ? resolveStoryCoverSrc(
        feedData.cover_image_url,
        feedData.story_type as 'confession' | 'meditation' | 'transformation',
      )
    : feedData?.cover_image_url
      ? feedData.cover_image_url
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
          <DynamicBackButton
            href={isMeditation ? '/meditations' : '/confessions'}
            bgColor={themeColor}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP_CONTAINER}
          className="flex w-full flex-col items-center justify-between gap-8 md:flex-row md:items-center"
        >
          {/* LEFT COLUMN: Brush title, right-aligned identity, hook */}
          <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full flex-col md:w-1/2">
            <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="relative flex min-h-18 w-full max-w-[280px] shrink-0 -rotate-2 transform items-center justify-center sm:min-h-22.5 sm:max-w-[320px]">
                <div className="absolute inset-0 h-full w-full">
                  <Image src={brushTextBg} alt="" fill className="object-fill" />
                </div>
                <h1 className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-white uppercase sm:px-6 sm:text-sm">
                  <BrushTagline
                    tagline={feedData?.hero_tagline}
                    title={feedData?.title}
                    isMeditation={isMeditation}
                  />
                </h1>
              </div>

              {(feedData?.author_name ||
                feedData?.location ||
                feedData?.gender ||
                feedData?.sexual_orientation ||
                feedData?.occupation ||
                feedData?.age) && (
                <div
                  className="min-w-0 flex-1 text-right font-serif text-lg leading-snug italic sm:text-xl"
                  style={{ color: themeColor }}
                >
                  {feedData?.author_name ? <p>{feedData.author_name}</p> : null}
                  {feedData?.location ? <p>{feedData.location}</p> : null}
                  {feedData?.gender ? <p>{feedData.gender}</p> : null}
                  {feedData?.sexual_orientation ? <p>{feedData.sexual_orientation}</p> : null}
                  {feedData?.occupation ? <p>{feedData.occupation}</p> : null}
                  {feedData?.age !== null && feedData?.age !== undefined ? (
                    <p>{feedData.age}</p>
                  ) : null}
                </div>
              )}
            </div>

            {feedData?.hero_hook ? (
              <div className="mt-6 flex items-start gap-3 sm:mt-8">
                <div className="relative mt-1 h-7 w-7 shrink-0 sm:h-9 sm:w-9">
                  <Image src={pinkHeartDrawn} alt="" fill className="object-contain" />
                </div>
                <p className="max-w-lg font-serif text-base leading-relaxed text-[#1A1A1A] italic sm:text-lg">
                  {feedData.hero_hook}
                </p>
              </div>
            ) : (
              <div className="relative mt-6 h-7 w-7 sm:h-9 sm:w-9">
                <Image src={pinkHeartDrawn} alt="" fill className="object-contain" />
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Cover, with a heart like the client mock */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="relative flex w-full justify-center md:w-1/2"
          >
            <div className="absolute top-8 -left-2 hidden h-8 w-8 md:block lg:top-12 lg:-left-4">
              <Image src={pinkHeartDrawn} alt="" fill className="object-contain" />
            </div>
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
              {feedData?.is_explicit || feedData?.high_intensity ? ' • Explicit' : ''}
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

          {/* Moods (editorial tags) and listener resonance */}
          {((feedData?.tags && feedData.tags.length > 0) ||
            (feedData?.top_tags && feedData.top_tags.length > 0)) && (
            <div className="space-y-3 pt-2">
              {feedData?.tags && feedData.tags.length > 0 ? (
                <div>
                  <p className="mb-2 font-sans text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
                    Moods
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feedData.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`${isMeditation ? '/meditations' : '/confessions'}?tag=${encodeURIComponent(tag)}`}
                        className="text-secondary rounded-xs border border-[#EBE4D5] bg-[#FAF7F2] px-3 py-1 text-xs hover:border-current"
                        style={{ color: themeColor }}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
              {feedData?.top_tags && feedData.top_tags.length > 0 ? (
                <div>
                  <p className="mb-2 font-sans text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
                    What listeners felt
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feedData.top_tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-secondary rounded-xs border border-[#EBE4D5] bg-[#FAF7F2] px-3 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
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
            onEnded={handleAudioEnded}
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
            <div className="w-56 space-y-2 sm:w-64">
              <DynamicActionButton
                text="Rate & Reflect"
                onClick={(e) => {
                  if (!isAuthenticated || user?.is_guest) {
                    handleReflectClick(e);
                    return;
                  }
                  router.push(`/details/${storyId}/reflect`);
                }}
                bgColor={themeColor}
                textColor="white"
                fullWidth
              />
              <p className="text-secondary text-center text-xs sm:text-sm">
                Share and continue after you rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
