'use client';

import { cn } from '@/lib/utils';
import { StoryVoiceOption } from '@/redux/features/aiStory/aiStory.api';

interface StoryVoicePickerProps {
  voices: StoryVoiceOption[];
  selectedName: string;
  onSelect: (voice: StoryVoiceOption) => void;
  error?: string;
  isLoading?: boolean;
}

export default function StoryVoicePicker({
  voices,
  selectedName,
  onSelect,
  error,
  isLoading = false,
}: StoryVoicePickerProps) {
  return (
    <div className="space-y-3">
      <label className="block font-sans text-sm font-semibold">Choose A Voice For Your Story</label>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-22 animate-pulse rounded-md border border-[#B39B7F]/40 bg-[#F5F2F0]"
            />
          ))}
        </div>
      ) : voices.length === 0 ? (
        <p className="font-sans text-xs font-semibold text-[#777]">
          Voices couldn’t be loaded. You can still submit — a default voice will be used.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" role="radiogroup">
          {voices.map((voice) => {
            const isSelected = selectedName === voice.name;

            return (
              <button
                key={voice.name}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(voice)}
                className="flex w-full cursor-pointer items-start gap-3 rounded-md border border-[#B39B7F] bg-transparent px-4 py-3.5 text-left transition-colors hover:border-[#EEA13D]/60"
              >
                <span
                  className={cn(
                    'mt-0.5 size-7 shrink-0 rounded-full border-2 border-[#EEA13D]',
                    isSelected && 'bg-[#EEA13D]',
                  )}
                  aria-hidden
                />

                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-sm font-bold text-[#1A1A1A]">
                    {voice.label}
                  </span>
                  <span className="mt-0.5 block font-sans text-xs text-[#554F4F]">
                    {voice.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="font-sans text-xs font-semibold text-[#D22D4C]">{error}</p>}
    </div>
  );
}
