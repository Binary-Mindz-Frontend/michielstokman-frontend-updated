/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import TableEmptyState from '@/components/dashboard/CustomTable/TableEmptyState';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import FilterTabs from '@/components/dashboard/FilterTabs/FilterTabs';
import useSetSearchQueryInURL from '@/hooks/useSetSearchQueryInURL';
import {
  useGetVoiceReviewListQuery,
  useRegenerateVoiceMutation,
} from '@/redux/features/admin/adminVoiceReview/adminVoiceReview.api';
import { TColumn } from '@/types/custom-table.types';
import { IVoiceReviewData } from '@/types/voiceReviewData.type';
import { FormatDate } from '@/utils/formatDateTime';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

let globalAudioInstance: HTMLAudioElement | null = null;

function VoiceReviewTable() {
  const { searchParams } = useSetSearchQueryInURL();
  const searchQuery = searchParams.get('search') || '';
  const currentTab = searchParams.get('story_type') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const {
    data: voiceReviewList,
    isLoading,
    isFetching,
  } = useGetVoiceReviewListQuery({
    search: searchQuery || undefined,
    story_type: currentTab === 'All' ? undefined : currentTab,
    limit: 10,
    page: currentPage,
  });

  const voiceReviewData = voiceReviewList?.data?.items || [];
  const meta = voiceReviewList?.data?.meta;
  const [regenerateVoice] = useRegenerateVoiceMutation();

  useEffect(() => {
    return () => {
      if (globalAudioInstance) {
        globalAudioInstance.pause();
        globalAudioInstance = null;
      }
    };
  }, []);

  const handlePlayPause = (row: IVoiceReviewData) => {
    if (!row?.audio_path || !row?.id) return;

    if (playingId === row?.id) {
      if (globalAudioInstance) {
        if (!globalAudioInstance.paused) {
          globalAudioInstance.pause();
          setPlayingId(null);
        } else {
          globalAudioInstance.play();
          setPlayingId(row?.id);
        }
      }
      return;
    }

    if (globalAudioInstance) {
      globalAudioInstance.pause();
    }

    globalAudioInstance = new Audio(row?.audio_path);
    globalAudioInstance.play();
    setPlayingId(row?.id);

    globalAudioInstance.onended = () => {
      setPlayingId(null);
    };
  };

  const handleRegenerate = async (storyId: string) => {
    setLoadingId(storyId);
    const toastId = toast.loading('Regenerating voice audio...');
    try {
      const response = await regenerateVoice(storyId).unwrap();
      if (response.success || response.status === 200) {
        toast.success(response.message || 'Voice regeneration started successfully!', {
          id: toastId,
        });
      }
    } catch (error: any) {
      console.error('Regeneration Error:', error);
      const errorMsg =
        error?.data?.message || error?.data?.detail?.[0]?.msg || 'Failed to regenerate voice.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const tableConfig: TColumn<IVoiceReviewData>[] = [
    {
      header: 'Sl',
      cell: (_, index) => <span className="text-secondary">{(index ?? 0) + 1}</span>,
    },
    {
      header: 'Content Title',
      cell: (row) => (
        <p className="text-secondary line-clamp-2 leading-snug font-semibold">{row?.title}</p>
      ),
    },
    {
      header: 'Type',
      accessor: 'story_type',
    },
    {
      header: 'Duration',
      accessor: 'audio_duration',
    },
    {
      header: 'Generated',
      accessor: 'created_at',
    },
    {
      header: 'Updated',
      cell: (row) => {
        return <span>{FormatDate(row?.updated_at)}</span>;
      },
    },
    {
      header: 'Action',
      cell: (row) => {
        const isCurrentAudioPlaying = playingId === row?.id;
        const isThisRowRegenerating = loadingId === row?.id;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePlayPause(row)}
              className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors"
              title={isCurrentAudioPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isCurrentAudioPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              type="button"
              disabled={loadingId !== null}
              onClick={() => row?.id && handleRegenerate(row?.id)}
              className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              title="Regenerate Voice"
            >
              <RotateCcw
                size={18}
                className={isThisRowRegenerating ? 'text-primary animate-spin' : ''}
              />
            </button>
          </div>
        );
      },
    },
  ];

  const tabsData = [
    { label: 'All', value: 'All', count: voiceReviewList?.data?.all || 0 },
    { label: 'Stories', value: 'Stories', count: voiceReviewList?.data?.stories || 0 },
    { label: 'Meditations', value: 'Meditations', count: voiceReviewList?.data?.meditations || 0 },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <SearchField placeholder="Search by title or type..." queryKey="search" />
      <FilterTabs tabs={tabsData} queryKey="story_type" />

      {isLoading || isFetching ? (
        <TableSkeleton SKELETON_COLS={6} />
      ) : voiceReviewData.length === 0 ? (
        <TableEmptyState message="No voice reviews found for the filters Please try again." />
      ) : (
        <CustomTable columns={tableConfig} data={voiceReviewData} />
      )}

      {!isLoading && !isFetching && meta && <CustomPagination meta={meta} />}
    </div>
  );
}

export default VoiceReviewTable;
