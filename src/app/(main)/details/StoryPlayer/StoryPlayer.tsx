'use client';

import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';

interface IStoryPlayerProps {
  story: string;
  // eslint-disable-next-line no-unused-vars
  onTimeUpdateCallback: (current: number, duration: number) => void;
}

export default function StoryPlayer({ story, onTimeUpdateCallback }: IStoryPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(cur);
      onTimeUpdateCallback(cur, dur);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Seek function to handle progress bar clicks
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = clickX / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="space-y-4 pt-6 md:space-y-6 md:pt-12">
      <audio
        ref={audioRef}
        src={story}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="space-y-4">
        <style>{`
          @keyframes bubble-pulse {
            0% {
              transform: scale(1);
              opacity: 0.6;
            }
            100% {
              transform: scale(2.2);
              opacity: 0;
            }
          }
          .animate-bubble-pulse {
            animation: bubble-pulse 2s infinite ease-out;
          }
        `}</style>

        <div
          ref={progressBarRef}
          onClick={seek}
          className="group relative w-full cursor-pointer py-2"
        >
          {/* Progress bar background track */}
          <div className="bg-primary/30 h-1.5 w-full overflow-hidden rounded-full">
            {/* Progress bar fill */}
            <div
              className="bg-primary h-full transition-[width] duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Smooth bubble visualization on progress bar */}
          <div
            className="bg-primary pointer-events-none absolute top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_0_10px_rgba(191,119,88,0.4)] transition-[left] duration-100 ease-linear"
            style={{ left: `${progressPercent}%` }}
          >
            {/* Inner dot of the bubble */}
            <div className="z-10 h-1.5 w-1.5 rounded-full bg-white" />

            {/* Pulsing effect when playing */}
            {isPlaying && (
              <div className="bg-primary/30 animate-bubble-pulse pointer-events-none absolute inset-0 rounded-full" />
            )}
          </div>
        </div>

        <div className="text-primary flex justify-between font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={togglePlay}
          className="bg-primary flex h-16 w-16 cursor-pointer items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          {isPlaying ? (
            <Pause fill="currentColor" size={28} />
          ) : (
            <Play fill="currentColor" size={28} className="ml-1" />
          )}
        </button>
      </div>
    </div>
  );
}
