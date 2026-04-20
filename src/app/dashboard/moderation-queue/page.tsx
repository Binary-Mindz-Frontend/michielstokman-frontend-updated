import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import ModerationTable from './_components/ModerationTable/ModerationTable';
import { Suspense } from 'react';

function DashboardModerationQueuePage() {
  // test
  return (
    <section>
      <DynamicPageHeader title="Moderation Queue" />
      <Suspense fallback={<div>Loading...</div>}>
        <ModerationTable />
      </Suspense>
    </section>
  );
}

export default DashboardModerationQueuePage;
