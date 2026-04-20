'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CreateFormCategoryTabs({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', cat);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 space-y-3">
      <label className="block font-medium">
        What are you sharing? <span className="text-error">*</span>
      </label>
      <div className="flex gap-4">
        {['Confessions', 'Meditation'].map((cat) => (
          <Button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cn(
              'rounded-sm border bg-transparent hover:bg-transparent sm:px-6 sm:py-5',
              selected === cat
                ? 'border-primary/50 bg-primary/90 hover:bg-primary'
                : 'border-primary/20 text-secondary',
            )}
          >
            {cat === 'Confessions' ? '📖' : '🧘'} {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
