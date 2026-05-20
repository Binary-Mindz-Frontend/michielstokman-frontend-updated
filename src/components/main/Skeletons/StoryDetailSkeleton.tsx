export const StoryDetailSkeleton = () => (
  <div className="min-h-screen bg-[#FAF7F5]">
    {/* Hero Section Skeleton */}
    <div className="relative h-[55vh] w-full animate-pulse bg-[#FAF7F5]">
      <div className="absolute inset-0 bg-[#EADED5]/50" />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(250, 247, 245, 0) -39.16%, #FAF7F5 93.71%)',
        }}
      />
      <div className="relative z-20 container mx-auto px-4 pt-10">
        <div className="flex h-4 w-16 items-center gap-1 rounded bg-[#EADED5]" />
      </div>
    </div>

    {/* Content Container */}
    <div className="relative z-20 mx-auto -mt-40 w-full max-w-400 animate-pulse px-4">
      <div className="space-y-6">
        {/* Header Tag and Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-4 w-20 rounded bg-[#EADED5]" />
            <div className="h-0.5 w-12 bg-[#EADED5]/40" />
          </div>
          <div className="h-7 w-20 rounded bg-[#EADED5]/70" />
        </div>

        {/* Title & Metadata */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="w-full space-y-4">
            {/* Main Title Bar */}
            <div className="h-10 w-[75%] rounded bg-[#EADED5] sm:w-[50%]" />
            {/* Meta Text Row */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="h-4 w-64 rounded bg-[#EADED5]/80" />
              <div className="h-4 w-48 rounded bg-[#EADED5]/80" />
            </div>
            {/* Tags Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="h-8 w-20 rounded bg-[#EADED5]/60" />
              <div className="h-8 w-24 rounded bg-[#EADED5]/60" />
              <div className="h-8 w-16 rounded bg-[#EADED5]/60" />
            </div>
          </div>
        </div>

        {/* Custom Audio Player Placeholder */}
        <div className="border-primary/5 flex h-20 w-full items-center justify-between space-x-4 rounded border bg-[#FAF7F5] px-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#EADED5]" />
          <div className="h-3 w-full rounded bg-[#EADED5]/70" />
          <div className="h-4 w-12 shrink-0 rounded bg-[#EADED5]/60" />
        </div>

        {/* Story Text Paragraphs Placeholder */}
        <div className="mx-auto w-full space-y-6 pt-8">
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-[#EADED5]/80" />
            <div className="h-4 w-[98%] rounded bg-[#EADED5]/80" />
            <div className="h-4 w-[93%] rounded bg-[#EADED5]/80" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-[96%] rounded bg-[#EADED5]/80" />
            <div className="h-4 w-[94%] rounded bg-[#EADED5]/80" />
            <div className="h-4 w-[40%] rounded bg-[#EADED5]/80" />
          </div>
        </div>

        {/* Bottom Button Action */}
        <div className="flex flex-col items-center pt-10 pb-20">
          <div className="h-11 w-44 rounded bg-[#EADED5]" />
        </div>
      </div>
    </div>
  </div>
);
