/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/main/DynamicBackButton/DynamicBackButton';
import DynamicSkipButton from '@/components/main/DynamicSkipButton/DynamicSkipButton';
import GrowthSlider from '@/components/main/GrowthSlider/GrowthSlider';
import { cn } from '@/lib/utils';

import { useCurrentUser, useIsAuthenticated } from '@/redux/features/auth/authSlice';
import {
  useGetStoryDetailsQuery,
  useSubmitStoryFeedbackMutation,
} from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { useAppSelector } from '@/redux/hooks';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';

import LoginRequiredModal from '@/app/(main)/create/CreateForm/_components/LoginRequiredModal/LoginRequiredModal';

import brushTextBg from '@/assets/shared/brush-text-bg.png';
import reflectCollageImg from '@/assets/reflect/reflect-object.png';
import vectorUnderline from '@/assets/reflect/reflect-vector.png';

// Zod Schema
const resonanceSchema = z.object({
  resonanceScore: z.number().min(0).max(10),
  selectedTags: z.array(z.string()).optional(),
  thought: z.string().optional(),
  feedbackTag: z.string().optional(),
});

type ResonanceFormData = z.infer<typeof resonanceSchema>;

// Static Data
const FEEDBACK_TAGS = ['Love this', 'More like this', 'Too Intense', 'Not my vibe'];

// Message Mapping
const FEEDBACK_MESSAGES: Record<string, string> = {
  'Love this': 'I absolutely love this story! It really spoke to me.',
  'More like this': "I'd love to read more content like this. Great work!",
  'Too Intense': 'This was quite intense and powerful for me today.',
  'Not my vibe': "This one didn't quite resonate with me this time.",
};

const HIGH_TAGS = [
  { emoji: '🔥', label: 'Voice' },
  { emoji: '❤️', label: 'Emotional Arc' },
  { emoji: '✨', label: 'Liberation Moment' },
  { emoji: '⚡', label: 'Energy Shift' },
  { emoji: '🤗', label: 'Felt Seen' },
];

const LOW_TAGS = [{ emoji: '🔵', label: "Didn't Connect" }];

// Helpers
const getSliderLabel = (value: number): string => {
  if (value === 0) return 'Closed';
  if (value <= 5) return 'Quiet';
  if (value < 10) return 'Open';
  return 'Alive';
};

const getDynamicQuestion = (value: number): string => {
  if (value === 0) return "What felt heavy or didn't land today?";
  if (value <= 5) return 'What resonated a bit, and what felt off or distant?';
  return 'Which moment hit deepest?';
};

const getDynamicTags = (value: number) => {
  if (value === 0) return LOW_TAGS;
  return HIGH_TAGS;
};

