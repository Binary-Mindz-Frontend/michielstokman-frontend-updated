/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import EmotionalSearch from '@/components/main/EmotionalSearch/EmotionalSearch';
import {
  useGetLiberationCatalogQuery,
  useGetDiscoveryFeedQuery,
} from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { resolveMediaUrl } from '@/lib/publications/media';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { STORY_CATALOG_GRID_CLASS } from '@/utils/storyCover.utils';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import LiberationsCard, { LiberationItem } from './_components/LiberationsCard/LiberationsCard';

// Fallback Asset
import fallbackCardImage from '@/assets/shared/confession-card-1.png';

const LIBERATION_PRESET_EMOTIONS = [
  'Breaking rigid habits',
  'Vitality & energy reset',
  'Overcoming hesitation',
  'Finding emotional stillness',
  'Reclaiming self-trust',
];

export default function LiberationsGrid() {
  const [visibleCount, setVisibleCount] = useState(8);
  const [aiMatchedTrackIds, setAiMatchedTrackIds] = useState<string[] | null>(null);

  const { data: catalogResponse, isLoading: isCatalogLoading } =
    useGetLiberationCatalogQuery(undefined);
  const { data: feedResponse, isLoading: isFeedLoading } = useGetDiscoveryFeedQuery([]);

  const definitions = catalogResponse?.data?.definitions;

  // Fallback: If catalog API has no items or is pending deployment, fall back to discovery feed
  const rawFeedLiberations = (feedResponse?.data?.items || []).filter(
    (item: any) =>
      item.card_type === 'liberation_journey' ||
      item.card_type === 'liberation' ||
      item.story_type === 'liberation',
  );

  const rawItems = definitions && definitions.length > 0 ? definitions : rawFeedLiberations;

  const liberationsData: LiberationItem[] = useMemo(() => {
    return rawItems.map((item: any) => {
      const dayImage = item.days?.find((d: any) => d.image_url)?.image_url;
      const isGenericDefault =
        !item.cover_image_url || item.cover_image_url.includes('de6eed03ae5244c0a80b60c85d6b57ab');
      const finalCover = isGenericDefault && dayImage ? dayImage : item.cover_image_url || dayImage;

      return {
        id: item.id || item.journey_code,
        journeyCode: item.journey_code,
        category: 'LIBERATION',
        title: item.title,
        description: item.description || `A ${item.total_days || 7}-day path to transformation.`,
        image: resolveMediaUrl(finalCover) || fallbackCardImage,
        price:
          item.price !== undefined && item.price !== null
            ? `€${item.price}`
            : item.price_cents
              ? `€${item.price_cents / 100}`
              : item.price_display
                ? `€${item.price_display}`
                : item.rating
                  ? item.rating.toString()
                  : '€47',
        totalDays: item.total_days ?? 7,
      };
    });
  }, [rawItems]);

  // Non-destructive AI vector match filtering
  const filteredLiberations = useMemo(() => {
    if (!aiMatchedTrackIds || aiMatchedTrackIds.length === 0) {
      return liberationsData;
    }

    const matched = liberationsData.filter((item) => {
      const itemId = String(item.id || '')
        .toLowerCase()
        .trim();
      const journeyCode = String(item.journeyCode || '')
        .toLowerCase()
        .trim();
      const title = String(item.title || '')
        .toLowerCase()
        .trim();

      return aiMatchedTrackIds.some((trackId) => {
        const needle = String(trackId).toLowerCase().trim();
        return (
          itemId === needle ||
          journeyCode === needle ||
          needle.includes(journeyCode) ||
          journeyCode.includes(needle) ||
          needle.includes(itemId) ||
          title.includes(needle)
        );
      });
    });

    // NON-DESTRUCTIVE FALLBACK:
    // If no direct matches in the current liberation journeys, keep all journeys visible
    // so the catalog is never blanked out or empty.
    return matched.length > 0 ? matched : liberationsData;
  }, [liberationsData, aiMatchedTrackIds]);

  const isFiltered = Boolean(
    aiMatchedTrackIds &&
    aiMatchedTrackIds.length > 0 &&
    filteredLiberations.length > 0 &&
    filteredLiberations.length < liberationsData.length,
  );

  const hasNoDirectMatches = Boolean(
    aiMatchedTrackIds &&
    aiMatchedTrackIds.length > 0 &&
    filteredLiberations.length === liberationsData.length,
  );

  const visibleLiberations = filteredLiberations.slice(0, visibleCount);
  const hasMore = filteredLiberations.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const handleResetSearch = () => {
    setAiMatchedTrackIds(null);
    setVisibleCount(8);
  };

  const activeLiberationPills = useMemo(() => {
    if (!aiMatchedTrackIds) return undefined;
    return filteredLiberations.map((item) => ({
      id: String(item.id || item.journeyCode),
      title: item.title,
      href: `/journeys/${item.journeyCode || item.id}`,
    }));
  }, [aiMatchedTrackIds, filteredLiberations]);

  const isLoading = isCatalogLoading && isFeedLoading && liberationsData.length === 0;

  if (isLoading) {
    return (
      <div className={STORY_CATALOG_GRID_CLASS}>
        {Array(6)
          .fill(null)
          .map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
      </div>
    );
  }

  return (
    <motion.section
      id="journeys"
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="scroll-mt-24"
    >
      {/* AI Semantic Search */}
      <EmotionalSearch
        category="liberation"
        accentColor="#4A229D"
        title="Find by How You Feel (AI Journey Search)"
        description="Describe how you are feeling or what transformation you crave. Pinecone will find matching liberation paths."
        placeholder="e.g. I feel stuck in a mental rut and need a 7-day reset of my daily energy..."
        presetEmotions={LIBERATION_PRESET_EMOTIONS}
        targetPathPrefix="/journeys"
        itemTypeLabel="journeys"
        getLinkHref={(id) => `/journeys/${id}`}
        activeMatchedItems={activeLiberationPills}
        onFilterByTrackIds={(ids) => {
          setAiMatchedTrackIds(ids);
          setVisibleCount(8);
        }}
      />

      {/* Filter Feedback Notice */}
      {isFiltered && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#4A229D]/20 bg-[#FAF7FD] px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#4A229D]" />
            <span className="font-playpen text-xs font-bold text-[#4A229D]">
              Showing {filteredLiberations.length} journey
              {filteredLiberations.length > 1 ? 's' : ''} resonant with your emotional query
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetSearch}
            className="font-playpen inline-flex items-center gap-1 text-xs font-semibold text-[#8A7464] transition-colors hover:text-[#4A229D]"
          >
            <X size={13} /> View all journeys
          </button>
        </div>
      )}

      {hasNoDirectMatches && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E0D5C3] bg-[#FAF7F2] px-4 py-3">
          <span className="font-sans text-xs text-[#8A7464]">
            No direct matches for this specific query in Liberations. Showing all available journeys
            below.
          </span>
          <button
            type="button"
            onClick={handleResetSearch}
            className="font-playpen inline-flex items-center gap-1 text-xs font-semibold text-[#8A7464] transition-colors hover:text-[#301C05]"
          >
            <X size={13} /> Clear filter
          </button>
        </div>
      )}

      {/* Catalog grid */}
      <motion.div variants={FADE_IN_UP_ITEM} className={STORY_CATALOG_GRID_CLASS}>
        {visibleLiberations.length > 0 ? (
          visibleLiberations.map((item) => <LiberationsCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full py-12 text-center font-sans text-sm font-semibold text-[#777]">
            No liberations found.
          </div>
        )}
      </motion.div>

      {/* Load More Button (Only visible if there are more than visibleCount items) */}
      {hasMore && (
        <motion.div variants={FADE_IN_UP_ITEM} className="mt-8 flex w-full justify-center md:mt-10">
          <div>
            <DynamicActionButton
              text="LOAD MORE"
              onClick={handleLoadMore}
              bgColor="#4A229D"
              textColor="white"
            />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
