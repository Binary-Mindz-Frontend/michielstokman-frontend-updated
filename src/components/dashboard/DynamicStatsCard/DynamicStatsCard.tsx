import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface DynamicStatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: {
    percentage: number;
    isUp: boolean;
  };
  accentColor?: string;
}

const DynamicStatsCard: React.FC<DynamicStatsCardProps> = ({
  title,
  value,
  subValue,
  trend,
  accentColor = '#7cff6b',
}) => {
  return (
    <div className="bg-secondary border-mute/10 relative overflow-hidden rounded-md border p-6 text-white shadow-sm transition-all">
      {/* Top Header Section */}
      <div className="mb-3.5 flex items-center justify-between gap-4">
        <span className="text-mute text-sm font-medium">{title}</span>

        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${trend?.isUp ? 'text-primary' : 'text-error'}`}
          >
            {trend?.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>
              {trend?.isUp ? '+' : '-'}
              {trend?.percentage}%
            </span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="space-y-1">
        <h3 className="text-3xl font-semibold">{value}</h3>
        {subValue && <p className="text-mute text-xs font-medium">{subValue}</p>}
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 w-full opacity-50"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
};

export default DynamicStatsCard;
