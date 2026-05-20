'use client';

import DynamicSectionHeader from '@/components/main/DynamicSectionHeader/DynamicSectionHeader';
import GrowthSlider from '@/components/main/GrowthSlider/GrowthSlider';
import ProfileSkeleton from '@/components/main/Skeletons/ProfileSkeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLogout } from '@/hooks/useLogout';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const logout = useLogout();

  const { data, isLoading, isError, error } = useGetProfileQuery(undefined);
  const profileData = data?.data;

  const [growthFocusValues, setGrowthFocusValues] = useState<Record<string, number>>({
    'Desire & Relationship': 0,
    'Life & Purpose': 0,
    'Career & Money': 0,
    'Show Your True Self': 0,
    'Sexuality & Life Energy': 0,
    'Fear & Freedom': 0,
    'Health & Body': 0,
    Enlightenment: 0,
  });

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
    if (isError && error && typeof error === 'object') {
      const err = error as { status?: number; data?: unknown };
      if (err.status === 401) {
        toast.error('Session expired or unauthorized. Please log in again.');
        logout();
        router.push('/login?redirect=%2Fprofile');
      }
    }
  }, [isError, error, router, logout]);

  useEffect(() => {
    if (profileData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGrowthFocusValues({
        'Desire & Relationship': profileData?.slider_desire_relationship || 0,
        'Life & Purpose': profileData?.slider_life_purpose || 0,
        'Career & Money': profileData?.slider_career_money || 0,
        'Show Your True Self': profileData?.slider_true_self || 0,
        'Sexuality & Life Energy': profileData?.slider_sexuality_life_energy || 0,
        'Fear & Freedom': profileData?.slider_fear_freedom || 0,
        'Health & Body': profileData?.slider_health_body || 0,
        Enlightenment: profileData?.slider_enlightenment || 0,
      });
    }
  }, [profileData]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading && !loadingTimeout) return <ProfileSkeleton />;

  // Display proper fallback screen when loading fails, times out, or when unauthorized
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
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const personalDetails = [
    { label: 'Age', value: profileData?.age?.toString() },
    { label: 'Country', value: profileData?.country },
    { label: 'City', value: profileData?.city },
    { label: 'Height', value: profileData?.height },
    { label: 'Education', value: profileData?.education },
    { label: 'Annual Income', value: profileData?.annual_income },
    { label: 'Gender', value: profileData?.gender },
    { label: 'Sexual Orientation', value: profileData?.sexual_orientation },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={FADE_IN_UP_CONTAINER}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      {/* Header Section */}
      <motion.div variants={FADE_IN_UP_ITEM}>
        <DynamicSectionHeader
          title={profileData?.true_name || 'User'}
          description={profileData?.life_phase || 'Discovering'}
        />
      </motion.div>

      <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4">
        {/* Daily Credits Card */}
        <div className="border-primary/20 rounded-md border p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-dark-primary text-sm font-semibold tracking-wider uppercase">
              Daily Credits
            </h3>
            <span className="text-dark-primary text-lg font-semibold">
              {`${profileData?.daily_credits}/3 Remaining`}
            </span>
          </div>
          <Progress
            value={(profileData?.daily_credits / 3) * 100}
            className="[&>div]:bg-primary bg-primary/20 h-2"
          />
          <p className="text-secondary mt-3 text-sm">
            1 credit = 1 full story or meditation. Resets daily.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="border-primary/20 rounded-md border p-6 text-center">
            <h4 className="text-dark-primary font-serif text-3xl font-bold">
              {profileData?.reflections_count || 0}
            </h4>
            <p className="text-secondary mt-1 text-[12px]">Reflections</p>
          </div>
          <div className="border-primary/20 rounded-md border p-6 text-center">
            <h4 className="text-dark-primary font-serif text-3xl font-bold">
              {profileData?.avg_resonance || 0}
            </h4>
            <p className="text-secondary mt-1 text-[12px]">Avg Resonance</p>
          </div>
        </div>
      </motion.div>

      {/* Personal Details Grid */}
      <motion.div variants={FADE_IN_UP_ITEM} className="grid grid-cols-2 gap-x-12 gap-y-8 pt-6">
        {personalDetails.map((detail, idx) => (
          <DetailItem key={idx} label={detail?.label} value={detail?.value || 'N/A'} />
        ))}
      </motion.div>

      {/* Growth Focus Section */}
      <motion.div variants={FADE_IN_UP_ITEM} className="space-y-6 pt-10">
        <h2 className="text-dark-primary border-muted/20 border-b pb-4 font-serif text-xl font-bold">
          Your Growth Focus
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {Object.entries(growthFocusValues).map(([key, val]) => (
            <GrowthSlider key={key} label={key} value={val} />
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={FADE_IN_UP_ITEM} className="space-y-4 pt-12">
        <Button className="btn-styles" onClick={() => router.push('/register/stepper')}>
          Update Preferences
        </Button>
        <Button
          variant="outline"
          className="btn-styles text-error border-error hover:bg-error/10 hover:text-error/90"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </motion.div>
    </motion.div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-primary text-sm font-medium">{label}</p>
      <p className="text-dark-primary font-serif text-xl leading-tight font-semibold">{value}</p>
    </div>
  );
}
