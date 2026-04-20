'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TColumn } from '@/types/custom-table.types';
import { IPhotoManagementData } from '@/types/PhotoManagementData.type';
import { Edit3, Eye, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { photoData } from './data/PhotoManagementTable.data';

function PhotoManagementTable() {
  const tableConfig: TColumn<IPhotoManagementData>[] = [
    {
      header: 'Sl',
      accessor: 'id',
    },
    {
      header: 'Content Title',
      cell: (row) => (
        <div className="py-2">
          <div className="relative h-15 w-20 shrink-0 overflow-hidden rounded-md border border-[#F1E9E4] shadow-sm">
            <Image
              src={row?.image || '/placeholder.png'}
              alt="Photo Thumbnail"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
    },
    {
      header: 'Action',
      cell: () => (
        // <Popover>
        //   <PopoverTrigger asChild>
        //     <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
        //       <MoreVertical size={20} className="text-secondary cursor-pointer" />
        //     </button>
        //   </PopoverTrigger>
        //   <PopoverContent
        //     align="end"
        //     className="w-44 rounded-md border-none bg-[#FAF7F5] p-1 shadow-lg ring-1 ring-black/5"
        //   >
        //     <div className="flex flex-col">
        //       <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all">
        //         <Eye size={16} className="text-primary" /> View Details
        //       </button>
        //       <div className="mx-2 my-1 h-px bg-[#F1E9E4]" />
        //       <button className="text-dark-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all">
        //         <Edit3 size={16} className="text-secondary" /> Edit
        //       </button>
        //       <div className="mx-2 my-1 h-px bg-[#F1E9E4]" />
        //       <button className="text-error flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all hover:bg-red-50">
        //         <Trash2 size={16} className="text-error" /> Remove
        //       </button>
        //     </div>
        //   </PopoverContent>
        // </Popover>
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
                <Eye size={16} className="text-dark-primary" /> View Details
              </button>
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
    <div>
      <CustomTable columns={tableConfig} data={photoData} />
    </div>
  );
}

export default PhotoManagementTable;
