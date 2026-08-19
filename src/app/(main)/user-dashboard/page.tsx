'use client';

import { motion } from 'framer-motion';
import UserDashboardHero from '@/components/main/UserDashboardHero/UserDashboardHero';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';

export default function UserDashboardPage() {
  const { data: profileResponse } = useGetProfileQuery(undefined);
  const profileData = profileResponse?.data;

  return (
    <main className="bg-bg-primary min-h-screen py-10 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="mx-auto flex w-full max-w-4xl flex-col items-center px-4"
      >
        {/* Page Title */}
        <motion.h1
          variants={FADE_IN_UP_ITEM}
          className="font-edo mb-10 text-center text-3xl font-bold tracking-wider text-[#D98755] md:text-4xl"
        >
          MY DASHBOARD
        </motion.h1>

        {/* User Dashboard Hero Section */}
        <motion.div variants={FADE_IN_UP_ITEM} className="w-full max-w-4xl">
          <UserDashboardHero
            confessionsCount={profileData?.reflections_count || 7}
            meditationsCount={profileData?.meditations_count || 8}
          />
        </motion.div>
      </motion.div>
    </main>
  );
}
