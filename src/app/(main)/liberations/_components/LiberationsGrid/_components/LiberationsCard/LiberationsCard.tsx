'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

import ratingBadge from '@/assets/shared/rating-badge.png';
import { STORY_COVER_SIZES, shouldUnoptimizeStoryImage } from '@/utils/storyCover.utils';

export interface LiberationItem {
  id: string | number;
  journeyCode?: string;
  category: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  price: string;
  totalDays: number | null;
}

interface LiberationsCardProps {
  item: LiberationItem;
}

const LiberationsCard: React.FC<LiberationsCardProps> = ({ item }) => {
  return (
    <div className="flex flex-col justify-between rounded-md bg-[#F8F3ED] p-3 transition-all hover:shadow-xs sm:p-4">
      {/* Top Image Box with Price/Rating Badge */}
      <div>
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-[#E8DFD4] ring-1 ring-[#DDD2C4]/90 sm:mb-4">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes={STORY_COVER_SIZES}
            quality={90}
            unoptimized={shouldUnoptimizeStoryImage(item.image)}
            className="object-contain object-center"
          />

          {/* Price/Rating Badge at Bottom-Right Corner */}
          <div className="absolute right-3 bottom-3 flex h-6.5 w-12 items-center justify-center drop-shadow-sm">
            <div className="absolute inset-0 h-full w-full">
              <Image src={ratingBadge} alt="Badge" fill className="object-fill" />
            </div>
            <span className="relative z-10 font-sans text-xs font-semibold text-[#4A229D]">
              {item.price}
            </span>
          </div>
        </div>

        {/* Category Label */}
        <span className="font-sans text-xs font-semibold tracking-widest text-[#301C05] uppercase">
          {item.category}
        </span>

        {/* Title */}
        <h3 className="font-edo mt-1 text-lg font-medium tracking-wide text-[#4A229D] capitalize sm:text-xl">
          {item.title}
        </h3>

        {/* Description Excerpt */}
        <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed font-medium text-black">
          {item.description}
        </p>

        {item.totalDays ? (
          <p className="my-2 font-sans text-xs font-medium text-[#301C05]">
            {item.totalDays} Day{item.totalDays === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>

      {/* Start Liberations Action Button */}
      <div className="mt-2">
        <DynamicActionButton
          text="Start Liberations"
          href={item.journeyCode ? `/journeys/${item.journeyCode}` : `/details/${item.id}`}
          bgColor="#4A229D"
          textColor="white"
        />
      </div>
    </div>
  );
};

export default LiberationsCard;
