'use client';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

const TABS = [
  { name: 'Confession', value: 'confession', activeBg: '#BF7758' },
  { name: 'Meditation', value: 'meditation', activeBg: '#F5C026' },
  { name: 'Liberations', value: 'transformation', activeBg: '#B7C9BD' },
];

const FilterTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active filters
  const activeFilters = searchParams.getAll('story_type');

  // Handle toggle
  const handleToggle = (name: string) => {
    const lowerName = name.toLowerCase();
    const params = new URLSearchParams(searchParams.toString());

    let currentFilters = params.getAll('story_type');

    if (currentFilters.includes(lowerName)) {
      currentFilters = currentFilters.filter((t) => t !== lowerName);
    } else {
      currentFilters.push(lowerName);
    }

    // Update URL
    params.delete('story_type');
    if (currentFilters.length > 0 && currentFilters.length < TABS.length) {
      currentFilters.forEach((filter) => params.append('story_type', filter));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 px-4 sm:gap-4">
      {TABS.map((tab) => {
        const isActive = activeFilters.includes(tab?.value);

        return (
          <Button
            key={tab?.value}
            onClick={() => handleToggle(tab?.value)}
            style={{
              backgroundColor: tab?.activeBg,
              opacity: isActive || activeFilters.length === 0 ? 1 : 0.5,
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-sm px-6 py-5 transition-all duration-500 sm:flex-none sm:px-8 sm:py-6 ${
              isActive ? 'ring-secondary text-white' : 'text-dark-primary'
            }`}
          >
            <span className="text-sm font-semibold tracking-wide sm:text-base">{tab?.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
