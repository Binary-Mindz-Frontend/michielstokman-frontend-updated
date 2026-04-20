'use client';

import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';

interface ITab {
  label: string;
  count: number;
  value: string;
}

interface FilterTabsProps {
  tabs: ITab[];
  queryKey?: string;
}

const FilterTabs = ({ tabs, queryKey = 'status' }: FilterTabsProps) => {
  const { setQuery, getQueryObject } = useSetSearchQueryInURL();
  const activeTab = getQueryObject()[queryKey] || tabs[0].value;

  return (
    <div className="flex gap-8 overflow-x-auto border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab?.value;
        return (
          <button
            key={tab?.value}
            onClick={() => setQuery(queryKey, tab?.value)}
            className={`relative cursor-pointer px-2 pb-2 text-nowrap transition-all ${
              isActive ? 'text-primary' : 'hover:text-secondary text-muted'
            }`}
          >
            {tab?.label} ({tab?.count})
            {isActive && <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full" />}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
