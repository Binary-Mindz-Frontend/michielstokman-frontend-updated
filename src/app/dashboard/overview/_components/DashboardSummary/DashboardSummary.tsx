import { BarChart3, Eye, Share2, TrendingUp } from 'lucide-react';
import { SummaryCard } from './_components/SummaryCard';

export default function DashboardSummary() {
  // Stats Data
  const statsData = [
    { title: 'Total Views', value: '14,820', subValue: '+12%', icon: Eye },
    { title: 'Avg Resonance', value: '7.6', subValue: '+0.3', icon: TrendingUp },
    { title: 'Completion Rate', value: '72%', subValue: '+4%', icon: BarChart3 },
    { title: 'Share Clicks', value: '1,243', subValue: '+18%', icon: Share2 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {statsData.map((stat, i) => (
        <SummaryCard key={i} {...stat} />
      ))}
    </div>
  );
}
