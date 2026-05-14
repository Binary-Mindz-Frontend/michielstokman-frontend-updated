'use client';
import UnifiedStoryFormSkeleton from '@/components/main/Skeletons/UnifiedStoryFormSkeleton';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CreateFormCategoryTabs from './CreateForm/_components/CreateFormCategoryTabs/CreateFormCategoryTabs';
import CreateFormHeader from './CreateForm/_components/CreateFormHeader/CreateFormHeader';
import UnifiedStoryForm from './CreateForm/_components/UnifiedStoryForm/UnifiedStoryForm';

export default function CreateFormPage() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('type') || 'Confessions';

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Suspense fallback={<UnifiedStoryFormSkeleton />}>
        <motion.div initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
          <motion.div variants={FADE_IN_UP_ITEM}>
            <CreateFormHeader category={selectedCategory} />
          </motion.div>

          <motion.div variants={FADE_IN_UP_ITEM}>
            <CreateFormCategoryTabs selected={selectedCategory} />
          </motion.div>

          <UnifiedStoryForm category={selectedCategory} />

          <motion.p variants={FADE_IN_UP_ITEM} className="text-secondary mt-4 text-center text-sm">
            All submissions are reviewed with care.
          </motion.p>
        </motion.div>
      </Suspense>
    </section>
  );
}
