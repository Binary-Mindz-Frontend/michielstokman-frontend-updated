/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import UnifiedStoryFormSkeleton from '@/components/main/Skeletons/UnifiedStoryFormSkeleton';
import { useCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CreateFormCategoryTabs from './CreateForm/_components/CreateFormCategoryTabs/CreateFormCategoryTabs';
import CreateFormHeader from './CreateForm/_components/CreateFormHeader/CreateFormHeader';

import LoginRequiredModal from './CreateForm/_components/LoginRequiredModal/LoginRequiredModal';
import UnifiedStoryForm from './CreateForm/_components/UnifiedStoryForm/UnifiedStoryForm';

export default function CreateFormPage() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('type') || 'Confessions';

  const user = useAppSelector(useCurrentUser) as any;

  const isAuthModalOpen = !user || user?.is_guest;
  const typeParam = searchParams.get('type');
  const createPath = typeParam ? `/create?type=${typeParam}` : '/create';

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <LoginRequiredModal
        isOpen={isAuthModalOpen}
        redirectUrl={`/login?redirect=${encodeURIComponent(createPath)}`}
      />

      <Suspense fallback={<UnifiedStoryFormSkeleton />}>
        <motion.div initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
          {/* Header Hero Section */}
          <motion.div variants={FADE_IN_UP_ITEM}>
            <CreateFormHeader category={selectedCategory} />
          </motion.div>

          {/* Form Container (No Outer Card Background) */}
          <div className="mx-auto max-w-3xl py-2">
            <motion.div variants={FADE_IN_UP_ITEM}>
              <CreateFormCategoryTabs selected={selectedCategory} />
            </motion.div>

            {!isAuthModalOpen ? (
              <UnifiedStoryForm category={selectedCategory} />
            ) : (
              <div className="pointer-events-none opacity-40 blur-[2px] select-none">
                <UnifiedStoryForm category={selectedCategory} />
              </div>
            )}
          </div>
        </motion.div>
      </Suspense>
    </section>
  );
}
