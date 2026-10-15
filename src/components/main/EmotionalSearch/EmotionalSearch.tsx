'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  X,
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  defaultOpen?: boolean;
}

interface PresetItem {
  label: string;
  query: string;
  emoji?: string;
}

const CATEGORY_PRESETS: Record<string, PresetItem[]> = {
  confession: [
    { emoji: '💔', label: 'Heartbreak & letting go', query: 'Heartbreak & letting go' },
    { emoji: '🔒', label: 'Secrets never told', query: 'Secrets I never told' },
    { emoji: '🔥', label: 'Craving authentic love', query: 'Craving authentic love' },
    { emoji: '🌧️', label: 'Overwhelmed by expectations', query: 'Overwhelmed by expectations' },
    { emoji: '🕯️', label: 'Guilt & self-forgiveness', query: 'Guilt & self-forgiveness' },
    { emoji: '❄️', label: 'Winter nights & longing', query: 'winter nights' },
  ],
  meditation: [
    { emoji: '🌅', label: 'Morning chest anxiety', query: 'Morning anxiety in the chest' },
    { emoji: '🌿', label: 'Grounded somatic breath', query: 'Grounded body & deep breath' },
    { emoji: '🧘', label: 'Inner stillness & peace', query: 'Inner stillness & peace' },
    { emoji: '✨', label: 'Opening to abundance', query: 'Opening to wealth' },
    { emoji: '🔥', label: 'Sacral fire & passion', query: 'Sacral fire' },
    { emoji: '👁️', label: 'Third eye intuition', query: 'Third eye' },
  ],
  liberation: [
    { emoji: '⚡', label: 'Breaking rigid habits', query: 'Breaking rigid habits' },
    { emoji: '🌊', label: 'Vitality & energy reset', query: 'Vitality & energy reset' },
    { emoji: '🛡️', label: 'Reclaiming self-trust', query: 'Reclaiming self-trust' },
    { emoji: '🗝️', label: 'Overcoming hesitation', query: 'Overcoming hesitation' },
    { emoji: '🌄', label: 'Emotional stillness', query: 'Finding emotional stillness' },
  ],
};

const DEFAULT_PRESET_ITEMS: PresetItem[] = [
  { emoji: '🕊️', label: 'Seeking quiet & release', query: 'Overwhelmed & seeking quiet' },
  { emoji: '💔', label: 'Heartbreak & letting go', query: 'Heartbreak & letting go' },
  { emoji: '🌅', label: 'Morning chest anxiety', query: 'Morning anxiety in the chest' },
  { emoji: '🛡️', label: 'Finding inner confidence', query: 'Finding inner confidence' },
  { emoji: '🌿', label: 'Grounded deep breath', query: 'Grounded body & deep breath' },
];

const CATEGORY_DEFAULT_SUBTITLES: Record<string, string> = {
  confession:
    'Express any unspoken feeling, raw desire, or vulnerability — discover confessions that mirror your heart.',
  meditation:
    'Describe the physical or emotional sensation your body is calling for — releasing tension, somatic calm, or stillness.',
  liberation:
    'Describe the threshold you are facing, and let AI reveal 7-day transformational journeys crafted for your state.',
};

