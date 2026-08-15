import { LucideIcon, Plus, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subValue?: string | number; // Added to capture percentage differences or comparison text
  trend?: 'up' | 'down' | 'neutral' | string;
  icon: LucideIcon;
}

export const SummaryCard = ({ title, value, subValue, trend, icon: Icon }: SummaryCardProps) => {
  const normalizedTrend = trend?.toLowerCase();

  // Determine dynamic text color based on your custom classes (or fallbacks)
  let trendColor = 'text-gray-500'; // Neutral fallback
  if (normalizedTrend === 'up') {
    trendColor = 'text-success';
  } else if (normalizedTrend === 'down') {
    trendColor = 'text-destructive';
  }

  return (
    <div className="space-y-5 rounded-md bg-[#F5F2F0] p-6 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between">
        <Icon size={22} strokeWidth={1.5} className="text-secondary" />
        {subValue !== undefined && subValue !== null && (
          <span
            className={`flex items-center gap-0.5 text-sm font-medium capitalize ${trendColor}`}
          >
            {normalizedTrend === 'up' && <Plus size={16} strokeWidth={1} />}
            {normalizedTrend === 'down' && <Minus size={16} strokeWidth={2} />}
            {subValue}%
          </span>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-baseline gap-2">
          <h3 className="text-primary text-2xl font-semibold sm:text-3xl">{value}</h3>
        </div>

        <p className="text-secondary text-sm font-medium">{title}</p>
      </div>
    </div>
  );
};
