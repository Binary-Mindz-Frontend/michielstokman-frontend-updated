interface DynamicSectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const DynamicSectionHeader = ({ title, description, className }: DynamicSectionHeaderProps) => {
  return (
    <div className={`${className} mb-12 text-center`}>
      <h2 className="text-dark-primary mb-1 font-serif text-2xl font-semibold md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="text-secondary mx-auto w-full max-w-150 text-sm sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
};

export default DynamicSectionHeader;
