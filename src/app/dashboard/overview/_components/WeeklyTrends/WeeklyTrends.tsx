import { TrendingUp } from 'lucide-react';
import { WeeklyTrendSkeleton } from '../OverViewSkeleton/OverViewSkeleton';

interface TrendItem {
  label: string;
  views: number | string;
  pulse: number | string;
  shares: number | string;
}

function WeeklyTrends({ trends, isLoading }: { trends: TrendItem[]; isLoading: boolean }) {
  if (isLoading) {
    return <WeeklyTrendSkeleton />;
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center rounded-md bg-[#F5F2F0] p-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAE7E4]">
          <TrendingUp className="h-8 w-8 text-[#A39F99]" />
        </div>
        <h3 className="text-lg font-semibold text-[#333333]">No Trend Data Yet</h3>
        <p className="mt-2 max-w-70 text-center text-sm leading-relaxed text-[#726E6A]">
          {`It looks like there isn't enough data to calculate weekly trends for this period. Check
          back later!`}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-[#F5F2F0] p-6">
      <h2 className="text-dark-primary mb-0.5 text-xl font-semibold md:text-2xl">Weekly Trends</h2>
      <p className="text-secondary text-sm sm:text-base">Performance over recent weeks</p>

      <div>
        {trends.map((item, index) => (
          <div
            key={index}
            className="border-primary/20 flex flex-col justify-between gap-x-4 gap-y-0.5 border-b py-5 last:border-0 sm:flex-row sm:items-center"
          >
            <span className="text-dark-primary text-lg font-semibold sm:text-xl">
              {item?.label}
            </span>

            <div className="text-secondary flex gap-4 font-medium md:text-lg">
              <span>{item?.views} views</span>
              <span className="text-primary font-semibold">{item?.pulse} pulse</span>
              <span>{item?.shares} shares</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyTrends;
