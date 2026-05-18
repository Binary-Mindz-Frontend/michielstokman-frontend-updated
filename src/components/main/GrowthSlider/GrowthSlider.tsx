'use client';

import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface GrowthSliderProps {
  label: string;
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (v: number) => void;
  className?: string;
}

export default function GrowthSlider({ label, value, onChange, className }: GrowthSliderProps) {
  const isReadOnly = !onChange;

  return (
    <div className={cn('animate-fade-up w-full space-y-3', className)}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-dark-primary text-sm font-medium sm:text-base">{label}</span>
        <span className="text-primary font-serif text-lg font-bold">{value.toFixed(1)}</span>
      </div>

      <div className="relative w-full">
        <Slider
          value={[value]}
          max={10}
          step={0.1}
          onValueChange={(vals) => onChange?.(vals[0])}
          className={cn(
            'w-full transition-all',
            isReadOnly ? 'pointer-events-none' : 'cursor-pointer',
            isReadOnly && 'opacity-100! **:[[role=slider]]:hidden',
          )}
        />
      </div>
    </div>
  );
}
