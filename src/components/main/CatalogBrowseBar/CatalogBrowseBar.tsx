'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CATALOG_SORTS, STORY_GROWTH_AREAS, type CatalogSort } from '@/utils/storyMoods.utils';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Clock,
  Headphones,
  Star,
  EyeOff,
  Check,
  Tag as TagIcon,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CatalogBrowseBarProps = {
  sort: CatalogSort;
  hideExplicit: boolean;
  growthArea: string | null;
  tag: string | null;
  accentColor: string;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  onSortChange: (next: CatalogSort) => void;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  onHideExplicitChange: (next: boolean) => void;
  // eslint-disable-next-line no-unused-vars -- callback prop type
  onGrowthAreaChange: (next: string | null) => void;
  onTagClear: () => void;
  onClearAll: () => void;
};

const GROWTH_AREA_ICONS: Record<string, string> = {
  'Fear & Freedom': '🕊️',
  'Self-Acceptance': '🪞',
  Forgiveness: '🌿',
  'Letting Go': '🍃',
  Presence: '🧘',
  'Self-Compassion': '💛',
  Rebuilding: '🌱',
  Patience: '⏳',
  'Love & Connection': '🤝',
  'Purpose & Meaning': '🧭',
};

const SORT_ICONS: Record<CatalogSort, LucideIcon> = {
  newest: Clock,
  most_listened: Headphones,
  highest_rated: Star,
};

function filterSummary({
  sort,
  growthArea,
  tag,
  hideExplicit,
}: {
  sort: CatalogSort;
  growthArea: string | null;
  tag: string | null;
  hideExplicit: boolean;
}): string[] {
  const parts: string[] = [];
  if (sort !== 'newest') {
    parts.push(CATALOG_SORTS.find((option) => option.id === sort)?.label || sort);
  }
  if (growthArea) parts.push(growthArea);
  if (tag) parts.push(`“${tag}”`);
  if (hideExplicit) parts.push('Safe mode');
  return parts;
}

