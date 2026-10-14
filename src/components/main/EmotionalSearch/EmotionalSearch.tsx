'use client';

import React, { useState } from 'react';
import { Sparkles, Search, X, Loader2, ArrowRight } from 'lucide-react';
import { useLazySearchTracksQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import Link from 'next/link';

export interface ActiveMatchItem {
  id: string;
  title: string;
  href?: string;
}

export interface EmotionalSearchProps {
  accentColor?: string;
  // eslint-disable-next-line no-unused-vars
  onFilterByTrackIds?: (trackIds: string[] | null) => void;
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  presetEmotions?: string[];
  targetPathPrefix?: string;
  itemTypeLabel?: string;
  category?: 'confession' | 'meditation' | 'liberation';
  // eslint-disable-next-line no-unused-vars
  getLinkHref?: (id: string) => string;
  activeMatchedItems?: ActiveMatchItem[];
}

const DEFAULT_PRESET_EMOTIONS = [
  'Overwhelmed & seeking quiet',
  'Heartbreak & letting go',
  'Morning anxiety in the chest',
  'Finding inner confidence',
  'Grounded body & deep breath',
];

const CATEGORY_PRESET_MAP: Record<string, string[]> = {
  confession: [
    'Heartbreak & letting go',
    'Overwhelmed by expectations',
    'Secrets I never told',
    'Guilt & self-forgiveness',
    'Craving authentic love',
  ],
  meditation: [
    'Morning anxiety in the chest',
    'Grounded body & deep breath',
    'Inner stillness & peace',
    'Quiet sanctuary & release',
    'Contact with the trees',
  ],
  liberation: [
    'Breaking rigid habits',
    'Vitality & energy reset',
    'Overcoming hesitation',
    'Finding emotional stillness',
    'Reclaiming self-trust',
  ],
};

export default function EmotionalSearch({
  accentColor = '#EB2874',
  onFilterByTrackIds,
  className = '',
  title = 'Find by How You Feel (AI Semantic Search)',
  description = 'Describe your present emotional state or what you are seeking. Pinecone will retrieve resonant matches.',
  placeholder = 'e.g. I feel overwhelmed by responsibility and crave silent reassurance...',
  presetEmotions,
  targetPathPrefix = '/details',
  itemTypeLabel = 'recommendations',
  category,
  getLinkHref,
  activeMatchedItems,
}: EmotionalSearchProps) {
  const activePresets =
    presetEmotions ||
    (category ? CATEGORY_PRESET_MAP[category] : undefined) ||
    DEFAULT_PRESET_EMOTIONS;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [matchedIds, setMatchedIds] = useState<string[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [triggerSearch, { isLoading, isError }] = useLazySearchTracksQuery();

  const handleSearch = async (textToSearch?: string) => {
    const searchText = (textToSearch ?? query).trim();
    if (!searchText) return;

    setHasSearched(true);
    try {
      const response = await triggerSearch({ query: searchText, category }).unwrap();
      const ids = response?.track_ids || [];
      setMatchedIds(ids);
      if (onFilterByTrackIds) {
        onFilterByTrackIds(ids);
      }
    } catch {
      setMatchedIds([]);
      if (onFilterByTrackIds) {
        onFilterByTrackIds([]);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    setMatchedIds(null);
    setHasSearched(false);
    if (onFilterByTrackIds) {
      onFilterByTrackIds(null);
    }
  };

  return (
    <div
      className={`mb-6 rounded-xl border border-[#EBE4D5] bg-[#FAF7F2] p-4 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="font-playpen flex items-center gap-2.5 text-left text-xs font-bold tracking-wide text-[#301C05] uppercase transition-opacity hover:opacity-80"
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-white shadow-xs"
            style={{ backgroundColor: accentColor }}
          >
            <Sparkles size={13} />
          </span>
          <span>{title}</span>
        </button>

        {matchedIds !== null ? (
          <button
            type="button"
            onClick={handleClear}
            className="font-playpen inline-flex items-center gap-1 text-[11px] font-semibold text-[#8A7464] hover:text-[#301C05]"
          >
            <X size={12} /> Clear search (
            {activeMatchedItems !== undefined ? activeMatchedItems.length : matchedIds.length}{' '}
            found)
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="font-playpen text-[11px] font-semibold text-[#8A7464] hover:text-[#301C05]"
          >
            {isOpen ? 'Close' : 'Open'}
          </button>
        )}
      </div>

      {isOpen ? (
        <div className="mt-4 space-y-3 pt-2">
          <p className="font-sans text-xs text-[#666]">{description}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-[#DDD2C4] bg-white px-3.5 py-2.5 pr-9 font-sans text-xs text-[#2A2A2A] placeholder:text-gray-400 focus:border-[#503225] focus:ring-1 focus:ring-[#503225] focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="font-playpen inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={13} />
                  <span>Search Emotion</span>
                </>
              )}
            </button>
          </form>

          {/* Quick emotion pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="font-sans text-[11px] font-medium text-[#8A7464]">Try:</span>
            {activePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setQuery(preset);
                  handleSearch(preset);
                }}
                className="rounded-full border border-[#E0D5C3] bg-white/80 px-2.5 py-1 font-sans text-[11px] text-[#503225] transition-colors hover:border-[#301C05]/40 hover:bg-white"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Results summary */}
          {hasSearched && !isLoading ? (
            <div className="mt-3 rounded-lg border border-[#E0D5C3] bg-white/70 p-3">
              {(activeMatchedItems !== undefined
                ? activeMatchedItems.length
                : (matchedIds?.length ?? 0)) > 0 ? (
                <div className="space-y-2">
                  <p className="font-playpen text-xs font-bold text-[#149443]">
                    Found{' '}
                    {activeMatchedItems !== undefined
                      ? activeMatchedItems.length
                      : matchedIds!.length}{' '}
                    emotionally resonant {itemTypeLabel}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeMatchedItems !== undefined
                      ? activeMatchedItems.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href || `${targetPathPrefix}/${item.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#D9CDB8] bg-white px-2.5 py-1 text-xs font-semibold text-[#503225] transition-colors hover:border-[#503225] hover:bg-[#FAF7F2]"
                          >
                            <span className="capitalize">{item.title}</span>
                            <ArrowRight size={11} />
                          </Link>
                        ))
                      : (matchedIds || []).map((id) => {
                          const clean = id.toLowerCase().trim();
                          const isJourney =
                            clean.startsWith('track-') ||
                            clean.startsWith('journey-') ||
                            [
                              'morning-anxiety-relief',
                              'quiet-sanctuary',
                              'inner-confidence',
                              'grounded-body',
                              'heartbreak-healing',
                            ].includes(clean);

                          const href = getLinkHref
                            ? getLinkHref(id)
                            : isJourney
                              ? `/journeys/${clean.replace(/^(track|journey)-/, '')}`
                              : `${targetPathPrefix}/${id}`;

                          return (
                            <Link
                              key={id}
                              href={href}
                              className="inline-flex items-center gap-1.5 rounded-md border border-[#D9CDB8] bg-white px-2.5 py-1 text-xs font-semibold text-[#503225] transition-colors hover:border-[#503225] hover:bg-[#FAF7F2]"
                            >
                              <span className="capitalize">
                                {id.replace(/^(track|story|journey)-/, '').replace(/-/g, ' ')}
                              </span>
                              <ArrowRight size={11} />
                            </Link>
                          );
                        })}
                  </div>
                </div>
              ) : (
                <p className="font-sans text-xs text-[#8A7464]">
                  {isError
                    ? 'AI search service is temporarily offline. Showing general catalog.'
                    : `No active ${itemTypeLabel} matched this specific query. Try adjusting your emotional keywords or clear search.`}
                </p>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
