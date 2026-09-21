/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CatalogBrowseBar from '@/components/main/CatalogBrowseBar/CatalogBrowseBar';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';
import StoryListingCard, {
  StoryListingItem,
} from '@/components/main/StoryListingCard/StoryListingCard';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { resolveStoryCoverSrc, STORY_CATALOG_GRID_CLASS } from '@/utils/storyCover.utils';
import { publicDisplayName } from '@/utils/storyIdentity.utils';
import {
  cardMoodTags,
  catalogEmptyMessage,
  listHasValue,
  type CatalogSort,
} from '@/utils/storyMoods.utils';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type StoryCatalogGridProps = {
  storyType: 'confession' | 'meditation';
  noun: string;
  accentColor: string;
  buttonBg: string;
  ratingColor: string;
};

function parseSort(value: string | null): CatalogSort {
  if (value === 'most_listened' || value === 'highest_rated') return value;
  return 'newest';
}

// eslint-disable-next-line no-unused-vars -- callback type
type SearchMutator = (nextParams: URLSearchParams) => void;

export default function StoryCatalogGrid({
  storyType,
  noun,
  accentColor,
  buttonBg,
  ratingColor,
}: StoryCatalogGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(8);

  const sort = parseSort(searchParams.get('sort'));
  const hideExplicit = searchParams.get('hide_explicit') === '1';
  const growthArea = searchParams.get('growth');
  const tag = searchParams.get('tag');

  const replaceParams = useCallback(
    (mutate: SearchMutator) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      setVisibleCount(8);
    },
    [pathname, router, searchParams],
  );

  const { data: feedResponse, isLoading } = useGetDiscoveryFeedQuery({
    storyTypes: [storyType],
    sort,
    hideExplicit,
    growthArea,
    tag,
    limit: 100,
  });

  const catalogItems: StoryListingItem[] = useMemo(() => {
    const rawItems = feedResponse?.data?.items || [];
    let items = rawItems.filter(
      (item: any) =>
        item.story_type === storyType ||
        item.card_type === storyType ||
        (item.card_type === 'story' && item.story_type === storyType),
    );

    // Idempotent with the API: still works against an older feed that ignores query params.
    if (hideExplicit) {
      items = items.filter((item: any) => !item.is_explicit);
    }
    if (growthArea && items.some((item: any) => Array.isArray(item.growth_areas))) {
      items = items.filter((item: any) => listHasValue(item.growth_areas, growthArea));
    }
    if (tag && items.some((item: any) => Array.isArray(item.tags))) {
      items = items.filter((item: any) => listHasValue(item.tags, tag));
    }
    if (sort === 'most_listened') {
      items = [...items].sort(
        (a: any, b: any) => (b.listened_count || 0) - (a.listened_count || 0),
      );
    } else if (sort === 'highest_rated') {
      items = [...items].sort(
        (a: any, b: any) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
      );
    }

    return items.map((item: any) => ({
      id: item.id,
      category: 'STORY',
      title: item.title,
      description: item.excerpt || item.description,
      image: resolveStoryCoverSrc(item.cover_image_url, storyType),
      rating: item.rating !== null && item.rating !== undefined ? String(item.rating) : null,
      listenedCount: item.listened_count ?? 0,
      isExplicit: item.is_explicit ?? false,
      authorName: publicDisplayName(item.author_name),
      location: item.location,
      gender: item.gender,
      sexualOrientation: item.sexual_orientation,
      occupation: item.occupation,
      age: item.age,
      durationSeconds: item.audio_duration_seconds,
      tags: cardMoodTags(item.tags),
    }));
  }, [feedResponse?.data?.items, growthArea, hideExplicit, sort, storyType, tag]);

  const visibleItems = catalogItems.slice(0, visibleCount);
  const hasMore = catalogItems.length > visibleCount;
  const hasActiveFilters = hideExplicit || Boolean(growthArea) || Boolean(tag) || sort !== 'newest';

  return (
    <motion.section
      id="stories"
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="scroll-mt-24"
    >
      <CatalogBrowseBar
        sort={sort}
        hideExplicit={hideExplicit}
        growthArea={growthArea}
        tag={tag}
        accentColor={accentColor}
        onSortChange={(next) =>
          replaceParams((params) => {
            if (next === 'newest') params.delete('sort');
            else params.set('sort', next);
          })
        }
        onHideExplicitChange={(hide) =>
          replaceParams((params) => {
            if (hide) params.set('hide_explicit', '1');
            else params.delete('hide_explicit');
          })
        }
        onGrowthAreaChange={(next) =>
          replaceParams((params) => {
            if (next) params.set('growth', next);
            else params.delete('growth');
          })
        }
        onTagClear={() => replaceParams((params) => params.delete('tag'))}
        onClearAll={() => {
          setVisibleCount(8);
          router.replace(pathname, { scroll: false });
        }}
      />

      {isLoading ? (
        <div className={STORY_CATALOG_GRID_CLASS}>
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
        </div>
      ) : (
        <>
          <motion.div variants={FADE_IN_UP_ITEM} className={STORY_CATALOG_GRID_CLASS}>
            {visibleItems.length > 0 ? (
              visibleItems.map((item, index) => (
                <StoryListingCard
                  key={item.id}
                  item={item}
                  href={`/details/${item.id}`}
                  accentColor={accentColor}
                  buttonBg={buttonBg}
                  ratingColor={ratingColor}
                  priority={index < 3}
                  selectedTag={tag}
                  onTagClick={(nextTag) =>
                    replaceParams((params) => {
                      if (tag === nextTag) params.delete('tag');
                      else params.set('tag', nextTag);
                    })
                  }
                />
              ))
            ) : (
              <div className="col-span-full space-y-3 py-12 text-center">
                <p className="font-sans text-sm font-semibold text-[#777]">
                  {catalogEmptyMessage({
                    noun,
                    growthArea,
                    tag,
                    hideExplicit,
                  })}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => router.replace(pathname, { scroll: false })}
                    className="font-sans text-xs font-semibold underline decoration-1 underline-offset-4"
                    style={{ color: accentColor }}
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            )}
          </motion.div>

          {hasMore && (
            <motion.div
              variants={FADE_IN_UP_ITEM}
              className="mt-8 flex w-full justify-center md:mt-10"
            >
              <div>
                <DynamicActionButton
                  text="LOAD MORE"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  bgColor={buttonBg}
                  textColor="white"
                />
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.section>
  );
}
