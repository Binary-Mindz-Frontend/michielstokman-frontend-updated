'use client';

import StoryVoicePicker from '@/app/(main)/create/CreateForm/_components/StoryVoicePicker/StoryVoicePicker';
import { useGetVoicesQuery, type StoryVoiceOption } from '@/redux/features/aiStory/aiStory.api';
import {
  useGetMyStoryQuery,
  useRenarrateMyStoryMutation,
} from '@/redux/features/memberStory/memberStory.api';
import type { RenarrateRequest } from '@/types/memberStory.types';
import { isHumanReady } from '@/utils/memberStory.utils';
import { Loader2 } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';

interface MemberVoicePanelProps {
  storyId: string;
  onDone: () => void;
}

export default function MemberVoicePanel({ storyId, onDone }: MemberVoicePanelProps) {
  const { data: detail, isLoading: isLoadingDetail } = useGetMyStoryQuery(storyId);
  const { data: voicesResponse, isLoading: isLoadingVoices } = useGetVoicesQuery();
  const [renarrate, { isLoading: isSaving }] = useRenarrateMyStoryMutation();
  const [voiceOverride, setVoiceOverride] = useState<StoryVoiceOption | null | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const voices = useMemo(
    () => (voicesResponse?.voices ?? []).filter((voice) => !voice.is_custom).slice(0, 4),
    [voicesResponse?.voices],
  );

  const derivedVoice = useMemo(() => {
    if (!detail || detail.uses_custom_voice) return null;
    return (
      voices.find((v) => v.name === detail.voice_name || v.label === detail.voice_name) ?? null
    );
  }, [detail, voices]);

  const selectedVoice = voiceOverride === undefined ? derivedVoice : voiceOverride;

  if (isLoadingDetail) {
    return (
      <section className="flex items-center justify-center gap-2 rounded-2xl border border-[#EBE4D5] bg-white py-10 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
      </section>
    );
  }

  if (isHumanReady(detail)) {
    return (
      <section className="rounded-2xl border border-[#EBE4D5] bg-white p-5">
        <h2 className="font-edo text-lg font-bold tracking-wider text-[#D98755]">VOICE</h2>
        <p className="mt-3 font-sans text-sm text-gray-700">
          This piece uses your uploaded narration. The recording cannot be replaced with a studio
          voice.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="font-playpen mt-4 rounded-xl bg-[#D22D4C] px-6 py-2 text-xs font-bold text-white"
        >
          Back to story
        </button>
      </section>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedVoice) {
      setErrorMessage('Please choose a voice.');
      return;
    }
    setErrorMessage(null);
    const body: RenarrateRequest = { voice_name: selectedVoice.name };
    try {
      await renarrate({ storyId, body }).unwrap();
      onDone();
    } catch (error) {
      console.error('Failed to re-narrate story:', error);
      setErrorMessage('Could not change the voice. Please try again.');
    }
  };

  return (
    <section className="rounded-2xl border border-[#EBE4D5] bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-edo text-lg font-bold tracking-wider text-[#D98755]">VOICE</h2>
          <p className="mt-1 font-sans text-xs text-gray-600">
            Re-records this story in a studio voice. Text and cover stay the same.
          </p>
        </div>
        <button
          type="button"
          onClick={onDone}
          className="font-playpen text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <StoryVoicePicker
          voices={voices}
          selectedName={selectedVoice?.name ?? ''}
          onSelect={setVoiceOverride}
          isLoading={isLoadingVoices}
        />

        {errorMessage ? (
          <p className="font-sans text-xs font-semibold text-red-600">{errorMessage}</p>
        ) : null}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onDone}
            disabled={isSaving}
            className="font-playpen rounded-xl border border-[#EBE4D5] bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isLoadingVoices}
            className="font-playpen flex items-center gap-2 rounded-xl bg-[#D22D4C] px-6 py-2 text-xs font-bold text-white hover:bg-[#b5243f] disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Re-narrate
          </button>
        </div>
      </form>
    </section>
  );
}
