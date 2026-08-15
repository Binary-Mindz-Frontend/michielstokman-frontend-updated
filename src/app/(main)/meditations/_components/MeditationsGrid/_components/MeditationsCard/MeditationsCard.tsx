'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

import ratingBadge from '@/assets/shared/rating-badge.png';

export interface MeditationItem {
  id: string | number;
  category: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  rating: string;
  listenedCount: number;
  isExplicit?: boolean;
}

interface MeditationsCardProps {
  item: MeditationItem;
}

const MeditationsCard: React.FC<MeditationsCardProps> = ({ item }) => {
  return (
    <div className="flex flex-col justify-between rounded-md bg-[#F8F3ED] p-4 transition-all hover:shadow-xs">
      {/* Top Image Box with Rating Badge */}
      <div>
        <div className="relative mb-4 h-60 w-full overflow-hidden rounded-md sm:h-64">
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized={typeof item.image === 'string'}
            className="object-cover object-center"
            priority
          />

          {/* Rating Badge at Bottom-Right Corner */}
          <div className="absolute right-6 bottom-3 flex h-6.5 w-12 items-center justify-center">
            <div className="absolute inset-0 h-full w-full">
              <Image src={ratingBadge} alt="Rating" fill className="object-fill" />
            </div>
            <span className="relative z-10 font-sans text-xs font-semibold text-[#EEA13D]">
              {item.rating}
            </span>
          </div>
        </div>

        {/* Category Label */}
        <span className="font-sans text-xs font-semibold tracking-widest text-[#301C05] uppercase">
          {item.category}
        </span>

        {/* Title */}
        <h3 className="font-edo mt-1 text-lg font-medium tracking-wide text-[#EEA13D] capitalize sm:text-xl">
          {item.title}
        </h3>

        {/* Description Excerpt */}
        <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed font-medium text-black">
          {item.description}
        </p>

        {/* Audio Meta Information */}
        <p className="my-2 font-sans text-xs font-medium text-[#301C05]">
          Listened To {item.listenedCount} Times {item.isExplicit ? '• Explicit' : ''}
        </p>
      </div>

      {/* Start Listening Action Button */}
      <div className="mt-2">
        <DynamicActionButton
          text="Start Listening"
          href={`/details/${item.id}`}
          bgColor="#EEA13D"
          textColor="white"
        />
      </div>
    </div>
  );
};

export default MeditationsCard;
