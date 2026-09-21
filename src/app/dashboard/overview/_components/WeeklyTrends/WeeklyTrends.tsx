import { TrendingUp } from 'lucide-react';
import { WeeklyTrendSkeleton } from '../OverViewSkeleton/OverViewSkeleton';

interface TrendItem {
  label: string;
  views: number | string;
  pulse: number | string;
  shares: number | string;
}

function toNumber(value: number | string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function WeeklyTrends({ trends, isLoading }: { trends: TrendItem[]; isLoading: boolean }) {
  if (isLoading) {
    return <WeeklyTrendSkeleton />;
  }

  if (!trends || trends.length === 0) {
    return (
      <section className="flex min-h-75 flex-col items-center justify-center rounded-md bg-[#F5F2F0] p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAE7E4]">
          <TrendingUp className="h-7 w-7 text-[#A39F99]" strokeWidth={1.5} />
        </div>
        <h3 className="text-secondary text-lg font-semibold">No trend data yet</h3>
        <p className="mt-2 max-w-70 text-sm leading-relaxed text-[#726E6A]">
          There isn&apos;t enough activity yet to chart weekly performance. Check back after more
          views land.
        </p>
      </section>
    );
  }

  const maxViews = Math.max(...trends.map((item) => toNumber(item.views)), 1);

  return (
    <section className="rounded-md bg-[#F5F2F0] p-5 sm:p-6">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-secondary text-xl font-semibold tracking-tight md:text-2xl">
            Weekly Trends
          </h2>
          <p className="mt-0.5 text-sm text-[#726E6A]">Performance over recent weeks</p>
        </div>
        <span className="bg-primary/8 text-primary hidden h-9 w-9 shrink-0 items-center justify-center rounded-md sm:inline-flex">
          <TrendingUp size={18} strokeWidth={1.5} />
        </span>
      </header>

      <ul className="space-y-1">
        {trends.map((item, index) => {
          const views = toNumber(item.views);
          const width = Math.max(8, Math.round((views / maxViews) * 100));

          return (
            <li
              key={`${item.label}-${index}`}
              className="border-primary/10 border-b py-4 first:pt-0 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-secondary text-base font-semibold sm:text-lg">
                  {item.label}
                </span>

                <div className="text-secondary flex flex-wrap gap-2 text-sm font-medium">
                  <span className="rounded-md bg-white/70 px-2.5 py-1 tabular-nums">
                    {views} views
                  </span>
                  <span className="text-primary rounded-md bg-white/70 px-2.5 py-1 font-semibold tabular-nums">
                    {item.pulse} pulse
                  </span>
                  <span className="rounded-md bg-white/70 px-2.5 py-1 tabular-nums">
                    {item.shares} shares
                  </span>
                </div>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EAE7E4]">
                <div
                  className="bg-primary/70 h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default WeeklyTrends;
