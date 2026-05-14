'use client';

import { Button } from '@/components/ui/button';

import { useGetStoryDetailsQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';

import { motion } from 'framer-motion';

import { ArrowLeft } from 'lucide-react';

import Image from 'next/image';

import Link from 'next/link';

import { useParams } from 'next/navigation';

import { useMemo, useState } from 'react';

import StoryDetailSkeleton from '@/components/main/Skeletons/StoryDetailSkeleton';
import StoryPlayer from '../StoryPlayer/StoryPlayer';

export default function StoryDetailPage() {
  const params = useParams();

  const storyId = params?.id as string;

  const { data: response, isLoading } = useGetStoryDetailsQuery(storyId);

  const feedData = response?.data;

  // audio current and duration time tracker
  const [audioProgress, setAudioProgress] = useState({ current: 0, duration: 0 });

  // Total words of the story
  const totalWordsCount = useMemo(() => {
    return feedData?.story_text?.split(/\s+/).length || 0;
  }, [feedData?.story_text]);

  // Paragraphs of the story
  const paragraphs = useMemo(() => {
    return feedData?.story_text?.split('\n').filter((p: string) => p.trim() !== '') || [];
  }, [feedData?.story_text]);

  if (isLoading) return <StoryDetailSkeleton />;

  // Word Counter
  let wordCounter = 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={
            feedData?.cover_image_url ||
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200'
          }
          alt={feedData?.title || 'Story'}
          fill
          className="object-cover"
          priority
        />

        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(250, 247, 245, 0) -39.16%, #FAF7F5 93.71%)',
          }}
        />

        <div className="relative z-20 container mx-auto pt-12">
          <Link
            href="/"
            className="text-primary inline-flex items-center gap-1 text-base font-medium hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={1.5} /> Back
          </Link>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-40 w-full max-w-400 px-4">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-dark-primary text-sm font-medium tracking-wider uppercase">
                {feedData?.story_type || 'Story'}
              </span>

              <div className="bg-dark-primary/30 h-0.5 w-12" />
            </div>

            {feedData?.avg_rating && (
              <div className="bg-primary rounded px-3 py-1.5 text-xs font-semibold text-white uppercase">
                Rating {feedData?.avg_rating}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="w-full space-y-4">
              <h1 className="text-dark-primary font-serif text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                {feedData?.title}
              </h1>
              <div className="text-secondary flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p>
                  {feedData?.author_name} • Listened to {feedData?.listened_count} times • Explicit
                </p>

                <p>
                  Resonance:{' '}
                  <span className="text-dark-primary font-semibold">
                    {feedData?.avg_resonance || '0'}
                  </span>{' '}
                  from{' '}
                  <span className="text-dark-primary font-semibold">
                    {feedData?.total_reflections || '0'}
                  </span>{' '}
                  reflections
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {feedData?.top_tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="border-primary/40 text-primary rounded-sm border bg-transparent px-4 py-2 text-xs transition-all hover:bg-transparent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Player */}

          <StoryPlayer
            story={feedData?.audio_path || ''}
            onTimeUpdateCallback={(current, duration) => setAudioProgress({ current, duration })}
          />

          {/* Paragraphs and Typewriter Effect*/}

          <div className="mx-auto w-full pt-6 md:pt-10">
            <div className="text-dark-primary space-y-8 text-lg leading-relaxed font-light">
              {paragraphs.map((paragraph: string, pIdx: number) => {
                const words = paragraph.split(/\s+/);

                return (
                  <p key={pIdx} className="flex flex-wrap gap-x-1.5">
                    {words.map((word: string, wIdx: number) => {
                      const currentWordIndex = wordCounter++;

                      const wordThreshold =
                        (audioProgress.duration / totalWordsCount) * currentWordIndex;

                      const isVisible = audioProgress.current >= wordThreshold;

                      return (
                        <motion.span
                          key={`${pIdx}-${wIdx}`}
                          initial={{ opacity: 0.1 }}
                          animate={{
                            opacity: isVisible ? 1 : 0.3,

                            color: isVisible ? '#bf7758' : '#414651',
                          }}
                          transition={{ duration: 0.2 }}
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

          <div className="flex flex-col items-center pt-10 pb-20">
            <Link href={`/details/${feedData?.id}/reflect`}>
              <Button className="btn-styles w-full sm:w-auto">Reflect on this</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
