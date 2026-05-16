/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useCreateLiberationMutation,
  useGetAllLiberationsQuery,
  useUpdateLiberationMutation,
} from '@/redux/features/admin/journeyManagement/journeyManagement.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import DynamicListInput from './_components/DynamicListInput/DynamicListInput';
import TiptapEditor from './_components/TiptapEditor/TiptapEditor';

// Schema
export const journeySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), 'Price must be a valid number'),
  description: z.string().optional(),
  whatToExpect: z.array(z.string()).optional(),
  days: z
    .array(
      z.object({
        dayTitle: z.string().min(1, 'Day title is required'),
        whatToDo: z.string().min(1, 'What to do is required'),
        whyThisExercise: z.string().min(1, 'Why this exercise is required'),
      }),
    )
    .length(7),
});

export type JourneyFormValues = z.infer<typeof journeySchema>;

const tabs = ['Basic Info', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

const tabFields: Record<string, (keyof JourneyFormValues | string)[]> = {
  'Basic Info': ['title', 'price'],
  'Day 1': ['days.0.dayTitle', 'days.0.whatToDo', 'days.0.whyThisExercise'],
  'Day 2': ['days.1.dayTitle', 'days.1.whatToDo', 'days.1.whyThisExercise'],
  'Day 3': ['days.2.dayTitle', 'days.2.whatToDo', 'days.2.whyThisExercise'],
  'Day 4': ['days.3.dayTitle', 'days.3.whatToDo', 'days.3.whyThisExercise'],
  'Day 5': ['days.4.dayTitle', 'days.4.whatToDo', 'days.4.whyThisExercise'],
  'Day 6': ['days.5.dayTitle', 'days.5.whatToDo', 'days.5.whyThisExercise'],
  'Day 7': ['days.6.dayTitle', 'days.6.whatToDo', 'days.6.whyThisExercise'],
};

export default function JourneyForm() {
  const [activeTab, setActiveTab] = useState('Basic Info');
  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;
  const isEditMode = id && id !== 'create';

  const activeTabIndex = tabs.indexOf(activeTab);
  const isLastTab = activeTab === 'Day 7';

  // Mutation & Query Hooks
  const [createLiberation, { isLoading: isCreating }] = useCreateLiberationMutation();
  const [updateLiberation, { isLoading: isUpdating }] = useUpdateLiberationMutation();

  // Get All Liberations Hook
  const { data: allLiberations } = useGetAllLiberationsQuery({
    limit: 50,
    offset: 0,
  });
  const definitions = allLiberations?.data?.definitions || allLiberations?.data || [];
  // Single liberation data find
  const singleData = Array.isArray(definitions)
    ? definitions.find((item: any) => item.id === id)
    : undefined;

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<JourneyFormValues>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      title: '',
      price: '',
      description: '',
      whatToExpect: [],
      days: Array(7).fill({ dayTitle: '', whatToDo: '', whyThisExercise: '' }),
    },
  });

  // Use Effect
  useEffect(() => {
    if (isEditMode && singleData) {
      reset({
        title: singleData.title || '',
        price: String(singleData.price || ''),
        description: singleData.description || '',
        whatToExpect: singleData.what_to_expect || [],
        days: Array(7)
          .fill(null)
          .map((_, index) => {
            const backendDay = singleData.days?.find((d: any) => d.day_number === index + 1);
            return {
              dayTitle: backendDay?.day_theme || '',
              whatToDo: backendDay?.exercise_text || '',
              whyThisExercise: backendDay?.why_text || '',
            };
          }),
      });
    }
  }, [isEditMode, singleData, reset]);

  // Submit Handler
  const onSubmit = async (data: JourneyFormValues) => {
    const toastId = toast.loading(isEditMode ? 'Updating journey...' : 'Creating journey...');
    try {
      const payload = {
        title: data.title,
        description: data.description || '',
        price: Number(data.price),
        what_to_expect:
          data.whatToExpect && data.whatToExpect.length > 0 ? data.whatToExpect : [''],
        days: data.days.map((dayItem, index) => ({
          day: index + 1,
          title: dayItem.dayTitle || '',
          exercise_text: dayItem.whatToDo && dayItem.whatToDo !== '<p></p>' ? dayItem.whatToDo : '',
          why_text:
            dayItem.whyThisExercise && dayItem.whyThisExercise !== '<p></p>'
              ? dayItem.whyThisExercise
              : '',
        })),
      };

      let response;
      if (isEditMode) {
        response = await updateLiberation({ id, data: payload }).unwrap();
      } else {
        response = await createLiberation(payload).unwrap();
      }

      if (response.success || response.status === 200) {
        toast.success(
          response.message || `Journey ${isEditMode ? 'updated' : 'created'} successfully!`,
          { id: toastId },
        );
        router.push('/dashboard/journey-management');
      }
    } catch (error: any) {
      console.error('Validation Error Details:', error);
      const backendErrorMsg =
        error?.data?.detail?.[0]?.msg || error?.data?.detail || error?.data?.message;
      toast.error(backendErrorMsg || 'Something went wrong!', { id: toastId });
    }
  };

  const handleNext = async () => {
    const fields = tabFields[activeTab] as Parameters<typeof trigger>[0];
    const isValid = await trigger(fields);
    if (!isValid) return;
    setActiveTab(tabs[activeTabIndex + 1]);
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="min-h-screen w-full rounded-md bg-[#FAF7F5] p-4 md:p-6">
      <DynamicPageHeader title={isEditMode ? 'Journey Details Edit' : 'Journey Details Create'} />

      {/* Tabs Header */}
      <div className="no-scrollbar border-primary/10 mb-8 flex items-center overflow-x-auto border-b">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            disabled={i > activeTabIndex && !isEditMode}
            className={cn(
              'relative cursor-pointer px-8 py-4 text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab ? 'text-primary font-bold' : 'text-[#978279]',
              i > activeTabIndex && !isEditMode && 'cursor-not-allowed opacity-40',
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full" />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Basic Info Tab ── */}
        {activeTab === 'Basic Info' && (
          <div className="space-y-6">
            <InputField
              label="Title"
              name="title"
              control={control}
              placeholder="Enter Title"
              required
              error={errors.title?.message}
            />
            <InputField
              label="Price"
              name="price"
              type="number"
              control={control}
              placeholder="Enter Price"
              required
              error={errors.price?.message}
            />
            <TextAreaField
              label="Description"
              name="description"
              control={control}
              placeholder="Enter Description"
              error={errors.description?.message}
            />
            <Controller
              name="whatToExpect"
              control={control}
              render={({ field }) => (
                <DynamicListInput
                  label="What to Expect"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  error={
                    Array.isArray(errors.whatToExpect)
                      ? errors.whatToExpect[0]?.message
                      : (errors.whatToExpect as { message?: string } | undefined)?.message
                  }
                />
              )}
            />
          </div>
        )}

        {/* ── Day Tabs ── */}
        {tabs.slice(1).map(
          (tab, index) =>
            activeTab === tab && (
              <div key={tab} className="space-y-6">
                <InputField
                  label="Title"
                  name={`days.${index}.dayTitle`}
                  control={control}
                  placeholder={`Enter Day ${index + 1} Title`}
                  required
                  error={errors.days?.[index]?.dayTitle?.message}
                />
                <Controller
                  name={`days.${index}.whatToDo`}
                  control={control}
                  render={({ field }) => (
                    <TiptapEditor
                      label="What to Do"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.days?.[index]?.whatToDo?.message}
                    />
                  )}
                />
                <Controller
                  name={`days.${index}.whyThisExercise`}
                  control={control}
                  render={({ field }) => (
                    <TiptapEditor
                      label="Why This Exercise"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.days?.[index]?.whyThisExercise?.message}
                    />
                  )}
                />
              </div>
            ),
        )}
        {/* ── Action Button ── */}
        {isLastTab ? (
          <Button type="submit" className="btn-styles" disabled={isLoading}>
            {isLoading ? 'Submitting...' : isEditMode ? 'Update Journey' : 'Submit Journey'}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} className="btn-styles">
            Next
          </Button>
        )}
      </form>
    </div>
  );
}
