import { BarChart2 } from 'lucide-react';
import { TopResonanceContentSkeleton } from '../OverViewSkeleton/OverViewSkeleton';

interface TopResonanceContent {
  id: number;
  title: string;
  reflections: number;
  pulse: string;
}

const TopResonanceContent = ({
  topResonanceContent,
  isLoading,
}: {
  topResonanceContent: TopResonanceContent[];
  isLoading: boolean;
}) => {
  // add skeleton
  if (isLoading) {
    return <TopResonanceContentSkeleton />;
  }

  if (!topResonanceContent || topResonanceContent.length === 0) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center rounded-md border-gray-300/50 bg-[#F5F2F0] p-6 text-center">
        <div className="mb-4 rounded-full bg-gray-200/50 p-4">
          <BarChart2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-dark-primary text-lg font-semibold">No Data Found</h3>
        <p className="text-secondary mt-1 max-w-xs text-sm sm:text-base">{`We couldn't find any resonance data for the selected period.`}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-[#F5F2F0] p-6">
      <h2 className="text-dark-primary mb-0.5 text-xl font-semibold md:text-2xl">
        Top Resonance Content
      </h2>
      <p className="text-secondary text-sm sm:text-base">Highest pulse scores this month</p>

      <div>
        {topResonanceContent?.map((content) => (
          <div
            key={content?.id}
            className="border-primary/20 flex items-center justify-between border-b py-5 last:border-0"
          >
            <div className="flex items-center gap-4">
              {/* <span className="text-secondary mt-1 text-xl">{content?.id}.</span> */}
              <div>
                <h4 className="text-dark-primary text-lg font-semibold sm:text-xl">
                  {content?.title}
                </h4>
                <p className="text-secondary text-base sm:text-lg md:mt-1">
                  {content?.reflections} reflections
                </p>
              </div>
            </div>
            <span className="text-primary text-lg font-semibold sm:text-xl">{content?.pulse}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopResonanceContent;
