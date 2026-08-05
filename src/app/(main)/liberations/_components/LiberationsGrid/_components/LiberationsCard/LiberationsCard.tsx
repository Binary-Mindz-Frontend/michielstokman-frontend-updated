'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

// Assets
import ratingBadge from '@/assets/confessions/rating-badge.png';

export interface LiberationItem {
  id: string | number;
  category: string;
  title: string;
  description: string;
  image: StaticImageData;
  price: string;
  listenedCount: number;
  isExplicit?: boolean;
}

interface LiberationsCardProps {
  item: LiberationItem;
}

const LiberationsCard: React.FC<LiberationsCardProps> = ({ item }) => {
  return (
    <div className="flex flex-col justify-between rounded-md bg-[#F8F3ED] p-4 transition-all hover:shadow-xs">
      {/* Top Image Box with Price/Rating Badge */}
      <div>
        <div className="relative mb-4 h-60 w-full overflow-hidden rounded-md sm:h-64">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover object-center"
            priority
          />

          {/* Price/Rating Badge at Bottom-Right Corner */}
          <div className="absolute right-6 bottom-3 flex h-7 w-14 items-center justify-center">
            <div className="absolute inset-0 h-full w-full">
              <Image src={ratingBadge} alt="Badge" fill className="object-fill" />
            </div>
            <span className="relative z-10 font-sans text-sm font-semibold text-[#4A229D]">
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
        <p className="mt-2 font-sans text-sm leading-relaxed font-medium text-black">
          {item.description}
        </p>

        {/* Audio Meta Information */}
        <p className="my-2 font-sans text-xs font-medium text-[#301C05]">
          Listened To {item.listenedCount} Times {item.isExplicit ? '• Explicit' : ''}
        </p>
      </div>

      {/* Start Liberations Action Button */}
      <div className="mt-2">
        <DynamicActionButton
          text="Start Liberations"
          href={`/liberations/${item.id}`}
          bgColor="#4A229D"
          textColor="white"
        />
      </div>
    </div>
  );
};

export default LiberationsCard;
