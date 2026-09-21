'use client';

import { Button } from '@/components/ui/button';
import { apiErrorMessage } from '@/lib/publications/apiError';
import { useGetVoicesQuery } from '@/redux/features/aiStory/aiStory.api';
import {
  useReplacePublicationAudioMutation,
  useSetVoiceRequirementMutation,
  useSuggestStoryFieldMutation,
} from '@/redux/features/admin/adminModeration/adminModeration.api';
import { useRegenerateVoiceMutation } from '@/redux/features/admin/adminVoiceReview/adminVoiceReview.api';
import type { PublicationDetail } from '@/types/publication.types';
import { Check, Download, Loader2, MicOff, RefreshCw, Upload, Volume2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAssetApproval } from './useAssetApproval';
import type { WorkspaceForm } from './useWorkspaceDraft';

const inputClass =
  'w-full rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm text-[#4A3B32] outline-none focus:ring-1 focus:ring-[#BF7758]/40';

const labelClass = 'text-[11px] font-bold tracking-wider text-[#A08170] uppercase';

const SPEEDS = [0.75, 1, 1.25, 1.5];

const MAX_AUDIO_BYTES = 50 * 1024 * 1024;

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '—';
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const VoiceTab = ({
  detail,
  form,
  patch,
  isDirty,
  isSaving,
  save,
}: {
  detail: PublicationDetail;
  form: WorkspaceForm;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  patch: (partial: Partial<WorkspaceForm>) => void;
  isDirty: boolean;
  isSaving: boolean;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  save: (options?: { silent?: boolean }) => Promise<boolean>;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [speed, setSpeed] = useState(1);
  const [suggesting, setSuggesting] = useState(false);

  const { data: catalog } = useGetVoicesQuery();
  const [suggestField] = useSuggestStoryFieldMutation();
  const [regenerateVoice, { isLoading: isRegenerating }] = useRegenerateVoiceMutation();
  const [replaceAudio, { isLoading: isUploading }] = useReplacePublicationAudioMutation();
  const [setVoiceRequirement, { isLoading: isSettingRequirement }] =
    useSetVoiceRequirementMutation();
  const { setApproved, isLoading: isApproving } = useAssetApproval(detail.id, 'voice');

  const voices = useMemo(
    () => (catalog?.voices || []).filter((voice) => !voice.is_custom),
    [catalog],
  );

  const approved = detail.statuses.voice === 'approved';
  const audioSrc = detail.audioPath;

  const applySpeed = (next: number) => {
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const handleSuggestVoice = async () => {
    setSuggesting(true);
    try {
      const res = await suggestField({ storyId: detail.id, field: 'voice' }).unwrap();
      const payload = (res?.data ?? res) as { voice_name?: string };
      const value = String(payload?.voice_name || '').trim();
      if (!value) {
        toast.error('No voice suggestion came back');
        return;
      }
      patch({ voiceName: value });
      toast.success(`Picked ${value} — save to keep it`);
    } catch {
      toast.error('Could not pick a voice');
    } finally {
      setSuggesting(false);
    }
  };

  const handleRegenerate = async () => {
    // Voice selection must be persisted before the backend re-narrates.
    if (isDirty && !(await save({ silent: true }))) return;
    try {
      const res = await regenerateVoice(detail.id).unwrap();
      if (res?.success) toast.success(res.message || 'Re-narration queued');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not queue re-narration'));
    }
  };

  const handleReplaceAudio = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;
    if (file.size > MAX_AUDIO_BYTES) {
      toast.error('File size exceeds the 50 MB limit.');
      return;
    }
    try {
      const res = await replaceAudio({ storyId: detail.id, file }).unwrap();
      if (res?.success) toast.success(res.message || 'Narration replaced');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not upload the audio'));
    }
  };

  const toggleApproved = async () => {
    await setApproved(!approved);
  };

  const handleNoVoiceChange = async (checked: boolean) => {
    try {
      const res = await setVoiceRequirement({
        storyId: detail.id,
        voiceNotRequired: checked,
      }).unwrap();
      if (res?.success) toast.success(res.message || 'Saved');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not update the voice requirement'));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <div className="space-y-5">
        {/* Player */}
        <div className="space-y-3 rounded-xl border border-[#F0EAE5] bg-[#FAF8F5] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 ${labelClass}`}>
              <Volume2 size={14} /> Generated audio
            </span>
            {audioSrc ? (
              <a
                href={audioSrc}
                download
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#BF7758]"
              >
                <Download size={12} /> Download
              </a>
            ) : null}
          </div>

          {audioSrc ? (
            <>
              <audio
                key={audioSrc}
                ref={audioRef}
                controls
                preload="metadata"
                src={audioSrc}
                className="h-10 w-full"
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#8A6E5F]">Speed</span>
                {SPEEDS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applySpeed(value)}
                    className={`cursor-pointer rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                      speed === value
                        ? 'border-[#BF7758] bg-[#BF7758] text-white'
                        : 'border-[#E1D7CE] bg-white text-[#5C4D43]'
                    }`}
                  >
                    {value}x
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-[#8A6E5F]">
              No audio yet. Pick a voice and regenerate, or upload a recording.
            </p>
          )}

          {detail.statuses.voice === 'in_progress' ? (
            <p className="text-[11px] text-[#8A6E5F]">
              New narration is being produced. Refresh in a moment to hear it.
            </p>
          ) : null}

          <dl className="grid grid-cols-2 gap-3 border-t border-[#F0EAE5] pt-3">
            <div>
              <dt className={labelClass}>Selected voice</dt>
              <dd className="text-sm text-[#4A3B32]">
                {form.voiceName || (detail.isHumanNarrated ? 'Member recording' : 'Not set')}
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Duration</dt>
              <dd className="text-sm text-[#4A3B32]">
                {formatDuration(detail.audioDurationSeconds)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Voice selection */}
        <div className="space-y-2 rounded-xl border border-[#F0EAE5] p-4">
          <div className="flex items-center justify-between gap-2">
            <span className={labelClass}>Voice</span>
            {!detail.isHumanNarrated ? (
              <button
                type="button"
                onClick={handleSuggestVoice}
                disabled={suggesting}
                className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[#BF7758] disabled:opacity-60"
              >
                {suggesting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                AI pick
              </button>
            ) : null}
          </div>

          {detail.isHumanNarrated ? (
            <p className="text-sm text-[#8A6E5F]">
              The member uploaded their own narration, so the voice is locked. Edit the text only.
            </p>
          ) : (
            <>
              <select
                className={inputClass}
                value={form.voiceName}
                onChange={(event) => patch({ voiceName: event.target.value })}
              >
                <option value="">Keep current</option>
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.label}
                    {voice.gender ? ` · ${voice.gender}` : ''}
                  </option>
                ))}
                {form.voiceName && !voices.some((voice) => voice.name === form.voiceName) ? (
                  <option value={form.voiceName}>{form.voiceName}</option>
                ) : null}
              </select>
              <p className="text-[11px] text-[#8A6E5F]">
                Changing the voice saves the name. Regenerate to produce the new audio.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="space-y-3 rounded-xl border border-[#E6DFDA] bg-white p-4">
          <span className={labelClass}>Audio actions</span>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mpeg, audio/mp3, audio/wav, audio/m4a, audio/mp4"
            onChange={handleReplaceAudio}
            className="hidden"
          />

          <Button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating || isSaving || detail.isHumanNarrated}
            className="btn-styles w-full"
          >
            {isRegenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            {isRegenerating ? 'Queuing…' : 'Regenerate voice'}
          </Button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm font-medium text-[#5C3A21] hover:bg-[#F5F0EB] disabled:opacity-60"
          >
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Replace / upload
          </button>

          <div className="border-t border-[#F0EAE5] pt-3">
            <button
              type="button"
              disabled={detail.voiceNotRequired || isApproving}
              onClick={toggleApproved}
              className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                approved
                  ? 'bg-[#149443] text-white'
                  : 'border border-[#B9D9C4] bg-white text-[#149443] hover:bg-[#F1FAF4]'
              }`}
            >
              {isApproving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {approved ? 'Audio approved' : 'Approve audio'}
            </button>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-[#E6DFDA] bg-white p-4">
          <span className={`inline-flex items-center gap-1.5 ${labelClass}`}>
            <MicOff size={13} /> No voice
          </span>
          <label className="flex items-start gap-2 text-sm text-[#5C3A21]">
            <input
              type="checkbox"
              className="mt-1"
              disabled={isSettingRequirement}
              checked={detail.voiceNotRequired}
              onChange={(event) => handleNoVoiceChange(event.target.checked)}
            />
            This publication intentionally has no voice
          </label>
          <p className="text-[11px] text-[#8A6E5F]">Removes voice from the publish requirements.</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceTab;
