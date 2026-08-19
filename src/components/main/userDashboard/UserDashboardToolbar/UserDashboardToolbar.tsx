/* eslint-disable no-unused-vars */
'use client';

import iconHeartPink from '@/assets/submit/icon-heart-pink.png';
import iconSunYellow from '@/assets/submit/icon-sun-yellow.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

export type TCategory = 'CONFESSION' | 'MEDITATION';
export type TStatus = 'Pending' | 'Flagged' | 'Published' | 'Rejected';

interface UserDashboardToolbarProps {
  selectedCategory: TCategory;
  onCategoryChange: (category: TCategory) => void;
  selectedStatus: TStatus;
  onStatusChange: (status: TStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function UserDashboardToolbar({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: UserDashboardToolbarProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const statusOptions: TStatus[] = ['Pending', 'Flagged', 'Published', 'Rejected'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const isConfession = selectedCategory === 'CONFESSION';

  return (
    <div className="mb-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* LEFT SIDE: Category Tabs (CONFESSION / MEDITATION buttons - exact style from /create) */}
      <div className="flex flex-wrap items-center gap-4">
        {/* CONFESSION TAB BUTTON */}
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

        {/* MEDITATION TAB BUTTON */}
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

      {/* RIGHT SIDE: Search Button, Status Dropdown & DynamicActionButton */}
      <div className="flex flex-wrap items-center gap-3">
        {/* SEARCH BUTTON & INPUT */}
        <div className="relative flex items-center">
          {isSearchOpen ? (
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="h-12 w-40 rounded-md border border-[#EBE4D5] bg-[#FAF7F2] py-3 pr-8 pl-3 font-sans text-sm font-medium text-gray-800 focus:border-[#D98755] focus:outline-none sm:w-48"
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

        {/* STATUS DROPDOWN FILTER */}
        <div className="relative" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
            className="flex h-12 cursor-pointer items-center gap-2 rounded-md border border-[#EBE4D5] bg-[#FAF7F2] px-4 py-3 font-sans text-sm font-semibold text-gray-800 shadow-xs transition-colors hover:bg-[#F3EFE6] focus:outline-none"
          >
            <SlidersHorizontal size={15} className="text-gray-600" />
            <span>{selectedStatus}</span>
            <ChevronDown
              size={14}
              className={`text-gray-500 transition-transform duration-200 ${
                isStatusDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Status Options Menu */}
          {isStatusDropdownOpen && (
            <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-44 rounded-md border border-gray-100 bg-white p-1.5 shadow-xl duration-150">
              {statusOptions.map((status) => {
                const isSelected = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      onStatusChange(status);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 font-sans text-xs font-semibold transition-colors ${
                      isSelected ? 'bg-[#FAF7F2] text-[#D98755]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{status}</span>
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#D98755]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CREATE CTA BUTTON USING DynamicActionButton */}
        <div className="w-auto">
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
    </div>
  );
}
