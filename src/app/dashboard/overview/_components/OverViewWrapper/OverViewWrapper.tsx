'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { useGetFigmaStatsQuery } from '@/redux/features/admin/overview/overview.api';
import { useAuthState } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import DashboardSummary from '../DashboardSummary/DashboardSummary';
import TopResonanceContent from '../TopResonanceContent/TopResonanceContent';
import WeeklyTrends from '../WeeklyTrends/WeeklyTrends';
import UserDashboardHero from '../UserDashboardHero/UserDashboardHero';

const OverViewWrapper = () => {
  const { user } = useAppSelector(useAuthState);
  const { data: overviewStats, isLoading } = useGetFigmaStatsQuery(undefined);

  const topStats = overviewStats?.data?.top_stats;
  const trends = overviewStats?.data?.weekly_trends;
  const topResonanceContent = overviewStats?.data?.top_resonance_content;

  const isUserDashboard = !user?.is_admin;

  return (
    <div className="space-y-6">
      <DynamicPageHeader title="Dashboard Overview" />

      {/* User Dashboard Hero Section */}
      {isUserDashboard && (
        <UserDashboardHero
          confessionsCount={overviewStats?.data?.confessions_count}
          meditationsCount={overviewStats?.data?.meditations_count}
        />
      )}

      <DashboardSummary topStats={topStats} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyTrends trends={trends} isLoading={isLoading} />
        <TopResonanceContent topResonanceContent={topResonanceContent} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default OverViewWrapper;
