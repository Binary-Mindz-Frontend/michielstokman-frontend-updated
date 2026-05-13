import { Skeleton } from '@/components/ui/skeleton';

export default function StoryDetailSkeleton() {
  return (
    <div className="min-h-screen space-y-10">
      {/* Hero Section Skeleton */}
      <div className="relative h-[60vh] w-full">
        <Skeleton className="h-full w-full" />

        {/* Back Button Skeleton */}
        <div className="relative z-20 container mx-auto pt-12">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="relative z-20 mx-auto -mt-40 w-full max-w-400 space-y-8 px-4">
        <div className="space-y-6">
          {/* Header Info Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-0.5 w-12" />
            </div>
            <Skeleton className="h-7 w-20 rounded" />
          </div>

          {/* Title & Stats Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 sm:h-16" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-sm" />
            ))}
          </div>

          {/* Player Section Skeleton */}
          <div className="space-y-6 pt-6 md:pt-12">
            <div className="space-y-4">
              <Skeleton className="h-1.5 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>

            <div className="flex justify-center">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          </div>

          {/* Text Content Skeleton */}
          <div className="space-y-4 pt-6 md:pt-10">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
            <Skeleton className="h-5 w-2/3" />
          </div>

          {/* Action Button Skeleton */}
          <div className="flex justify-center pt-6 md:pt-10">
            <Skeleton className="h-12 w-48 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
