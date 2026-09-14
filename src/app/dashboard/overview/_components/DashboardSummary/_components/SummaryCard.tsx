import { ArrowDownRight, ArrowUpRight, LucideIcon, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subValue?: string | number;
  trend?: 'up' | 'down' | 'neutral' | string;
  icon: LucideIcon;
}

export const SummaryCard = ({ title, value, subValue, trend, icon: Icon }: SummaryCardProps) => {
  const normalizedTrend = trend?.toLowerCase();
  const isUp = normalizedTrend === 'up';
  const isDown = normalizedTrend === 'down';

  const trendTone = isUp
    ? 'bg-success/10 text-success'
    : isDown
      ? 'bg-destructive/10 text-destructive'
      : 'bg-[#EAE7E4] text-[#726E6A]';

  return (
    <article className="group relative overflow-hidden rounded-md bg-[#F5F2F0] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(65,70,81,0.28)] sm:p-6">
      <div
        aria-hidden
        className="bg-primary absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 opacity-0 transition-all duration-200 group-hover:scale-y-100 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        <span className="bg-primary/8 text-secondary group-hover:bg-primary/12 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-200">
          <Icon size={20} strokeWidth={1.5} />
        </span>

        {subValue !== undefined && subValue !== null && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-semibold tabular-nums ${trendTone}`}
          >
            {isUp && <ArrowUpRight size={14} strokeWidth={2} />}
            {isDown && <ArrowDownRight size={14} strokeWidth={2} />}
            {!isUp && !isDown && <Minus size={12} strokeWidth={2} />}
            {subValue}%
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold tracking-wider text-[#A08170] uppercase">{title}</p>
        <h3 className="text-primary mt-1.5 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
          {value}
        </h3>
      </div>
    </article>
  );
};
