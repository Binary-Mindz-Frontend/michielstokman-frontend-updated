'use client';

import { cn } from '@/lib/utils';
import { StoryVoiceOption } from '@/redux/features/aiStory/aiStory.api';
import { Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { appToast } from '@/utils/appToast';

interface StoryVoicePickerProps {
  voices: StoryVoiceOption[];
  selectedName: string;
  // eslint-disable-next-line no-unused-vars
  onSelect: (voice: StoryVoiceOption) => void;
  error?: string;
  isLoading?: boolean;
}

let previewAudio: HTMLAudioElement | null = null;
let previewGeneration = 0;

function getPreviewAudio() {
  if (!previewAudio) {
    previewAudio = new Audio();
  }
  return previewAudio;
}

function pausePreviewAudio() {
  if (!previewAudio) return;
  previewAudio.pause();
  previewAudio.currentTime = 0;
}

export default function StoryVoicePicker({
  voices,
  selectedName,
  onSelect,
  error,
  isLoading = false,
}: StoryVoicePickerProps) {
  const [playingName, setPlayingName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      previewGeneration += 1;
      pausePreviewAudio();
    };
  }, []);

  const stopPreview = () => {
    pausePreviewAudio();
    setPlayingName(null);
  };

  const handlePreview = (voice: StoryVoiceOption) => {
    if (!voice.preview_url) return;

    if (playingName === voice.name) {
      previewGeneration += 1;
      stopPreview();
      return;
    }

    const requestId = ++previewGeneration;
    pausePreviewAudio();
    setPlayingName(null);

    const audio = getPreviewAudio();
    audio.src = voice.preview_url;
    audio.onended = () => {
      if (previewGeneration === requestId) setPlayingName(null);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (previewGeneration === requestId) setPlayingName(voice.name);
        })
        .catch(() => {
          if (previewGeneration !== requestId) return;
          setPlayingName(null);
          appToast.error('Voice preview could not be played.');
        });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-sans text-sm font-semibold">Choose a voice for your story</label>

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
            const isPlaying = playingName === voice.name;

            return (
              <div
                key={voice.name}
                className="flex w-full items-center gap-3 rounded-md border border-[#B39B7F] bg-transparent px-4 py-3.5 transition-colors hover:border-[#EEA13D]/60"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelect(voice)}
                  className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left"
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

                {voice.preview_url ? (
                  <button
                    type="button"
                    onClick={() => handlePreview(voice)}
                    aria-label={
                      isPlaying ? `Pause ${voice.label} preview` : `Play ${voice.label} preview`
                    }
                    className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E8DFD4] text-[#1A1A1A] transition-opacity hover:opacity-90"
                  >
                    {isPlaying ? (
                      <Pause className="size-6 fill-current" strokeWidth={1.5} />
                    ) : (
                      <Play className="size-6 fill-current" strokeWidth={1.5} />
                    )}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="font-sans text-xs font-semibold text-[#D22D4C]">{error}</p>}
    </div>
  );
}
