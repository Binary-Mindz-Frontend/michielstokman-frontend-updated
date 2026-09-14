import { cn } from '@/lib/utils';

interface DynamicPageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const DynamicPageHeader = ({ title, description, className }: DynamicPageHeaderProps) => {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-secondary text-xl font-bold sm:text-2xl xl:text-3xl">{title}</h2>
      {description && (
        <p className="mt-1 max-w-2xl text-sm text-[#726E6A] sm:mt-1.5 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
};

export default DynamicPageHeader;