export default function ResonanceReflection() {
  const params = useParams();
  const router = useRouter();
  const storyId = params?.id as string;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackTag, setFeedbackTag] = useState<string>('');
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const isAuthenticated = useAppSelector(useIsAuthenticated);
  const user = useAppSelector(useCurrentUser) as any;
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: response } = useGetStoryDetailsQuery(storyId, {
    skip: !storyId,
  });

  const feedData = response?.data;
  const isMeditation = feedData?.story_type === 'meditation';
  const themeColor = isMeditation ? '#E9A139' : '#D22D4C';
  const heroImageSrc = feedData?.cover_image_url || reflectCollageImg;

  const [submitFeedback, { isLoading }] = useSubmitStoryFeedbackMutation();

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResonanceFormData>({
    resolver: zodResolver(resonanceSchema),
    mode: 'onChange',
    defaultValues: {
      resonanceScore: 5,
      selectedTags: [],
      thought: '',
      feedbackTag: '',
    },
  });

  const resonanceScore = watch('resonanceScore');

  if (!storyId) return null;

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    setValue('selectedTags', updated, { shouldValidate: true });
  };

  const handleFeedbackTag = (tag: string) => {
    const isDeselecting = feedbackTag === tag;
    const updatedTag = isDeselecting ? '' : tag;

    setFeedbackTag(updatedTag);
    setValue('feedbackTag', updatedTag, { shouldValidate: true });

    const messageToSet = isDeselecting ? '' : FEEDBACK_MESSAGES[tag] || tag;
    setValue('thought', messageToSet, { shouldValidate: true });
  };

  const onSubmit = async (data: ResonanceFormData) => {
    if (!isAuthenticated || user?.is_guest) {
      setShowLoginModal(true);
      return;
    }
    try {
      const payload = {
        storyId,
        body: {
          touch_score: data.resonanceScore,
          star_rating: starRating,
          resonance_tags: selectedTags,
          reaction: feedbackTag,
          feedback_text: data.thought || '',
        },
      };

      const res = await submitFeedback(payload).unwrap();

      if (res.success) {
        toast.success(res.message || 'Feedback submitted successfully!');
        router.push(`/details/${storyId}/share`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const dynamicTags = getDynamicTags(resonanceScore);
  const sliderLabel = getSliderLabel(resonanceScore);
  const dynamicQuestion = getDynamicQuestion(resonanceScore);

  return (
    <div className="min-h-screen pb-12">
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          router.push('/');
        }}
        redirectUrl={`/login?redirect=${encodeURIComponent(`/details/${storyId}/reflect`)}`}
      />

      {/* Hero Section matching Screenshot Design */}
      <div className="mx-auto w-full max-w-350 px-4 pt-4 pb-8">
        <div className="mb-6 sm:mb-8">
          <DynamicBackButton href={`/details/${storyId}`} bgColor={themeColor} />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={FADE_IN_UP_CONTAINER}
          className="flex w-full flex-col items-center justify-between gap-8 md:flex-row md:items-center"
        >
          {/* LEFT COLUMN: Resonance Reflection Title & Brush Subtitle */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="flex w-full flex-col items-start md:w-1/2"
          >
            {/* Title */}
            <div className="font-edo relative leading-none font-medium uppercase">
              <h1 className="-rotate-3 transform text-3xl tracking-wider sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                <span className="block text-[#4D6E26]">RESONANCE</span>
                <span className="relative block text-[#E81A66]">
                  REFLECTION
                  {/* Decorative drawn white heart */}
                  <span className="absolute -top-3 -right-6 font-sans text-2xl font-light text-[#E81A66] sm:-top-5 sm:-right-8 sm:text-4xl">
                    ♡
                  </span>
                </span>
              </h1>

              {/* Purple Underline Stroke */}
              <div className="relative mt-2 h-4 w-full max-w-70 sm:max-w-85">
                <Image src={vectorUnderline} alt="underline" fill className="object-contain" />
              </div>
            </div>

            {/* Brush Stroke Subtitle */}
            <div className="relative mt-6 flex min-h-18 w-full max-w-[320px] -rotate-1 transform items-center justify-center sm:mt-8 sm:min-h-22.5 sm:max-w-105">
              <div className="absolute inset-0 h-full w-full">
                <Image src={brushTextBg} alt="Brush background" fill className="object-fill" />
              </div>

              <p className="relative z-10 px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-white uppercase sm:px-6 sm:text-sm">
                {feedData?.title || 'THE MORNING I STOPPED RUNNING'}
              </p>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Hero Collage Image with Torn Border */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="relative flex w-full justify-center md:w-1/2"
          >
            <div className="relative h-80 w-full max-w-85 shrink-0 sm:h-112.5 sm:max-w-125 md:max-w-150 lg:h-120 lg:max-w-170 xl:h-150 xl:max-w-187.5">
              <Image
                src={heroImageSrc}
                alt={feedData?.title || 'Reflect Collage'}
                fill
                className="object-contain"
                priority
                unoptimized={typeof feedData?.cover_image_url === 'string'}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Original Reflection Form Container */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="mx-auto max-w-3xl px-4 py-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Slider Section */}
          <motion.div variants={FADE_IN_UP_ITEM} className="space-y-3">
            <label className="block font-medium">
              How much did this touch or open something in you right now?
            </label>
            <GrowthSlider
              label={sliderLabel}
              value={resonanceScore}
              onChange={(val) => {
                setValue('resonanceScore', val, { shouldValidate: true });
                setSelectedTags([]);
                setValue('selectedTags', []);
              }}
            />
          </motion.div>

          {/* Star Rating, Question & Soft Gold Pill Badges Section matching Screenshot */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="flex flex-col items-center justify-center space-y-4 pt-4 pb-2 text-center"
          >
            {/* Centered 5 Golden Stars with Score */}
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setStarRating(star)}
                  className="cursor-pointer p-0.5 transition-transform hover:scale-110 active:scale-95"
                >
                  <span
                    className={cn(
                      'text-2xl leading-none transition-colors sm:text-3xl',
                      (hoverRating || starRating) >= star ? 'text-[#F5B400]' : 'text-gray-300',
                    )}
                  >
                    ★
                  </span>
                </button>
              ))}

              <span className="ml-2 font-sans text-base font-bold text-[#1A1A1A]">
                {(hoverRating || starRating).toFixed(1)}
              </span>
            </div>

            {/* Centered Dynamic Question */}
            <h3 className="max-w-xl font-serif text-lg leading-tight font-bold text-[#1A1A1A] sm:text-2xl">
              {dynamicQuestion}
            </h3>

            {/* Rows of Soft-Gold Warm Paper Pill Badges */}
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-2">
              {/* Row 1: Dynamic Resonance Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {dynamicTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.label);
                  return (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => toggleTag(tag.label)}
                      className={cn(
                        'cursor-pointer rounded-sm border px-4 py-1.5 text-xs font-medium shadow-2xs transition-all sm:text-sm',
                        isSelected
                          ? 'border-[#E81A66] bg-[#FFEBF0] text-[#A60C38]'
                          : 'border-[#DFB54C] bg-[#F8DF94] text-[#4A3408] hover:bg-[#f5d77f]',
                      )}
                    >
                      {tag.emoji} {tag.label}
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Feedback Tags with "How did this feel?" label */}
              <div className="flex w-full flex-col items-center justify-center gap-2 pt-1">
                <label className="block font-sans text-xs font-semibold text-[#555] sm:text-sm">
                  How did this feel?
                </label>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {FEEDBACK_TAGS.map((tag, idx) => {
                    const isSelected = feedbackTag === tag;
                    // Color highlights matching screenshot borders
                    const activeColor =
                      idx % 2 === 0
                        ? 'border-[#E81A66] bg-[#FFEBF0] text-[#A60C38] '
                        : 'border-[#8B5CF6] bg-[#F5F3FF] text-[#5B21B6] ';

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleFeedbackTag(tag)}
                        className={cn(
                          'cursor-pointer rounded-sm border px-4 py-1.5 text-xs font-medium shadow-2xs transition-all sm:text-sm',
                          isSelected
                            ? activeColor
                            : 'border-[#DFB54C] bg-[#F8DF94] text-[#4A3408] hover:bg-[#f5d77f]',
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={FADE_IN_UP_ITEM} className="mt-4">
            <TextAreaField
              label="Share a thought"
              name="thought"
              control={control}
              placeholder="Share a thought (optional)...."
              error={errors.thought?.message}
              rows={5}
            />
          </motion.div>

          {/* Submit / Skip Buttons */}
          <motion.div
            variants={FADE_IN_UP_ITEM}
            className="flex items-center justify-center gap-4 pt-4 sm:gap-6"
          >
            <div className="w-48 sm:w-56">
              <DynamicActionButton
                type="submit"
                text={isLoading ? 'Submitting...' : 'Submit'}
                bgColor={themeColor}
                textColor="white"
                fullWidth
                disabled={isLoading}
              />
            </div>

            <div className="w-48 sm:w-56">
              <DynamicSkipButton
                text="Skip"
                onClick={() => router.push(`/details/${storyId}/share`)}
                borderColor={themeColor}
                textColor={themeColor}
                fullWidth
              />
            </div>
          </motion.div>
        </form>
      </motion.section>
    </div>
  );
}
