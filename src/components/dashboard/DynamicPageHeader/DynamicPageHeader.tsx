interface DynamicPageHeaderProps {
  title: string;
  description?: string;
}

const DynamicPageHeader = ({ title, description }: DynamicPageHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-secondary text-xl font-bold sm:text-2xl xl:text-3xl">{title}</h2>
      {description && (
        <p className="text-secondary mt-1 text-sm sm:mt-1.5 sm:text-base">{description}</p>
      )}
    </div>
  );
};

export default DynamicPageHeader;
