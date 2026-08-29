'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { formatListenLength } from '@/utils/memberStory.utils';
import { storyIdentityLines } from '@/utils/storyIdentity.utils';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React from 'react';

import ratingBadge from '@/assets/shared/rating-badge.png';

export interface StoryListingItem {
  id: string | number;
  category: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  rating: string;
  listenedCount: number;
  isExplicit?: boolean;
  authorName?: string | null;
  location?: string | null;
  gender?: string | null;
  sexualOrientation?: string | null;
  occupation?: string | null;
  age?: number | string | null;
  durationSeconds?: number | null;
}

interface StoryListingCardProps {
  item: StoryListingItem;
  href: string;
  accentColor: string;
  buttonBg: string;
  ratingColor: string;
  ctaText?: string;
}

const StoryListingCard: React.FC<StoryListingCardProps> = ({
  item,
  href,
  accentColor,
  buttonBg,
  ratingColor,
  ctaText = 'Start Listening',
}) => {
  const { nameLine, detailLine } = storyIdentityLines(item);
  const duration = formatListenLength(item.durationSeconds);
  const stats = [
    duration,
    item.listenedCount > 0
      ? `Listened ${item.listenedCount} ${item.listenedCount === 1 ? 'time' : 'times'}`
      : null,
    item.isExplicit ? 'Explicit' : null,
  ].filter(Boolean);

  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-md bg-[#F8F3ED] p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: accentColor }}
    >
      <div>
        <div className="relative mb-4 h-60 w-full overflow-hidden rounded-md sm:h-64">
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized={typeof item.image === 'string'}
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            priority
          />

          <div className="absolute right-6 bottom-3 flex h-6.5 w-12 items-center justify-center">
            <div className="absolute inset-0 h-full w-full">
              <Image src={ratingBadge} alt="" fill className="object-fill" />
            </div>
            <span
              className="relative z-10 font-sans text-xs font-semibold"
              style={{ color: ratingColor }}
            >
              {item.rating}
            </span>
          </div>
        </div>

        <span className="font-sans text-xs font-semibold tracking-widest text-[#301C05] uppercase">
          {item.category}
        </span>

        <h3
          className="font-edo mt-1 text-lg font-medium tracking-wide capitalize sm:text-xl"
          style={{ color: accentColor }}
        >
          {item.title}
        </h3>

        {item.description ? (
          <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed font-medium text-black">
            {item.description}
          </p>
        ) : null}

        {(nameLine || detailLine) && (
          <div className="mt-3 space-y-0.5">
            {nameLine ? (
              <p className="font-serif text-sm leading-snug italic" style={{ color: accentColor }}>
                {nameLine}
              </p>
            ) : null}
            {detailLine ? (
              <p className="font-sans text-xs leading-relaxed text-[#5C4A3A]">{detailLine}</p>
            ) : null}
          </div>
        )}

        {stats.length > 0 ? (
          <p className="mt-2 font-sans text-xs font-medium tracking-wide text-[#301C05]">
            {stats.join(' · ')}
          </p>
        ) : null}
      </div>

      <div className="mt-3">
        <DynamicActionButton text={ctaText} bgColor={buttonBg} textColor="white" asVisual />
      </div>
    </Link>
  );
};

export default StoryListingCard;
