'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import FilterTabs from '@/components/dashboard/FilterTabs/FilterTabs';
import { Button } from '@/components/ui/button';
import { TColumn } from '@/types/custom-table.types';
import { IVoiceReviewData } from '@/types/voiceReviewData.type';
import { Play, RotateCcw, Upload } from 'lucide-react';
import voiceData from './data/voiceData.data';

function VoiceReviewTable() {
  const tableConfig: TColumn<IVoiceReviewData>[] = [
    {
      header: 'Sl',
      cell: (row) => <span className="text-secondary">{row?.id}</span>,
    },
    {
      header: 'Content Title',

      cell: (row) => (
        <p className="text-dark-primary line-clamp-2 leading-snug font-semibold">{row?.title}</p>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
    },
    {
      header: 'Voice',
      accessor: 'voice',
    },
    {
      header: 'Duration',
      accessor: 'duration',
    },
    {
      header: 'Generated',
      accessor: 'generated',
    },
    {
      header: 'Action',
      cell: () => (
        <div className="flex items-center gap-2">
          {/* Play & Refresh Buttons from Screenshot */}
          <button className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors">
            <Play size={18} />
          </button>
          <button className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>
      ),
    },
  ];

  const tabsData = [
    { label: 'All', value: 'all', count: 102 },
    { label: 'Stories', value: 'story', count: 45 },
    { label: 'Meditations', value: 'meditations', count: 57 },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <div className="flex items-center justify-between gap-4">
        <SearchField placeholder="Search by title or type..." queryKey="search" />
        <Button className="text-secondary border-primary/20 flex items-center gap-2 rounded-md border bg-white px-6 py-5 font-medium hover:bg-gray-50">
          <Upload size={18} /> Export
        </Button>
      </div>

      <FilterTabs tabs={tabsData} />

      <CustomTable columns={tableConfig} data={voiceData} />
    </div>
  );
}

export default VoiceReviewTable;
