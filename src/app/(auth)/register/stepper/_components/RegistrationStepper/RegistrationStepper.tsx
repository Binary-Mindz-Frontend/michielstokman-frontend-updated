/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
'use client';

import { Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

import buttonArrow from '@/assets/shared/button-arrow.png';

import { cn } from '@/lib/utils';
import { useUpdateUserProfileMutation } from '@/redux/features/auth/auth.api';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';
import { StepperSkeleton } from './RegistrationStepperSkeletons';

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

  const { data: profileResponse, isLoading: isFetchingProfile } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<StepperFormData>({
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

  const handleStepOneNext = async () => {
    const isStepOneValid = await trigger(['name', 'age', 'country', 'city', 'gender']);
    if (isStepOneValid) {
      setStep(2);
    }
  };

  useEffect(() => {
    if (isFetchingProfile) return;

    const p = profileResponse?.data?.data || profileResponse?.data;
    const hasServerProfile =
      Boolean(p) &&
      Boolean(
        p.true_name ||
        p.name ||
        p.country ||
        p.city ||
        p.gender ||
        p.sexual_orientation ||
        (typeof p.age === 'number' && p.age > 0) ||
        (typeof p.age === 'string' && p.age.trim() !== '') ||
        p.life_phase,
      );

    if (hasServerProfile) {
      const genderVal = p.gender || '';
      const matchedGender =
        ['Male', 'Female', 'Non-binary', 'Prefer not to say'].find(
          (g) => g.toLowerCase() === genderVal.toLowerCase(),
        ) || genderVal;

      reset({
        name: p.true_name || p.name || '',
        age: p.age !== undefined && p.age !== null ? String(p.age) : '',
        country: p.country || '',
        city: p.city || '',
        height: p.height || '',
        education: p.education || '',
        income: p.annual_income || p.income || '',
        gender: matchedGender,
        isSexualOrientationEnabled: Boolean(p.sexual_orientation),
        sexualOrientation: p.sexual_orientation || '',
        lifePhase: p.life_phase || 'Discovering',
        growthFocus: {
          'Desire & Relationship': p.slider_desire_relationship ?? 5,
          'Life & Purpose': p.slider_life_purpose ?? 5,
          'Career & Money': p.slider_career_money ?? 5,
          'Show Your True Self': p.slider_true_self ?? 5,
          'Sexuality & Life Energy': p.slider_sexuality_life_energy ?? 5,
          'Fear & Freedom': p.slider_fear_freedom ?? 5,
          'Health & Body': p.slider_health_body ?? 5,
          Enlightenment: p.slider_enlightenment ?? 5,
        },
      });
      return;
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        reset(parsedData);
      } catch (e) {
        console.error('Error parsing localStorage data', e);
      }
    }
  }, [profileResponse, isFetchingProfile, reset]);

  const allFormValues = watch();
  useEffect(() => {
    if (isSubmitting || isSubmitSuccessful) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    if (allFormValues.name || allFormValues.gender || allFormValues.country) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allFormValues));
    }
  }, [allFormValues, isSubmitting, isSubmitSuccessful]);

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
    return <StepperSkeleton step={step} />;
  }

  return (
    <section className="bg-bg-primary text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12 font-sans md:px-12">
      <div className="flex w-full max-w-5xl flex-col items-center">
        {/* Top Step Tracker Bar (Centered at Top) */}
        <div className="mb-6 flex w-full max-w-md justify-center gap-4 sm:max-w-lg md:max-w-xl">
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

        {/* Back Button Row (Only for StepTwo & StepThree - Aligned Left under Step Tracker Bar) */}
        {step > 1 && (
          <div className="mb-6 flex w-full justify-start">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center justify-center gap-2 rounded-none px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-95 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Image
                src={buttonArrow}
                alt="Back Arrow"
                width={24}
                height={24}
                className="h-5 w-5 rotate-180 object-contain sm:h-6 sm:w-6"
              />
              Back
            </button>
          </div>
        )}

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
                errors={errors}
                genderValue={allFormValues.gender || ''}
                onNext={handleStepOneNext}
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
    <Suspense fallback={<StepperSkeleton step={1} />}>
      <RegistrationStepperContent />
    </Suspense>
  );
}
