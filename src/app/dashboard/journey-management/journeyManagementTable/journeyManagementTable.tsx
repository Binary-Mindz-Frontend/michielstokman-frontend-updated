'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import { TColumn } from '@/types/custom-table.types';
import { Edit3, Eye, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface IJourneyData {
  id: number;
  title: string;
  date: string;
  days: number;
  price: string;
}

function JourneyManagementTable() {
  const journeyData: IJourneyData[] = [
    {
      id: 1,
      title: 'Feel More Vital – 7 Days to More Life Energy',
      date: '12 Jan 26',
      days: 7,
      price: '$50',
    },
    {
      id: 2,
      title: 'Feel More Vital – 7 Days to More Life Energy',
      date: '12 Jan 26',
      days: 7,
      price: '$50',
    },
    {
      id: 3,
      title: 'Feel More Vital – 7 Days to More Life Energy',
      date: '12 Jan 26',
      days: 7,
      price: '$50',
    },
    {
      id: 4,
      title: 'Feel More Vital – 7 Days to More Life Energy',
      date: '12 Jan 26',
      days: 7,
      price: '$50',
    },
    {
      id: 5,
      title: 'Feel More Vital – 7 Days to More Life Energy',
      date: '12 Jan 26',
      days: 7,
      price: '$50',
    },
    {
      id: 6,
      title: 'Feel More Vital – 7 Days to More Life Energy',
      date: '12 Jan 26',
      days: 7,
      price: '$50',
    },
    {
      id: 7,
      title: 'Feel More Vital – 7 Days to More Life Energy',
      date: '12 Jan 26',
      days: 7,
      price: '$50',
    },
  ];

  const tableConfig: TColumn<IJourneyData>[] = [
    {
      header: 'Sl',
      cell: (row) => <span className="text-secondary">{row?.id}</span>,
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
      accessor: 'date',
    },
    {
      header: 'Days',
      accessor: 'days',
    },
    {
      header: 'Price',
      accessor: 'price',
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

      {/* Custom Table */}
      <CustomTable columns={tableConfig} data={journeyData} />
    </div>
  );
}

export default JourneyManagementTable;
