export const JourneyDetailSkeleton = () => (
  <div className="min-h-screen bg-[#FAF7F5]">
    {/* Hero Area Placeholder */}
    <div className="relative h-[60vh] w-full animate-pulse bg-[#FAF7F5]">
      <div className="absolute inset-0 bg-[#EADED5]/50" />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(250, 247, 245, 0) -39.16%, #FAF7F5 93.71%)',
        }}
      />
      <div className="relative z-20 container mx-auto px-4 pt-12">
        <div className="h-4 w-12 rounded bg-[#EADED5]" />
      </div>
    </div>

    {/* Content Area Placeholder */}
    <div className="relative z-20 mx-auto -mt-40 w-full max-w-400 animate-pulse px-4">
      <div className="space-y-6">
        {/* Category Tag Line */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-20 rounded bg-[#EADED5]" />
          <div className="h-0.5 w-12 bg-[#EADED5]/40" />
        </div>

        {/* Title, Badges & Price Grid */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="w-full space-y-4">
            {/* Title Bars */}
            <div className="h-10 w-[70%] rounded bg-[#EADED5] sm:w-[50%]" />
            {/* Badges */}
            <div className="flex items-center gap-3">
              <div className="h-7 w-20 rounded bg-[#EADED5]/70" />
              <div className="h-7 w-24 rounded bg-[#EADED5]/70" />
            </div>
          </div>
          {/* Price Tag */}
          <div className="h-10 w-24 shrink-0 rounded bg-[#EADED5]" />
        </div>

        {/* Description Block */}
        <div className="max-w-4xl space-y-3 pt-4">
          <div className="h-4 w-full rounded bg-[#EADED5]/80" />
          <div className="h-4 w-[95%] rounded bg-[#EADED5]/80" />
          <div className="h-4 w-[85%] rounded bg-[#EADED5]/80" />
        </div>

        {/* What to Expect List */}
        <div className="space-y-4 pt-6">
          <div className="h-6 w-36 rounded bg-[#EADED5]" />
          <div className="grid grid-cols-1 gap-y-4 md:max-w-xl">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-4 shrink-0 rounded-full bg-[#EADED5]" />
                  <div className="h-4 w-full rounded bg-[#EADED5]/70" />
                </div>
              ))}
          </div>
        </div>

        {/* Bottom Button Area */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="h-12 w-64 rounded bg-[#EADED5]" />
          <div className="h-4 w-72 rounded bg-[#EADED5]/60" />
        </div>
      </div>
    </div>
  </div>
);
