'use client';

import SubmitTypeChoice from '@/app/(main)/create/CreateForm/_components/SubmitTypeChoice/SubmitTypeChoice';
import SubmitWizard from '@/app/(main)/create/CreateForm/_components/SubmitWizard/SubmitWizard';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import UnifiedStoryFormSkeleton from '@/components/main/Skeletons/UnifiedStoryFormSkeleton';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const ADMIN_CREATE_BASE = '/dashboard/publications/create';

function AdminCreateContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || '';
  const hasType =
    typeParam === 'Confessions' || typeParam === 'Meditation' || typeParam === 'Meditations';
  const wizardCategory =
    typeParam === 'Meditation' || typeParam === 'Meditations' ? 'Meditation' : 'Confessions';

  return (
    <div className="mx-auto max-w-3xl py-2">
      {hasType ? (
        <SubmitWizard
          key={wizardCategory}
          category={wizardCategory === 'Meditation' ? 'Meditation' : 'Confessions'}
          basePath={ADMIN_CREATE_BASE}
          successHref="/dashboard/publications"
        />
      ) : (
        <SubmitTypeChoice basePath={ADMIN_CREATE_BASE} />
      )}
    </div>
  );
}

export default function AdminPublicationCreatePage() {
  return (
    <section>
      <DynamicPageHeader
        title="Submit a publication"
        description="Create a Confession or Meditation the same way members do. After submit, manage it from Publications."
      />
      <Suspense fallback={<UnifiedStoryFormSkeleton />}>
        <AdminCreateContent />
      </Suspense>
    </section>
  );
}
