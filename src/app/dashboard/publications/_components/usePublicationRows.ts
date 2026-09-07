'use client';

import { buildPublicationRows } from '@/lib/publications/adapter';
import { selectPublicationDrafts } from '@/redux/features/admin/publications/publicationsDraft.slice';
import { useGetModerationQueueQuery } from '@/redux/features/admin/adminModeration/adminModeration.api';
import { useGetVoiceReviewListQuery } from '@/redux/features/admin/adminVoiceReview/adminVoiceReview.api';
import { useAppSelector } from '@/redux/hooks';
import type { PublicationRow, PublicationStatus, PublicationType } from '@/types/publication.types';
import { useMemo } from 'react';

export type PublicationSort = 'submitted_desc' | 'submitted_asc' | 'updated_desc' | 'updated_asc';
export type MissingAsset = 'text' | 'cover' | 'voice';

/**
 * Audio lives on a different endpoint than the queue, so one wide page of the voice
 * list is pulled and merged in memory. Replaced by `audio_path` on the queue item.
 */
const VOICE_LOOKUP_LIMIT = 100;

type Options = {
  search?: string;
  /** Server-side moderation filter driven by the status tabs. */
  moderationStatus?: string;
  page: number;
  limit: number;
  /** Client-side filters, applied to the current page of results. */
  type: PublicationType | 'all';
  status: PublicationStatus | 'all';
  missing: MissingAsset[];
  sort: PublicationSort;
};

export const usePublicationRows = ({
  search,
  moderationStatus,
  page,
  limit,
  type,
  status,
  missing,
  sort,
}: Options) => {
  const queueQuery = useGetModerationQueueQuery({
    search: search || undefined,
    status: moderationStatus,
    limit,
    page,
  });
  const voiceQuery = useGetVoiceReviewListQuery({ limit: VOICE_LOOKUP_LIMIT, page: 1 });
  const drafts = useAppSelector(selectPublicationDrafts);

  const queueData = queueQuery.data?.data;

  const rows = useMemo(
    () =>
      buildPublicationRows({
        queueItems: queueData?.stories,
        voiceItems: voiceQuery.data?.data?.items,
        drafts,
      }),
    [queueData?.stories, voiceQuery.data?.data?.items, drafts],
  );

  const visibleRows = useMemo(() => {
    const matchesMissing = (row: PublicationRow) =>
      missing.every((asset) => row[asset] === 'missing');

    const filtered = rows.filter(
      (row) =>
        (type === 'all' || row.type === type) &&
        (status === 'all' || row.overall === status) &&
        matchesMissing(row),
    );

    const direction = sort.endsWith('_asc') ? 1 : -1;
    const key = sort.startsWith('updated') ? 'updatedAt' : 'submittedAt';

    return [...filtered].sort((a, b) => {
      const diff = (a[key] - b[key]) * direction;
      return diff !== 0 ? diff : a.title.localeCompare(b.title);
    });
  }, [rows, type, status, missing, sort]);

  return {
    rows: visibleRows,
    /** Rows on this page before client-side filters, so the UI can explain a mismatch. */
    pageSize: rows.length,
    counts: {
      all: queueData?.all ?? 0,
      pending: queueData?.pending ?? 0,
      flagged: queueData?.flagged ?? 0,
      approved: queueData?.approved ?? 0,
      rejected: queueData?.rejected ?? 0,
    },
    meta: queueData?.meta,
    isLoading: queueQuery.isLoading,
    isFetching: queueQuery.isFetching || voiceQuery.isFetching,
    isError: queueQuery.isError,
  };
};
