import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
}

export const SummaryCard = ({ title, value, subValue, icon: Icon }: SummaryCardProps) => {
  return (
    <div className="space-y-5 rounded-md bg-[#F5F2F0] p-6">
      <div className="flex items-start justify-between">
        <Icon size={22} strokeWidth={1.5} className="text-dark-primary" />
        {subValue && <span className="text-success text-sm font-medium">{subValue}</span>}
      </div>
      <div>
        <h3 className="text-primary mb-2 text-2xl font-semibold sm:text-3xl">{value}</h3>
        <p className="text-secondary text-sm font-medium">{title}</p>
      </div>
    </div>
  );
};
