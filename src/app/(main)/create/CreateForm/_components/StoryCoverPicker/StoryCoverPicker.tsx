'use client';

import { cn } from '@/lib/utils';
import type { CoverImageMode } from '@/utils/storyGenerate.utils';
import { Sparkles, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import { appToast } from '@/utils/appToast';

const MAX_COVER_BYTES = 8 * 1024 * 1024;
const ACCEPTED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface StoryCoverPickerProps {
  mode: CoverImageMode;
  // eslint-disable-next-line no-unused-vars
  onModeChange: (mode: CoverImageMode) => void;
  coverFile: File | null;
  // eslint-disable-next-line no-unused-vars
  onFileChange: (file: File | null) => void;
  error?: string;
  /** Hide the generate/upload mode toggle (e.g. artwork modal after creation). */
  showModeToggle?: boolean;
}

export default function StoryCoverPicker({
  mode,
  onModeChange,
  coverFile,
  onFileChange,
  error,
  showModeToggle = true,
}: StoryCoverPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : null),
    [coverFile],
  );

  useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    };
  }, [uploadPreview]);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    event.target.value = '';
    if (!file) return;

    if (!ACCEPTED_COVER_TYPES.includes(file.type)) {
      appToast.error('Cover must be a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_COVER_BYTES) {
      appToast.error('Cover image must be 8 MB or smaller.');
      return;
    }

    onFileChange(file);
  };

  const selectMode = (nextMode: CoverImageMode) => {
    onModeChange(nextMode);
    if (nextMode === 'ai_generated') {
      onFileChange(null);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-sans text-sm font-semibold">Cover artwork</label>

      {showModeToggle ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectMode('ai_generated')}
            className={cn(
              'font-playpen inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition-colors',
              mode === 'ai_generated'
                ? 'border-[#EEA13D] bg-[#EEA13D]/10 text-[#EEA13D]'
                : 'border-[#B39B7F] text-[#B39B7F] hover:border-[#EEA13D]/50',
            )}
          >
            <Sparkles size={14} />
            Generate for me
          </button>
          <button
            type="button"
            onClick={() => selectMode('user_uploaded')}
            className={cn(
              'font-playpen inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition-colors',
              mode === 'user_uploaded'
                ? 'border-[#EEA13D] bg-[#EEA13D]/10 text-[#EEA13D]'
                : 'border-[#B39B7F] text-[#B39B7F] hover:border-[#EEA13D]/50',
            )}
          >
            <Upload size={14} />
            Upload my own
          </button>
        </div>
      ) : null}

      {mode === 'user_uploaded' ? (
        <>
          <div className="flex flex-wrap items-center gap-[19px]">
            <button
              type="button"
              onClick={handleUploadClick}
              className={cn(
                'relative flex h-[257px] w-[220px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-solid transition-colors',
                uploadPreview ? 'border-[#B39B7F]' : 'border-[#EEA13D] bg-[#F5F2F0]',
              )}
              aria-label={uploadPreview ? 'Replace cover image' : 'Upload cover image'}
            >
              {uploadPreview ? (
                <Image
                  src={uploadPreview}
                  alt="Uploaded cover preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Upload className="size-[53px] text-[#1A1A1A]" strokeWidth={1.75} />
              )}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <p className="font-sans text-xs text-[#888]">
            JPEG, PNG, or WebP up to 8 MB. You can also generate AI artwork later from My Stories.
          </p>
        </>
      ) : (
        <div className="flex h-[140px] w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-[#EEA13D] bg-[#F5F2F0] px-4 text-center">
          <div>
            <Sparkles className="mx-auto mb-2 size-8 text-[#EEA13D]" />
            <p className="font-sans text-sm font-semibold text-[#1A1A1A]">
              AI artwork from your story
            </p>
            <p className="mt-1 font-sans text-xs text-[#888]">
              A unique cover is created when your story finishes. You can upload your own image
              later too.
            </p>
          </div>
        </div>
      )}

      {error && <p className="font-sans text-xs font-semibold text-[#D22D4C]">{error}</p>}
    </div>
  );
}
