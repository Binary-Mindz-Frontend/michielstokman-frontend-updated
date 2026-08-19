'use client';

import ratingBadge from '@/assets/shared/rating-badge.png';
import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import { Trash2 } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

export interface UserDashboardItem {
  id: string | number;
  category: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  rating?: string;
  listenedCount: number;
  isExplicit?: boolean;
  story_type?: 'confession' | 'meditation';
  status?: 'Pending' | 'Flagged' | 'Published' | 'Rejected';
}

interface UserDashboardCardProps {
  item: UserDashboardItem;
  // eslint-disable-next-line no-unused-vars
  onEdit: (item: UserDashboardItem) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (item: UserDashboardItem) => void;
}

const UserDashboardCard: React.FC<UserDashboardCardProps> = ({ item, onEdit, onDelete }) => {
  const isConfession = item.story_type !== 'meditation';
  const primaryColor = isConfession ? '#EB2874' : '#EEA13D';
  const buttonBgColor = isConfession ? '#D22D4C' : '#EEA13D';

  return (
    <div className="relative flex flex-col justify-between rounded-md bg-[#F8F3ED] p-4 transition-all hover:shadow-xs">
      <div>
        {/* Top Image Box with Edit Badge & Delete Action */}
        <div className="relative mb-4 h-60 w-full overflow-hidden rounded-md sm:h-64">
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized={typeof item.image === 'string'}
            className="object-cover object-center"
            priority
          />

          {/* Edit & Delete Action Badges at Top-Right Corner */}
          <div className="absolute top-3 right-4 z-20 flex items-center gap-2.5 sm:right-5">
            {/* Edit Badge (Paper/brush style matching user screenshot) */}
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="relative flex h-7 w-12 cursor-pointer items-center justify-center transition-transform hover:scale-105"
              title="Edit"
            >
              <div className="absolute inset-0 h-full w-full">
                <Image src={ratingBadge} alt="Edit" fill className="object-fill" />
              </div>
              <span className="relative z-10 font-sans text-xs font-bold text-[#EB2874]">Edit</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-red-600 shadow-md transition-all hover:bg-red-600 hover:text-white"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Category Label */}
        <span className="font-sans text-xs font-semibold tracking-widest text-[#301C05] uppercase">
          {item.category || (isConfession ? 'STORY' : 'MEDITATION')}
        </span>

        {/* Title */}
        <h3
          style={{ color: primaryColor }}
          className="font-edo mt-1 text-lg font-medium tracking-wide capitalize sm:text-xl"
        >
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
          bgColor={buttonBgColor}
          textColor="white"
        />
      </div>
    </div>
  );
};

export default UserDashboardCard;
