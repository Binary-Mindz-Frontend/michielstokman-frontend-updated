'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { cardData } from '../data/cardData.data';

const CardGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cardData.map((card) => {
        const isJourney = card?.category === 'JOURNEYS';

        // Dynamic path selection logic
        const detailPath = isJourney ? `/journeys/${card?.id}` : `/details/${card?.id}`;

        return (
          <Link
            href={detailPath}
            key={card?.id}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-md transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative aspect-4/5 w-full">
              <Image
                src={card?.image}
                alt={card?.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Rating Badge - Top Right */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {card?.days && (
                  <div className="bg-bg-primary text-primary rounded px-3 py-1 text-xs font-medium">
                    {card?.days}
                  </div>
                )}
                <div className="bg-bg-primary text-primary rounded px-3 py-1 text-xs font-medium">
                  Rating {card?.rating}
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
              <div className="absolute bottom-0 left-0 w-full space-y-3 p-5 pb-6">
                <p className="font-sans text-xs font-semibold tracking-wider text-white/70 uppercase">
                  {card?.category}
                </p>
                <h3 className="text-2xl leading-tight font-medium text-white">{card?.title}</h3>
                <p className="text-[15px] leading-relaxed text-white/80 italic">{card?.desc}</p>

                {/* Conditional Footer for Journey vs Normal */}
                <div className="pt-4">
                  {isJourney ? (
                    <div className="space-y-4">
                      <p className="text-2xl font-semibold text-white">{card?.price}</p>
                      <Button className="btn-styles">Begin Your Liberation</Button>
                    </div>
                  ) : (
                    <div className="text-xs font-light text-white/60">
                      Listened to {card?.listens} times • Explicit
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CardGrid;
