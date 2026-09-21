'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { useGetFigmaStatsQuery } from '@/redux/features/admin/overview/overview.api';
import { useAuthState } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import DashboardSummary from '../DashboardSummary/DashboardSummary';
import OverviewQuickActions from '../OverviewQuickActions/OverviewQuickActions';
import TopResonanceContent from '../TopResonanceContent/TopResonanceContent';
import UserDashboardHero from '../UserDashboardHero/UserDashboardHero';
import WeeklyTrends from '../WeeklyTrends/WeeklyTrends';

const OverViewWrapper = () => {
  const { user } = useAppSelector(useAuthState);
  const { data: overviewStats, isLoading } = useGetFigmaStatsQuery(undefined);

  const topStats = overviewStats?.data?.top_stats;
  const trends = overviewStats?.data?.weekly_trends;
  const topResonanceContent = overviewStats?.data?.top_resonance_content;

  const isAdmin = Boolean(user?.is_admin);
  const isUserDashboard = !isAdmin;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <DynamicPageHeader
          className="mb-0"
          title="Dashboard Overview"
          description="Views, resonance, and the stories landing hardest with your audience."
        />
        {isAdmin ? <OverviewQuickActions /> : null}
      </div>

      {isUserDashboard && (
        <UserDashboardHero
          confessionsCount={overviewStats?.data?.confessions_count}
          meditationsCount={overviewStats?.data?.meditations_count}
        />
      )}

      <DashboardSummary topStats={topStats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <WeeklyTrends trends={trends} isLoading={isLoading} />
        <TopResonanceContent topResonanceContent={topResonanceContent} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default OverViewWrapper;
