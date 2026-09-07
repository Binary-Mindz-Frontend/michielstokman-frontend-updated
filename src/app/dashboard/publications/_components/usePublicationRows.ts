'use client';

import { buildPublicationRows } from '@/lib/publications/adapter';
import { useGetModerationQueueQuery } from '@/redux/features/admin/adminModeration/adminModeration.api';
import type { PublicationStatus, PublicationType } from '@/types/publication.types';
import { useMemo } from 'react';

export type PublicationSort = 'submitted_desc' | 'submitted_asc' | 'updated_desc' | 'updated_asc';
export type MissingAsset = 'text' | 'cover' | 'voice';

type Options = {
  search?: string;
  /** Moderation filter driven by the status tabs. */
  moderationStatus?: string;
  page: number;
  limit: number;
  type: PublicationType | 'all';
  status: PublicationStatus | 'all';
  missing: MissingAsset[];
  sort: PublicationSort;
};

/**
 * Every filter and the sort run on the server, so they span the whole queue and
 * the pagination totals stay honest.
 */
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
    storyType: type === 'all' ? undefined : type,
    publicationStatus: status === 'all' ? undefined : status,
    missing,
    sort,
  });

  const queueData = queueQuery.data?.data;

  const rows = useMemo(() => buildPublicationRows(queueData?.stories), [queueData?.stories]);

  return {
    rows,
    counts: {
      all: queueData?.all ?? 0,
      pending: queueData?.pending ?? 0,
      flagged: queueData?.flagged ?? 0,
      approved: queueData?.approved ?? 0,
      rejected: queueData?.rejected ?? 0,
    },
    meta: queueData?.meta,
    isLoading: queueQuery.isLoading,
    isFetching: queueQuery.isFetching,
    isError: queueQuery.isError,
  };
};
