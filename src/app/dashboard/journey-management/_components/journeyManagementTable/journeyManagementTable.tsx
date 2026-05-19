'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import { Switch } from '@/components/ui/switch';
import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';
import {
  useDeactivateLiberationMutation,
  useGetAllLiberationsQuery,
} from '@/redux/features/admin/journeyManagement/journeyManagement.api';
import { TColumn } from '@/types/custom-table.types';
import { FormatDateTime } from '@/utils/formatDateTime';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ILiberationData {
  id: string;
  title: string;
  created_at: string;
  total_days: number;
  price: number;
  currency: string;
  is_active: boolean;
}

function JourneyManagementTable() {
  const { searchParams } = useSetSearchQueryInURL();
  const searchTerm = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, isFetching } = useGetAllLiberationsQuery({
    limit: 10,
    page: currentPage,
    search: searchTerm,
  });

  const [deactivateLiberation] = useDeactivateLiberationMutation();

  const journeyData = data?.data?.definitions || [];
  const meta = data?.data?.meta;

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const toastId = toast.loading(nextStatus ? 'Activating journey...' : 'Deactivating journey...');

    try {
      const response = await deactivateLiberation({
        id,
        isActive: nextStatus,
      }).unwrap();

      if (response.success) {
        toast.success(
          response.message ||
            `Liberation ${nextStatus ? 'activated' : 'deactivated'} successfully!`,
          { id: toastId },
        );
      } else {
        toast.error('Failed to update status', { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Status Update Error:', error);
      toast.error(error?.data?.message || 'Something went wrong!', { id: toastId });
    }
  };

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
      cell: (row) => <span>{FormatDateTime(row?.created_at)}</span>,
    },
    {
      header: 'Days',
      accessor: 'total_days',
    },
    {
      header: 'Price',
      cell: (row) => <span>€ {row?.price}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <Switch
          checked={row?.is_active}
          onCheckedChange={() => handleStatusToggle(row?.id, row?.is_active)}
        />
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <Link
          href={`/dashboard/journey-management/${row?.id}`}
          className="text-dark-primary hover:bg-primary/10 flex w-fit cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 transition-all"
        >
          <Edit size={18} className="text-secondary" /> Edit
        </Link>
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

      {!isLoading && !isFetching && meta && <CustomPagination meta={meta} />}
    </div>
  );
}

export default JourneyManagementTable;
