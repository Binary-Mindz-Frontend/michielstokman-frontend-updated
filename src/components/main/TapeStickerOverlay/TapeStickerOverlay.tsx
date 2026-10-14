import React from 'react';

interface TapeStickerOverlayProps {
  className?: string;
  variant?: 'hero' | 'card';
}

export default function TapeStickerOverlay({
  className = '',
  variant = 'hero',
}: TapeStickerOverlayProps) {
  if (variant === 'card') {
    return (
      <div
        className={`pointer-events-none absolute inset-x-2 bottom-3 z-10 flex flex-wrap items-center justify-between gap-1.5 ${className}`}
      >
        <span className="-rotate-2 rounded-[1px] border-y border-[#E2D8C3] bg-[#FAF3E0]/95 px-2 py-0.5 font-mono text-[9px] font-black tracking-widest text-[#2A2A2A] uppercase shadow-sm">
          REAL STORIES.
        </span>
        <span className="rotate-1 rounded-[1px] border-y border-[#E2D8C3] bg-[#FAF3E0]/95 px-2 py-0.5 font-mono text-[9px] font-black tracking-widest text-[#2A2A2A] uppercase shadow-sm">
          REAL PEOPLE.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 p-3 select-none sm:p-4 ${className}`}
    >
      {/* Top Left Tape: REAL STORIES */}
      <div className="absolute top-3 left-2 sm:top-5 sm:left-4">
        <span className="inline-block -rotate-3 rounded-[1px] border-y border-[#E4D8C0] bg-[#FAF3E0]/95 px-2.5 py-1 font-mono text-[10px] font-black tracking-widest text-[#2A2A2A] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-[1px] sm:text-[11px]">
          REAL STORIES.
        </span>
      </div>

      {/* Top Right Tape: REAL PEOPLE */}
      <div className="absolute top-4 right-2 sm:top-6 sm:right-4">
        <span className="inline-block rotate-2 rounded-[1px] border-y border-[#E4D8C0] bg-[#FFF8E7]/95 px-2.5 py-1 font-mono text-[10px] font-black tracking-widest text-[#2A2A2A] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-[1px] sm:text-[11px]">
          REAL PEOPLE.
        </span>
      </div>

      {/* Bottom Center Tape: REAL TRANSFORMATION */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-5">
        <span className="inline-block -rotate-1 rounded-[1px] border-y border-[#DFD1B5] bg-[#F7EED8]/95 px-3 py-1 font-mono text-[10px] font-black tracking-widest text-[#2A2A2A] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-[1px] sm:text-[11px]">
          REAL TRANSFORMATION.
        </span>
      </div>
    </div>
  );
}
