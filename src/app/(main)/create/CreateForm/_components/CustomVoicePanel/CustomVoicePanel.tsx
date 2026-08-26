'use client';

import {
  useDeleteCustomVoiceMutation,
  useGetCustomVoiceQuery,
  useUploadCustomVoiceMutation,
} from '@/redux/features/memberVoice/memberVoice.api';
import { appToast } from '@/utils/appToast';
import { CheckCircle2, Loader2, Mic, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

const ACCEPTED_AUDIO =
  'audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,audio/ogg,audio/webm,.mp3,.wav,.m4a,.ogg,.webm';
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MIN_FILE_BYTES = 32 * 1024;

interface CustomVoicePanelProps {
  // eslint-disable-next-line no-unused-vars
  onVoiceReady?: (voicePickerName: string) => void;
}

export default function CustomVoicePanel({ onVoiceReady }: CustomVoicePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: statusResponse, isLoading: isLoadingStatus } = useGetCustomVoiceQuery();
  const [uploadVoice, { isLoading: isUploading }] = useUploadCustomVoiceMutation();
  const [deleteVoice, { isLoading: isDeleting }] = useDeleteCustomVoiceMutation();

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [displayName, setDisplayName] = useState('');

  const status = statusResponse?.data;
  const hasCustomVoice = Boolean(status?.has_custom_voice);
  const isBusy = isUploading || isDeleting;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    const valid: File[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        appToast.error(`${file.name} is too large. Keep each file under 10 MB.`);
        continue;
      }
      if (file.size < MIN_FILE_BYTES) {
        appToast.error(`${file.name} is too short. Record at least 30–60 seconds of clear speech.`);
        continue;
      }
      valid.push(file);
    }

    if (valid.length) {
      setPendingFiles((prev) => [...prev, ...valid]);
    }
  };

  const handleUpload = async () => {
    if (!pendingFiles.length) {
      appToast.error('Add at least one recording first.');
      return;
    }

    try {
      const result = await uploadVoice({
        recordings: pendingFiles,
        displayName: displayName.trim() || undefined,
      }).unwrap();

      setPendingFiles([]);
      setDisplayName('');
      appToast.success(result.data?.message || 'Your voice is ready to use.');
      onVoiceReady?.('custom');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message =
        err?.data?.message ||
        'Voice cloning is unavailable right now. You can still use the preset voices.';
      appToast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVoice().unwrap();
      appToast.success('Custom voice removed.');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      appToast.error(err?.data?.message || 'Could not remove your custom voice.');
    }
  };

  return (
    <div className="space-y-3 rounded-md border border-[#B39B7F]/60 bg-[#F5F2F0]/50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8DFD4] text-[#1A1A1A]">
          <Mic size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-[#1A1A1A]">
            Narrate in your own voice
          </p>
          <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#666]">
            Upload at least 60 seconds of clear, single-speaker audio (mp3, wav, m4a, ogg, or webm).
            Once cloned, choose it in the voice picker below — works with AI artwork or your own
            cover image.
          </p>
        </div>
      </div>

      {isLoadingStatus ? (
        <div className="flex items-center gap-2 py-2 font-sans text-xs text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking voice status…
        </div>
      ) : hasCustomVoice ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-sans text-sm font-bold text-emerald-900">
                  {status?.voice_name || 'My Voice'}
                </p>
                <p className="mt-0.5 font-sans text-xs text-emerald-800">
                  Ready in the voice picker. Select it to send{' '}
                  <code className="rounded bg-white/60 px-1">use_custom_voice: true</code> when you
                  create or re-narrate.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isBusy}
              className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-sans text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="font-playpen block text-xs font-semibold text-gray-800">
              Display name (optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="My Voice"
              disabled={isBusy}
              className="mt-1 w-full rounded-xl border border-[#EBE4D5] bg-white px-3 py-2 font-sans text-sm text-gray-900 focus:border-[#D98755] focus:outline-none disabled:opacity-60"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_AUDIO}
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#B39B7F] bg-white px-4 py-3 font-sans text-xs font-semibold text-[#301C05] transition-colors hover:border-[#EEA13D] disabled:opacity-50"
          >
            <Upload size={14} /> Add recordings
          </button>

          {pendingFiles.length > 0 ? (
            <ul className="space-y-1 rounded-md border border-[#EBE4D5] bg-white px-3 py-2">
              {pendingFiles.map((file) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex items-center justify-between font-sans text-xs text-gray-700"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setPendingFiles((prev) => prev.filter((f) => f !== file))}
                    className="ml-2 shrink-0 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={handleUpload}
            disabled={isBusy || pendingFiles.length === 0}
            className="font-playpen w-full rounded-xl bg-[#301C05] py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1a1003] disabled:opacity-50"
          >
            {isUploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cloning voice…
              </span>
            ) : (
              'Clone my voice'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
