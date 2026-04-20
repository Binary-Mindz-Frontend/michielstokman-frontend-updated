/* eslint-disable @typescript-eslint/no-explicit-any */
import DynamicSectionHeader from '@/components/main/DynamicSectionHeader/DynamicSectionHeader';

export default function CreateFormHeader({ category }: { category: string }) {
  const headerContent: any = {
    Confessions: {
      title: 'Share Your Liberation',
      description: 'Your story could be exactly what someone needs today.',
    },
    Meditation: {
      title: 'Share Your Voice',
      description: 'Guide others through your unique meditation practice.',
    },
  };

  return (
    <DynamicSectionHeader
      title={headerContent[category].title}
      description={headerContent[category].description}
    />
  );
}
