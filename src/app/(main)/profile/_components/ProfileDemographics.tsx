'use client';

interface DemographicItem {
  label: string;
  value: string;
}

interface ProfileDemographicsProps {
  personalDetails: DemographicItem[];
}

export default function ProfileDemographics({ personalDetails }: ProfileDemographicsProps) {
  return (
    <div className="mb-8 w-full rounded-2xl bg-[#F7F3EC] p-8 shadow-sm md:p-12">
      <div className="grid grid-cols-2 gap-y-8 md:gap-x-12">
        {personalDetails.map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="font-playpen text-[11px] font-bold tracking-wider text-[#8C6D4D] uppercase">
              {item.label}
            </span>
            <span className="font-edo text-xl font-normal text-[#94A3B8] not-italic">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
