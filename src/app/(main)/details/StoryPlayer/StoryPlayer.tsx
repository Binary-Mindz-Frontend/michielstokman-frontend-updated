/* eslint-disable react-hooks/set-state-in-effect */
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

// 75 dense waveform heights matching design screenshot
const DENSE_WAVEFORM_HEIGHTS = [
  15, 12, 10, 25, 18, 30, 22, 15, 20, 35, 15, 55, 90, 35, 65, 20, 50, 25, 45, 18, 35, 75, 45, 25,
  15, 40, 18, 25, 15, 12, 30, 20, 45, 30, 18, 25, 15, 35, 20, 15, 12, 10, 30, 45, 60, 40, 75, 50,
  85, 45, 95, 60, 85, 40, 65, 30, 50, 35, 60, 25, 45, 30, 20, 15, 35, 18, 25, 15, 12, 10, 30, 45,
  60, 35, 75, 50, 85, 65, 90, 70, 80, 55, 40, 25, 15,
];

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
  const animFrameRef = useRef<number | null>(null);

  // Dynamic waveform heights state
  const [dynamicHeights, setDynamicHeights] = useState<number[]>(DENSE_WAVEFORM_HEIGHTS);

  // Strict unmount cleanup to prevent memory leak and audio dangling
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Smooth waveform animation throttled to ~30fps to prevent CPU/memory pressure
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      setDynamicHeights(DENSE_WAVEFORM_HEIGHTS);
      return;
    }

    let phase = 0;
    let lastTime = performance.now();

    const animateWaveform = (now: number) => {
      // Throttle state updates to 30fps (every 33ms)
      if (now - lastTime >= 33) {
        lastTime = now;
        phase += 0.12;
        const newHeights = DENSE_WAVEFORM_HEIGHTS.map((baseH, i) => {
          const sineWave = Math.sin(phase + i * 0.3) * 18;
          const cosWave = Math.cos(phase * 0.7 + i * 0.15) * 12;
          return Math.max(10, Math.min(100, baseH + sineWave + cosWave));
        });
        setDynamicHeights(newHeights);
      }
      animFrameRef.current = requestAnimationFrame(animateWaveform);
    };

    animFrameRef.current = requestAnimationFrame(animateWaveform);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying]);

  // Sync playbackRate when speed or story changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed, story]);

  // Reset player state when a new story loads
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = speed;
    }
    onTimeUpdateCallback(0, 0, speed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story]);

  const cycleSpeed = () => {
    const speeds = [1, 1.2, 1.5, 2];
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
      onTimeUpdateCallback(
        audioRef.current.currentTime,
        audioRef.current.duration || duration,
        nextSpeed,
      );
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (audioRef.current) audioRef.current.playbackRate = speed;
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Audio playback error:', error);
            setIsPlaying(false);
          });
      }
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
      const dur = audioRef.current.duration;
      setDuration(dur);
      audioRef.current.playbackRate = speed;
      onTimeUpdateCallback(audioRef.current.currentTime, dur, speed);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      setCurrentTime(dur);
      onTimeUpdateCallback(dur, dur, speed);
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
    const targetTime = percent * duration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    onTimeUpdateCallback(targetTime, duration, speed);
  };

  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="w-full space-y-4 pt-6 md:space-y-6 md:pt-8">
      <audio
        ref={audioRef}
        src={story}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Dense Waveform matching screenshot (75 thin bars with tight gap) */}
      <div className="flex h-16 w-full items-center justify-between gap-[2px] px-0.5 sm:gap-[3px]">
        {dynamicHeights.map((heightPercent, index) => {
          const barPercent = (index / dynamicHeights.length) * 100;
          const isActive = barPercent <= progressPercent;

          return (
            <div
              key={index}
              style={{ height: `${heightPercent}%` }}
              className={`w-[2.5px] shrink-0 rounded-full transition-all duration-100 ease-out sm:w-1 ${
                isActive ? 'bg-[#E81A66]' : 'bg-[#FCA5C5] opacity-60'
              }`}
            />
          );
        })}
      </div>

      {/* Progress Bar Track with Thumb */}
      <div className="space-y-2">
        <div
          ref={progressBarRef}
          onClick={seek}
          className="group relative flex h-4 w-full cursor-pointer items-center"
        >
          {/* Gray Background Track */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#D9D9D9]">
            {/* Pink Progress Fill */}
            <div
              className="h-full bg-[#E81A66] transition-[width] duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Solid Pink Knob / Thumb */}
          <div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E81A66] shadow-sm transition-[left] duration-100 ease-linear hover:scale-110"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Time Indicators */}
        <div className="flex justify-between px-1 font-sans text-sm font-semibold text-[#1A1A1A]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Control Buttons */}
      <div className="flex items-center justify-center gap-6 pt-2 sm:gap-8">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
            hasPrev
              ? 'text-[#1A1A1A] hover:bg-black/5 active:scale-95'
              : 'pointer-events-none text-gray-300'
          }`}
          aria-label="Previous Story"
        >
          <SkipBack size={24} fill="currentColor" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E81A66] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause fill="currentColor" size={26} />
          ) : (
            <Play fill="currentColor" size={26} className="ml-1" />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
            hasNext
              ? 'text-[#1A1A1A] hover:bg-black/5 active:scale-95'
              : 'pointer-events-none text-gray-300'
          }`}
          aria-label="Next Story"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>

        {/* Speed Button */}
        <button
          onClick={cycleSpeed}
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#D9D9D9] font-sans text-xs font-bold text-[#1A1A1A] transition-all hover:bg-black/5 active:scale-95"
          aria-label="Playback Speed"
        >
          {speed}x
        </button>
      </div>
    </div>
  );
}
