/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import {
  useUpdateStoryMutation,
  useGetStoryDetailsQuery,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Custom Field Imports
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';

interface EditActionProps {
  id: string;
  onSuccess: () => void;
}

interface IEditForm {
  title: string;
  story_type: 'meditations' | 'confessions';
  story_text: string;
}

const EditAction: React.FC<EditActionProps> = ({ id, onSuccess }) => {
  const { data: storyData, isLoading: isFetching } = useGetStoryDetailsQuery(id);
  console.log(storyData?.data);
  const [updateStory, { isLoading: isUpdating }] = useUpdateStoryMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IEditForm>({
    // This 'values' key ensures that when storyData loads,
    // the SelectField and InputFields are automatically populated/selected.
    values: {
      title: storyData?.data?.title || '',
      story_type:
        (storyData?.data?.story_type?.toLowerCase() as 'meditations' | 'confessions') ||
        'meditations',
      story_text: storyData?.data?.story_text || '',
    },
  });

  const onSubmit = async (formData: IEditForm) => {
    try {
      const res = await updateStory({
        storyId: id,
        ...formData, // This sends { storyId, title, story_type, story_text }
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || 'Failed to update story');
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <Loader2 className="text-secondary h-8 w-8 animate-spin" />
        <p className="text-mute text-sm font-medium tracking-wide">Loading Details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 1. Title Input */}
      <InputField
        label="Story Title"
        name="title"
        control={control}
        placeholder="Enter title"
        required
        error={errors.title?.message}
      />

      {/* 2. Story Type Select - Pre-selected based on storyData */}
      <SelectField
        label="Story Type"
        name="story_type"
        control={control}
        required
        placeholder="Choose category"
        options={[
          { label: 'Meditations', value: 'meditations' },
          { label: 'Confessions', value: 'confessions' },
        ]}
        error={errors.story_type?.message}
      />

      {/* 3. Story Text Area - Using your TextAreaField */}
      <TextAreaField
        label="Story Content"
        name="story_text"
        control={control}
        required
        rows={6}
        placeholder="Type the story content here..."
        error={errors.story_text?.message}
      />

      {/* Action Buttons */}
      <div className="border-primary/10 flex items-center gap-3 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          className="border-primary/10 text-dark-primary h-12 flex-1 bg-white font-semibold transition-colors hover:bg-[#F5F2F0]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isUpdating}
          className="bg-secondary h-12 flex-1 font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </div>
          ) : (
            'Update Story'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditAction;
