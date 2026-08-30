'use client';

import StoryVoicePicker from '@/app/(main)/create/CreateForm/_components/StoryVoicePicker/StoryVoicePicker';
import { useGetVoicesQuery, StoryVoiceOption } from '@/redux/features/aiStory/aiStory.api';
import {
  useGetMyStoryQuery,
  useRenarrateMyStoryMutation,
} from '@/redux/features/memberStory/memberStory.api';
import type { RenarrateRequest } from '@/types/memberStory.types';
import { isHumanReady } from '@/utils/memberStory.utils';
import { Loader2, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { UserDashboardItem } from '../UserDashboardCard/UserDashboardCard';

interface ChangeVoiceModalProps {
  isOpen: boolean;
  item: UserDashboardItem | null;
  onClose: () => void;
}

export default function ChangeVoiceModal({ isOpen, item, onClose }: ChangeVoiceModalProps) {
  const storyId = item ? String(item.id) : '';
  const { data: detail } = useGetMyStoryQuery(storyId, {
    skip: !isOpen || !storyId,
  });
  const { data: voicesResponse, isLoading: isLoadingVoices } = useGetVoicesQuery(undefined, {
    skip: !isOpen,
  });
  const [renarrate, { isLoading: isSaving }] = useRenarrateMyStoryMutation();

  const [selectedVoice, setSelectedVoice] = useState<StoryVoiceOption | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const voices = useMemo(
    () => (voicesResponse?.voices ?? []).filter((voice) => !voice.is_custom).slice(0, 4),
    [voicesResponse?.voices],
  );

  /* eslint-disable react-hooks/set-state-in-effect -- prefill voice from story detail */
  useEffect(() => {
    if (!isOpen || !item) return;

    if (detail?.uses_custom_voice && voicesResponse?.custom_voice) {
      setSelectedVoice(null);
      return;
    }

    const match =
      voices.find(
        (v) =>
          v.name === detail?.voice_name ||
          v.label === detail?.voice_name ||
          v.label === item.voice_name,
      ) ?? null;
    setSelectedVoice(match);
  }, [isOpen, item, detail, voices, voicesResponse?.custom_voice]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen || !item) return null;

  if (isHumanReady(detail ?? item ?? undefined)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
        <div className="relative w-full max-w-md rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] p-6 shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X size={18} />
          </button>
          <h3 className="font-edo text-xl font-bold tracking-wider text-[#D98755]">CHANGE VOICE</h3>
          <p className="mt-3 font-sans text-sm text-gray-700">
            This piece uses your uploaded narration. The recording cannot be replaced with a studio
            voice.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="font-playpen mt-6 rounded-xl bg-[#D22D4C] px-6 py-2 text-xs font-bold text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentName = selectedVoice?.name ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVoice) {
      setErrorMessage('Please choose a voice.');
      return;
    }

    setErrorMessage(null);

    const body: RenarrateRequest = { voice_name: selectedVoice.name };

    try {
      await renarrate({ storyId, body }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to re-narrate story:', error);
      setErrorMessage('Could not change the voice. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] p-6 shadow-2xl duration-150">
        <div className="flex items-center justify-between border-b border-[#EBE4D5] pb-4">
          <div>
            <h3 className="font-edo text-xl font-bold tracking-wider text-[#D98755]">
              CHANGE VOICE
            </h3>
            <p className="mt-0.5 font-sans text-xs text-gray-600">{item.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="rounded-lg border border-[#EBE4D5] bg-white px-3 py-2 font-sans text-xs text-gray-700">
            Re-records your story in a studio voice. Text and cover art stay the same. No credit
            charged.
          </p>

          <StoryVoicePicker
            voices={voices}
            selectedName={currentName}
            onSelect={setSelectedVoice}
            isLoading={isLoadingVoices}
          />

          {errorMessage ? (
            <p className="font-sans text-xs font-semibold text-red-600">{errorMessage}</p>
          ) : null}

          <div className="flex items-center justify-end gap-3 border-t border-[#EBE4D5] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="font-playpen rounded-xl border border-[#EBE4D5] bg-white px-5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoadingVoices}
              className="font-playpen flex items-center gap-2 rounded-xl bg-[#D22D4C] px-6 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#b5243f] disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Re-narrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
