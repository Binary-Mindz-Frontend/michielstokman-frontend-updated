'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';
import {
  useDeactivateLiberationMutation,
  useDeleteLiberationMutation,
  useGetAllLiberationsQuery,
} from '@/redux/features/admin/journeyManagement/journeyManagement.api';
import { TColumn } from '@/types/custom-table.types';
import { FormatDateTime } from '@/utils/formatDateTime';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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
  const [journeyToDelete, setJourneyToDelete] = useState<ILiberationData | null>(null);
  const { searchParams } = useSetSearchQueryInURL();
  const searchTerm = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, isFetching } = useGetAllLiberationsQuery({
    limit: 10,
    page: currentPage,
    search: searchTerm,
  });

  const [deactivateLiberation] = useDeactivateLiberationMutation();
  const [deleteLiberation, { isLoading: isDeleting }] = useDeleteLiberationMutation();

  const journeyData = data?.data?.definitions || [];
  const meta = data?.data?.meta;

  const handleDelete = async () => {
    if (!journeyToDelete) return;
    const toastId = toast.loading(`Deleting '${journeyToDelete.title}'...`);
    try {
      const response = await deleteLiberation(journeyToDelete.id).unwrap();
      if (response.success || response.status === 200) {
        toast.success(response.message || 'Journey deleted successfully!', { id: toastId });
        setJourneyToDelete(null);
      } else {
        toast.error(response.message || 'Failed to delete journey', { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Delete Journey Error:', error);
      toast.error(error?.data?.message || 'Something went wrong!', { id: toastId });
    }
  };

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
      header: 'Published in catalog',
      cell: (row) => (
        <Switch
          checked={row?.is_active}
          onCheckedChange={() => handleStatusToggle(row?.id, row?.is_active)}
          aria-label={row?.is_active ? 'Published in catalog' : 'Hidden from catalog'}
        />
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/journey-management/${row?.id}`}
            className="text-secondary hover:bg-primary/10 flex w-fit cursor-pointer items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium transition-all"
          >
            <Edit size={15} className="text-secondary" /> Edit
          </Link>
          <button
            type="button"
            onClick={() => setJourneyToDelete(row)}
            className="flex w-fit cursor-pointer items-center gap-1.5 rounded-sm border border-red-200 bg-red-50/60 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(journeyToDelete)}
        onOpenChange={(open) => {
          if (!open) setJourneyToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this Liberation Journey?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-black">&quot;{journeyToDelete?.title}&quot;</span>
              ? This will permanently remove the journey and its 7 days from the catalog. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setJourneyToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JourneyManagementTable;
