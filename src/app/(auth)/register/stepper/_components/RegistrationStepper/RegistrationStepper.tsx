/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useUpdateUserProfileMutation } from '@/redux/features/auth/auth.api';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { Skeleton } from '@/components/ui/skeleton';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';

import {
  STORAGE_KEY,
  stepperSchema,
  StepperFormData,
  stepVariants,
} from './RegistrationStepper.types';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

function RegistrationStepperContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step')) || 1;

  const setStep = (s: number | ((prev: number) => number)) => {
    const nextStep = typeof s === 'function' ? s(step) : s;
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', nextStep.toString());
    router.push(`?${params.toString()}`);
  };

  const { data: profileResponse, isLoading: isFetchingProfile } = useGetProfileQuery(undefined);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const { register, setValue, watch, handleSubmit, reset } = useForm<StepperFormData>({
    resolver: zodResolver(stepperSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      country: '',
      city: '',
      gender: '',
      isSexualOrientationEnabled: false,
      lifePhase: 'Discovering',
      growthFocus: {
        'Desire & Relationship': 5,
        'Life & Purpose': 5,
        'Career & Money': 5,
        'Show Your True Self': 5,
        'Sexuality & Life Energy': 5,
        'Fear & Freedom': 5,
        'Health & Body': 5,
        Enlightenment: 5,
      },
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
        return;
      } catch (e) {
        console.error('Error parsing localStorage data', e);
      }
    }

    if (profileResponse?.data) {
      const p = profileResponse.data;
      reset({
        name: p.true_name || '',
        age: p.age?.toString() || '',
        country: p.country || '',
        city: p.city || '',
        height: p.height || '',
        education: p.education || '',
        income: p.annual_income || '',
        gender: p.gender || '',
        isSexualOrientationEnabled: !!p.sexual_orientation,
        sexualOrientation: p.sexual_orientation || '',
        lifePhase: p.life_phase || 'Discovering',
        growthFocus: {
          'Desire & Relationship': p.slider_desire_relationship || 5,
          'Life & Purpose': p.slider_life_purpose || 5,
          'Career & Money': p.slider_career_money || 5,
          'Show Your True Self': p.slider_true_self || 5,
          'Sexuality & Life Energy': p.slider_sexuality_life_energy || 5,
          'Fear & Freedom': p.slider_fear_freedom || 5,
          'Health & Body': p.slider_health_body || 5,
          Enlightenment: p.slider_enlightenment || 5,
        },
      });
    }
  }, [profileResponse, reset]);

  const allFormValues = watch();
  useEffect(() => {
    if (allFormValues.name || allFormValues.gender || allFormValues.country) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allFormValues));
    }
  }, [allFormValues]);

  const isOrientationEnabled = watch('isSexualOrientationEnabled');
  const selectedLifePhase = watch('lifePhase');
  const growthValues = watch('growthFocus');

  const onFinalSubmit = async (data: StepperFormData) => {
    const transformedData = {
      true_name: data?.name,
      age: Number(data?.age) || 0,
      country: data?.country,
      city: data?.city,
      height: data?.height,
      education: data?.education,
      annual_income: data?.income,
      gender: data?.gender,
      sexual_orientation: data?.isSexualOrientationEnabled ? data?.sexualOrientation : '',
      life_phase: data?.lifePhase,
      slider_desire_relationship: data?.growthFocus['Desire & Relationship'] || 0,
      slider_life_purpose: data?.growthFocus['Life & Purpose'] || 0,
      slider_career_money: data?.growthFocus['Career & Money'] || 0,
      slider_true_self: data?.growthFocus['Show Your True Self'] || 0,
      slider_sexuality_life_energy: data?.growthFocus['Sexuality & Life Energy'] || 0,
      slider_fear_freedom: data?.growthFocus['Fear & Freedom'] || 0,
      slider_health_body: data?.growthFocus['Health & Body'] || 0,
      slider_enlightenment: data?.growthFocus['Enlightenment'] || 0,
    };

    await catchAsyncMutation(updateUserProfile(transformedData).unwrap(), (res) => {
      toast.success(res?.message || 'Profile Updated Successfully');
      localStorage.removeItem(STORAGE_KEY);
      const redirectUrl = searchParams.get('redirect');
      const redirectPath = redirectUrl ? decodeURIComponent(redirectUrl) : '/profile';
      setTimeout(() => router.push(redirectPath), 1000);
    });
  };

  if (isFetchingProfile) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-primary/30 h-0.75 flex-1" />
          ))}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="col-span-full">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-primary text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12 font-sans md:px-12">
      {step > 1 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="text-primary mx-auto mb-4 flex max-w-5xl cursor-pointer items-center gap-1 self-start text-sm font-medium transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" /> Back To Step {step - 1}
        </button>
      )}

      <div className="flex w-full max-w-5xl flex-col items-center">
        {/* Progress Bar */}
        <div className="mb-10 flex w-full max-w-5xl justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-500',
                i <= step ? 'bg-[#D29B38]' : 'bg-[#EADFCF]',
              )}
            />
          ))}
        </div>

        {/* Animation Container */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex w-full flex-col items-center justify-center"
            >
              <StepOne
                register={register}
                isOrientationEnabled={isOrientationEnabled}
                setValue={setValue}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex w-full flex-col items-center justify-center"
            >
              <StepTwo
                selectedLifePhase={selectedLifePhase}
                setValue={setValue}
                onNext={() => setStep(3)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex w-full flex-col items-center justify-center"
            >
              <StepThree
                growthValues={growthValues}
                setValue={setValue}
                onSubmit={handleSubmit(onFinalSubmit)}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function RegistrationStepper() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-12 flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-primary/30 h-0.75 flex-1" />
            ))}
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="col-span-full">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </section>
      }
    >
      <RegistrationStepperContent />
    </Suspense>
  );
}
