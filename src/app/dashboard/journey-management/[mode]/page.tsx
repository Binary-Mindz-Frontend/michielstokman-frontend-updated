'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCreateLiberationMutation } from '@/redux/features/admin/journeyManagement/journeyManagement.api';
import { zodResolver } from '@hookform/resolvers/zod';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, List, ListOrdered, Plus, UnderlineIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// ১. ব্যাকএন্ডের রিকোয়ার্ড স্কিমা অনুযায়ী Zod স্কিমা মডিফাই করা হলো
export const journeySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), 'Price must be a valid number'),
  description: z.string().optional(),
  whatToExpect: z.array(z.string()).optional(),
  setupInstructions: z.array(z.string()).optional(),

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

// ট্যাব ওয়াইজ ভ্যালিডেশন ফিল্ডস থেকে বাড়তি ফিল্ড রিমুভড
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

  const activeTabIndex = tabs.indexOf(activeTab);
  const isLastTab = activeTab === 'Day 7';

  // Mutation Hook
  const [createLiberation, { isLoading }] = useCreateLiberationMutation();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<JourneyFormValues>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      title: '',
      price: '',
      description: '',
      whatToExpect: [],
      setupInstructions: [],
      days: Array(7).fill({ dayTitle: '', whatToDo: '', whyThisExercise: '' }),
    },
  });

  // ২. সাবমিট হ্যান্ডলারে শুধু রিকোয়ার্ড ডেটা স্ট্রাকচার পাস করা হয়েছে
  const onSubmit = async (data: JourneyFormValues) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || '',
        price: Number(data.price), // ব্যাকএন্ড স্কিমা অনুযায়ী ইন্টিজার বা নাম্বার
        what_to_expect:
          data.whatToExpect && data.whatToExpect.length > 0 ? data.whatToExpect : [''],
        setup_instructions:
          data.setupInstructions && data.setupInstructions.length > 0
            ? data.setupInstructions
            : [''],
        days: data.days.map((dayItem, index) => ({
          day: index + 1, // দিন গণনা ১ থেকে শুরু
          title: dayItem.dayTitle || '',
          exercise_text: dayItem.whatToDo && dayItem.whatToDo !== '<p></p>' ? dayItem.whatToDo : '',
          why_text:
            dayItem.whyThisExercise && dayItem.whyThisExercise !== '<p></p>'
              ? dayItem.whyThisExercise
              : '',
        })),
      };

      const response = await createLiberation(payload).unwrap();

      if (response.success || response.status === 200) {
        toast.success(response.message || 'Journey created successfully!');
        router.push('/dashboard/journey-management');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Validation Error Details:', error);
      const backendErrorMsg =
        error?.data?.detail?.[0]?.msg || error?.data?.detail || error?.data?.message;
      toast.error(backendErrorMsg || 'Something went wrong!');
    }
  };

  const handleNext = async () => {
    const fields = tabFields[activeTab] as Parameters<typeof trigger>[0];
    const isValid = await trigger(fields);
    if (!isValid) return;
    setActiveTab(tabs[activeTabIndex + 1]);
  };

  return (
    <div className="min-h-screen w-full rounded-md bg-[#FAF7F5] p-4 md:p-6">
      <DynamicPageHeader title="Journey Details Create" />

      {/* Tabs Header */}
      <div className="no-scrollbar border-primary/10 mb-8 flex items-center overflow-x-auto border-b">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            disabled={i > activeTabIndex}
            className={cn(
              'relative cursor-pointer px-8 py-4 text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab ? 'text-primary font-bold' : 'text-[#978279]',
              i > activeTabIndex && 'cursor-not-allowed opacity-40',
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
            <Controller
              name="setupInstructions"
              control={control}
              render={({ field }) => (
                <DynamicListInput
                  label="Setup Instructions"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  error={
                    Array.isArray(errors.setupInstructions)
                      ? errors.setupInstructions[0]?.message
                      : (errors.setupInstructions as { message?: string } | undefined)?.message
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
            {isLoading ? 'Submitting...' : 'Submit Journey'}
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

// DynamicListInput Component
const DynamicListInput = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string[];
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string[]) => void;
  error?: string;
}) => {
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
        {value.map((item, idx) => (
          <div
            key={idx}
            className="border-primary/10 text-primary animate-in fade-in zoom-in flex items-center gap-2 border bg-white px-3 py-1.5 text-sm duration-300"
          >
            <span>{item}</span>
            <X
              size={14}
              className="text-error cursor-pointer transition-transform hover:scale-125"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
            />
          </div>
        ))}
      </div>
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};

// TiptapEditor Component
const TiptapEditor = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string) => void;
  error?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[140px] w-full rounded-b-md border-x border-b border-primary/10 bg-[#F5F2F0] p-3 text-sm text-primary outline-none',
      },
    },
  });

  if (!editor) return null;

  const toolbarBtn = (active: boolean) =>
    cn(
      'rounded p-1.5 transition-colors hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer',
      active ? 'bg-primary/15 text-primary' : 'text-dark-primary',
    );

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">
        {label} <span className="text-error">*</span>
      </label>
      <div className="border-primary/10 flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 bg-white px-2 py-1.5">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={toolbarBtn(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={toolbarBtn(editor.isActive('italic'))}
          title="Italic"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={toolbarBtn(editor.isActive('underline'))}
          title="Underline"
        >
          <UnderlineIcon size={15} />
        </button>

        <div className="bg-primary/10 mx-1 h-5 w-px" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={toolbarBtn(editor.isActive('heading', { level: 2 }))}
          title="Heading"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={toolbarBtn(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={toolbarBtn(editor.isActive('orderedList'))}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </button>
      </div>
      <EditorContent editor={editor} />
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
};
