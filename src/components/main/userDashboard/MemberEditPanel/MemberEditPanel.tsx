'use client';

import StoryVoicePicker from '@/app/(main)/create/CreateForm/_components/StoryVoicePicker/StoryVoicePicker';
import { useGetVoicesQuery, type StoryVoiceOption } from '@/redux/features/aiStory/aiStory.api';
import {
  useGetMyStoryQuery,
  useUpdateMyStoryMutation,
} from '@/redux/features/memberStory/memberStory.api';
import { isHumanReady } from '@/utils/memberStory.utils';
import { Loader2 } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';

interface MemberEditPanelProps {
  storyId: string;
  onDone: () => void;
}

export default function MemberEditPanel({ storyId, onDone }: MemberEditPanelProps) {
  const { data: detail, isLoading: isLoadingDetail } = useGetMyStoryQuery(storyId);
  const { data: voicesCatalog, isLoading: isLoadingVoices } = useGetVoicesQuery();
  const [updateStory, { isLoading: isSaving }] = useUpdateMyStoryMutation();

  const [titleDraft, setTitleDraft] = useState<string | null>(null);
  const [storyInputDraft, setStoryInputDraft] = useState<string | null>(null);
  const [voiceOverride, setVoiceOverride] = useState<StoryVoiceOption | null | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const voices = useMemo(
    () => (voicesCatalog?.voices ?? []).filter((voice) => !voice.is_custom).slice(0, 4),
    [voicesCatalog?.voices],
  );
  const humanReady = isHumanReady(detail);

  const derivedVoice = useMemo(() => {
    if (!detail || humanReady) return null;
    if (detail.uses_custom_voice) return voicesCatalog?.custom_voice ?? null;
    return (
      voices.find((v) => v.name === detail.voice_name || v.label === detail.voice_name) ??
      voices.find((v) => v.name === voicesCatalog?.default_voice) ??
      voices[0] ??
      null
    );
  }, [detail, humanReady, voices, voicesCatalog]);

  const title = titleDraft ?? detail?.title ?? '';
  const storyInput = storyInputDraft ?? detail?.story_input ?? detail?.story_text ?? '';
  const selectedVoice = voiceOverride === undefined ? derivedVoice : voiceOverride;
  const useCustomVoice = Boolean(
    selectedVoice && voicesCatalog?.custom_voice?.name === selectedVoice.name,
  );

  const handleSubmit = async (e: FormEvent) => {
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
      onDone();
    } catch (error) {
      console.error('Failed to update story:', error);
      setErrorMessage('Could not save changes. Please try again.');
    }
  };

  const isBusy = isLoadingDetail || isSaving;
  const selectedName = selectedVoice?.name ?? '';

  return (
    <section className="rounded-2xl border border-[#EBE4D5] bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-edo text-lg font-bold tracking-wider text-[#D98755]">EDIT PIECE</h2>
          <p className="mt-1 font-sans text-xs text-gray-600">
            Edit here on the story page — nothing opens in a popup.
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

      {isLoadingDetail ? (
        <div className="flex items-center justify-center gap-2 py-10 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-sans text-sm">Loading story…</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-sans text-xs text-amber-900">
            {humanReady
              ? 'Saving updates your submitted text and keeps your recording. It goes back for review.'
              : 'Saving will regenerate your story and send it back for review. AI covers may refresh.'}
          </p>

          <div>
            <label className="font-playpen block text-xs font-semibold text-gray-800">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitleDraft(e.target.value)}
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
              onChange={(e) => setStoryInputDraft(e.target.value)}
              rows={8}
              required
              disabled={isBusy}
              className="mt-1 w-full rounded-xl border border-[#EBE4D5] bg-white px-4 py-2.5 font-sans text-sm font-medium text-gray-900 focus:border-[#D98755] focus:outline-none disabled:opacity-60"
            />
          </div>

          {humanReady ? (
            <p className="rounded-lg border border-[#EBE4D5] bg-[#FAF7F2] px-3 py-2 font-sans text-xs text-gray-700">
              Your uploaded narration stays as-is. Voice cloning is not available on this route.
            </p>
          ) : (
            <StoryVoicePicker
              voices={voices}
              selectedName={selectedName}
              onSelect={(voice) => setVoiceOverride(voice)}
              isLoading={isLoadingVoices}
            />
          )}

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
              disabled={isBusy}
              className="font-playpen flex items-center gap-2 rounded-xl bg-[#D22D4C] px-6 py-2 text-xs font-bold text-white hover:bg-[#b5243f] disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {humanReady ? 'Save' : 'Save & regenerate'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
