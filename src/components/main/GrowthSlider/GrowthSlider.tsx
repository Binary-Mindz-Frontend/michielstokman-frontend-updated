'use client';
import * as SliderPrimitive from '@radix-ui/react-slider';

export default function GrowthSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (v: number) => void;
}) {
  return (
    <div className="animate-in fade-in w-full space-y-3 duration-300">
      <div className="flex items-center justify-between gap-4">
        <span className="text-dark-primary text-sm font-medium sm:text-base">{label}</span>
        <span className="text-primary font-serif text-lg font-bold">{value}</span>
      </div>
      <SliderPrimitive.Root
        className="relative flex h-0 w-full cursor-pointer touch-none items-center select-none"
        value={[value]}
        max={10}
        step={0.01}
        onValueChange={(vals) => onChange(vals[0])}
      >
        <SliderPrimitive.Track className="bg-primary/30 relative h-1.5 grow overflow-hidden rounded-full">
          <SliderPrimitive.Range className="bg-primary absolute h-full rounded-full transition-all duration-200 ease-out" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="bg-primary ring-offset-background focus-visible:ring-ring block h-5 w-5 cursor-grab rounded-full border-2 border-white shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 active:cursor-grabbing" />
      </SliderPrimitive.Root>
    </div>
  );
}
