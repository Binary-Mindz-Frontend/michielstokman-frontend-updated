import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Suspense } from 'react';
import ModerationTable from './_components/ModerationTable/ModerationTable';

function DashboardModerationQueuePage() {
  // test
  return (
    <section>
      <DynamicPageHeader title="Moderation Queue" />
      <Suspense>
        <ModerationTable />
      </Suspense>
    </section>
  );
}

export default DashboardModerationQueuePage;
