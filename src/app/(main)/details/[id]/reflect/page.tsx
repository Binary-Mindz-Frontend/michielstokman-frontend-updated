/* eslint-disable react-hooks/incompatible-library */
'use client';

import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicSectionHeader from '@/components/main/DynamicSectionHeader/DynamicSectionHeader';
import GrowthSlider from '@/components/main/GrowthSlider/GrowthSlider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubmitStoryFeedbackMutation } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ShareSection from './_components/ShareSection/ShareSection';

//  Zod Schema
const resonanceSchema = z.object({
  resonanceScore: z.number().min(0).max(10),
  selectedTags: z.array(z.string()).optional(),
  thought: z.string().optional(),
  feedbackTag: z.string().optional(),
});

type ResonanceFormData = z.infer<typeof resonanceSchema>;

//  Static Data
const FEEDBACK_TAGS = ['Love this', 'More like this', 'Too Intense', 'Not my vibe'];

const HIGH_TAGS = [
  { emoji: '🔥', label: 'Voice' },
  { emoji: '❤️', label: 'Emotional Arc' },
  { emoji: '✨', label: 'Liberation Moment' },
  { emoji: '⚡', label: 'Energy Shift' },
  { emoji: '🤗', label: 'Felt Seen' },
];

const LOW_TAGS = [{ emoji: '🔵', label: "Didn't Connect" }];

//  Helpers
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

//  Component
export default function ResonanceReflection() {
  const params = useParams();
  const router = useRouter();
  const storyId = params?.id as string;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackTag, setFeedbackTag] = useState<string>('');

  // RTK Query Mutation Hook
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

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    setValue('selectedTags', updated, { shouldValidate: true });
  };

  const handleFeedbackTag = (tag: string) => {
    const updated = feedbackTag === tag ? '' : tag;
    setFeedbackTag(updated);
    setValue('feedbackTag', updated, { shouldValidate: true });
  };

  // --- API Submit Function ---
  const onSubmit = async (data: ResonanceFormData) => {
    try {
      const payload = {
        storyId,
        body: {
          touch_score: data.resonanceScore,
          star_rating: 0,
          resonance_tags: selectedTags,
          reaction: feedbackTag,
          feedback_text: data.thought || '',
        },
      };

      const response = await submitFeedback(payload).unwrap();

      if (response.success) {
        toast.success(response.message || 'Feedback submitted successfully!');
        router.push(`/details/${storyId}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const dynamicTags = getDynamicTags(resonanceScore);
  const sliderLabel = getSliderLabel(resonanceScore);
  const dynamicQuestion = getDynamicQuestion(resonanceScore);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <motion.div variants={FADE_IN_UP_ITEM}>
        <DynamicSectionHeader
          title="Resonance Reflection"
          description="The Morning I Stopped Running"
        />
      </motion.div>

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

        {/* Star Rating Section */}
        <motion.div variants={FADE_IN_UP_ITEM} className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-2xl leading-none text-amber-400">
              ★
            </span>
          ))}
          <span className="text-dark-primary ml-1 font-medium">4.3</span>
        </motion.div>

        {/* Dynamic Tags */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-3">
          <label className="block font-medium">{dynamicQuestion}</label>
          <div className="flex flex-wrap gap-2">
            {dynamicTags.map((tag) => (
              <Button
                key={tag.label}
                type="button"
                onClick={() => toggleTag(tag.label)}
                className={cn(
                  'rounded-sm border bg-transparent px-4 py-2 text-sm transition-all hover:bg-transparent',
                  selectedTags.includes(tag.label)
                    ? 'border-primary/50 text-primary'
                    : 'border-primary/20 text-secondary',
                )}
              >
                {tag.emoji} {tag.label}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
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
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-3">
          <div className="flex w-full gap-3">
            <Button type="submit" className="btn-styles flex-1" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="btn-styles border-primary/20 text-primary hover:text-primary/80 hover:bg-primary/10 flex-1"
            >
              Skip
            </Button>
          </div>
          <p className="text-secondary text-center text-sm">
            All submissions are reviewed with care before publishing.
          </p>
        </motion.div>

        {/* Feedback Tags */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="border-primary/10 space-y-3 border-t pt-6"
        >
          <label className="block font-medium">How did this feel?</label>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_TAGS.map((tag) => (
              <Button
                key={tag}
                type="button"
                onClick={() => handleFeedbackTag(tag)}
                className={cn(
                  'rounded-sm border bg-transparent px-4 py-2 text-sm transition-all hover:bg-transparent',
                  feedbackTag === tag
                    ? 'border-primary/50 text-primary'
                    : 'border-primary/20 text-secondary',
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Social Share Section */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <ShareSection />
        </motion.div>
      </form>
    </motion.section>
  );
}
