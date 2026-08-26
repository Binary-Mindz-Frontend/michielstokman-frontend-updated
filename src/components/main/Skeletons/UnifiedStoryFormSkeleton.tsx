import { Skeleton } from '@/components/ui/skeleton';

export default function UnifiedStoryFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Inputs Section */}
      <div className="space-y-4 sm:space-y-6">
        {/* Title Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* First Name Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Textarea Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-40 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Voice & Cover pickers */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-56" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-22 w-full rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-[257px] w-[220px] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Selection Areas Section */}
      <div className="space-y-6">
        {/* Growth Areas Chips Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Life Phase Chips Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Tags Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Switch Section Skeleton */}
        <div className="flex items-center justify-between border-t border-[#E5E0DA] pt-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <Skeleton className="h-12 w-full sm:h-16" />
    </div>
  );
}
