import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <main className="bg-bg-primary min-h-screen py-10 font-sans">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4">
        {/* Page Title Skeleton */}
        <div className="mb-10 flex w-full justify-center">
          <Skeleton className="h-9 w-64 rounded-md bg-[#E5DFD5] md:h-10 md:w-96" />
        </div>

        {/* SECTION 1: HERO / BRUSH STATS SKELETON */}
        <div className="relative mb-8 flex w-full max-w-4xl flex-col items-center justify-center rounded-2xl bg-[#F7F3EC] px-3 py-8 shadow-sm sm:px-6 sm:py-12 md:py-16">
          {/* Top Username Brush Area */}
          <div className="relative flex min-h-[110px] w-full max-w-[550px] flex-col items-center justify-center text-center sm:min-h-[135px] md:min-h-[150px]">
            {/* Credit Badge Skeleton */}
            <div className="absolute top-1 right-2 min-[400px]:top-2 min-[400px]:right-4 sm:top-4 sm:right-10 md:top-5 md:right-14">
              <Skeleton className="h-6 w-16 rounded-full bg-[#E0D8CB] sm:h-7 sm:w-20" />
            </div>

            {/* Username & Life Phase Skeletons */}
            <Skeleton className="h-7 w-48 rounded-md bg-[#E0D8CB] min-[380px]:h-8 min-[380px]:w-56 sm:h-9 sm:w-64 md:h-10 md:w-72" />
            <Skeleton className="mt-2 h-3.5 w-24 rounded-md bg-[#E0D8CB]/80 sm:mt-3 sm:h-4 sm:w-32" />
          </div>

          {/* Bottom Brushes Skeleton Container */}
          <div className="mt-6 flex w-full flex-row items-center justify-center gap-2 px-1 sm:mt-10 sm:gap-6 md:gap-12 lg:gap-16">
            {/* Left Stat Brush Skeleton */}
            <div className="relative flex min-h-[75px] w-1/2 max-w-[260px] flex-col items-center justify-center rounded-xl bg-[#EBE4D8] p-3 min-[380px]:min-h-[85px] sm:min-h-[100px] sm:max-w-[320px] md:min-h-[115px]">
              <Skeleton className="h-6 w-10 rounded-md bg-[#DCD4C6] sm:h-8 sm:w-14" />
              <Skeleton className="mt-2 h-2.5 w-16 rounded-xs bg-[#DCD4C6] sm:h-3 sm:w-24" />
            </div>

            {/* Right Stat Brush Skeleton */}
            <div className="relative flex min-h-[75px] w-1/2 max-w-[260px] flex-col items-center justify-center rounded-xl bg-[#EBE4D8] p-3 min-[380px]:min-h-[85px] sm:min-h-[100px] sm:max-w-[320px] md:min-h-[115px]">
              <Skeleton className="h-6 w-10 rounded-md bg-[#DCD4C6] sm:h-8 sm:w-14" />
              <Skeleton className="mt-2 h-2.5 w-16 rounded-xs bg-[#DCD4C6] sm:h-3 sm:w-24" />
            </div>
          </div>
        </div>

        {/* SECTION 2: DEMOGRAPHICS GRID SKELETON */}
        <div className="mb-8 w-full max-w-2xl rounded-2xl bg-[#F7F3EC] p-8 shadow-sm md:p-12">
          <div className="grid grid-cols-2 gap-y-8 md:gap-x-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-20 rounded-xs bg-[#E5DFD5] sm:w-24" />
                <Skeleton className="h-6 w-20 rounded-md bg-[#E0D8CB] sm:w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: RADAR CHART SKELETON */}
        <div className="mb-10 w-full max-w-2xl rounded-2xl bg-[#F7F3EC] p-6 shadow-sm sm:p-8">
          <Skeleton className="mx-auto mb-6 h-5 w-44 rounded-md bg-[#E0D8CB] sm:w-52" />

          <div className="mx-auto flex aspect-square max-h-80 w-full max-w-125 items-center justify-center rounded-full border-4 border-dashed border-[#E5DFD5] bg-[#F2ECE2] p-8 sm:max-h-105">
            <Skeleton className="h-32 w-32 rounded-full bg-[#E0D8CB]/60 sm:h-44 sm:w-44" />
          </div>
        </div>

        {/* SECTION 4: ACTIONS SKELETON */}
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <Skeleton className="h-14 w-full rounded-none bg-[#D9305B]/30" />
          <Skeleton className="h-14 w-full rounded-none bg-[#E0D8CB]/70" />
        </div>
      </div>
    </main>
  );
}
