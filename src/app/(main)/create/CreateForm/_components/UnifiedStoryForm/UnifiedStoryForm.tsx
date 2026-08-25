/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useGenerateStoryMutation, useGetVoicesQuery } from '@/redux/features/aiStory/aiStory.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { appToast } from '@/utils/appToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import * as z from 'zod';
import StoryCoverPicker from '../StoryCoverPicker/StoryCoverPicker';
import StoryVoicePicker from '../StoryVoicePicker/StoryVoicePicker';
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
  voiceName: z.string().optional(),
  useCustomVoice: z.boolean().default(false),
});

export default function UnifiedStoryForm({ category }: { category: string }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [generateStory, { isLoading: isGenerating }] = useGenerateStoryMutation();
  const { data: voicesCatalog, isLoading: isVoicesLoading } = useGetVoicesQuery();
  const isConfession = category === 'Confessions';
  const voices = voicesCatalog?.voices ?? [];

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
      voiceName: '',
      useCustomVoice: false,
    },
  });

  const contentValue = watch('content') || '';
  const selectedGrowthAreas = watch('growthAreas') || [];
  const selectedLifePhase = watch('lifePhase');
  const selectedVoiceName = watch('voiceName');

  useEffect(() => {
    if (!voicesCatalog?.voices.length) return;
    const isKnownVoice = voicesCatalog.voices.some((voice) => voice.name === selectedVoiceName);
    if (!isKnownVoice) {
      const fallback =
        voicesCatalog.voices.find((voice) => voice.name === voicesCatalog.default_voice) ||
        voicesCatalog.voices[0];
      setValue('voiceName', fallback.name);
      setValue('useCustomVoice', fallback.is_custom);
    }
  }, [voicesCatalog, selectedVoiceName, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const formattedData: Record<string, unknown> = {
        story_type: isConfession ? 'confession' : 'meditation',
        title: data?.title,
        first_name: data?.firstName,
        story_input: data?.content,
        growth_areas: data?.growthAreas,
        life_phase: data?.lifePhase,
        tags: data?.tags
          ? data.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter(Boolean)
          : [],
        high_intensity: data?.sensitiveContent,
        image_mode: coverFile ? 'user_uploaded' : 'ai_generated',
      };

      if (data?.useCustomVoice) {
        formattedData.use_custom_voice = true;
      } else if (data?.voiceName) {
        formattedData.voice_name = data.voiceName;
      }

      let res;
      if (coverFile) {
        const formData = new FormData();
        Object.entries(formattedData).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });
        formData.append('image', coverFile);
        res = await generateStory(formData).unwrap();
      } else {
        res = await generateStory(formattedData).unwrap();
      }

      if (res.success) {
        setIsSuccess(true);
        setCoverFile(null);
        reset({
          content: '',
          title: '',
          firstName: '',
          growthAreas: [],
          lifePhase: 'Deepening',
          sensitiveContent: false,
          tags: '',
          voiceName: voicesCatalog?.default_voice || voices[0]?.name || '',
          useCustomVoice: false,
        });
      }
    } catch (error: any) {
      appToast.error(error?.data?.message || 'Something went wrong!');
    }
  };

  const onInvalid = (formErrors: FieldErrors) => {
    const order = ['title', 'firstName', 'content', 'growthAreas', 'lifePhase'] as const;
    const firstKey = order.find((key) => formErrors[key]);
    const firstMessage = firstKey ? formErrors[firstKey]?.message : undefined;
    appToast.error(
      typeof firstMessage === 'string' ? firstMessage : 'Please fill in the required fields.',
    );
  };

  const submitStory = handleSubmit(onSubmit, onInvalid);

  return (
    <>
      <motion.form
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        onSubmit={submitStory}
        className="space-y-6"
      >
        {/* Title Input using custom InputField */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <InputField
            label="Title"
            name="title"
            placeholder="Give your story a name..."
            control={control}
            error={errors.title?.message}
            required
          />
        </motion.div>

        {/* First Name Input using custom InputField */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <InputField
            label="Your first name"
            name="firstName"
            placeholder="Your first name..."
            control={control}
            error={errors.firstName?.message}
            required
          />
        </motion.div>

        {/* Content Textarea using custom TextAreaField */}
        <motion.div variants={FADE_IN_UP_ITEM}>
          <TextAreaField
            label={isConfession ? 'Your story' : 'Meditation script'}
            name="content"
            placeholder={
              isConfession
                ? 'Start where it hurts. Or where it healed.'
                : 'Write in second person (you)...'
            }
            control={control}
            error={errors.content?.message}
            required
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

        <motion.div variants={FADE_IN_UP_ITEM}>
          <StoryVoicePicker
            voices={voices}
            selectedName={selectedVoiceName || ''}
            onSelect={(voice) => {
              setValue('voiceName', voice.name);
              setValue('useCustomVoice', voice.is_custom);
              trigger('voiceName');
            }}
            error={errors.voiceName?.message}
            isLoading={isVoicesLoading}
          />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM}>
          <StoryCoverPicker coverFile={coverFile} onFileChange={setCoverFile} />
        </motion.div>

        {/* Growth Areas Pills */}
        <motion.div variants={FADE_IN_UP_ITEM} className="space-y-3">
          <label className="block font-sans text-sm font-semibold">
            Growth areas (choose all that resonate)
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
            Life phase this speaks to
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
            label="Tags (optional)"
            name="tags"
            placeholder="Add words that describe your story..."
            control={control}
            error={errors.tags?.message}
          />
          <p className="font-sans text-xs text-[#888]">
            Examples: vulnerability, courage, healing, letting go...
          </p>
        </motion.div>

        {/* Sensitive Content Toggle Switch */}
        <motion.div variants={FADE_IN_UP_ITEM} className="flex items-center justify-between py-2">
          <div>
            <p className="font-sans text-sm font-bold text-[#1A1A1A]">Contains sensitive content</p>
            <p className="font-sans text-xs text-[#777]">
              Some truths are heavy. That&apos;s okay.
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
            onClick={submitStory}
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
