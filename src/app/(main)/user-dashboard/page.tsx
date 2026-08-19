/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import UserDashboardHero from '@/components/main/userDashboard/UserDashboardHero/UserDashboardHero';
import UserDashboardToolbar, {
  TCategory,
  TStatus,
} from '@/components/main/userDashboard/UserDashboardToolbar/UserDashboardToolbar';
import UserDashboardCard, {
  UserDashboardItem,
} from '@/components/main/userDashboard/UserDashboardCard/UserDashboardCard';
import EditConfessionModal from '@/components/main/userDashboard/EditConfessionModal/EditConfessionModal';
import DeleteConfessionModal from '@/components/main/userDashboard/DeleteConfessionModal/DeleteConfessionModal';
import ProductCardSkeleton from '@/components/main/Skeletons/ProductCardSkeleton';

import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { useGetDiscoveryFeedQuery } from '@/redux/features/discoveryFeed/discoveryFeed.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';

import fallbackCardImage from '@/assets/shared/confession-card-1.png';

export default function UserDashboardPage() {
  const { data: profileResponse } = useGetProfileQuery(undefined);
  const profileData = profileResponse?.data;

  const { data: feedResponse, isLoading } = useGetDiscoveryFeedQuery(['confession', 'meditation']);

  const [selectedCategory, setSelectedCategory] = useState<TCategory>('CONFESSION');
  const [selectedStatus, setSelectedStatus] = useState<TStatus>('Published');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingItem, setEditingItem] = useState<UserDashboardItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<UserDashboardItem | null>(null);
  const [userItems, setUserItems] = useState<UserDashboardItem[] | null>(null);

  const rawItems = feedResponse?.data?.items || [];

  // Initial load mapping from feed / backend
  const mappedItems: UserDashboardItem[] = rawItems.map((item: any) => ({
    id: item.id,
    category: 'STORY',
    title: item.title || 'CONTACT WITH THE TREES',
    description:
      item.description || 'The First Tinae I Really Felt A Tree Was When I Was Ten................',
    image: item.cover_image_url || fallbackCardImage,
    rating: item.rating ? item.rating.toString() : '4.8',
    listenedCount: item.listened_count ?? 0,
    isExplicit: item.is_explicit ?? false,
    story_type: item.story_type === 'meditation' ? 'meditation' : 'confession',
    status: item.status || 'Published',
  }));

  const activeItems = userItems !== null ? userItems : mappedItems;

  // Filter items based on Category, Status, and Search Query
  const filteredItems = activeItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'CONFESSION'
        ? item.story_type === 'confession'
        : item.story_type === 'meditation';

    const matchesStatus = selectedStatus
      ? item.status === selectedStatus || selectedStatus === 'Published'
      : true;

    const matchesSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleEditSave = (updatedItem: UserDashboardItem) => {
    const updated = (userItems !== null ? userItems : mappedItems).map((i) =>
      i.id === updatedItem.id ? updatedItem : i,
    );
    setUserItems(updated);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    const updated = (userItems !== null ? userItems : mappedItems).filter(
      (i) => i.id !== deletingItem.id,
    );
    setUserItems(updated);
    setDeletingItem(null);
  };

  return (
    <main className="bg-bg-primary min-h-screen py-10 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="mx-auto flex w-full max-w-350 flex-col items-center px-4"
      >
        {/* Page Title */}
        <motion.h1
          variants={FADE_IN_UP_ITEM}
          className="font-edo mb-10 text-center text-3xl font-bold tracking-wider text-[#D98755] md:text-4xl"
        >
          MY DASHBOARD
        </motion.h1>

        {/* User Dashboard Hero Section */}
        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          <UserDashboardHero
            confessionsCount={profileData?.reflections_count || 7}
            meditationsCount={profileData?.meditations_count || 8}
          />
        </motion.div>

        {/* Filter Toolbar Section */}
        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          <UserDashboardToolbar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        {/* Cards Grid Section */}
        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          {isLoading ? (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array(6)
                .fill(null)
                .map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <UserDashboardCard
                  key={item.id}
                  item={item}
                  onEdit={setEditingItem}
                  onDelete={setDeletingItem}
                />
              ))}
            </div>
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

        {/* Edit Modal */}
        <EditConfessionModal
          isOpen={!!editingItem}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleEditSave}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfessionModal
          isOpen={!!deletingItem}
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDeleteConfirm}
        />
      </motion.div>
    </main>
  );
}
