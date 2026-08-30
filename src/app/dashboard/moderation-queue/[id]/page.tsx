'use client';

import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ReviewDetails } from '../_components/ReviewDetails/ReviewDetails';

export default function ModerationDeskPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? '').trim();

  const backToQueue = () => router.push('/dashboard/moderation-queue');

  if (!id) {
    return (
      <section>
        <p className="text-sm text-[#5C4D43]">Invalid story link.</p>
      </section>
    );
  }

  return (
    <section>
      <button
        type="button"
        onClick={backToQueue}
        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#BF7758]"
      >
        <ArrowLeft size={14} /> Queue
      </button>
      <DynamicPageHeader
        title="Edit concept"
        description="Listen, edit in place, regenerate AI fields, then save or approve."
      />
      <div className="custom-scrollbar max-h-[calc(100vh-8rem)] overflow-y-auto rounded-md border border-[#F1E9E4] bg-[#F8F7F3] p-6">
        <ReviewDetails id={id} onClose={backToQueue} />
      </div>
    </section>
  );
}
