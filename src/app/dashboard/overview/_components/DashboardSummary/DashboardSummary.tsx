'use client';
import { BarChart3, Eye, Share2, TrendingUp } from 'lucide-react';
import { SummaryCard } from './_components/SummaryCard';
import { useGetFigmaStatsQuery } from '@/redux/features/admin/overview/overview.api';

export default function DashboardSummary() {
  const { data: overviewStats } = useGetFigmaStatsQuery(undefined);

  const topStats = overviewStats?.data?.top_stats;

  const statsData = [
    {
      title: 'Total Views',
      value: topStats?.views?.value || '0',
      subValue: topStats?.views?.percentage || '0%',
      trend: topStats?.views?.trend,
      icon: Eye,
    },
    {
      title: 'Avg Resonance',
      value: topStats?.resonance?.value || '0.0',
      subValue: topStats?.resonance?.percentage || '0',
      trend: topStats?.resonance?.trend,
      icon: TrendingUp,
    },
    {
      title: 'Completion Rate',
      value: topStats?.completion?.value || '0%',
      subValue: topStats?.completion?.percentage || '0%',
      trend: topStats?.completion?.trend,
      icon: BarChart3,
    },
    {
      title: 'Share Clicks',
      value: topStats?.shares?.value || '0',
      subValue: topStats?.shares?.percentage || '0%',
      trend: topStats?.shares?.trend,
      icon: Share2,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {statsData.map((stat, i) => (
        <SummaryCard key={i} {...stat} />
      ))}
    </div>
  );
}
