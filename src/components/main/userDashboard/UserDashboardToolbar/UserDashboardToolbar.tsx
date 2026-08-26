/* eslint-disable no-unused-vars */
'use client';

import iconHeartPink from '@/assets/submit/icon-heart-pink.png';
import iconSunYellow from '@/assets/submit/icon-sun-yellow.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import type { SubmissionTab } from '@/utils/memberStory.utils';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

export type TCategory = 'CONFESSION' | 'MEDITATION';

const SUBMISSION_TABS: { key: SubmissionTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'submitted', label: 'Live' },
  { key: 'withdrawn', label: 'Withdrawn' },
  { key: 'draft', label: 'Draft' },
];

interface UserDashboardToolbarProps {
  selectedCategory: TCategory;
  onCategoryChange: (category: TCategory) => void;
  selectedSubmissionTab: SubmissionTab;
  onSubmissionTabChange: (tab: SubmissionTab) => void;
  submissionCounts?: Record<string, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function UserDashboardToolbar({
  selectedCategory,
  onCategoryChange,
  selectedSubmissionTab,
  onSubmissionTabChange,
  submissionCounts,
  searchQuery,
  onSearchChange,
}: UserDashboardToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const isConfession = selectedCategory === 'CONFESSION';

  return (
    <div className="mb-8 flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onCategoryChange('CONFESSION')}
            className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 bg-transparent px-6 py-3 font-sans text-sm font-semibold tracking-wider text-[#EB2874] uppercase transition-all ${
              isConfession ? 'border-[#EB2874]/80' : 'border-[#EBE4D5] hover:border-[#EB2874]/50'
            }`}
          >
            <div className="relative h-5 w-5 shrink-0">
              <Image src={iconHeartPink} alt="Confession" fill className="object-contain" />
            </div>
            <span>CONFESSION</span>
          </button>

          <button
            type="button"
            onClick={() => onCategoryChange('MEDITATION')}
            className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 bg-transparent px-6 py-3 font-sans text-sm font-semibold tracking-wider text-[#FEC332] uppercase transition-all ${
              !isConfession ? 'border-[#FEC332]' : 'border-[#EBE4D5] hover:border-[#FEC332]/50'
            }`}
          >
            <div className="relative h-6 w-6 shrink-0">
              <Image src={iconSunYellow} alt="Meditation" fill className="object-contain" />
            </div>
            <span>MEDITATION</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search title or reference…"
                  className="h-12 w-48 rounded-md border border-[#EBE4D5] bg-[#FAF7F2] py-3 pr-8 pl-3 font-sans text-sm font-medium text-gray-800 focus:border-[#D98755] focus:outline-none sm:w-56"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border border-[#EBE4D5] bg-[#FAF7F2] text-gray-700 shadow-xs transition-colors hover:bg-[#F3EFE6]"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          <DynamicActionButton
            text="Create"
            href={
              selectedCategory === 'CONFESSION'
                ? '/create?type=Confessions'
                : '/create?type=Meditation'
            }
            bgColor="#D22D4C"
            textColor="white"
            showArrow={true}
            fullWidth={false}
            className="h-12 rounded-md px-6 py-3 font-sans text-sm font-semibold tracking-wider"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUBMISSION_TABS.map(({ key, label }) => {
          const count = submissionCounts?.[key];
          const isSelected = selectedSubmissionTab === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSubmissionTabChange(key)}
              className={`font-playpen flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition-colors ${
                isSelected
                  ? 'border-[#D98755] bg-[#D98755] text-white'
                  : 'border-[#EBE4D5] bg-[#FAF7F2] text-gray-700 hover:border-[#D98755]/50'
              }`}
            >
              {label}
              {typeof count === 'number' ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isSelected ? 'bg-white/20' : 'bg-[#EBE4D5]/80'
                  }`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
