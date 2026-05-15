'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetAllLiberationsQuery } from '@/redux/features/admin/journeyManagement/journeyManagement.api';

import { TColumn } from '@/types/custom-table.types';
import { Edit3, Eye, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Liberation Data type
interface ILiberationData {
  id: string;
  title: string;
  created_at: string;
  total_days: number;
  price_cents: number;
  currency: string;
  is_active: boolean;
}

function JourneyManagementTable() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  // API Hooks
  const { data, isLoading, isFetching } = useGetAllLiberationsQuery({
    limit: 50,
    offset: 0,
    search: searchTerm,
  });

  // Extracting journey data from the API response
  const journeyData = data?.data?.definitions || [];

  const tableConfig: TColumn<ILiberationData>[] = [
    {
      header: 'Sl',
      cell: (_, index) => <span className="text-secondary">{(index || 0) + 1}</span>,
    },
    {
      header: 'Title',
      cell: (row) => (
        <p className="line-clamp-2 max-w-75 leading-snug font-semibold text-[#3A2A21]">
          {row?.title}
        </p>
      ),
    },
    {
      header: 'Date',
      cell: (row) => (
        <span>
          {new Date(row?.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Days',
      accessor: 'total_days',
    },
    {
      header: 'Price',
      cell: (row) => <span>${row?.price_cents}</span>,
    },
    {
      header: 'Active',
      cell: (row) => (
        <DynamicBadge
          text={row?.is_active ? 'Active' : 'Inactive'}
          color={row?.is_active ? '#10B981' : '#EF4444'}
        />
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full p-1 transition-colors hover:bg-gray-100">
              <MoreVertical size={20} className="text-secondary cursor-pointer" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="border-primary/10 w-48 rounded-md bg-[#FAF7F5] p-0 shadow-sm"
          >
            <div className="flex flex-col">
              <Link
                href={`/dashboard/journey-management/${row?.id}`}
                className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all"
              >
                <Eye size={16} className="text-dark-primary" /> View Details
              </Link>
              <div className="my-1 h-px bg-[#F1E9E4]" />
              <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all">
                <Edit3 size={16} className="text-secondary" /> Edit
              </button>
              <div className="my-1 h-px bg-[#F1E9E4]" />
              <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all">
                <Trash2 size={16} className="text-error" /> Remove
              </button>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <SearchField placeholder="Search by Journey" queryKey="search" />

      <div>
        {isLoading || isFetching ? (
          <TableSkeleton />
        ) : journeyData.length === 0 ? (
          <TableEmptyState message="No journey found!" />
        ) : (
          <CustomTable columns={tableConfig} data={journeyData} />
        )}
      </div>
    </div>
  );
}

export default JourneyManagementTable;
