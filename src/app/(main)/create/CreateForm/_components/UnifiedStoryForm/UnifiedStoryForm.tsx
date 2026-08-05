/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useGenerateStoryMutation } from '@/redux/features/aiStory/aiStory.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import SuccessModal from '../SuccessModal/SuccessModal';

const GROWTH_AREAS = [
  'Fear & Freedom',
  'Self-Acceptance',
  'Forgiveness',
  'Letting Go',
  'Presence',
  'Self-Compassion',
  'Rebuilding',
  'Patience',
  'Love & Connection',
  'Purpose & Meaning',
];
const LIFE_PHASES = ['Discovering', 'Building', 'Recalibrating', 'Deepening', 'Passing On'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  firstName: z.string().min(1, 'First name is required'),
  content: z.string().min(1, 'Content is required').max(8000, 'Max 8000 characters'),
  growthAreas: z.array(z.string()).min(1, 'Select at least one growth area'),
  lifePhase: z.string().min(1, 'Select a life phase'),
  tags: z.string().optional(),
  sensitiveContent: z.boolean().default(false),
});

export default function UnifiedStoryForm({ category }: { category: string }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [generateStory, { isLoading: isGenerating }] = useGenerateStoryMutation();
  const isConfession = category === 'Confessions';

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
      title: '',
      firstName: '',
      growthAreas: [],
      lifePhase: 'Deepening',
      sensitiveContent: false,
      tags: '',
    },
  });

  const contentValue = watch('content') || '';
  const selectedGrowthAreas = watch('growthAreas') || [];
  const selectedLifePhase = watch('lifePhase');

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        story_type: isConfession ? 'confession' : 'meditation',
        title: data?.title,
        first_name: data?.firstName,
        story_input: data?.content,
        growth_areas: data?.growthAreas,
        life_phase: data?.lifePhase,
        tags: data?.tags ? data?.tags.split(',').map((tag: string) => tag.trim()) : [],
        high_intensity: data?.sensitiveContent,
      };

      const res = await generateStory(formattedData).unwrap();

      if (res.success) {
        setIsSuccess(true);

        reset({
          content: '',
          title: '',
          firstName: '',
          growthAreas: [],
          lifePhase: 'Deepening',
          sensitiveContent: false,
          tags: '',
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <>
      <motion.form
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Title Input using custom InputField */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <InputField
            label="Title"
            name="title"
            placeholder="Give Your Story A Name..."
            control={control}
            error={errors.title?.message}
            required
          />
        </motion.div>

        {/* First Name Input using custom InputField */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <InputField
            label="Your First Name"
            name="firstName"
            placeholder="Give Your Story A Name..."
            control={control}
            error={errors.firstName?.message}
            required
          />
        </motion.div>

        {/* Content Textarea using custom TextAreaField */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <TextAreaField
            label={isConfession ? 'Your Story' : 'Meditation Script'}
            name="content"
            placeholder={
              isConfession
                ? 'Start Where It Hurts. Or Where It Healed.'
                : 'Write in second person (you)...'
            }
            control={control}
            error={errors.content?.message}
            rows={5}
          />
          <div
            className={cn(
              'mt-1 text-right font-sans text-xs',
              contentValue.length > 8000 ? 'font-bold text-[#D22D4C]' : 'font-semibold text-[#888]',
            )}
          >
            {contentValue.length}/8000
          </div>
        </motion.div>

        {/* Growth Areas Pills */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-3">
          <label className="block font-sans text-sm font-semibold">
            Growth Areas (Choose All That Resonate)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {GROWTH_AREAS.map((area) => {
              const isSelected = selectedGrowthAreas.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => {
                    const next = isSelected
                      ? selectedGrowthAreas.filter((a: string) => a !== area)
                      : [...selectedGrowthAreas, area];
                    setValue('growthAreas', next);
                    trigger('growthAreas');
                  }}
                  className={cn(
                    'cursor-pointer rounded-sm border bg-transparent px-4 py-2 font-sans text-xs font-semibold transition-all duration-300',
                    isSelected
                      ? 'border-[#EEA13D] font-semibold text-[#EEA13D]'
                      : 'border-[#B39B7F] text-[#B39B7F] hover:border-[#EEA13D]/50',
                  )}
                >
                  {area}
                </button>
              );
            })}
          </div>
          {errors.growthAreas && (
            <p className="font-sans text-xs font-semibold text-[#D22D4C]">
              {errors.growthAreas.message?.toString()}
            </p>
          )}
        </motion.div>

        {/* Life Phase Pills */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-3">
          <label className="block font-sans text-sm font-semibold text-[#1A1A1A]">
            Life Phase This Speaks To
          </label>
          <div className="flex flex-wrap gap-2.5">
            {LIFE_PHASES.map((phase) => {
              const isSelected = selectedLifePhase === phase;
              return (
                <button
                  key={phase}
                  type="button"
                  onClick={() => {
                    setValue('lifePhase', phase);
                    trigger('lifePhase');
                  }}
                  className={cn(
                    'cursor-pointer rounded-sm border bg-transparent px-4 py-2 font-sans text-xs font-semibold transition-all duration-300',
                    isSelected
                      ? 'border-[#EEA13D] font-semibold text-[#EEA13D]'
                      : 'border-[#B39B7F] text-[#B39B7F] hover:border-[#EEA13D]/50',
                  )}
                >
                  {phase}
                </button>
              );
            })}
          </div>
          {errors.lifePhase && (
            <p className="font-sans text-xs font-semibold text-[#D22D4C]">
              {errors.lifePhase.message?.toString()}
            </p>
          )}
        </motion.div>

        {/* Tags Input using custom InputField */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-1">
          <InputField
            label="Tags (Optional)"
            name="tags"
            placeholder="Add Words That Describe Your Story..."
            control={control}
            error={errors.tags?.message}
          />
          <p className="font-sans text-xs text-[#888]">
            Examples: Vulnerability, Courage, Healing, Letting Go...
          </p>
        </motion.div>

        {/* Sensitive Content Toggle Switch */}
        <motion.div variants={FADE_IN_UP_ITEM} className="flex items-center justify-between py-2">
          <div>
            <p className="font-sans text-sm font-bold text-[#1A1A1A]">Contains Sensitive Content</p>
            <p className="font-sans text-xs text-[#777]">
              Some Truths Are Heavy. That&apos;s Okay.
            </p>
          </div>
          <Switch
            className="cursor-pointer"
            checked={watch('sensitiveContent')}
            onCheckedChange={(val) => setValue('sensitiveContent', val)}
          />
        </motion.div>

        {/* Submit Action Button using DynamicActionButton */}
        <motion.div variants={FADE_IN_UP_ITEM} className="pt-2">
          <DynamicActionButton
            text={
              isGenerating
                ? 'Submitting...'
                : `Submit ${isConfession ? 'Confession' : 'Meditation'}`
            }
            onClick={handleSubmit(onSubmit)}
            bgColor="#D22D4C"
            textColor="white"
            fullWidth
          />
          <p className="mt-2.5 text-center font-sans text-xs font-semibold text-[#777]">
            Every Submission Is Reviewed With Care And Compassion.
          </p>
        </motion.div>
      </motion.form>

      <SuccessModal isOpen={isSuccess} onClose={() => setIsSuccess(false)} category={category} />
    </>
  );
}
