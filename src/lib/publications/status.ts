import type {
  ModerationStatus,
  PublicationDraft,
  PublicationStatus,
  PublicationStatuses,
} from '@/types/publication.types';
import {
  Check,
  CircleDashed,
  Clock3,
  Eye,
  Globe2,
  Loader,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

type StatusMeta = {
  label: string;
  color: string;
  icon: LucideIcon;
};

/** One definition of every rung on the ladder, so a status never looks different twice. */
export const STATUS_META: Record<PublicationStatus, StatusMeta> = {
  missing: { label: 'Missing', color: '#8E8E8E', icon: CircleDashed },
  pending: { label: 'Pending', color: '#503225', icon: Clock3 },
  in_progress: { label: 'In progress', color: '#2563EB', icon: Loader },
  ready_for_review: { label: 'Ready for review', color: '#BF7758', icon: Eye },
  approved: { label: 'Approved', color: '#149443', icon: Check },
  rejected: { label: 'Rejected', color: '#C82323', icon: XCircle },
  published: { label: 'Published', color: '#0F766E', icon: Globe2 },
};

/** Order used by the status filter dropdown. */
export const STATUS_ORDER: PublicationStatus[] = [
  'missing',
  'pending',
  'in_progress',
  'ready_for_review',
  'approved',
  'rejected',
  'published',
];

export const normalizeModerationStatus = (value: unknown): ModerationStatus => {
  const raw = String(value ?? '')
    .toLowerCase()
    .replace('moderationstatus.', '')
    .trim();
  if (raw === 'approved' || raw === 'rejected' || raw === 'flagged') return raw;
  return 'pending';
};

type DeriveInput = {
  moderationStatus: ModerationStatus;
  coverImageUrl: string | null;
  audioPath: string | null;
  draft: PublicationDraft;
  /** Undefined when the payload does not carry the text (the queue list does not). */
  hasText?: boolean;
  /** Undefined when we cannot compare the edited text against the submission. */
  textEdited?: boolean;
};

const deriveText = ({
  moderationStatus,
  draft,
  hasText,
  textEdited,
}: DeriveInput): PublicationStatus => {
  if (moderationStatus === 'rejected') return 'rejected';
  if (hasText === false) return 'missing';
  if (draft.contentApproved || moderationStatus === 'approved') return 'approved';
  if (moderationStatus === 'flagged' || textEdited) return 'ready_for_review';
  return 'pending';
};

const deriveCover = ({ coverImageUrl, draft }: DeriveInput): PublicationStatus => {
  if (draft.coverApproved) return 'approved';
  if (draft.coverRegeneratedAt) return 'in_progress';
  if (!coverImageUrl && !draft.replacedCoverUrl) return 'missing';
  return 'ready_for_review';
};

const deriveVoice = ({ audioPath, draft }: DeriveInput): PublicationStatus => {
  if (draft.voiceApproved) return 'approved';
  if (draft.voiceRegeneratedAt) return 'in_progress';
  if (!audioPath && !draft.replacedAudioUrl) return 'missing';
  return 'ready_for_review';
};

/** Assets that must be approved before this publication may go live. */
const requiredAssets = (statuses: Omit<PublicationStatuses, 'overall'>, draft: PublicationDraft) =>
  draft.hasNoVoice
    ? [statuses.text, statuses.cover]
    : [statuses.text, statuses.cover, statuses.voice];

export const derivePublicationStatuses = (input: DeriveInput): PublicationStatuses => {
  const text = deriveText(input);
  const cover = deriveCover(input);
  const voice = deriveVoice(input);
  const assets = { text, cover, voice };

  const overall = ((): PublicationStatus => {
    if (input.moderationStatus === 'rejected') return 'rejected';
    // `/approve` is what exposes a story publicly today, so approved == published.
    if (input.moderationStatus === 'approved') return 'published';

    const required = requiredAssets(assets, input.draft);
    if (required.every((status) => status === 'approved')) return 'ready_for_review';
    if (required.some((status) => status === 'missing')) return 'missing';
    if (required.some((status) => status === 'approved' || status === 'in_progress')) {
      return 'in_progress';
    }
    if (input.moderationStatus === 'flagged') return 'ready_for_review';
    return 'pending';
  })();

  return { ...assets, overall };
};

/** Human-readable reasons the Publish button is disabled. Empty array means publishable. */
export const publishBlockers = (
  statuses: PublicationStatuses,
  draft: PublicationDraft,
): string[] => {
  if (statuses.overall === 'published') return ['Already published'];
  if (statuses.overall === 'rejected') return ['This publication was rejected'];

  const blockers: string[] = [];
  if (statuses.text !== 'approved') blockers.push('Written content is not approved');
  if (statuses.cover !== 'approved') blockers.push('Story card is not approved');
  if (!draft.hasNoVoice && statuses.voice !== 'approved') blockers.push('Voice is not approved');
  return blockers;
};
