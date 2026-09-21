import type {
  ModerationStatus,
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

const KNOWN_STATUSES = new Set<string>(STATUS_ORDER);

/**
 * Read one asset status off the API payload. The server owns these values, so an
 * unrecognised one means the two sides have drifted — fall back to the safest
 * reading rather than inventing a rung.
 */
export const normalizePublicationStatus = (
  value: unknown,
  fallback: PublicationStatus = 'pending',
): PublicationStatus => {
  const raw = String(value ?? '')
    .toLowerCase()
    .replace('assetreviewstatus.', '')
    .trim();
  return KNOWN_STATUSES.has(raw) ? (raw as PublicationStatus) : fallback;
};

/** Pull the three asset statuses and the overall rung out of an API payload. */
export const readPublicationStatuses = (raw: {
  content_status?: unknown;
  cover_status?: unknown;
  voice_status?: unknown;
  publication_status?: unknown;
}): PublicationStatuses => ({
  text: normalizePublicationStatus(raw.content_status),
  cover: normalizePublicationStatus(raw.cover_status, 'missing'),
  voice: normalizePublicationStatus(raw.voice_status, 'missing'),
  overall: normalizePublicationStatus(raw.publication_status),
});
