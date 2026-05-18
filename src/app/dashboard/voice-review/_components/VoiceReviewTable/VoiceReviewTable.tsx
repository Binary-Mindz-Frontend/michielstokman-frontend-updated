/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import SearchField from '@/components/dashboard/Fields/SearchField/SearchField';
import FilterTabs from '@/components/dashboard/FilterTabs/FilterTabs';
import {
  useGetVoiceReviewListQuery,
  useRegenerateVoiceMutation,
} from '@/redux/features/admin/adminVoiceReview/adminVoiceReview.api';
import { TColumn } from '@/types/custom-table.types';
import { IVoiceReviewData } from '@/types/voiceReviewData.type';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

let globalAudioInstance: HTMLAudioElement | null = null;

function VoiceReviewTable() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get('search') : '';

  const [playingId, setPlayingId] = useState<string | null>(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: voiceReviewList } = useGetVoiceReviewListQuery({
    search: searchQuery || '',
    limit: 50,
    offset: 0,
  });

  const voiceReviewData = voiceReviewList?.data?.items || [];

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

    const audioUrl = `http://34.255.26.146:8000/${row.audio_path}`;

    if (playingId === row.id) {
      if (globalAudioInstance) {
        if (!globalAudioInstance.paused) {
          globalAudioInstance.pause();
          setPlayingId(null);
        } else {
          globalAudioInstance.play();
          setPlayingId(row.id);
        }
      }
      return;
    }

    if (globalAudioInstance) {
      globalAudioInstance.pause();
    }

    globalAudioInstance = new Audio(audioUrl);
    globalAudioInstance.play();
    setPlayingId(row.id);

    globalAudioInstance.onended = () => {
      setPlayingId(null);
    };
  };

  // Handle Voice Regeneration Action
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

  // Table Config
  const tableConfig: TColumn<IVoiceReviewData>[] = [
    {
      header: 'Sl',
      cell: (_, index) => <span className="text-secondary">{(index ?? 0) + 1}</span>,
    },
    {
      header: 'Content Title',
      cell: (row) => (
        <p className="text-dark-primary line-clamp-2 leading-snug font-semibold">{row?.title}</p>
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
      header: 'Action',
      cell: (row) => {
        const isCurrentAudioPlaying = playingId === row?.id;
        const isThisRowRegenerating = loadingId === row?.id;

        return (
          <div className="flex items-center gap-2">
            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={() => handlePlayPause(row)}
              className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors"
              title={isCurrentAudioPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isCurrentAudioPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Regenerate Button */}
            <button
              type="button"
              disabled={loadingId !== null}
              onClick={() => row?.id && handleRegenerate(row.id)}
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
    { label: 'All', value: 'all', count: voiceReviewList?.data?.total || 0 },
    {
      label: 'Stories',
      value: 'story',
      count: voiceReviewData.filter((item: any) => item.story_type === 'Story').length,
    },
    {
      label: 'Meditations',
      value: 'meditations',
      count: voiceReviewData.filter((item: any) => item.story_type === 'Meditations').length,
    },
  ];

  return (
    <div className="w-full space-y-6 rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
      <SearchField placeholder="Search by title or type..." queryKey="search" />
      <FilterTabs tabs={tabsData} />
      <CustomTable columns={tableConfig} data={voiceReviewData} />
    </div>
  );
}

export default VoiceReviewTable;
