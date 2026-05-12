/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import SuccessModal from '../../SuccessModal/SuccessModal';

const GROWTH_AREAS = [
  'Fear & Freedom',
  'Self-Acceptance',
  'Forgiveness',
  'Letting Go',
  'Presence',
  'Inner Peace',
  'Self-Compassion',
  'Self-Discovery',
  'Rebuilding',
  'Patience',
  'Love & Connection',
  'Purpose & Meaning',
];
const LIFE_PHASES = ['Discovering', 'Building', 'Recalibrating', 'Deepening', 'Passing On'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  firstName: z.string().min(1, 'First name is required'),
  meditationScript: z.string().min(1, 'Script is required').max(5000, 'Max 5000 characters'),
  growthAreas: z.array(z.string()).min(1, 'Select at least one growth area'),
  lifePhase: z.string().min(1, 'Select a life phase'),
  tags: z.string().optional(),
  sensitiveContent: z.boolean().default(false),
});

export default function MeditationForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      meditationScript: '',
      title: '',
      firstName: '',
      growthAreas: [],
      lifePhase: 'Deepening',
      sensitiveContent: false,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const scriptContent = watch('meditationScript') || '';
  const selectedGrowthAreas = watch('growthAreas') || [];
  const selectedLifePhase = watch('lifePhase');

  const onSubmit = (data: any) => {
    console.log('Meditation Data:', data);
    setIsSuccess(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 sm:space-y-6">
          <InputField
            label="Title"
            name="title"
            placeholder="Give it a name that resonates..."
            control={control}
            error={errors.title?.message}
            required
          />
          <InputField
            label="Your first name"
            name="firstName"
            placeholder="How you'd like to be known..."
            control={control}
            error={errors.firstName?.message}
            required
          />
          <div>
            <TextAreaField
              label="Meditation Script"
              name="meditationScript"
              placeholder="Write in second person (you)..."
              control={control}
              error={errors.meditationScript?.message}
              required
              rows={6}
            />
            <div
              className={cn(
                'mt-1 text-right text-xs',
                scriptContent.length > 5000 ? 'text-error font-bold' : 'text-secondary',
              )}
            >
              {scriptContent.length}/5000
            </div>
          </div>
        </div>

        {/* Same style and logic as Confessions, but independent */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <label className="block font-medium">
              Growth areas <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {GROWTH_AREAS.map((area) => (
                <Button
                  key={area}
                  type="button"
                  onClick={() => {
                    const next = selectedGrowthAreas.includes(area)
                      ? selectedGrowthAreas.filter((a: string) => a !== area)
                      : [...selectedGrowthAreas, area];
                    setValue('growthAreas', next);
                    trigger('growthAreas');
                  }}
                  className={cn(
                    'rounded-sm border bg-transparent px-4 py-2 text-sm transition-all hover:bg-transparent',
                    selectedGrowthAreas.includes(area)
                      ? 'border-primary/50 text-primary'
                      : 'border-primary/20 text-secondary',
                  )}
                >
                  {area}
                </Button>
              ))}
            </div>
            {errors.growthAreas && (
              <p className="text-error text-xs">{errors.growthAreas.message?.toString()}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block font-medium">
              Life phase this speaks to <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LIFE_PHASES.map((phase) => (
                <Button
                  key={phase}
                  type="button"
                  onClick={() => {
                    setValue('lifePhase', phase);
                    trigger('lifePhase');
                  }}
                  className={cn(
                    'rounded-sm border bg-transparent px-4 py-2 text-sm transition-all hover:bg-transparent',
                    selectedLifePhase === phase
                      ? 'border-primary/50 text-primary'
                      : 'border-primary/20 text-secondary',
                  )}
                >
                  {phase}
                </Button>
              ))}
            </div>
            {errors.lifePhase && (
              <p className="text-error text-xs">{errors.lifePhase.message?.toString()}</p>
            )}
          </div>

          <InputField
            label="Tags"
            name="tags"
            placeholder="Vulnerability, courage, morning"
            control={control}
          />

          <div className="flex items-center justify-between border-t border-[#E5E0DA] pt-4">
            <div>
              <p className="text-lg font-medium">Contains sensitive content</p>
              <p className="text-secondary text-sm">Mature themes</p>
            </div>
            <Switch onCheckedChange={(val) => setValue('sensitiveContent', val)} />
          </div>
        </div>

        <Button
          type="submit"
          className="bg-primary/90 hover:bg-primary w-full rounded-md py-5 font-medium text-white sm:py-6 sm:text-lg"
        >
          Submit Meditation
        </Button>
      </form>

      <SuccessModal isOpen={isSuccess} onClose={() => setIsSuccess(false)} />
    </>
  );
}
