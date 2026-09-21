'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateProfileMutation } from '@/redux/features/userProfile/userProfile.api';

interface ProfileDisplayNameProps {
  trueName?: string | null;
}

export default function ProfileDisplayName({ trueName }: ProfileDisplayNameProps) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(trueName || '');

  const startEditing = () => {
    setDraft(trueName || '');
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(trueName || '');
    setEditing(false);
  };

  const onSave = async () => {
    const next = draft.trim();
    if (!next) {
      toast.error('Name cannot be empty.');
      return;
    }
    if (next === (trueName || '').trim()) {
      setEditing(false);
      return;
    }

    try {
      await updateProfile({ true_name: next }).unwrap();
      toast.success('Name updated.');
      setEditing(false);
    } catch {
      toast.error('Could not update your name.');
    }
  };

  if (!editing) {
    return (
      <div className="mb-6 flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
        <div className="text-center sm:text-left">
          <p className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
            Display name
          </p>
          <p className="text-secondary mt-1 text-lg font-semibold">{trueName || 'Not set'}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-primary/20 text-secondary hover:bg-[#F5F1EA]"
          onClick={startEditing}
        >
          Change name
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full max-w-2xl space-y-3 rounded-md border border-[#E1D7CE] bg-[#F7F3EC] p-4">
      <label className="block">
        <span className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">
          Display name
        </span>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={80}
          autoFocus
          className="bg-bg-primary mt-1.5 border-[#E1D7CE]"
          placeholder="Your name"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void onSave();
            }
            if (event.key === 'Escape') {
              cancelEditing();
            }
          }}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className="btn-styles"
          disabled={isLoading}
          onClick={() => void onSave()}
        >
          {isLoading ? 'Saving…' : 'Save name'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-primary/20 text-secondary"
          disabled={isLoading}
          onClick={cancelEditing}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
