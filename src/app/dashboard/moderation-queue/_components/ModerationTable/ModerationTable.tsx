'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TColumn } from '@/types/custom-table.types';

import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import FilterTabs from '@/components/dashboard/FilterTabs/FilterTabs';
import { Button } from '@/components/ui/button';
import { IModerationData } from '@/types/moderationData.type';
import {
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
import { moderationData } from './data/ModerationTable.data';

function ModerationTable() {
  const tableConfig: TColumn<IModerationData>[] = [
    {
      header: 'Sl',
      accessor: 'id',
    },
    {
      header: 'Title',
      cell: (row) => (
        <div className="flex max-w-md items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
            <Image
              src={row?.image || '/placeholder.png'}
              alt="thumb"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-dark-primary line-clamp-2 leading-snug font-semibold">{row?.title}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
    },
    {
      header: 'Author',
      accessor: 'author',
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'Status',
      cell: (row) => {
        return (
          <DynamicBadge
            text={row?.status}
            icon={
              row?.status === 'Approved' ? Check : row?.status === 'Rejected' ? XCircle : Clock3
            }
            color={
              row?.status === 'Approved'
                ? '#149443'
                : row?.status === 'Rejected'
                  ? '#C82323'
                  : '#503225'
            }
          />
        );
      },
    },
    {
      header: 'Action',
      cell: () => (
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
              <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all">
                <Eye size={16} className="text-dark-primary" /> Review
              </button>
              <div className="my-1 h-px bg-[#F1E9E4]" />
              <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all">
                <CheckCircle2 size={16} className="text-success" /> Approve
              </button>
              <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all">
                <XCircle size={16} className="text-error" /> Reject
              </button>
              <div className="my-1 h-px bg-[#F1E9E4]" />
              <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all">
                <Trash2 size={16} className="text-error" /> Remove
              </button>
              <div className="my-1 h-px bg-[#F1E9E4]" />
              <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-all">
                <Edit3 size={16} className="text-secondary" /> Edit
              </button>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  // Tab data for the filter tabs
  const tabsData = [
    { label: 'All', value: 'all', count: 102 },
    { label: 'Pending', value: 'pending', count: 0 },
    { label: 'Flagged', value: 'flagged', count: 0 },
    { label: 'Approved', value: 'approved', count: 0 },
    { label: 'Rejected', value: 'rejected', count: 0 },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      {/* Header with Search Component */}
      <div className="flex items-center justify-between gap-4">
        <SearchField placeholder="Search by title or author..." queryKey="search" />
        <Button className="text-secondary border-primary/20 flex items-center gap-2 rounded-md border bg-white px-6 py-5 font-medium hover:bg-gray-50">
          <Upload size={18} /> Export
        </Button>
      </div>

      {/* Tabs */}
      <FilterTabs tabs={tabsData} />

      {/* Custom Table with Header Styling */}
      <CustomTable columns={tableConfig} data={moderationData} />
    </div>
  );
}

export default ModerationTable;
