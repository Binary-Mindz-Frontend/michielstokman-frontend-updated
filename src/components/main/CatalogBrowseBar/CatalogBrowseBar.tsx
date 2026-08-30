'use client';

import { cn } from '@/lib/utils';
import { CATALOG_SORTS, STORY_GROWTH_AREAS, type CatalogSort } from '@/utils/storyMoods.utils';
import { useState } from 'react';

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
}): string | null {
  const parts: string[] = [];
  if (sort !== 'newest') {
    parts.push(CATALOG_SORTS.find((option) => option.id === sort)?.label || sort);
  }
  if (growthArea) parts.push(growthArea);
  if (tag) parts.push(`“${tag}”`);
  if (hideExplicit) parts.push('No explicit');
  return parts.length ? parts.join(' · ') : null;
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
  const hasFilters = hideExplicit || Boolean(growthArea) || Boolean(tag) || sort !== 'newest';
  const summary = filterSummary({ sort, growthArea, tag, hideExplicit });

  return (
    <div className="mb-6 border-b border-[#EBE4D5] sm:mb-8">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="font-playpen block text-xs font-bold tracking-[0.18em] text-[#301C05] uppercase">
            Filter
          </span>
          {summary ? (
            <span className="font-playpen mt-0.5 block truncate text-[11px] font-semibold text-[#8A7464]">
              {summary}
            </span>
          ) : (
            <span className="font-playpen mt-0.5 block text-[11px] text-[#A08170]">
              Sort and mood
            </span>
          )}
        </span>
        <span
          className={cn(
            'font-playpen shrink-0 text-sm leading-none text-[#8A7464] transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open ? (
        <div className="pb-4">
          <p className="font-playpen mb-2 text-[10px] font-bold tracking-[0.2em] text-[#A08170] uppercase">
            Sort
          </p>
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1">
            {CATALOG_SORTS.map((option) => {
              const selected = sort === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSortChange(option.id)}
                  className={cn(
                    'font-playpen text-xs font-semibold tracking-wide',
                    selected ? 'underline decoration-2 underline-offset-4' : 'text-[#8A7464]',
                  )}
                  style={selected ? { color: accentColor } : undefined}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="font-playpen mb-2 text-[10px] font-bold tracking-[0.2em] text-[#A08170] uppercase">
            Mood
          </p>
          <div className="-mx-1 mb-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {STORY_GROWTH_AREAS.map((area) => {
              const selected = growthArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => onGrowthAreaChange(selected ? null : area)}
                  className={cn(
                    'font-playpen shrink-0 cursor-pointer rounded-sm border bg-transparent px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap',
                    selected
                      ? 'border-current'
                      : 'border-[#EBE4D5] text-[#8A7464] hover:border-[#301C05]/30',
                  )}
                  style={selected ? { color: accentColor, borderColor: accentColor } : undefined}
                >
                  {area}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onHideExplicitChange(!hideExplicit)}
              className={cn(
                'font-playpen rounded-sm border px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase',
                hideExplicit ? 'border-current bg-white' : 'border-[#EBE4D5] text-[#8A7464]',
              )}
              style={hideExplicit ? { color: accentColor, borderColor: accentColor } : undefined}
            >
              {hideExplicit ? 'Explicit hidden' : 'Hide explicit'}
            </button>

            {tag ? (
              <button
                type="button"
                onClick={onTagClear}
                className="font-playpen rounded-sm border bg-white px-3 py-1.5 text-[11px] font-bold"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Tagged “{tag}” ×
              </button>
            ) : null}

            {hasFilters ? (
              <button
                type="button"
                onClick={onClearAll}
                className="font-playpen text-[11px] font-bold tracking-wide text-[#8A7464] uppercase underline decoration-1 underline-offset-4 hover:text-[#301C05]"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
