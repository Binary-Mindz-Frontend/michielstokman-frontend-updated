import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Suspense } from 'react';
import VoiceReviewTable from './_components/VoiceReviewTable/VoiceReviewTable';

function DashboardVoiceReviewPage() {
  return (
    <section>
      <DynamicPageHeader title="Voice Review — AI Generated Audio" />
      <Suspense fallback={<div>Loading...</div>}>
        <VoiceReviewTable />
      </Suspense>
    </section>
  );
}

export default DashboardVoiceReviewPage;
