'use client';

import img from '@/assets/table_placeholder_image.jpg';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import FilterTabs from '@/components/dashboard/FilterTabs/FilterTabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';
import { useGetModerationQueueQuery } from '@/redux/features/admin/adminModeration/adminModeration.api';
import { TColumn } from '@/types/custom-table.types';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  MoreVertical,
  Trash2,
  Upload,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ApproveAction, DeleteAction, RejectAction } from '../ApproveAction/ApproveAction';
import EditAction from '../EditModeration/EditModeration';
import { ReviewDetails } from '../ReviewDetails/ReviewDetails';
import ModerationPagination from './ModerationPagination';
// import { EditAction } from '../EditModeration/EditModeration';

interface IModerationStory {
  id: string;
  title: string;
  story_type: string;
  author: string;
  created_at: string;
  moderation_status: 'pending' | 'flagged' | 'approved' | 'rejected';
  cover_image_url: string | null;
}

const ModerationTable = () => {
  const { getQueryObject, searchParams } = useSetSearchQueryInURL();
  const query = getQueryObject();

  // --- Modal State ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'review' | 'approve' | 'reject' | 'remove' | 'edit' | null;
    selectedStory: IModerationStory | null;
  }>({
    isOpen: false,
    type: null,
    selectedStory: null,
  });

  const closeModal = () => setModalState((prev) => ({ ...prev, isOpen: false }));

  const openModal = (
    type: 'review' | 'approve' | 'reject' | 'remove' | 'edit',
    story: IModerationStory,
  ) => {
    setModalState({ isOpen: true, type, selectedStory: story });
  };

  const limit = 10;
  const currentOffset = parseInt(searchParams.get('offset') || '0');
  const currentStatus = searchParams.get('status') || 'all';

  const { data, isLoading } = useGetModerationQueueQuery({
    search: Array.isArray(query.search) ? query.search[0] : query.search || undefined,
    status: currentStatus === 'all' ? undefined : currentStatus,
    limit: limit,
    offset: currentOffset,
  });

  const stories = data?.data?.stories || [];
  const stats = data?.data;
  const activeTab = currentStatus;
  const totalCount = stats?.[activeTab] || stats?.all || 0;

  const tableConfig: TColumn<IModerationStory>[] = [
    { header: 'Sl', accessor: 'id' },
    {
      header: 'Title',
      cell: (row) => (
        <div className="flex max-w-md items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
            <Image src={row?.cover_image_url || img} alt="thumb" fill className="object-cover" />
          </div>
          <p className="text-dark-primary line-clamp-2 leading-snug font-semibold">{row?.title}</p>
        </div>
      ),
    },
    { header: 'Type', accessor: 'story_type' },
    { header: 'Author', accessor: 'author' },
    { header: 'Date', accessor: 'created_at' },
    {
      header: 'Status',
      cell: (row) => {
        const status = row?.moderation_status?.toLowerCase() || 'pending';
        const statusConfig = {
          approved: { color: '#149443', icon: Check, label: 'Approved' },
          rejected: { color: '#C82323', icon: XCircle, label: 'Rejected' },
          flagged: { color: '#EAB308', icon: AlertTriangle, label: 'Flagged' },
          pending: { color: '#503225', icon: Clock3, label: 'Pending' },
        };
        const current = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return <DynamicBadge text={current.label} icon={current.icon} color={current.color} />;
      },
    },
    {
      header: 'Action',
      cell: (row) => (
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full p-1 transition-colors outline-none hover:bg-gray-100">
              <MoreVertical size={20} className="text-secondary cursor-pointer" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="border-primary/10 z-50 w-48 rounded-md bg-[#FAF7F5] p-0 shadow-sm"
          >
            <div className="flex flex-col">
              <button
                onClick={() => openModal('review', row)}
                className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all"
              >
                <Eye size={16} /> Review
              </button>
              <div className="my-1 h-px bg-[#F1E9E4]" />
              <button
                onClick={() => openModal('approve', row)}
                className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all"
              >
                <CheckCircle2 size={16} className="text-success" /> Approve
              </button>
              <button
                onClick={() => openModal('reject', row)}
                className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all"
              >
                <XCircle size={16} className="text-error" /> Reject
              </button>
              <div className="my-1 h-px bg-[#F1E9E4]" />
              <button
                onClick={() => openModal('remove', row)}
                className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all"
              >
                <Trash2 size={16} className="text-error" /> Remove
              </button>
              <button
                onClick={() => openModal('edit', row)}
                className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all"
              >
                <Edit3 size={16} className="text-secondary" /> Edit
              </button>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  const tabsData = [
    { label: 'All', value: 'all', count: stats?.all || 0 },
    { label: 'Pending', value: 'pending', count: stats?.pending || 0 },
    { label: 'Flagged', value: 'flagged', count: stats?.flagged || 0 },
    { label: 'Approved', value: 'approved', count: stats?.approved || 0 },
    { label: 'Rejected', value: 'rejected', count: stats?.rejected || 0 },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <div className="flex items-center justify-between gap-4">
        <SearchField placeholder="Search by title or author..." queryKey="search" />
        <Button className="text-secondary border-primary/20 flex items-center gap-2 rounded-md border bg-white px-6 py-5 font-medium hover:bg-gray-50">
          <Upload size={18} /> Export
        </Button>
      </div>

      <FilterTabs tabs={tabsData} />

      {isLoading ? (
        <TableSkeleton />
      ) : stories.length === 0 ? (
        <TableEmptyState
          message={`No ${currentStatus || 'pending'} stories found matching your criteria.`}
        />
      ) : (
        <CustomTable columns={tableConfig} data={stories} />
      )}

      {!isLoading && stories.length > 0 && (
        <ModerationPagination totalItems={totalCount} limit={limit} />
      )}

      {/* --- Global Dynamic Modal --- */}
      <DynamicModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={`${modalState.type?.toUpperCase()}`}
      >
        {modalState.selectedStory && (
          <>
            {modalState.type === 'review' && <ReviewDetails id={modalState.selectedStory.id} />}

            {modalState.type === 'approve' && (
              <ApproveAction id={modalState.selectedStory.id} onSuccess={closeModal} />
            )}

            {modalState.type === 'reject' && (
              <RejectAction id={modalState.selectedStory.id} onSuccess={closeModal} />
            )}

            {modalState.type === 'remove' && (
              <DeleteAction id={modalState.selectedStory.id} onSuccess={closeModal} />
            )}

            {modalState.type === 'edit' && (
              <EditAction id={modalState.selectedStory.id} onSuccess={closeModal} />
            )}
          </>
        )}
      </DynamicModal>
    </div>
  );
};

export default ModerationTable;
