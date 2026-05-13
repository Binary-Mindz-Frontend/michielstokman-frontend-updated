/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import DynamicSectionHeader from '@/components/main/DynamicSectionHeader/DynamicSectionHeader';
import GrowthSlider from '@/components/main/GrowthSlider/GrowthSlider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useUpdateUserProfileMutation } from '@/redux/features/auth/auth.api';
import { useGetProfileQuery } from '@/redux/features/userProfile/userProfile.api';

import { catchAsyncMutation } from '@/utils/apiReqRes.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, Variants } from 'framer-motion'; // Motion ইমপোর্ট
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Form Schema
const stepperSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.string().min(1, 'Age is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  height: z.string().optional(),
  education: z.string().optional(),
  income: z.string().optional(),
  gender: z.string().min(1, 'Please select a gender'),
  isSexualOrientationEnabled: z.boolean(),
  sexualOrientation: z.string().optional(),
  lifePhase: z.string().min(1, 'Life phase is required'),
  growthFocus: z.record(z.string(), z.number()),
});

type StepperFormData = z.infer<typeof stepperSchema>;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

// --- Animation Variants ---
const stepVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } as any,
};

function RegistrationStepperContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step')) || 1;

  // eslint-disable-next-line no-unused-vars
  const setStep = (s: number | ((prev: number) => number)) => {
    const nextStep = typeof s === 'function' ? s(step) : s;
    router.push(`?step=${nextStep}`);
  };

  const { data: profileResponse, isLoading: isFetchingProfile } = useGetProfileQuery(undefined);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const {
    setValue,
    watch,
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { errors },
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

  useEffect(() => {
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
          'Desire & Relationship': p.slider_desire_relationship || 0,
          'Life & Purpose': p.slider_life_purpose || 0,
          'Career & Money': p.slider_career_money || 0,
          'Show Your True Self': p.slider_true_self || 0,
          'Sexuality & Life Energy': p.slider_sexuality_life_energy || 0,
          'Fear & Freedom': p.slider_fear_freedom || 0,
          'Health & Body': p.slider_health_body || 0,
          Enlightenment: p.slider_enlightenment || 0,
        },
      });
    }
  }, [profileResponse, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const isOrientationEnabled = watch('isSexualOrientationEnabled');
  const selectedLifePhase = watch('lifePhase');
  const growthValues = watch('growthFocus');

  const handleNextStep = async (nextStep: number) => {
    let fieldsToValidate: (keyof StepperFormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ['name', 'age', 'country', 'city', 'gender'];
    }
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(nextStep);
  };

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
      setTimeout(() => router.push('/profile'), 1000);
    });
  };

  if (isFetchingProfile) return <div className="py-20 text-center">Loading Profile Data...</div>;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      {step > 1 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="text-primary mb-4 flex cursor-pointer items-center gap-1 text-sm transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" /> Back To Step {step - 1}
        </button>
      )}

      <div>
        {/* Progress Bar */}
        <div className="mb-12 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'h-0.75 flex-1 transition-all duration-500',
                i <= step ? 'bg-primary' : 'bg-primary/30',
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
              className="space-y-6"
            >
              <DynamicSectionHeader
                title="Tell us about yourself"
                description="Please provide your basic details to personalize your experience."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Your name"
                  name="name"
                  control={control}
                  placeholder="Enter your name"
                  error={errors.name?.message}
                  required
                />
                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  control={control}
                  placeholder="Enter your age"
                  error={errors.age?.message}
                  required
                />
                <InputField
                  label="Country"
                  name="country"
                  control={control}
                  placeholder="Enter your country"
                  error={errors.country?.message}
                  required
                />
                <InputField
                  label="City"
                  name="city"
                  control={control}
                  placeholder="Enter your city"
                  error={errors.city?.message}
                  required
                />
                <InputField
                  label="Height"
                  name="height"
                  control={control}
                  placeholder="Enter your height"
                  error={errors.height?.message}
                />
                <InputField
                  label="Education"
                  name="education"
                  control={control}
                  placeholder="Your highest degree"
                />
                <InputField
                  label="Annual Income"
                  name="income"
                  control={control}
                  placeholder="Your annual income"
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  options={GENDER_OPTIONS}
                  control={control}
                  placeholder="Select your gender"
                  error={errors.gender?.message}
                  required
                />
                <div className="col-span-full">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-dark-primary font-medium">Sexual Orientation</label>
                    <Switch
                      checked={isOrientationEnabled}
                      onCheckedChange={(val) => {
                        setValue('isSexualOrientationEnabled', val);
                        if (!val) setValue('sexualOrientation', '');
                      }}
                    />
                  </div>
                  <InputField
                    label=""
                    name="sexualOrientation"
                    control={control}
                    placeholder={
                      isOrientationEnabled ? 'Enter your orientation' : 'Enable to specify'
                    }
                    readOnly={!isOrientationEnabled}
                  />
                </div>
              </div>
              <Button onClick={() => handleNextStep(2)} className="btn-styles">
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <DynamicSectionHeader
                title="Which life phase feels closest?"
                description="Choose the phase that describes your current journey."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { id: 'Discovering', desc: 'Beginning to question and explore' },
                  { id: 'Building', desc: 'Creating foundations and new patterns' },
                  { id: 'Recalibrating', desc: 'Adjusting after a shift or change' },
                  { id: 'Deepening', desc: 'Going further into what matters' },
                  { id: 'Passing On', desc: 'Sharing wisdom and mentoring' },
                ].map((phase) => (
                  <motion.div
                    key={phase.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setValue('lifePhase', phase.id, { shouldValidate: true })}
                    className={cn(
                      'cursor-pointer rounded-md border p-4 transition-all',
                      selectedLifePhase === phase.id
                        ? 'border-primary/70 bg-primary/10'
                        : 'hover:border-primary/50 border-primary/20 bg-transparent',
                    )}
                  >
                    <h3
                      className={cn(
                        'font-serif sm:text-lg',
                        selectedLifePhase === phase.id ? 'text-primary' : 'text-dark-primary',
                      )}
                    >
                      {phase.id}
                    </h3>
                    <p className="text-secondary mt-1 text-xs sm:text-base">{phase.desc}</p>
                  </motion.div>
                ))}
              </div>
              <Button onClick={() => setStep(3)} className="btn-styles">
                Continue
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <DynamicSectionHeader
                title="What matters most right now?"
                description="Move each slider to reflect the importance of these areas in your life."
              />
              <div className="grid grid-cols-1 space-y-5 gap-x-6 gap-y-4 sm:grid-cols-2">
                {Object.keys(growthValues).map((key) => (
                  <GrowthSlider
                    key={key}
                    label={key}
                    value={(growthValues as any)[key]}
                    onChange={(val) =>
                      setValue(`growthFocus.${key}` as any, val, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
              <Button
                onClick={handleSubmit(onFinalSubmit)}
                disabled={isLoading}
                className="btn-styles"
              >
                {isLoading ? 'Please wait...' : 'Begin Your Journey'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function RegistrationStepper() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <RegistrationStepperContent />
    </Suspense>
  );
}
