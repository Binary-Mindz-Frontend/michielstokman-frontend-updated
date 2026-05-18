'use client';

import cardImage6 from '@/assets/home/card6.png';
import NoDataFound from '@/components/main/NoDataFound/NoDataFound';
import CardGridSkeleton from '@/components/main/Skeletons/CardGridSkeleton';
import { Button } from '@/components/ui/button';
import { useIsAuthenticated } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { TDiscoveryItemType } from '@/types/discoveryFeed.types';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const CardGrid = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAuthenticated = useAppSelector(useIsAuthenticated);
  const activeFilters = searchParams.getAll('story_type');

  const { data, isLoading, isFetching } = useGetDiscoveryFeedQuery(activeFilters);
  const feedData = data?.data?.items;

  if (isLoading || isFetching) {
    return <CardGridSkeleton />;
  }

  return (
    <div>
      {/* Feed Data Check */}
      {(!feedData || feedData.length === 0) && !isLoading ? (
        <NoDataFound
          title="No Content Available"
          description="It seems like there's nothing in your feed right now. Check back later or try exploring other categories."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {feedData?.map((card: TDiscoveryItemType) => {
            const isJourney = card?.card_type === 'liberation_journey';

            // Dynamic path selection logic
            const detailPath = isJourney
              ? `/journeys/${card?.journey_code}`
              : `/details/${card?.id}`;

            return (
              <Link
                href={detailPath}
                key={card?.id}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    router.push(`/login?redirect=${encodeURIComponent(detailPath)}`);
                  }
                }}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-md transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Section */}

                <div className="relative aspect-4/5 w-full">
                  <Image
                    src={cardImage6}
                    alt={card?.title}
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
                      Rating {card?.rating || 0}
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

                          <Button className="btn-styles">Begin Your Liberation</Button>
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
