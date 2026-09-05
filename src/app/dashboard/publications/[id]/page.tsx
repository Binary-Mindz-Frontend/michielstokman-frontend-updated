'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import PublicationWorkspace from './_components/PublicationWorkspace';

export default function PublicationWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? '').trim();

  if (!id) {
    return <p className="text-sm text-[#5C4D43]">Invalid publication link.</p>;
  }

  return (
    <section>
      <button
        type="button"
        onClick={() => router.push('/dashboard/publications')}
        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#BF7758]"
      >
        <ArrowLeft size={14} /> Publications
      </button>
      <DynamicPageHeader
        title="Publication record"
        description="Review the written content, story card, and voice. Publish only when every required piece is approved."
      />
      <PublicationWorkspace id={id} />
    </section>
  );
}
