/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import UnifiedStoryFormSkeleton from '@/components/main/Skeletons/UnifiedStoryFormSkeleton';
import { useCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import CreateFormHeader from './CreateForm/_components/CreateFormHeader/CreateFormHeader';
import LoginRequiredModal from './CreateForm/_components/LoginRequiredModal/LoginRequiredModal';
import SubmitTypeChoice from './CreateForm/_components/SubmitTypeChoice/SubmitTypeChoice';
import SubmitWizard from './CreateForm/_components/SubmitWizard/SubmitWizard';

export default function CreateFormPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type');
  const selectedCategory = typeParam || '';

  const user = useAppSelector(useCurrentUser) as any;
  const isAuthModalOpen = !user || user?.is_guest;
  const createPath = typeParam ? `/create?type=${typeParam}` : '/create';
  const hasType =
    selectedCategory === 'Confessions' ||
    selectedCategory === 'Meditation' ||
    selectedCategory === 'Meditations';
  const wizardCategory =
    selectedCategory === 'Meditation' || selectedCategory === 'Meditations'
      ? 'Meditation'
      : 'Confessions';

  useEffect(() => {
    const type = (typeParam || '').toLowerCase();
    if (type === 'liberations' || type === 'liberation' || type === 'journeys') {
      router.replace('/liberations');
    }
  }, [typeParam, router]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <LoginRequiredModal
        isOpen={isAuthModalOpen}
        redirectUrl={`/login?redirect=${encodeURIComponent(createPath)}`}
      />

      <Suspense fallback={<UnifiedStoryFormSkeleton />}>
        <motion.div initial="hidden" animate="visible" variants={FADE_IN_UP_CONTAINER}>
          <motion.div variants={FADE_IN_UP_ITEM}>
            {hasType ? <CreateFormHeader category={wizardCategory} /> : null}
          </motion.div>

          <div className="mx-auto max-w-3xl py-2">
            {isAuthModalOpen ? (
              <div className="pointer-events-none opacity-40 blur-[2px] select-none">
                <SubmitTypeChoice />
              </div>
            ) : hasType ? (
              <SubmitWizard
                category={wizardCategory === 'Meditation' ? 'Meditation' : 'Confessions'}
              />
            ) : (
              <SubmitTypeChoice />
            )}
          </div>
        </motion.div>
      </Suspense>
    </section>
  );
}
