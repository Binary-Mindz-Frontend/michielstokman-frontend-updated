'use client';

import { useGenerateStoryImageMutation } from '@/redux/features/memberStory/memberStory.api';
import { hasStoryCover } from '@/utils/storyCover.utils';
import { Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface MemberArtworkPanelProps {
  storyId: string;
  title?: string;
  coverUrl?: string | null;
  onDone: () => void;
  onUpdated?: () => void;
}

export default function MemberArtworkPanel({
  storyId,
  title,
  coverUrl,
  onDone,
  onUpdated,
}: MemberArtworkPanelProps) {
  const [generateImage, { isLoading: isGenerating }] = useGenerateStoryImageMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const currentCover = coverUrl && hasStoryCover(coverUrl) ? coverUrl : null;

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
    <section className="rounded-2xl border border-[#EBE4D5] bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-edo text-lg font-bold tracking-wider text-[#D98755]">ARTWORK</h2>
          {title ? <p className="mt-1 font-sans text-xs text-gray-600">{title}</p> : null}
        </div>
        <button
          type="button"
          onClick={onDone}
          className="font-playpen text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          Done
        </button>
      </div>

      <div className="space-y-4">
        {currentCover ? (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-xl border border-[#EBE4D5] bg-[#FAF7F2]">
            <Image
              src={currentCover}
              alt="Current story cover"
              fill
              unoptimized
              className="object-contain"
              sizes="240px"
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="font-playpen flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBE4D5] bg-[#FAF7F2] py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
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
          Covers are generated from the finished piece. This can take 30–60 seconds.
        </p>

        {errorMessage ? (
          <p className="font-sans text-xs font-semibold text-red-600">{errorMessage}</p>
        ) : null}
        {successMessage ? (
          <p className="font-sans text-xs font-semibold text-green-700">{successMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
