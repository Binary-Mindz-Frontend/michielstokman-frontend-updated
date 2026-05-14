'use client';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { useGetFigmaStatsQuery } from '@/redux/features/admin/overview/overview.api';
import DashboardSummary from '../DashboardSummary/DashboardSummary';
import TopResonanceContent from '../TopResonanceContent/TopResonanceContent';
import WeeklyTrends from '../WeeklyTrends/WeeklyTrends';

const OverViewWrapper = () => {
  const { data: overviewStats, isLoading } = useGetFigmaStatsQuery(undefined);

  const topStats = overviewStats?.data?.top_stats;
  const trends = overviewStats?.data?.weekly_trends;
  const topResonanceContent = overviewStats?.data?.top_resonance_content;

  return (
    <div className="space-y-6">
      <DynamicPageHeader title="Dashboard Overview" />
      <DashboardSummary topStats={topStats} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyTrends trends={trends} isLoading={isLoading} />
        <TopResonanceContent topResonanceContent={topResonanceContent} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default OverViewWrapper;