export default function EmotionalSearch({
  accentColor: accentColorProp,
  onFilterByTrackIds,
  className = '',
  title: titleProp,
  description: descriptionProp,
  placeholder: placeholderProp,
  presetEmotions,
  targetPathPrefix = '/details',
  itemTypeLabel = 'stories',
  category = 'confession',
  getLinkHref,
  activeMatchedItems,
  defaultOpen = true,
}: EmotionalSearchProps) {
  const accentColor =
    accentColorProp ||
    (category === 'confession' ? '#D22D4C' : category === 'meditation' ? '#EEA13D' : '#4A229D');

  const defaultTitle =
    category === 'confession'
      ? 'Find Confessions by How You Feel'
      : category === 'meditation'
        ? 'Find Meditations by State of Mind'
        : 'Find Journeys by Emotional Need';

  const title = titleProp || defaultTitle;

  const defaultDescription =
    CATEGORY_DEFAULT_SUBTITLES[category] ||
    'Describe how you feel right now. AI will search across all entries to find resonant matches.';

  // Eliminate any technical "Pinecone" leaks from legacy description strings
  const description =
    descriptionProp && !descriptionProp.toLowerCase().includes('pinecone')
      ? descriptionProp
      : defaultDescription;

  const placeholder =
    placeholderProp ||
    (category === 'confession'
      ? 'e.g. Lonely in a cold room, craving someone who truly sees me...'
      : category === 'meditation'
        ? 'e.g. Tightness in my chest after waking up, seeking somatic grounding...'
        : 'e.g. I feel paralyzed by doubt and want a 7-day emotional reset...');

  const presets: PresetItem[] = presetEmotions
    ? presetEmotions.map((p) => ({ label: p, query: p }))
    : CATEGORY_PRESETS[category] || DEFAULT_PRESET_ITEMS;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [matchedIds, setMatchedIds] = useState<string[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activePresetQuery, setActivePresetQuery] = useState<string | null>(null);

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

  const handlePresetClick = (p: PresetItem) => {
    setIsOpen(true);
    setQuery(p.query);
    setActivePresetQuery(p.query);
    handleSearch(p.query);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQuery('');
    setActivePresetQuery(null);
    setMatchedIds(null);
    setHasSearched(false);
    if (onFilterByTrackIds) {
      onFilterByTrackIds(null);
    }
  };

  const matchCount =
    activeMatchedItems !== undefined ? activeMatchedItems.length : (matchedIds?.length ?? 0);

  return (
    <div
      className={`group relative mb-8 overflow-hidden rounded-2xl border border-[#E8DFC8] bg-gradient-to-b from-[#FAF7F2] via-[#FDFBF7] to-[#FAF5EE] shadow-[0_8px_30px_rgba(48,28,5,0.04)] transition-all duration-300 hover:border-[#DECDB5] ${className}`}
    >
      {/* Decorative Brand Accent Line */}
      <div
        className="h-1 w-full transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      {/* ===== HEADER / ACCORDION TOGGLE ===== */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Title Block */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-start gap-3.5 select-none"
          >
            {/* Ambient Glowing Icon Badge */}
            <div
              className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: accentColor }}
            >
              <Sparkles size={18} className="animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: accentColor }}
                />
                <span
                  className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white"
                  style={{ backgroundColor: accentColor }}
                />
              </span>
            </div>

            {/* Title & Evocative Tagline */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-playpen text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: accentColor }}
                >
                  ✦ Emotional Resonance
                </span>
                {matchedIds !== null && (
                  <span className="inline-flex items-center rounded-full bg-[#149443]/10 px-2 py-0.5 font-sans text-[10px] font-bold text-[#149443]">
                    {matchCount} Matched
                  </span>
                )}
              </div>
              <h2 className="font-playpen text-sm font-bold tracking-tight text-[#301C05] sm:text-base">
                {title}
              </h2>
              <p className="line-clamp-1 max-w-xl font-sans text-xs text-[#826E5F]">
                {description}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {matchedIds !== null && (
              <button
                type="button"
                onClick={handleClear}
                className="font-playpen inline-flex items-center gap-1.5 rounded-full border border-[#D92344]/30 bg-[#FFF5F6] px-3 py-1.5 text-xs font-semibold text-[#D92344] shadow-2xs transition-all hover:bg-[#FFEAEF] hover:shadow-xs"
              >
                <RotateCcw size={12} />
                <span>Clear ({matchCount} found)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="font-playpen inline-flex items-center gap-1.5 rounded-full border border-[#E2D5C3] bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#503225] shadow-2xs transition-all hover:border-[#301C05]/40 hover:bg-white hover:text-[#301C05]"
            >
              <span>{isOpen ? 'Close' : 'Search by Feeling'}</span>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Quick Teaser Chips (when collapsed, to invite the user into emotional discovery) */}
        {!isOpen && matchedIds === null && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#EFE8DC]/80 pt-1">
            <span className="font-playpen mr-1 text-[11px] font-bold text-[#8A7464]">
              Popular feelings:
            </span>
            {presets.slice(0, 3).map((p) => (
              <button
                key={p.query}
                type="button"
                onClick={() => handlePresetClick(p)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#DDD2C0] bg-white px-3 py-1 font-sans text-xs text-[#503225] shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#301C05]/40 hover:shadow-xs"
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== EXPANDED INTERACTIVE SEARCH ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-[#EFE8DC] px-4 pt-3 pb-5 sm:px-6"
          >
            {/* Search Input Bar (Capsule Style) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="relative mt-2 flex flex-col gap-2 rounded-2xl border-2 border-[#E2D5C3] bg-white p-1.5 shadow-[0_4px_16px_rgba(48,28,5,0.03)] transition-all focus-within:border-[accentColor] focus-within:ring-4 focus-within:ring-[#D22D4C]/10 sm:flex-row sm:items-center sm:gap-2"
              style={{
                borderColor: query ? accentColor : undefined,
              }}
            >
              <div className="relative flex flex-1 items-center px-3">
                <Search size={18} className="mr-2.5 shrink-0 text-[#9A8675]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (activePresetQuery && e.target.value !== activePresetQuery) {
                      setActivePresetQuery(null);
                    }
                  }}
                  placeholder={placeholder}
                  className="w-full bg-transparent py-1.5 font-sans text-xs text-[#2A2A2A] placeholder:text-[#9C8A79] focus:outline-none sm:text-sm"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setActivePresetQuery(null);
                    }}
                    className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <X size={15} />
                  </button>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="font-playpen inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:brightness-105 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                style={{ backgroundColor: accentColor }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Tuning Resonance...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Search Emotion</span>
                  </>
                )}
              </button>
            </form>

            {/* Curated Emotion Chips Cloud */}
            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Heart size={12} style={{ color: accentColor }} />
                <span className="font-playpen text-[11px] font-bold text-[#8A7464]">
                  Tap a feeling to explore:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {presets.map((p) => {
                  const isActive = activePresetQuery === p.query;
                  return (
                    <button
                      key={p.query}
                      type="button"
                      onClick={() => handlePresetClick(p)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-xs transition-all duration-200 ${
                        isActive
                          ? 'scale-102 font-bold text-white shadow-xs'
                          : 'border-[#DDD2C0] bg-white/90 text-[#402613] hover:-translate-y-0.5 hover:border-[#301C05]/40 hover:bg-white hover:shadow-2xs'
                      }`}
                      style={{
                        backgroundColor: isActive ? accentColor : undefined,
                        borderColor: isActive ? accentColor : undefined,
                      }}
                    >
                      <span>{p.emoji}</span>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Showcase Banner */}
            {hasSearched && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-[#D9CDB8] bg-white/90 p-4 shadow-xs"
              >
                {matchCount > 0 ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="font-playpen flex items-center gap-1.5 text-xs font-bold text-[#149443] sm:text-sm">
                        <span>
                          ✦ Found {matchCount} emotionally resonant {itemTypeLabel}
                        </span>
                        <span className="text-xs font-normal text-[#8A7464]">
                          (Catalog filtered below)
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="font-playpen text-[11px] font-semibold text-[#8A7464] transition-colors hover:text-[#D92344]"
                      >
                        Reset view
                      </button>
                    </div>

                    {/* Resonant Story Chips */}
                    <div className="flex flex-wrap gap-2">
                      {activeMatchedItems !== undefined
                        ? activeMatchedItems.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href || `${targetPathPrefix}/${item.id}`}
                              className="group/pill inline-flex items-center gap-2 rounded-lg border border-[#DDD2C0] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#301C05] transition-all duration-200 hover:border-[#301C05]/60 hover:bg-white hover:shadow-xs"
                            >
                              <span className="capitalize">{item.title}</span>
                              <ArrowRight
                                size={12}
                                className="text-[#8A7464] transition-transform group-hover/pill:translate-x-0.5 group-hover/pill:text-[#301C05]"
                              />
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
                                className="group/pill inline-flex items-center gap-2 rounded-lg border border-[#DDD2C0] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#301C05] transition-all duration-200 hover:border-[#301C05]/60 hover:bg-white hover:shadow-xs"
                              >
                                <span className="capitalize">
                                  {id.replace(/^(track|story|journey)-/, '').replace(/-/g, ' ')}
                                </span>
                                <ArrowRight
                                  size={12}
                                  className="text-[#8A7464] transition-transform group-hover/pill:translate-x-0.5 group-hover/pill:text-[#301C05]"
                                />
                              </Link>
                            );
                          })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                    <p className="font-sans text-xs text-[#8A7464]">
                      {isError
                        ? 'AI resonance engine is temporarily offline. Showing the standard catalog.'
                        : `No ${itemTypeLabel} directly matched "${query}". Try simpler emotional keywords like "longing", "restless", or pick a feeling above.`}
                    </p>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="font-playpen text-xs font-bold text-[#301C05] underline hover:opacity-80"
                    >
                      Show all {itemTypeLabel}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
