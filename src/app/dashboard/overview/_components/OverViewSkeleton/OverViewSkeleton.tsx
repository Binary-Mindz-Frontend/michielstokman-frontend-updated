export const SummaryCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-md bg-[#F5F2F0] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-md bg-[#EAE7E4]" />
        <div className="h-6 w-14 rounded-md bg-[#EAE7E4]" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-20 rounded bg-[#EAE7E4]" />
        <div className="h-8 w-24 rounded bg-[#EAE7E4]" />
      </div>
    </div>
  );
};

export const WeeklyTrendSkeleton = () => {
  return (
    <div className="rounded-md bg-[#F5F2F0] p-5 sm:p-6">
      <div className="mb-5 space-y-2">
        <div className="h-7 w-40 animate-pulse rounded bg-[#EAE7E4]" />
        <div className="h-4 w-56 animate-pulse rounded bg-[#EAE7E4]" />
      </div>
      <div className="space-y-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-28 rounded bg-[#EAE7E4]" />
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-md bg-[#EAE7E4]" />
                <div className="h-7 w-16 rounded-md bg-[#EAE7E4]" />
                <div className="h-7 w-16 rounded-md bg-[#EAE7E4]" />
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#EAE7E4]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TopResonanceContentSkeleton = () => {
  return (
    <div className="rounded-md bg-[#F5F2F0] p-5 sm:p-6">
      <div className="mb-5 space-y-2">
        <div className="h-7 w-36 animate-pulse rounded bg-[#EAE7E4]" />
        <div className="h-4 w-52 animate-pulse rounded bg-[#EAE7E4]" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex animate-pulse items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-[#EAE7E4]" />
              <div className="space-y-2">
                <div className="h-4 w-36 rounded bg-[#EAE7E4]" />
                <div className="h-3 w-24 rounded bg-[#EAE7E4]" />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="h-8 w-10 rounded bg-[#EAE7E4]" />
              <div className="h-8 w-10 rounded bg-[#EAE7E4]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
