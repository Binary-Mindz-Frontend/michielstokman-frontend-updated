/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import StoryVoicePicker from '@/app/(main)/create/CreateForm/_components/StoryVoicePicker/StoryVoicePicker';
import { useGetVoicesQuery, StoryVoiceOption } from '@/redux/features/aiStory/aiStory.api';
import {
  useGetMyStoryQuery,
  useUpdateMyStoryMutation,
} from '@/redux/features/memberStory/memberStory.api';
import { isHumanReady } from '@/utils/memberStory.utils';
import { Loader2, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { UserDashboardItem } from '../UserDashboardCard/UserDashboardCard';

interface EditConfessionModalProps {
  isOpen: boolean;
  item: UserDashboardItem | null;
  onClose: () => void;
}

export default function EditConfessionModal({ isOpen, item, onClose }: EditConfessionModalProps) {
  const storyId = item ? String(item.id) : '';
  const { data: detail, isLoading: isLoadingDetail } = useGetMyStoryQuery(storyId, {
    skip: !isOpen || !storyId,
  });
  const { data: voicesCatalog, isLoading: isLoadingVoices } = useGetVoicesQuery(undefined, {
    skip: !isOpen,
  });
  const [updateStory, { isLoading: isSaving }] = useUpdateMyStoryMutation();

  const [title, setTitle] = useState('');
  const [storyInput, setStoryInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<StoryVoiceOption | null>(null);
  const [useCustomVoice, setUseCustomVoice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const voices = useMemo(
    () => (voicesCatalog?.voices ?? []).filter((voice) => !voice.is_custom).slice(0, 4),
    [voicesCatalog?.voices],
  );
  const humanReady = isHumanReady(detail ?? item);

  useEffect(() => {
    if (!detail) return;
    setTitle(detail.title || '');
    setStoryInput(detail.story_input || detail.story_text || '');

    if (isHumanReady(detail)) {
      setSelectedVoice(null);
      setUseCustomVoice(false);
      return;
    }

    if (detail.uses_custom_voice && voicesCatalog?.custom_voice) {
      setSelectedVoice(voicesCatalog.custom_voice);
      setUseCustomVoice(true);
    } else if (detail.voice_name) {
      const match =
        voices.find((v) => v.name === detail.voice_name || v.label === detail.voice_name) ??
        voices.find((v) => v.name === voicesCatalog?.default_voice) ??
        voices[0] ??
        null;
      setSelectedVoice(match);
      setUseCustomVoice(false);
    }
  }, [detail, voices, voicesCatalog]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!humanReady && useCustomVoice && !voicesCatalog?.custom_voice) {
      setErrorMessage('Choose a studio voice.');
      return;
    }

    const body: Record<string, unknown> = {
      title,
      story_input: storyInput,
      regenerate: !humanReady,
    };

    if (!humanReady) {
      if (useCustomVoice) {
        body.use_custom_voice = true;
      } else if (selectedVoice?.name) {
        body.voice_name = selectedVoice.name;
      }
    }

    try {
      await updateStory({ storyId, body }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update story:', error);
      setErrorMessage('Could not save changes. Please try again.');
    }
  };

  const isBusy = isLoadingDetail || isSaving;
  const selectedName =
    selectedVoice?.name ??
    (useCustomVoice ? voicesCatalog?.custom_voice?.name : item.voice_name) ??
    '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] p-6 shadow-2xl duration-150">
        <div className="flex items-center justify-between border-b border-[#EBE4D5] pb-4">
          <h3 className="font-edo text-xl font-bold tracking-wider text-[#D98755]">
            EDIT CONFESSION
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {isLoadingDetail ? (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-sans text-sm">Loading story…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-sans text-xs text-amber-900">
              {humanReady
                ? 'Saving updates your submitted text and keeps your recording. It goes back for review.'
                : 'Saving will regenerate your story and send it back for review. AI covers may refresh.'}
            </p>

            <div>
              <label className="font-playpen block text-xs font-semibold text-gray-800">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isBusy}
                className="mt-1 w-full rounded-xl border border-[#EBE4D5] bg-white px-4 py-2.5 font-sans text-sm font-medium text-gray-900 focus:border-[#D98755] focus:outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label className="font-playpen block text-xs font-semibold text-gray-800">
                Your original story
              </label>
              <textarea
                value={storyInput}
                onChange={(e) => setStoryInput(e.target.value)}
                rows={4}
                required
                disabled={isBusy}
                className="mt-1 w-full rounded-xl border border-[#EBE4D5] bg-white px-4 py-2.5 font-sans text-sm font-medium text-gray-900 focus:border-[#D98755] focus:outline-none disabled:opacity-60"
              />
            </div>

            {humanReady ? (
              <p className="rounded-lg border border-[#EBE4D5] bg-white px-3 py-2 font-sans text-xs text-gray-700">
                Your uploaded narration stays as-is. Voice cloning is not available on this route.
              </p>
            ) : (
              <StoryVoicePicker
                voices={voices}
                selectedName={selectedName}
                onSelect={(voice) => {
                  setSelectedVoice(voice);
                  setUseCustomVoice(false);
                }}
                isLoading={isLoadingVoices}
              />
            )}

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
                disabled={isBusy}
                className="font-playpen flex items-center gap-2 rounded-xl bg-[#D22D4C] px-6 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#b5243f] disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {humanReady ? 'Save' : 'Save & regenerate'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