export default function CatalogBrowseBar({
  sort,
  hideExplicit,
  growthArea,
  tag,
  accentColor,
  onSortChange,
  onHideExplicitChange,
  onGrowthAreaChange,
  onTagClear,
  onClearAll,
}: CatalogBrowseBarProps) {
  const [open, setOpen] = useState(false);
  const activePills = filterSummary({ sort, growthArea, tag, hideExplicit });
  const hasActiveFilters = activePills.length > 0;

  return (
    <div className="mb-8 rounded-2xl border border-[#E8DFC8] bg-gradient-to-r from-[#FAF7F2] via-[#FDFBF8] to-[#FAF7F2] p-4 shadow-[0_4px_20px_rgba(48,28,5,0.03)] transition-all duration-300 sm:p-5">
      {/* ===== BAR HEADER ===== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Title & Active Filter Summary */}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="group flex flex-1 cursor-pointer items-center gap-3 text-left select-none"
        >
          {/* Filter Icon Bubble */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-2xs transition-all duration-300 group-hover:scale-105"
            style={{
              backgroundColor: hasActiveFilters ? accentColor : '#EFE7D8',
              color: hasActiveFilters ? '#FFFFFF' : '#503225',
            }}
          >
            <SlidersHorizontal size={16} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-playpen text-xs font-bold tracking-tight text-[#301C05] sm:text-sm">
                Filter & Sort
              </span>
              {hasActiveFilters && (
                <span
                  className="font-playpen rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs"
                  style={{ backgroundColor: accentColor }}
                >
                  {activePills.length} Active
                </span>
              )}
            </div>

            {/* Subtitle / Active Filter Teaser */}
            {hasActiveFilters ? (
              <p className="max-w-md truncate font-sans text-[11px] font-medium text-[#7A6455]">
                Active:{' '}
                <span className="font-semibold text-[#301C05]">{activePills.join(' · ')}</span>
              </p>
            ) : (
              <p className="font-sans text-[11px] text-[#8C7665]">
                Order by recency, listens, or filter by emotional theme
              </p>
            )}
          </div>
        </button>

        {/* Right: Quick Actions (Clear & Toggle) */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="font-playpen inline-flex items-center gap-1.5 rounded-full border border-[#DDD2C0] bg-white px-3 py-1.5 text-xs font-semibold text-[#8A7464] shadow-2xs transition-all hover:border-[#D92344]/40 hover:bg-[#FFF5F6] hover:text-[#D92344]"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="font-playpen inline-flex items-center gap-1.5 rounded-full border border-[#E2D5C3] bg-white px-3.5 py-1.5 text-xs font-bold text-[#503225] shadow-2xs transition-all hover:border-[#301C05]/40 hover:bg-white"
          >
            <span>{open ? 'Hide Filters' : 'Explore Filters'}</span>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ===== EXPANDED FILTER PANEL ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="mt-4 space-y-4 border-t border-[#EFE8DC] pt-4"
          >
            {/* ROW 1: Sort by (Segmented Tab Style) */}
            <div>
              <p className="font-playpen mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-[#8A7464] uppercase">
                <span>✦ Order Catalog By</span>
              </p>
              <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#E0D5C3] bg-[#EFE8DC]/60 p-1">
                {CATALOG_SORTS.map((option) => {
                  const selected = sort === option.id;
                  const Icon = SORT_ICONS[option.id] || Clock;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onSortChange(option.id)}
                      className={cn(
                        'font-playpen flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-200 select-none',
                        selected
                          ? 'bg-white text-[#301C05] shadow-xs'
                          : 'text-[#7A6455] hover:bg-white/50 hover:text-[#301C05]',
                      )}
                    >
                      <Icon
                        size={13}
                        style={{ color: selected ? accentColor : undefined }}
                        className={selected ? '' : 'text-[#8A7464]'}
                      />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 2: Emotional Themes / Growth Areas */}
            <div>
              <p className="font-playpen mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-[#8A7464] uppercase">
                <span>✦ Emotional Growth & Mood</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {STORY_GROWTH_AREAS.map((area) => {
                  const selected = growthArea === area;
                  const emoji = GROWTH_AREA_ICONS[area] || '✨';
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => onGrowthAreaChange(selected ? null : area)}
                      className={cn(
                        'group/chip inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-xs shadow-2xs transition-all duration-200 select-none',
                        selected
                          ? 'scale-102 font-bold text-white shadow-xs'
                          : 'border-[#DDD2C0] bg-white/90 text-[#402613] hover:-translate-y-0.5 hover:border-[#301C05]/40 hover:bg-white hover:shadow-xs',
                      )}
                      style={{
                        backgroundColor: selected ? accentColor : undefined,
                        borderColor: selected ? accentColor : undefined,
                      }}
                    >
                      <span>{emoji}</span>
                      <span>{area}</span>
                      {selected && <Check size={12} className="stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 3: Safety Toggle (Hide Explicit) & Active Tag Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFE8DC]/80 pt-2">
              {/* iOS-Style Toggle for Explicit Content */}
              <button
                type="button"
                onClick={() => onHideExplicitChange(!hideExplicit)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2 shadow-2xs transition-all duration-200 select-none',
                  hideExplicit
                    ? 'border-[#149443]/40 bg-[#F2FBF5] text-[#149443]'
                    : 'border-[#E2D5C3] bg-white text-[#6A5445] hover:border-[#301C05]/30',
                )}
              >
                <div
                  className={cn(
                    'relative h-4 w-7 rounded-full transition-colors duration-200',
                    hideExplicit ? 'bg-[#149443]' : 'bg-[#DDD2C0]',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow-xs transition-transform duration-200',
                      hideExplicit ? 'translate-x-3' : 'translate-x-0',
                    )}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <EyeOff size={13} />
                  <span className="font-playpen text-xs font-bold">
                    {hideExplicit ? 'Explicit content hidden' : 'Hide explicit content'}
                  </span>
                </div>
              </button>

              {/* Tag Filter Badge (if arrived via a tag click) */}
              {tag ? (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D92344]/30 bg-[#FFF5F6] px-3 py-1.5 text-xs font-bold text-[#D92344] shadow-2xs">
                  <TagIcon size={12} />
                  <span>Tagged “{tag}”</span>
                  <button
                    type="button"
                    onClick={onTagClear}
                    className="ml-1 rounded-full p-0.5 transition-colors hover:bg-[#D92344]/10"
                  >
                    ×
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
