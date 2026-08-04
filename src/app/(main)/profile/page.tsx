/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import ProfileSkeleton from '@/components/main/Skeletons/ProfileSkeleton';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/useLogout';
import { apiClient } from '@/redux/apiClient/apiClient';
import { logout as authLogout, useCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser } from '@/services/auth/auth.service';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';

import ProfileHero from './_components/ProfileHero';
import ProfileDemographics from './_components/ProfileDemographics';
import ProfileRadarChart from './_components/ProfileRadarChart';
import ProfileActions from './_components/ProfileActions';

export default function ProfilePage() {
  const router = useRouter();
  const logout = useLogout();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, error } = useGetProfileQuery(undefined);
  const profileData = data?.data;

  const user = useAppSelector(useCurrentUser) as any;
  const isGuest = user?.is_guest;

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Monitor loading timeout (10 seconds fallback) to prevent infinite loading state
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  // Handle unauthorized or failed session states dynamically
  useEffect(() => {
    if (isError && error && typeof error === 'object' && !isGuest && !isLoggingOut) {
      const err = error as { status?: number; data?: unknown };
      if (err.status === 401) {
        toast.error('Session expired or unauthorized. Please log in again.');
        logout();
        router.push('/login?redirect=%2Fprofile');
      }
    }
  }, [isError, error, router, logout, isGuest, isLoggingOut]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isGuest || isLoggingOut) {
    return (
      <div className="mx-auto max-w-md space-y-6 px-4 py-20 text-center">
        <h2 className="text-primary font-serif text-2xl font-semibold">Guest Session</h2>
        <p className="text-secondary text-sm">
          You are using as a guest user. Please log in to access your profile.
        </p>
        <div className="space-y-3">
          <Button
            className="btn-styles w-full"
            disabled={isLoggingOut}
            onClick={async () => {
              setIsLoggingOut(true);
              dispatch(authLogout());
              dispatch(apiClient.util.resetApiState());
              await logoutUser();
              window.location.href = '/login';
            }}
          >
            {isLoggingOut ? 'Log In Now' : 'Log In Now'}
          </Button>
          <Button
            variant="outline"
            disabled={isLoggingOut}
            className="btn-styles border-primary/20 text-dark-primary w-full bg-transparent hover:bg-[#F5F1EA]"
            onClick={() => router.push('/')}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading && !loadingTimeout) return <ProfileSkeleton />;

  if (loadingTimeout || (isError && !profileData)) {
    return (
      <div className="mx-auto max-w-md space-y-6 px-4 py-20 text-center">
        <h2 className="text-primary font-serif text-2xl font-semibold">Unable to load profile</h2>
        <p className="text-secondary text-sm">
          {loadingTimeout
            ? 'The request timed out due to a slow network connection.'
            : 'Your session may have expired or there was a server connection issue.'}
        </p>
        <div className="space-y-3">
          <Button className="btn-styles w-full" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
          <Button
            variant="outline"
            className="btn-styles border-primary/20 text-dark-primary w-full bg-transparent hover:bg-[#F5F1EA]"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  const personalDetails = [
    { label: 'AGE', value: profileData?.age ? profileData.age.toString() : '0' },
    { label: 'COUNTRY', value: profileData?.country || 'N A' },
    { label: 'CITY', value: profileData?.city || 'N A' },
    { label: 'HEIGHT', value: profileData?.height || 'N A' },
    { label: 'GENDER', value: profileData?.gender || 'N A' },
    { label: 'SEXUAL ORIENTATION', value: profileData?.sexual_orientation || 'N A' },
    { label: 'EDUCATION', value: profileData?.education || 'N A' },
    { label: 'ANNUAL INCOME', value: profileData?.annual_income || 'N A' },
  ];

  const chartData = [
    { subject: 'Letting go', A: profileData?.slider_career_money || 8, B: 11 },
    { subject: 'Forgiveness', A: profileData?.slider_true_self || 9, B: 13 },
    { subject: 'Fear & Freedom', A: profileData?.slider_fear_freedom || 12, B: 10 },
    { subject: 'Self acceptance', A: profileData?.slider_health_body || 11, B: 9 },
    { subject: 'Inner peace', A: profileData?.slider_enlightenment || 14, B: 8.5 },
    {
      subject: 'Sexual & Relations Vitality',
      A: profileData?.slider_desire_relationship || 10,
      B: 12,
    },
    { subject: 'Presence', A: profileData?.slider_life_purpose || 8.5, B: 10 },
  ];

  return (
    <main className="bg-bg-primary min-h-screen py-10 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="mx-auto flex max-w-4xl flex-col items-center px-4"
      >
        {/* Page Title */}
        <motion.h1
          variants={FADE_IN_UP_ITEM}
          className="font-edo mb-10 text-center text-3xl font-bold tracking-wider text-[#D98755] md:text-4xl"
        >
          TRANSFORM TO LIBERATION
        </motion.h1>

        {/* SECTION 1: HERO / BRUSH STATS */}
        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          <ProfileHero
            trueName={profileData?.true_name}
            lifePhase={profileData?.life_phase}
            dailyCredits={profileData?.daily_credits}
            reflectionsCount={profileData?.reflections_count}
            avgResonance={profileData?.avg_resonance}
          />
        </motion.div>

        {/* SECTION 2: DEMOGRAPHICS GRID */}
        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          <ProfileDemographics personalDetails={personalDetails} />
        </motion.div>

        {/* SECTION 3: RADAR CHART */}
        <motion.div variants={FADE_IN_UP_ITEM} className="w-full">
          <ProfileRadarChart data={chartData} />
        </motion.div>

        {/* ACTIONS: BUTTONS */}
        <motion.div variants={FADE_IN_UP_ITEM} className="flex w-full justify-center">
          <ProfileActions
            onUpdateFocus={() => router.push('/register/stepper')}
            onLogout={handleLogout}
          />
        </motion.div>
      </motion.div>
    </main>
  );
}
