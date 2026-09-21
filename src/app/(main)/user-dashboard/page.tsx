'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import UserDashboardHero from '@/components/main/userDashboard/UserDashboardHero/UserDashboardHero';
import UserDashboardToolbar, {
  TCategory,
} from '@/components/main/userDashboard/UserDashboardToolbar/UserDashboardToolbar';
import UserDashboardCard, {
  UserDashboardItem,
} from '@/components/main/userDashboard/UserDashboardCard/UserDashboardCard';
import DeleteConfessionModal from '@/components/main/userDashboard/DeleteConfessionModal/DeleteConfessionModal';
import ShareStoryModal from '@/components/main/userDashboard/ShareStoryModal/ShareStoryModal';
import WithdrawStoryModal from '@/components/main/userDashboard/WithdrawStoryModal/WithdrawStoryModal';
import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';

import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import {
  useDeleteMyStoryMutation,
  useGetMyStoriesQuery,
  useResubmitMyStoryMutation,
  useWithdrawMyStoryMutation,
} from '@/redux/features/memberStory/memberStory.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { hasProcessingStories, type SubmissionTab } from '@/utils/memberStory.utils';
import { resolveStoryCoverSrc, STORY_CATALOG_GRID_CLASS } from '@/utils/storyCover.utils';
import type { MemberStoryListItem, StoryType } from '@/types/memberStory.types';

function mapStoryToCardItem(story: MemberStoryListItem): UserDashboardItem {
  const storyType = story.story_type;
  const isMeditation = storyType === 'meditation';

  return {
    id: story.id,
    story_reference: story.story_reference,
    category: isMeditation
      ? 'MEDITATION'
      : storyType === 'transformation'
        ? 'TRANSFORMATION'
        : 'STORY',
    title: story.title || 'Untitled story',
    description: story.excerpt || story.title || '',
    image: resolveStoryCoverSrc(story.cover_image_url, storyType),
    story_type: storyType,
    generation_status: story.generation_status,
    moderation_status: story.moderation_status,
    submission_status: story.submission_status,
    submission_mode: story.submission_mode,
    has_social_intros: story.has_social_intros,
    moderation_notes: story.moderation_notes,
    audio_duration_seconds: story.audio_duration_seconds,
    voice_name: story.voice_name,
  };
}

export default function UserDashboardPage() {
  const { data: profileResponse } = useGetProfileQuery(undefined);
  const profileData = profileResponse?.data;

  const [selectedCategory, setSelectedCategory] = useState<TCategory>('CONFESSION');
  const [selectedSubmissionTab, setSelectedSubmissionTab] = useState<SubmissionTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const storyTypeFilter: StoryType | undefined =
    selectedCategory === 'CONFESSION' ? 'confession' : 'meditation';

  const submissionFilter = selectedSubmissionTab === 'all' ? undefined : selectedSubmissionTab;

  const {
    data: storiesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyStoriesQuery({
    story_type: storyTypeFilter,
    submission_status: submissionFilter,
    page,
    limit: 12,
  });

  const stories = storiesResponse?.data?.stories ?? [];
  const shouldPollList = hasProcessingStories(stories);

  useEffect(() => {
    if (!shouldPollList) return undefined;
    const timer = setInterval(() => {
      refetch();
    }, 4000);
    return () => clearInterval(timer);
  }, [shouldPollList, refetch]);

  const [deleteStory] = useDeleteMyStoryMutation();
  const [withdrawStory, { isLoading: isWithdrawing }] = useWithdrawMyStoryMutation();
  const [resubmitStory] = useResubmitMyStoryMutation();

  const [deletingItem, setDeletingItem] = useState<UserDashboardItem | null>(null);
  const [sharingItem, setSharingItem] = useState<UserDashboardItem | null>(null);
  const [withdrawingItem, setWithdrawingItem] = useState<UserDashboardItem | null>(null);

  const mappedItems = useMemo(() => {
    const stories = storiesResponse?.data?.stories ?? [];
    return stories.map(mapStoryToCardItem);
  }, [storiesResponse]);

  const filteredItems = mappedItems.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.story_reference?.toLowerCase().includes(q) ?? false)
    );
  });

  const submissionCounts = storiesResponse?.data?.counts;
  const meta = storiesResponse?.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      await deleteStory(String(deletingItem.id)).unwrap();
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
    setDeletingItem(null);
  };

  const handleWithdrawConfirm = async () => {
    if (!withdrawingItem) return;
    try {
      await withdrawStory(String(withdrawingItem.id)).unwrap();
    } catch (error) {
      console.error('Failed to withdraw story:', error);
    }
    setWithdrawingItem(null);
  };

  const handleResubmit = async (item: UserDashboardItem) => {
    try {
      await resubmitStory(String(item.id)).unwrap();
    } catch (error) {
      console.error('Failed to resubmit story:', error);
    }
  };

  return (
    <main className="bg-bg-primary min-h-screen py-10 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="mx-auto flex w-full max-w-350 flex-col items-center px-4"
      >
        <motion.h1
          variants={FADE_IN_UP_ITEM}
          className="font-edo mb-10 text-center text-3xl font-bold tracking-wider text-[#D98755] md:text-4xl"
        >
          MY STORIES
        </motion.h1>

        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          <UserDashboardHero
            confessionsCount={profileData?.reflections_count ?? 0}
            meditationsCount={profileData?.meditations_count ?? 0}
          />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          <UserDashboardToolbar
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setPage(1);
            }}
            selectedSubmissionTab={selectedSubmissionTab}
            onSubmissionTabChange={(tab) => {
              setSelectedSubmissionTab(tab);
              setPage(1);
            }}
            submissionCounts={submissionCounts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          {isLoading ? (
            <div className={STORY_CATALOG_GRID_CLASS}>
              {Array(6)
                .fill(null)
                .map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              <div className={STORY_CATALOG_GRID_CLASS}>
                {filteredItems.map((item) => (
                  <UserDashboardCard
                    key={item.id}
                    item={item}
                    onShare={setSharingItem}
                    onWithdraw={setWithdrawingItem}
                    onResubmit={handleResubmit}
                    onDelete={setDeletingItem}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || isFetching}
                    className="font-playpen rounded-xl border border-[#EBE4D5] bg-white px-4 py-2 text-xs font-semibold text-gray-700 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="font-sans text-xs text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || isFetching}
                    className="font-playpen rounded-xl border border-[#EBE4D5] bg-white px-4 py-2 text-xs font-semibold text-gray-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="w-full rounded-2xl border border-dashed border-[#EBE4D5] bg-[#FAF7F2] py-16 text-center">
              <p className="font-playpen text-base font-bold text-gray-800">
                No {selectedCategory.toLowerCase()}s found.
              </p>
              <p className="mt-1 font-sans text-xs text-gray-500">
                Try adjusting your filter or create a new story.
              </p>
            </div>
          )}
        </motion.div>

        <DeleteConfessionModal
          isOpen={!!deletingItem}
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDeleteConfirm}
        />

        <ShareStoryModal
          isOpen={!!sharingItem}
          storyId={sharingItem ? String(sharingItem.id) : null}
          storyTitle={sharingItem?.title}
          onClose={() => setSharingItem(null)}
        />

        <WithdrawStoryModal
          isOpen={!!withdrawingItem}
          item={withdrawingItem}
          onClose={() => setWithdrawingItem(null)}
          onConfirm={handleWithdrawConfirm}
          isLoading={isWithdrawing}
        />
      </motion.div>
    </main>
  );
}
