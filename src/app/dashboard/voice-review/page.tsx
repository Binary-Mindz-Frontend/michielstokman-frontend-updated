import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import VoiceReviewTable from './_components/VoiceReviewTable/VoiceReviewTable';
import { Suspense } from 'react';

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
