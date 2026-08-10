// _components/SummaryCardSkeleton.tsx
export const SummaryCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-md bg-[#f5f2f0ce] p-6">
      <div className="flex items-center justify-between">
        {/* Icon Circle Skeleton */}
        <div className="h-10 w-10 rounded-md bg-gray-200" />
        {/* SubValue/Trend Skeleton */}
        <div className="h-4 w-12 rounded bg-gray-200" />
      </div>
      <div className="mt-4 space-y-2">
        {/* Title Skeleton */}
        <div className="h-4 w-24 rounded bg-gray-200" />
        {/* Value Skeleton */}
        <div className="h-8 w-16 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export const WeeklyTrendSkeleton = () => {
  return (
    <div className="rounded-md bg-[#F5F2F0] p-6">
      <h2 className="text-secondary mb-0.5 text-xl font-semibold md:text-2xl">Weekly Trends</h2>
      <p className="text-secondary text-sm sm:text-base">Performance over recent weeks</p>

      <div className="mt-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-md bg-gray-200 p-4">
            <div className="mb-2 h-4 w-1/3 rounded bg-gray-200"></div>
            <div className="flex gap-4">
              <div className="h-3 w-1/4 rounded bg-gray-300"></div>
              <div className="h-3 w-1/4 rounded bg-gray-300"></div>
              <div className="h-3 w-1/4 rounded bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TopResonanceContentSkeleton = () => {
  return (
    <div className="rounded-md bg-[#F5F2F0] p-6">
      <h2 className="text-secondary mb-0.5 text-xl font-semibold md:text-2xl">
        Top Resonance Content
      </h2>
      <p className="text-secondary text-sm sm:text-base">Highest pulse scores this month</p>
      <div className="mt-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse items-center justify-between rounded bg-[#f5f2f0ce] p-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div>
                <div className="mb-1 h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
              </div>
            </div>
            <div className="h-4 w-12 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};
