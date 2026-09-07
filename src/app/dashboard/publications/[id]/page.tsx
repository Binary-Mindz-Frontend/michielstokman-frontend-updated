'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import PublicationWorkspace from './_components/PublicationWorkspace';

export default function PublicationWorkspacePage() {
  const params = useParams();
  const id = String(params?.id ?? '').trim();

  if (!id) {
    return (
      <section>
        <p className="text-sm text-[#5C4D43]">Invalid publication link.</p>
      </section>
    );
  }

  return (
    <section>
      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-24 w-full rounded-xl bg-[#EDE7E1]" />
            <div className="h-96 w-full rounded-xl bg-[#EDE7E1]" />
          </div>
        }
      >
        <PublicationWorkspace id={id} />
      </Suspense>
    </section>
  );
}
