import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="mx-auto h-10 w-48" />
        <Skeleton className="mx-auto h-5 w-32" />
      </div>

      <div className="space-y-4">
        {/* Daily Credits Card Skeleton */}
        <div className="border-primary/10 space-y-4 border p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-64" />
        </div>

        {/* Stats Section Skeleton */}
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>

      {/* Personal Details Grid Skeleton */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-32" />
          </div>
        ))}
      </div>

      {/* Growth Focus Skeleton */}
      <div className="space-y-6 pt-6">
        <Skeleton className="h-8 w-40 border-b pb-4" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="space-y-4 pt-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
