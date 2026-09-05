import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Suspense } from 'react';
import PublicationsTable from './_components/PublicationsTable';

export default function PublicationsPage() {
  return (
    <section>
      <DynamicPageHeader
        title="Publications"
        description="One record per Confession or Meditation. Open a row to review text, story card, and voice, then publish them together."
      />
      <Suspense>
        <PublicationsTable />
      </Suspense>
    </section>
  );
}
