export const JourneyDetailSkeleton = () => (
  <main className="min-h-screen animate-pulse bg-[#FAF7F2] pb-16 font-sans text-black">
    {/* Brand Hero Container */}
    <div className="mx-auto w-full max-w-350 px-4 pt-4 pb-8 sm:px-8">
      {/* Top Back Button Skeleton */}
      <div className="mb-6 sm:mb-8">
        <div className="h-9 w-24 rounded-full bg-[#EADED5]" />
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row md:items-center">
        {/* TITLE SECTION (Left Column) */}
        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          {/* Main Title Skeleton Bars */}
          <div className="w-full max-w-lg space-y-3">
            <div className="h-10 w-full rounded-md bg-[#EADED5] sm:h-12" />
            <div className="h-10 w-[85%] rounded-md bg-[#EADED5] sm:h-12" />
          </div>

          {/* Brush Subtitle Skeleton */}
          <div className="mt-6 h-14 w-full max-w-[300px] rounded-xl bg-[#EADED5]/70 sm:max-w-[340px]" />
        </div>

        {/* HERO IMAGE SECTION (Right Column) */}
        <div className="relative flex w-full justify-center md:w-1/2">
          <div className="relative h-72 w-full max-w-85 shrink-0 rounded-2xl bg-[#EADED5]/80 sm:h-100 sm:max-w-115 md:max-w-140 lg:h-120 lg:max-w-160">
            {/* Yellow Badge Skeleton */}
            <div className="absolute bottom-2 left-2 z-20 h-20 w-20 rounded-full bg-[#EADED5] sm:bottom-4 sm:left-4 sm:h-28 sm:w-28" />

            {/* Hand-Drawn Purple Badge Skeleton */}
            <div className="absolute right-2 bottom-1 z-20 hidden h-22 w-22 rounded-full bg-[#EADED5] sm:right-4 sm:bottom-2 sm:h-26 sm:w-26 md:block" />
          </div>
        </div>
      </div>
    </div>

    {/* Intro Description Paragraph & Floating Purple Circle Badge Skeleton */}
    <div className="relative mx-auto mt-6 mb-8 max-w-5xl px-4 text-center">
      <div className="mx-auto max-w-2xl space-y-3">
        <div className="h-4 w-full rounded bg-[#EADED5]/80" />
        <div className="mx-auto h-4 w-[92%] rounded bg-[#EADED5]/80" />
        <div className="mx-auto h-4 w-[80%] rounded bg-[#EADED5]/80" />
      </div>

      {/* Floating Purple Badge Skeleton on Desktop / Centered on Mobile */}
      <div className="relative mx-auto my-6 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#EADED5] lg:absolute lg:-top-6 lg:right-4 lg:my-0 lg:h-28 lg:w-28 lg:translate-y-0 xl:right-8" />
    </div>

    {/* "WHAT TO EXPECT" Card Skeleton */}
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center rounded-lg border border-[#EDE8E8] bg-[#FBF9F3] p-6 text-center shadow-xs sm:p-10">
        {/* Card Header & Underline Skeleton */}
        <div className="mb-6 flex flex-col items-center justify-center space-y-2">
          <div className="h-7 w-48 rounded bg-[#EADED5] sm:w-60" />
          <div className="h-3 w-36 rounded bg-[#EADED5]/70 sm:w-48" />
        </div>

        {/* List Items Skeleton */}
        <div className="w-full space-y-4">
          {Array(4)
            .fill(null)
            .map((_, idx) => (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="h-5 w-5 shrink-0 rounded-full bg-[#EADED5]" />
                <div
                  className="h-4 rounded bg-[#EADED5]/80"
                  style={{ width: `${85 - idx * 8}%` }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* CTA Button Section Skeleton */}
    <div className="mx-auto max-w-2xl px-4">
      <div className="mt-8 flex flex-col items-center justify-center space-y-3">
        <div className="h-12 w-full max-w-xs rounded-xl bg-[#EADED5] sm:max-w-sm" />
        <div className="h-3.5 w-60 rounded bg-[#EADED5]/70 sm:w-72" />
      </div>
    </div>
  </main>
);
