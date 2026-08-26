'use client';

import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import { appToast } from '@/utils/appToast';

const MAX_COVER_BYTES = 8 * 1024 * 1024;
const ACCEPTED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface StoryCoverPickerProps {
  coverFile: File | null;
  // eslint-disable-next-line no-unused-vars
  onFileChange: (file: File | null) => void;
  error?: string;
}

export default function StoryCoverPicker({
  coverFile,
  onFileChange,
  error,
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

  return (
    <div className="space-y-3">
      <label className="block font-sans text-sm font-semibold">Choose a cover image</label>

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
        Optional. Upload your own JPEG, PNG, or WebP (up to 8 MB), or leave empty to generate
        artwork.
      </p>

      {error && <p className="font-sans text-xs font-semibold text-[#D22D4C]">{error}</p>}
    </div>
  );
}
