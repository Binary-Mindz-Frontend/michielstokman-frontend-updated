import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CoverLibrary from './_components/CoverLibrary';

export default function CoverLibraryPage() {
  return (
    <section>
      <Link
        href="/dashboard/publications"
        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#BF7758]"
      >
        <ArrowLeft size={14} /> Publications
      </Link>
      <DynamicPageHeader
        title="Cover library"
        description="Fallback cover per content type, used only when AI cover generation fails."
      />
      <CoverLibrary />
    </section>
  );
}
