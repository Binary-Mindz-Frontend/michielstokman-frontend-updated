'use client';

import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface IStoryPlayerProps {
  story: string;
  // eslint-disable-next-line no-unused-vars
  onTimeUpdateCallback: (current: number, duration: number, speed?: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function StoryPlayer({
  story,
  onTimeUpdateCallback,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: IStoryPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const requestRef = useRef<number | null>(null);
  const callbackRef = useRef(onTimeUpdateCallback);

  // Keep callback ref fresh to prevent re-triggering requestAnimationFrame
  useEffect(() => {
    callbackRef.current = onTimeUpdateCallback;
  }, [onTimeUpdateCallback]);

  // Sync playbackRate when speed or story changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed, story]);

  // High-resolution progress update loop at 60fps using requestAnimationFrame
  useEffect(() => {
    const updateProgressLoop = () => {
      if (audioRef.current) {
        const cur = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
        setCurrentTime(cur);
        callbackRef.current(cur, dur, speed);
      }
      if (isPlaying) {
        requestRef.current = requestAnimationFrame(updateProgressLoop);
      }
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updateProgressLoop);
    } else {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, speed]);

  const cycleSpeed = () => {
    const speeds = [1, 1.2, 1.5, 2];
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        // Force sync playback rate on play start
        audioRef.current.playbackRate = speed;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(cur);
      onTimeUpdateCallback(cur, dur, speed);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.playbackRate = speed;
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

      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {(onPrev || onNext) && (
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`flex cursor-pointer flex-col items-center gap-1 transition-all ${
              hasPrev
                ? 'text-primary hover:opacity-80 active:scale-95'
                : 'text-primary pointer-events-none cursor-not-allowed opacity-30'
            }`}
            aria-label="Previous Story"
          >
            <div className="hover:bg-primary/5 flex h-10 w-10 items-center justify-center rounded-full border border-current">
              <SkipBack size={18} fill="currentColor" />
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase">Prev</span>
          </button>
        )}

        <button
          onClick={togglePlay}
          className="bg-primary flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          {isPlaying ? (
            <Pause fill="currentColor" size={28} />
          ) : (
            <Play fill="currentColor" size={28} className="ml-1" />
          )}
        </button>

        {(onPrev || onNext) && (
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex cursor-pointer flex-col items-center gap-1 transition-all ${
              hasNext
                ? 'text-primary hover:opacity-80 active:scale-95'
                : 'text-primary pointer-events-none cursor-not-allowed opacity-30'
            }`}
            aria-label="Next Story"
          >
            <div className="hover:bg-primary/5 flex h-10 w-10 items-center justify-center rounded-full border border-current">
              <SkipForward size={18} fill="currentColor" />
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase">Next</span>
          </button>
        )}

        <button
          onClick={cycleSpeed}
          className="text-primary flex cursor-pointer flex-col items-center gap-1 transition-all hover:opacity-80 active:scale-95"
          aria-label="Playback Speed"
        >
          <div className="hover:bg-primary/5 flex h-10 w-10 items-center justify-center rounded-full border border-current text-xs font-bold">
            {speed}x
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase">Speed</span>
        </button>
      </div>
    </div>
  );
}
