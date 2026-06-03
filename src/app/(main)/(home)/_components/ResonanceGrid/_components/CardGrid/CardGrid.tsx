/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import cardImage6 from '@/assets/home/card6.png';
import NoDataFound from '@/components/main/NoDataFound/NoDataFound';
import CardGridSkeleton from '@/components/main/Skeletons/CardGridSkeleton';
import { Button } from '@/components/ui/button';
import { useIsAuthenticated, useCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { useAppSelector } from '@/redux/hooks';
import { TDiscoveryItemType } from '@/types/discoveryFeed.types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LoginRequiredModal from '@/app/(main)/create/CreateForm/_components/LoginRequiredModal/LoginRequiredModal';

const getValidImageUrl = (url?: string | null) => {
  if (!url) return cardImage6;
  if (url.startsWith('/')) return url;
  try {
    new URL(url);
    return url;
  } catch {
    return cardImage6;
  }
};

const CardGrid = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAuthenticated = useAppSelector(useIsAuthenticated);
  const user = useAppSelector(useCurrentUser) as any;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const activeFilters = searchParams.getAll('story_type');

  const { data, isLoading, isFetching } = useGetDiscoveryFeedQuery(activeFilters);
  const feedData = data?.data?.items;

  const sortedFeedData = feedData
    ? [...feedData].sort((a, b) => {
        return (b.has_access ? 1 : 0) - (a.has_access ? 1 : 0);
      })
    : [];

  if (isLoading || isFetching) {
    return <CardGridSkeleton />;
  }

  return (
    <div>
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      {/* Feed Data Check */}
      {sortedFeedData.length === 0 && !isLoading ? (
        <NoDataFound
          title="No Content Available"
          description="It seems like there's nothing in your feed right now. Check back later or try exploring other categories."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedFeedData.map((card: TDiscoveryItemType, index: number) => {
            const isJourney = card?.card_type === 'liberation_journey';

            // Dynamic path selection logic
            let detailPath = `/details/${card?.id}`;

            if (isJourney) {
              if (card?.has_access) {
                if (card?.is_enrolled && card?.current_day && card.current_day > 1) {
                  detailPath = `/journeys/${card?.journey_code}/liberation?phase=overview`;
                } else {
                  detailPath = `/journeys/${card?.journey_code}/liberation`;
                }
              } else {
                detailPath = `/journeys/${card?.journey_code}`;
              }
            }

            return (
              <Link
                href={detailPath}
                key={`${card?.id || 'card'}-${index}`}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    router.push(`/login?redirect=${encodeURIComponent(detailPath)}`);
                    return;
                  }

                  if (user?.is_guest) {
                    if (isJourney) {
                      e.preventDefault();
                      setShowLoginModal(true);
                      return;
                    } else {
                      const guestReadsStr = localStorage.getItem('guest_reads') || '{}';
                      let guestReads;
                      try {
                        guestReads = JSON.parse(guestReadsStr);
                      } catch {
                        guestReads = {};
                      }

                      const now = new Date().getTime();
                      const twentyFourHours = 24 * 60 * 60 * 1000;

                      if (guestReads.timestamp && guestReads.storyId) {
                        const timePassed = now - guestReads.timestamp;
                        if (timePassed < twentyFourHours) {
                          if (guestReads.storyId !== card?.id) {
                            // Block: different story within 24 hours
                            e.preventDefault();
                            setShowLoginModal(true);
                            return;
                          } else {
                            // Allow: same story within 24 hours. Do not reset the timer.
                            return;
                          }
                        }
                      }

                      // If no previous read, or 24 hours have passed: lock in the new story!
                      localStorage.setItem(
                        'guest_reads',
                        JSON.stringify({
                          timestamp: now,
                          storyId: card?.id,
                        }),
                      );
                    }
                  }
                }}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-md transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative aspect-4/5 h-full max-h-112.5 w-full">
                  <Image
                    src={getValidImageUrl(card?.cover_image_url)}
                    alt={card?.title || 'Card Cover'}
                    width={400}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Rating Badge - Top Right */}

                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {card?.total_days && (
                      <div className="bg-bg-primary text-primary rounded px-3 py-1 text-xs font-medium">
                        {card?.total_days || 0} Days
                      </div>
                    )}

                    <div className="bg-bg-primary text-primary rounded px-3 py-1 text-xs font-medium">
                      Rating {card?.rating ? (card.rating / 10).toFixed(1) : '0.0'}
                    </div>
                  </div>

                  {/* Exact Overlay from your specs */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(80, 50, 37, 0) 10%, rgba(80, 50, 37, 0.90) 80%)',
                    }}
                  />

                  {/* Text Content inside the Image/Overlay Area */}

                  <div className="absolute bottom-0 left-0 w-full space-y-3 p-5 pb-5">
                    <p className="font-sans text-xs font-semibold tracking-wider text-white/70 uppercase">
                      {card?.card_type === 'liberation_journey'
                        ? 'Journey'
                        : card?.card_type || 'Story'}
                    </p>

                    <h3 className="line-clamp-1 text-2xl leading-tight font-medium text-white">
                      {card?.title || 'No title available.'}
                    </h3>

                    <p className="line-clamp-3 text-[15px] leading-relaxed text-white/80 italic">
                      {card?.description || 'No description available.'}
                    </p>

                    {/* Conditional Footer for Journey vs Normal */}

                    <div className="pt-4">
                      {isJourney ? (
                        <div className="space-y-4">
                          <p className="text-2xl font-semibold text-white">
                            €{card?.price_display || '0.00'}
                          </p>

                          <Button className="btn-styles">
                            {card?.has_access
                              ? 'Continue Your Liberation'
                              : 'Begin Your Liberation'}
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs font-light text-white/60">
                          Listened to {card?.listened_count || 0} times • Explicit
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CardGrid;
