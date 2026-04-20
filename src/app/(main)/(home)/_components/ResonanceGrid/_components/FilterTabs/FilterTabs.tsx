'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState('Confessions');

  const tabs = [
    { name: 'Confessions', activeBg: '#BF7758' },
    { name: 'Meditation', activeBg: '#F5C026' },
    { name: 'Journeys', activeBg: '#B7C9BD' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 px-4 sm:gap-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab?.name;

        return (
          <Button
            key={tab?.name}
            onClick={() => setActiveTab(tab?.name)}
            style={{
              backgroundColor: isActive ? tab?.activeBg : tab?.activeBg,
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-sm px-6 py-5 transition-all duration-500 sm:flex-none sm:px-8 sm:py-6 ${
              isActive ? 'text-white' : 'text-dark-primary'
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
