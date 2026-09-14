import { Activity } from 'lucide-react';
import Link from 'next/link';
import { TopResonanceContentSkeleton } from '../OverViewSkeleton/OverViewSkeleton';

interface TopResonanceContentItem {
  id: number;
  title: string;
  reflections: number;
  score: string;
  pulse: string;
}

const TopResonanceContent = ({
  topResonanceContent,
  isLoading,
}: {
  topResonanceContent: TopResonanceContentItem[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <TopResonanceContentSkeleton />;
  }

  if (!topResonanceContent || topResonanceContent.length === 0) {
    return (
      <section className="flex min-h-75 flex-col items-center justify-center rounded-md bg-[#F5F2F0] p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAE7E4]">
          <Activity className="h-7 w-7 text-[#A39F99]" strokeWidth={1.5} />
        </div>
        <h3 className="text-secondary text-lg font-semibold">No resonance data</h3>
        <p className="mt-2 max-w-70 text-sm leading-relaxed text-[#726E6A]">
          Once stories start collecting pulse scores, the top performers will show up here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-md bg-[#F5F2F0] p-5 sm:p-6">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-secondary text-xl font-semibold tracking-tight md:text-2xl">
            Top Resonance
          </h2>
          <p className="mt-0.5 text-sm text-[#726E6A]">Highest pulse scores this month</p>
        </div>
        <span className="bg-primary/8 text-primary hidden h-9 w-9 shrink-0 items-center justify-center rounded-md sm:inline-flex">
          <Activity size={18} strokeWidth={1.5} />
        </span>
      </header>

      <ul>
        {topResonanceContent.map((content, index) => {
          const rank = index + 1;
          const href = content?.id ? `/dashboard/publications/${content.id}` : undefined;

          const body = (
            <>
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums ${
                    rank === 1 ? 'bg-primary text-white' : 'bg-white/80 text-[#726E6A]'
                  }`}
                >
                  {rank}
                </span>

                <div className="min-w-0">
                  <h4 className="text-secondary truncate text-base font-semibold sm:text-lg">
                    {content.title}
                  </h4>
                  <p className="mt-0.5 text-sm text-[#726E6A] tabular-nums">
                    {content.reflections} reflections
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
                    Score
                  </p>
                  <p className="text-primary text-base font-semibold tabular-nums sm:text-lg">
                    {content.score}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold tracking-wider text-[#A08170] uppercase">
                    Pulse
                  </p>
                  <p className="text-primary text-base font-semibold tabular-nums sm:text-lg">
                    {content.pulse}
                  </p>
                </div>
              </div>
            </>
          );

          return (
            <li
              key={content.id ?? `${content.title}-${index}`}
              className="border-primary/10 border-b last:border-0"
            >
              {href ? (
                <Link
                  href={href}
                  className="hover:bg-primary/[0.03] flex items-center justify-between gap-4 rounded-md py-4 transition-colors"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-4 py-4">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TopResonanceContent;
