'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as z from 'zod';

export const journeySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.string().min(1, 'Price is required'),
  daysCount: z.string().min(1, 'Days count is required'),
  description: z.string().optional(),
  whatToExpect: z.string().optional(),

  days: z
    .array(
      z.object({
        dayTitle: z.string().min(1, 'Day title is required'),
        whatToDo: z.array(z.string()).min(1, 'Add at least one point'),
        whyThisExercise: z.array(z.string()).min(1, 'Add at least one point'),
      }),
    )
    .length(7),
});

export type JourneyFormValues = z.infer<typeof journeySchema>;

const tabs = ['Basic Info', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

export default function JourneyForm() {
  const [activeTab, setActiveTab] = useState('Basic Info');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JourneyFormValues>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      title: '',
      price: '',
      daysCount: '',
      description: '',
      whatToExpect: '',
      days: Array(7).fill({ dayTitle: '', whatToDo: [], whyThisExercise: [] }),
    },
  });

  const onSubmit = (data: JourneyFormValues) => {
    console.log('Final Journey Data (Backend Ready):', data);
  };

  return (
    <div className="min-h-screen w-full rounded-md bg-[#FAF7F5] p-4 md:p-6">
      <DynamicPageHeader title="Journey Management Details" />
      {/* Tabs Header */}
      <div className="no-scrollbar border-primary/10 mb-8 flex items-center overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'relative cursor-pointer px-8 py-4 text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab ? 'text-primary font-bold' : 'text-[#978279]',
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
              control={control}
              placeholder="Enter Price"
              required
              error={errors.price?.message}
            />
            <InputField
              label="Days"
              name="daysCount"
              control={control}
              placeholder="Enter Days"
              required
              error={errors.daysCount?.message}
            />
            <InputField
              label="Description"
              name="description"
              control={control}
              placeholder="Enter Description"
            />
            <InputField
              label="What to Expect"
              name="whatToExpect"
              control={control}
              placeholder="Enter What to Expect"
            />
          </div>
        )}

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
                    <DynamicListInput
                      label="What to do"
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
                    <DynamicListInput
                      label="Why this exercise"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.days?.[index]?.whyThisExercise?.message}
                    />
                  )}
                />
              </div>
            ),
        )}

        <Button type="submit" className="btn-styles w-full px-12 md:w-auto">
          Submit Journey
        </Button>
      </form>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DynamicListInput = ({ label, value, onChange, error }: any) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onChange([...value, text.trim()]);
      setText('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label} <span className="text-error">*</span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="Type a point and press Enter"
          className="border-primary/10 text-primary focus:border-primary/60 h-auto w-full rounded-md border bg-[#F5F2F0] p-3 transition-all outline-none placeholder:text-[#978279]"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-primary flex cursor-pointer items-center justify-center rounded-md px-4 text-white hover:opacity-90"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {value.map((item: string, idx: number) => (
          <div
            key={idx}
            className="border-primary/10 text-primary animate-in fade-in zoom-in flex items-center gap-2 rounded border bg-white px-3 py-1.5 text-sm duration-300"
          >
            <span>{item}</span>
            <X
              size={14}
              className="text-error cursor-pointer transition-transform hover:scale-125"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => onChange(value.filter((_: any, i: number) => i !== idx))}
            />
          </div>
        ))}
      </div>
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};
