import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import TableSkeleton from '@/components/dashboard/CustomTable/TableSkeleton';
import { Suspense } from 'react';
import PublicationsOverview from './_components/PublicationsOverview';

export default function PublicationsPage() {
  return (
    <section>
      <DynamicPageHeader
        title="Publications"
        description="One record per Confession and Meditation text, story card and voice in one place."
      />
      <Suspense fallback={<TableSkeleton SKELETON_COLS={9} />}>
        <PublicationsOverview />
      </Suspense>
    </section>
  );
}
