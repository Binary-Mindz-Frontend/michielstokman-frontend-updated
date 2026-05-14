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

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  // audio source

  const audioSrc = `http://34.255.26.146:8000/${story}`;

  // toggle play

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

  // handle time update

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;

      const dur = audioRef.current.duration;

      setCurrentTime(cur);

      onTimeUpdateCallback(cur, dur);
    }
  };

  // handle loaded metadata

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // format time

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="space-y-4 pt-6 md:space-y-6 md:pt-12">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="space-y-4">
        {/* Progress Bar */}

        <div className="bg-primary/30 relative h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary absolute h-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="t text-primary flex justify-between font-medium">
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
