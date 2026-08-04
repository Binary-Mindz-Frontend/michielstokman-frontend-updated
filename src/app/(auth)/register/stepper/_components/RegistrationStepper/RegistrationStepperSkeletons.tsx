import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StepHeaderSkeletonProps {
  step: number;
}

export function StepHeaderSkeleton({ step }: StepHeaderSkeletonProps) {
  return (
    <>
      {/* Top Step Tracker Bar */}
      <div className="mb-6 flex w-full max-w-md justify-center gap-4 sm:max-w-lg md:max-w-xl">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-500',
              i <= step ? 'bg-[#D29B38]' : 'bg-[#EADFCF]',
            )}
          />
        ))}
      </div>

      {/* Back Button Row Placeholder */}
      {step > 1 && (
        <div className="mb-6 flex w-full justify-start">
          <Skeleton className="h-9 w-24 rounded-none bg-[#EADFCF]" />
        </div>
      )}

      {/* Header Hero + Text Column Section */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
        {/* Image Column Skeleton */}
        <div className="order-1 mt-4 flex w-full justify-center md:order-2 md:mt-0 md:w-1/2">
          {/* Mobile Hero Image Placeholder */}
          <div className="relative block aspect-4/5 w-full max-w-95 md:hidden">
            <Skeleton className="h-full w-full rounded-2xl bg-[#EADFCF]/70" />
          </div>

          {/* Desktop Hero Image Placeholder */}
          <div className="relative hidden aspect-square w-full max-w-112.5 md:block">
            <Skeleton className="h-full w-full rounded-2xl bg-[#EADFCF]/70" />
          </div>
        </div>

        {/* Text Column Skeleton */}
        <div className="order-2 mt-4 flex w-full max-w-110 flex-col items-center text-center md:order-1 md:w-1/2 md:max-w-full md:items-start md:text-left">
          <div className="flex w-full flex-col items-start justify-center gap-3.5 pl-4 md:pl-0">
            <Skeleton className="h-10 w-44 -rotate-3 rounded-md bg-[#E0D8CB] sm:h-12 sm:w-56 md:h-14 md:w-64" />
            <Skeleton className="h-8 w-36 -rotate-3 rounded-md bg-[#E0D8CB] sm:h-10 sm:w-44 md:h-12 md:w-52" />
            <Skeleton className="h-9 w-48 -rotate-3 rounded-md bg-[#E0D8CB] sm:h-11 sm:w-60 md:h-13 md:w-72" />
          </div>

          {/* Brush Background Section Skeleton */}
          <div className="relative mt-8 flex min-h-35 w-full max-w-105 -rotate-1 transform items-center justify-center rounded-xl bg-[#EBE4D8] p-4 sm:mt-10">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-3.5 w-64 rounded-md bg-[#DCD4C6] sm:w-80" />
              <Skeleton className="h-3.5 w-48 rounded-md bg-[#DCD4C6] sm:w-56" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function StepOneSkeleton() {
  return (
    <section className="bg-bg-primary text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12 font-sans md:px-12">
      <div className="flex w-full max-w-5xl flex-col items-center">
        <StepHeaderSkeleton step={1} />

        {/* Form Inputs Section Skeleton */}
        <div className="mt-10 flex w-full max-w-lg flex-col gap-5 text-left sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          {/* 8 Form Fields Skeletons */}
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-44 rounded-xs bg-[#E5DFD5]" />
              <Skeleton className="h-11 w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0]" />
            </div>
          ))}

          {/* Sexual Orientation Switch + Input Skeleton */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-60 rounded-xs bg-[#E5DFD5]" />
              <Skeleton className="h-6 w-11 rounded-full bg-[#EADFCF]" />
            </div>
            <Skeleton className="h-3 w-24 rounded-xs bg-[#EADFCF]" />
            <Skeleton className="h-11 w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0]" />
          </div>

          {/* Submit Button Skeleton */}
          <Skeleton className="mx-auto mt-6 h-12 w-full max-w-xs rounded-md bg-[#D29B38]/40 sm:rounded-none" />
        </div>
      </div>
    </section>
  );
}

export function StepTwoSkeleton() {
  return (
    <section className="bg-bg-primary text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12 font-sans md:px-12">
      <div className="flex w-full max-w-5xl flex-col items-center">
        <StepHeaderSkeleton step={2} />

        {/* Options Container Box Skeleton */}
        <div className="mt-10 flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-[#FEC332]/60 bg-[#FAF7F0] p-6 text-left shadow-sm sm:max-w-xl sm:p-8 md:max-w-2xl lg:max-w-3xl">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full bg-[#EADFCF]" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32 rounded-md bg-[#E0D8CB]" />
                <Skeleton className="h-3.5 w-56 rounded-xs bg-[#EADFCF] sm:w-72" />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button Skeleton */}
        <Skeleton className="mx-auto mt-8 h-12 w-full max-w-xs rounded-md bg-[#D29B38]/40 sm:rounded-none" />
      </div>
    </section>
  );
}

export function StepThreeSkeleton() {
  return (
    <section className="bg-bg-primary text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12 font-sans md:px-12">
      <div className="flex w-full max-w-5xl flex-col items-center">
        <StepHeaderSkeleton step={3} />

        {/* Sliders Container Box Skeleton */}
        <div className="mt-10 flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-[#FEC332]/60 bg-[#FAF7F0] p-6 text-left shadow-sm sm:max-w-xl sm:p-8 md:max-w-2xl lg:max-w-3xl">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36 rounded-xs bg-[#E0D8CB]" />
                <Skeleton className="h-4 w-8 rounded-xs bg-[#D29B38]/40" />
              </div>
              <Skeleton className="h-2 w-full rounded-full bg-[#EADFCF]" />
            </div>
          ))}
        </div>

        {/* Submit Button Skeleton */}
        <Skeleton className="mx-auto mt-8 h-12 w-full max-w-xs rounded-md bg-[#D29B38]/40 sm:rounded-none" />
      </div>
    </section>
  );
}

export function StepperSkeleton({ step = 1 }: { step?: number }) {
  if (step === 2) return <StepTwoSkeleton />;
  if (step === 3) return <StepThreeSkeleton />;
  return <StepOneSkeleton />;
}
