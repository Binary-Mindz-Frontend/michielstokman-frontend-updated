'use client';

import ShareStoryModal from '@/components/main/userDashboard/ShareStoryModal/ShareStoryModal';
import ArtworkModal from '@/components/main/userDashboard/ArtworkModal/ArtworkModal';
import type { UserDashboardItem } from '@/components/main/userDashboard/UserDashboardCard/UserDashboardCard';
import StoryPlayer from '@/app/(main)/details/StoryPlayer/StoryPlayer';
import { useGetMyStoryQuery } from '@/redux/features/memberStory/memberStory.api';
import {
  formatAudioDuration,
  getGenerationStatusLabel,
  getModerationStatusLabel,
  getRouteLabel,
  getSubmissionStatusLabel,
  shouldShowModerationNotes,
} from '@/utils/memberStory.utils';
import { getMemberStoryQueryErrorMessage } from '@/utils/memberStoryQuery.utils';
import {
  getStoryCoverFallback,
  hasStoryCover,
  resolveStoryCoverSrc,
} from '@/utils/storyCover.utils';
import { ArrowLeft, Loader2, Share2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type ContentTab = 'listen' | 'read' | 'original';

export default function MemberStoryDetailPage() {
  const params = useParams();
  const storyId = String(params.id ?? '').trim();
  const [activeTab, setActiveTab] = useState<ContentTab>('listen');
  const [shareOpen, setShareOpen] = useState(false);
  const [artworkOpen, setArtworkOpen] = useState(false);
  const [brokenCoverKey, setBrokenCoverKey] = useState<string | null>(null);

  const {
    data: story,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMyStoryQuery(storyId, {
    skip: !storyId,
    refetchOnMountOrArgChange: true,
  });

  const isInitialLoading = Boolean(storyId) && (isLoading || (isFetching && !story));

  const isProcessing = story?.generation_status === 'processing';

  useEffect(() => {
    if (!isProcessing) return undefined;
    const timer = setInterval(() => {
      refetch();
    }, 4000);
    return () => clearInterval(timer);
  }, [isProcessing, refetch]);

  const coverKey = story?.cover_image_url ?? 'missing';

  const coverSrc = useMemo(() => {
    if (!story) return '';
    if (brokenCoverKey === coverKey) {
      return getStoryCoverFallback(story.story_type);
    }
    return resolveStoryCoverSrc(story.cover_image_url, story.story_type);
  }, [brokenCoverKey, coverKey, story]);

  const artworkItem = useMemo<UserDashboardItem | null>(() => {
    if (!story) return null;
    return {
      id: story.id,
      story_reference: story.story_reference,
      category:
        story.story_type === 'meditation'
          ? 'MEDITATION'
          : story.story_type === 'transformation'
            ? 'TRANSFORMATION'
            : 'STORY',
      title: story.title || 'Untitled story',
      description: story.excerpt || story.title || '',
      image: resolveStoryCoverSrc(story.cover_image_url, story.story_type),
      story_type: story.story_type,
      generation_status: story.generation_status,
      moderation_status: story.moderation_status,
      submission_status: story.submission_status,
      submission_mode: story.submission_mode,
      has_social_intros: story.has_social_intros,
      moderation_notes: story.moderation_notes,
      audio_duration_seconds: story.audio_duration_seconds,
      voice_name: story.voice_name,
    };
  }, [story]);

  if (!storyId) {
    return (
      <main className="bg-bg-primary min-h-screen px-4 py-16 text-center">
        <p className="font-sans text-sm text-gray-700">Invalid story link.</p>
        <Link
          href="/user-dashboard"
          className="font-playpen mt-4 inline-block text-sm font-bold text-[#D98755]"
        >
          Back to My Stories
        </Link>
      </main>
    );
  }

  if (isInitialLoading) {
    return (
      <main className="bg-bg-primary flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D98755]" />
      </main>
    );
  }

  if (isError || !story) {
    return (
      <main className="bg-bg-primary min-h-screen px-4 py-16 text-center">
        <p className="font-sans text-sm text-gray-700">
          {isError ? getMemberStoryQueryErrorMessage(error) : 'Story not found.'}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => refetch()}
            className="font-playpen text-sm font-bold text-[#D98755]"
          >
            Try again
          </button>
          <Link href="/user-dashboard" className="font-playpen text-sm font-bold text-[#D98755]">
            Back to My Stories
          </Link>
        </div>
      </main>
    );
  }

  const showCoverPlaceholder = !hasStoryCover(story.cover_image_url);
  const duration = formatAudioDuration(story.audio_duration_seconds);
  const isConfession = story.story_type === 'confession';
  const accent = isConfession ? '#EB2874' : '#EEA13D';

  const tabs: { key: ContentTab; label: string }[] = [
    { key: 'listen', label: 'Listen' },
    { key: 'read', label: 'Read' },
    { key: 'original', label: 'My original' },
  ];

  return (
    <main className="bg-bg-primary min-h-screen py-10 font-sans">
      <div className="mx-auto w-full max-w-3xl px-4">
        <Link
          href="/user-dashboard"
          className="font-playpen mb-6 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[#D98755] uppercase"
        >
          <ArrowLeft size={14} /> My Stories
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#EBE4D5] bg-[#FAF7F2]">
          <div className="relative h-56 w-full sm:h-72">
            {coverSrc ? (
              <Image
                key={typeof coverSrc === 'string' ? coverSrc : 'fallback-cover'}
                src={coverSrc}
                alt={story.title || 'Story cover'}
                fill
                unoptimized={typeof coverSrc === 'string'}
                className="object-cover"
                onError={() => {
                  setBrokenCoverKey(coverKey);
                }}
              />
            ) : null}
            {showCoverPlaceholder ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35 px-6 text-center">
                <p className="font-sans text-sm font-semibold text-white">No cover artwork yet</p>
                {story.generation_status === 'completed' ? (
                  <button
                    type="button"
                    onClick={() => setArtworkOpen(true)}
                    className="font-playpen inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-xs font-bold text-gray-900"
                  >
                    <Sparkles size={14} />
                    Generate or upload cover
                  </button>
                ) : (
                  <p className="font-sans text-xs text-white/90">
                    Artwork can be added after your story finishes generating.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {story.story_reference ? (
                  <p className="font-sans text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                    {story.story_reference}
                  </p>
                ) : null}
                <h1
                  style={{ color: accent }}
                  className="font-edo text-2xl font-bold tracking-wide capitalize"
                >
                  {story.title || 'Untitled story'}
                </h1>
                <p className="mt-1 font-sans text-xs text-gray-600">
                  {[
                    getRouteLabel(story),
                    duration,
                    story.voice_name ? `Voice: ${story.voice_name}` : null,
                    story.uses_custom_voice ? '(your voice)' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>

              {story.generation_status === 'completed' ? (
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="font-playpen flex items-center gap-2 rounded-xl bg-[#D98755] px-4 py-2 text-xs font-bold text-white"
                >
                  <Share2 size={14} /> Share
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#EBE4D5]/60 px-2.5 py-1 font-sans text-[10px] font-bold uppercase">
                {getGenerationStatusLabel(story.generation_status)}
              </span>
              <span className="rounded-full bg-[#EBE4D5]/60 px-2.5 py-1 font-sans text-[10px] font-bold uppercase">
                {getModerationStatusLabel(story.moderation_status)}
              </span>
              <span className="rounded-full bg-[#EBE4D5]/60 px-2.5 py-1 font-sans text-[10px] font-bold uppercase">
                {getSubmissionStatusLabel(story.submission_status, story.moderation_status)}
              </span>
              <span className="rounded-full bg-[#301C05] px-2.5 py-1 font-sans text-[10px] font-bold text-white uppercase">
                {getRouteLabel(story)}
              </span>
            </div>

            {shouldShowModerationNotes(story.moderation_status, story.moderation_notes) ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-sans text-xs text-amber-900">
                {story.moderation_notes}
              </p>
            ) : null}

            <div className="flex gap-2 border-b border-[#EBE4D5]">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`font-playpen border-b-2 px-4 py-2 text-xs font-bold tracking-wide uppercase transition-colors ${
                    activeTab === key
                      ? 'border-[#D98755] text-[#D98755]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'listen' ? (
              story.audio_path && story.generation_status === 'completed' ? (
                <StoryPlayer story={story.audio_path} onTimeUpdateCallback={() => {}} />
              ) : (
                <p className="font-sans text-sm text-gray-600">
                  {story.generation_status === 'processing'
                    ? 'Your story is still being created…'
                    : 'Audio is not available yet.'}
                </p>
              )
            ) : null}

            {activeTab === 'read' ? (
              <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {story.story_text || 'Narrated text will appear here when generation completes.'}
              </div>
            ) : null}

            {activeTab === 'original' ? (
              <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {story.story_input || 'Your original submission is not available.'}
              </div>
            ) : null}

            {story.social_intros ? (
              <div className="rounded-xl border border-[#EBE4D5] bg-white p-4">
                <p className="font-playpen text-xs font-bold text-gray-800">Social intros ready</p>
                <p className="mt-1 font-sans text-xs text-gray-600">
                  Open Share to copy Instagram, Facebook, and Spotify introductions.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ShareStoryModal
        isOpen={shareOpen}
        storyId={storyId}
        storyTitle={story.title || undefined}
        onClose={() => setShareOpen(false)}
      />

      <ArtworkModal
        isOpen={artworkOpen}
        item={artworkItem}
        onClose={() => setArtworkOpen(false)}
        onUpdated={() => refetch()}
      />
    </main>
  );
}
