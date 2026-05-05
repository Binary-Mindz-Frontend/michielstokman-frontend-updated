'use client';

import { Slider } from '@/components/ui/slider';

interface GrowthSliderProps {
  label: string;
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (v: number) => void;
}

export default function GrowthSlider({ label, value, onChange }: GrowthSliderProps) {
  return (
    <div className="animate-fade-up w-full space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-dark-primary text-sm font-medium sm:text-base">{label}</span>
        <span className="text-primary font-serif text-lg font-bold">{value}</span>
      </div>

      <Slider
        value={[value]}
        max={10}
        step={0.1}
        onValueChange={(vals) => onChange(vals[0])}
        className="cursor-pointer"
      />
    </div>
  );
}
