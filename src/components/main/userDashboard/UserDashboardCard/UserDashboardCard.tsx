'use client';

import DynamicActionButton from '@/components/main/DynamicActionButton/DynamicActionButton';
import {
  canChangeArtwork,
  canChangeVoice,
  canEditStory,
  canResubmitStory,
  canShareStory,
  canWithdrawStory,
  createHrefForStoryType,
  formatAudioDuration,
  getGenerationStatusLabel,
  getModerationStatusLabel,
  getRouteLabel,
  getSubmissionStatusLabel,
  shouldShowModerationNotes,
} from '@/utils/memberStory.utils';
import type {
  GenerationStatus,
  ModerationStatus,
  SubmissionMode,
  SubmissionStatus,
  StoryType,
} from '@/types/memberStory.types';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React from 'react';

export interface UserDashboardItem {
  id: string;
  story_reference?: string | null;
  category: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  story_type: StoryType;
  generation_status: GenerationStatus;
  moderation_status: ModerationStatus;
  submission_status: SubmissionStatus;
  submission_mode?: SubmissionMode | null;
  has_social_intros: boolean;
  moderation_notes?: string | null;
  audio_duration_seconds?: number | null;
  voice_name?: string | null;
}

interface UserDashboardCardProps {
  item: UserDashboardItem;
  // eslint-disable-next-line no-unused-vars
  onShare: (item: UserDashboardItem) => void;
  // eslint-disable-next-line no-unused-vars
  onWithdraw: (item: UserDashboardItem) => void;
  // eslint-disable-next-line no-unused-vars
  onResubmit: (item: UserDashboardItem) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (item: UserDashboardItem) => void;
}

const GENERATION_COLORS: Record<GenerationStatus, string> = {
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
};

const MODERATION_COLORS: Record<ModerationStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  flagged: 'bg-orange-100 text-orange-800',
};

const SUBMISSION_COLORS: Record<SubmissionStatus, string> = {
  submitted: 'bg-teal-100 text-teal-800',
  withdrawn: 'bg-gray-100 text-gray-700',
  draft: 'bg-slate-100 text-slate-700',
};

function ActionButton({
  label,
  onClick,
  disabled,
  variant = 'default',
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-playpen rounded-md px-2 py-1 text-[10px] font-bold tracking-wide uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : 'text-[#301C05] hover:bg-[#EBE4D5]/60'
      }`}
    >
      {label}
    </button>
  );
}

function ActionLink({
  label,
  href,
  disabled,
}: {
  label: string;
  href: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="font-playpen rounded-md px-2 py-1 text-[10px] font-bold tracking-wide text-[#301C05] uppercase opacity-40">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="font-playpen rounded-md px-2 py-1 text-[10px] font-bold tracking-wide text-[#301C05] uppercase hover:bg-[#EBE4D5]/60"
    >
      {label}
    </Link>
  );
}

const UserDashboardCard: React.FC<UserDashboardCardProps> = ({
  item,
  onShare,
  onWithdraw,
  onResubmit,
  onDelete,
}) => {
  const isConfession = item.story_type === 'confession';
  const isMeditation = item.story_type === 'meditation';
  const primaryColor = isMeditation ? '#EEA13D' : '#EB2874';
  const buttonBgColor = isMeditation ? '#EEA13D' : '#D22D4C';
  const duration = formatAudioDuration(item.audio_duration_seconds);

  return (
    <div className="relative flex flex-col justify-between rounded-md bg-[#F8F3ED] p-4 transition-all hover:shadow-xs">
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

          <div className="absolute top-3 left-3 z-20 flex max-w-[70%] flex-col gap-1">
            <span
              className={`w-fit rounded-full px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase ${GENERATION_COLORS[item.generation_status]}`}
            >
              {getGenerationStatusLabel(item.generation_status)}
            </span>
            <span
              className={`w-fit rounded-full px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase ${MODERATION_COLORS[item.moderation_status]}`}
            >
              {getModerationStatusLabel(item.moderation_status)}
            </span>
            <span
              className={`w-fit rounded-full px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide uppercase ${SUBMISSION_COLORS[item.submission_status]}`}
            >
              {getSubmissionStatusLabel(item.submission_status, item.moderation_status)}
            </span>
            <span className="w-fit rounded-full bg-[#301C05]/80 px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide text-white uppercase">
              {getRouteLabel(item)}
            </span>
            {item.has_social_intros ? (
              <span className="w-fit rounded-full bg-[#D98755]/15 px-2 py-0.5 font-sans text-[9px] font-bold tracking-wide text-[#D98755] uppercase">
                Ready to share
              </span>
            ) : null}
          </div>
        </div>

        {item.story_reference ? (
          <span className="font-sans text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
            {item.story_reference}
          </span>
        ) : null}

        <span className="font-sans text-xs font-semibold tracking-widest text-[#301C05] uppercase">
          {item.category || (isConfession ? 'STORY' : 'MEDITATION')}
        </span>

        <h3
          style={{ color: primaryColor }}
          className="font-edo mt-1 text-lg font-medium tracking-wide capitalize sm:text-xl"
        >
          {item.title}
        </h3>

        <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed font-medium text-black">
          {item.description}
        </p>

        {shouldShowModerationNotes(item.moderation_status, item.moderation_notes) ? (
          <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 font-sans text-xs text-amber-900">
            {item.moderation_notes}
          </p>
        ) : null}

        <p className="my-2 font-sans text-xs font-medium text-[#301C05]">
          {[
            duration ? `${duration} listen` : null,
            item.voice_name ? `Voice: ${item.voice_name}` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <div className="flex flex-wrap gap-1 border-t border-[#EBE4D5]/80 pt-2">
          <ActionLink
            label="Edit"
            href={`/user-dashboard/stories/${item.id}?panel=edit`}
            disabled={!canEditStory(item)}
          />
          <ActionLink
            label="Voice"
            href={`/user-dashboard/stories/${item.id}?panel=voice`}
            disabled={!canChangeVoice(item)}
          />
          <ActionLink
            label="Artwork"
            href={`/user-dashboard/stories/${item.id}?panel=artwork`}
            disabled={!canChangeArtwork(item)}
          />
          <ActionButton
            label="Share"
            onClick={() => onShare(item)}
            disabled={!canShareStory(item)}
          />
          {canWithdrawStory(item) ? (
            <ActionButton label="Withdraw" onClick={() => onWithdraw(item)} />
          ) : null}
          {canResubmitStory(item) ? (
            <>
              <ActionButton label="Resubmit" onClick={() => onResubmit(item)} />
              <Link
                href={createHrefForStoryType(item.story_type)}
                className="font-playpen rounded-md px-2 py-1 text-[10px] font-bold tracking-wide text-[#301C05] uppercase hover:bg-[#EBE4D5]/60"
              >
                Submit new
              </Link>
            </>
          ) : null}
          <ActionButton label="Delete" onClick={() => onDelete(item)} variant="danger" />
        </div>
      </div>

      <div className="mt-3">
        <DynamicActionButton
          text="Open story"
          href={`/user-dashboard/stories/${item.id}`}
          bgColor={buttonBgColor}
          textColor="white"
        />
      </div>
    </div>
  );
};

export default UserDashboardCard;
