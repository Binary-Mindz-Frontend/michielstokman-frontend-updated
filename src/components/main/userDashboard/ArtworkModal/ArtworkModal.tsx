'use client';

import { useGenerateStoryImageMutation } from '@/redux/features/memberStory/memberStory.api';
import { hasStoryCover } from '@/utils/storyCover.utils';
import { Loader2, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { UserDashboardItem } from '../UserDashboardCard/UserDashboardCard';

interface ArtworkModalProps {
  isOpen: boolean;
  item: UserDashboardItem | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function ArtworkModal({ isOpen, item, onClose, onUpdated }: ArtworkModalProps) {
  const storyId = item ? String(item.id) : '';
  const [generateImage, { isLoading: isGenerating }] = useGenerateStoryImageMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const currentCover =
    typeof item.image === 'string' && hasStoryCover(item.image) ? item.image : null;

  const handleGenerate = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await generateImage(storyId).unwrap();
      setSuccessMessage(result.data?.message || 'Cover image generated.');
      onUpdated?.();
    } catch (error) {
      console.error('Failed to generate cover:', error);
      setErrorMessage('Generation failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2] p-6 shadow-2xl duration-150">
        <div className="flex items-center justify-between border-b border-[#EBE4D5] pb-4">
          <div>
            <h3 className="font-edo text-xl font-bold tracking-wider text-[#D98755]">ARTWORK</h3>
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

        <div className="mt-4 space-y-5">
          {currentCover ? (
            <div className="space-y-2">
              <p className="font-playpen text-xs font-bold text-gray-800">Current cover</p>
              <div className="relative mx-auto h-40 w-32 overflow-hidden rounded-lg border border-[#EBE4D5]">
                <Image
                  src={currentCover}
                  alt="Current story cover"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="font-playpen flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBE4D5] bg-white py-2.5 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating artwork…
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" /> Generate from story
              </>
            )}
          </button>

          <p className="font-sans text-xs text-gray-500">
            Covers are generated from the finished piece so every story shares the same visual
            language. Generation can take 30–60 seconds.
          </p>

          {errorMessage ? (
            <p className="font-sans text-xs font-semibold text-red-600">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="font-sans text-xs font-semibold text-green-700">{successMessage}</p>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="font-playpen w-full rounded-xl border border-[#EBE4D5] bg-white py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
