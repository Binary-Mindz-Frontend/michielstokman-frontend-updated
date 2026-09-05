'use client';

import placeholder from '@/assets/shared/table_placeholder_image.jpg';
import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import FilterTabs from '@/components/dashboard/FilterTabs/FilterTabs';
import { Button } from '@/components/ui/button';
import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';
import { useGetPublicationsQuery } from '@/redux/features/admin/publications/publications.api';
import { TColumn } from '@/types/custom-table.types';
import {
  ASSET_STATUS_LABEL,
  PUBLICATION_STATUS_LABEL,
  STATUS_COLOR,
  type AssetStatus,
  type PublicationListItem,
  type PublicationStatus,
} from '@/types/publication.types';
import Image from 'next/image';
import Link from 'next/link';

function StatusBadge({ status }: { status: AssetStatus | PublicationStatus }) {
  return (
    <DynamicBadge
      text={
        PUBLICATION_STATUS_LABEL[status as PublicationStatus] ||
        ASSET_STATUS_LABEL[status as AssetStatus]
      }
      color={STATUS_COLOR[status] || '#9A8878'}
    />
  );
}

const PublicationsTable = () => {
  const { getQueryObject, searchParams, setQuery, deleteQuery } = useSetSearchQueryInURL();
  const query = getQueryObject();
  const limit = 10;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const status = searchParams.get('status') || 'all';
  const storyType = searchParams.get('story_type') || '';
  const missing = searchParams.get('missing') || '';
  const sort = searchParams.get('sort') || 'submitted_at';

  const { data, isLoading, isFetching } = useGetPublicationsQuery({
    search: Array.isArray(query.search) ? query.search[0] : query.search || undefined,
    story_type: storyType || undefined,
    status,
    missing: missing || undefined,
    sort,
    limit,
    page,
  });

  const items: PublicationListItem[] = data?.data?.items || [];
  const stats = data?.data;
  const meta = data?.data?.meta;

  const tabsData = [
    { label: 'All', value: 'all', count: stats?.all || 0 },
    { label: 'Missing', value: 'missing', count: stats?.missing || 0 },
    { label: 'Pending', value: 'pending', count: stats?.pending || 0 },
    { label: 'In progress', value: 'in_progress', count: stats?.in_progress || 0 },
    { label: 'Ready for review', value: 'ready_for_review', count: stats?.ready_for_review || 0 },
    { label: 'Ready to publish', value: 'ready_to_publish', count: stats?.ready_to_publish || 0 },
    { label: 'Published', value: 'published', count: stats?.published || 0 },
    { label: 'Rejected', value: 'rejected', count: stats?.rejected || 0 },
  ];

  const columns: TColumn<PublicationListItem>[] = [
    {
      header: 'Story card',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-11 overflow-hidden rounded-md bg-[#EDE6DF]">
            <Image
              src={row.cover_image_url || placeholder}
              alt=""
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div>
            <p className="font-medium text-[#301C05]">{row.title}</p>
            <p className="text-xs text-[#8A6E5F]">{row.author || '—'}</p>
          </div>
        </div>
      ),
    },
    { header: 'Type', accessor: 'story_type' },
    {
      header: 'Submitted',
      cell: (row) => new Date(row.submitted_at).toLocaleDateString(),
    },
    {
      header: 'Text',
      cell: (row) => <StatusBadge status={row.content_status} />,
    },
    {
      header: 'Cover',
      cell: (row) => <StatusBadge status={row.cover_status} />,
    },
    {
      header: 'Voice',
      cell: (row) => <StatusBadge status={row.voice_status} />,
    },
    {
      header: 'Publication',
      cell: (row) => <StatusBadge status={row.publication_status} />,
    },
    {
      header: '',
      cell: (row) => (
        <Button asChild className="bg-primary text-white">
          <Link href={`/dashboard/publications/${row.id}`}>Open</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchField placeholder="Search by title or author..." queryKey="search" />
        <div className="flex flex-wrap gap-2">
          <select
            value={storyType}
            onChange={(event) =>
              event.target.value
                ? setQuery('story_type', event.target.value)
                : deleteQuery('story_type')
            }
            className="rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="confession">Confession</option>
            <option value="meditation">Meditation</option>
          </select>
          <select
            value={missing}
            onChange={(event) =>
              event.target.value ? setQuery('missing', event.target.value) : deleteQuery('missing')
            }
            className="rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm"
          >
            <option value="">Any assets</option>
            <option value="text">Missing text</option>
            <option value="cover">Missing cover</option>
            <option value="voice">Missing voice</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setQuery('sort', event.target.value)}
            className="rounded-md border border-[#E1D7CE] bg-white px-3 py-2 text-sm"
          >
            <option value="submitted_at">Sort by submission</option>
            <option value="updated_at">Sort by last update</option>
          </select>
        </div>
      </div>

      <FilterTabs tabs={tabsData} />

      {isLoading || isFetching ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <TableEmptyState message="No publications match these filters." />
      ) : (
        <CustomTable columns={columns} data={items} />
      )}

      {!isLoading && !isFetching && meta && <CustomPagination meta={meta} />}
    </div>
  );
};

export default PublicationsTable;
