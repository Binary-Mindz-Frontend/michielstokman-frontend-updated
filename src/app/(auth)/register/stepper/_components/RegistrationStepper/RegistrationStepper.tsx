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

import { catchAsyncMutation } from '@/utils/apiReqRes.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Zod Schema definition
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

export default function RegistrationStepper() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation(undefined);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<StepperFormData>({
    resolver: zodResolver(stepperSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      country: '',
      city: '',
      height: '',
      education: '',
      income: '',
      gender: '',
      isSexualOrientationEnabled: false,
      sexualOrientation: '',
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const isOrientationEnabled = watch('isSexualOrientationEnabled');
  const selectedLifePhase = watch('lifePhase');
  const growthValues = watch('growthFocus');

  // Step validation logic
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
      true_name: data.name,
      age: Number(data.age) || 0,
      country: data.country,
      city: data.city,
      height: data.height,
      education: data.education,
      annual_income: data.income,
      gender: data.gender,
      sexual_orientation: data.isSexualOrientationEnabled ? data.sexualOrientation : '',
      life_phase: data.lifePhase,

      slider_desire_relationship: data.growthFocus['Desire & Relationship'] || 0,
      slider_life_purpose: data.growthFocus['Life & Purpose'] || 0,
      slider_career_money: data.growthFocus['Career & Money'] || 0,
      slider_true_self: data.growthFocus['Show Your True Self'] || 0,
      slider_sexuality_life_energy: data.growthFocus['Sexuality & Life Energy'] || 0,
      slider_free_freedom: data.growthFocus['Fear & Freedom'] || 0,
      slider_health_body: data.growthFocus['Health & Body'] || 0,
      slider_enlightenment: data.growthFocus['Enlightenment'] || 0,
    };

    console.log('Transformed Data:', transformedData);

    await catchAsyncMutation(
      updateUserProfile(transformedData).unwrap(),
      // onSuccess
      (res) => {
        toast.success(res?.message || 'Profile Updated Successfully');
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      },
    );
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      {step > 1 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="text-primary mb-4 flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
        >
          ← Back
        </button>
      )}

      <div>
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

        {step === 1 && (
          <div className="animate-in fade-in space-y-6 duration-500">
            <DynamicSectionHeader
              title="What should we call you?"
              description="Just your first name. This is your space."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Your name"
                name="name"
                register={register}
                placeholder="Enter your name"
                error={errors.name?.message}
                required
              />
              <InputField
                label="Age"
                name="age"
                register={register}
                placeholder="Enter your age"
                error={errors.age?.message}
                required
              />
              <InputField
                label="Country"
                name="country"
                register={register}
                placeholder="Enter your country"
                error={errors.country?.message}
                required
              />
              <InputField
                label="City"
                name="city"
                register={register}
                placeholder="Enter your city"
                error={errors.city?.message}
                required
              />
              <InputField
                label="Height"
                name="height"
                register={register}
                placeholder="Enter your height"
              />
              <InputField
                label="Education"
                name="education"
                register={register}
                placeholder="Enter your education"
              />
              <InputField
                label="Annual Income"
                name="income"
                register={register}
                placeholder="Enter your annual income"
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
                  register={register}
                  placeholder={isOrientationEnabled ? 'Enter orientation' : 'Enable to enter'}
                  readOnly={!isOrientationEnabled}
                />
              </div>
            </div>

            <Button onClick={() => handleNextStep(2)} className="btn-styles">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in space-y-6 duration-500">
            <DynamicSectionHeader
              title="Which life phase feels closest?"
              description="There&rsquo;s no wrong answer. This helps us find content that meets you where you
                  are."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { id: 'Discovering', desc: 'Beginning to question and explore' },
                { id: 'Building', desc: 'Creating foundations and new patterns' },
                { id: 'Recalibrating', desc: 'Adjusting after a shift or change' },
                { id: 'Deepening', desc: 'Going further into what matters' },
                { id: 'Passing On', desc: 'Sharing wisdom and mentoring' },
              ].map((phase) => (
                <div
                  key={phase.id}
                  onClick={() => {
                    setValue('lifePhase', phase.id, { shouldValidate: true });
                  }}
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
                </div>
              ))}
            </div>
            <Button onClick={() => setStep(3)} className="btn-styles">
              Continue
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in space-y-6 duration-500">
            <DynamicSectionHeader
              title="What matters most right now?"
              description="Move each slider to reflect how important this area is to you."
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
              <div className="col-span-full border-t border-[#E5E0DA] pt-4">
                <p className="text-dark-primary text-sm font-semibold">
                  Sexual & Relational Vitality
                </p>
                <p className="text-secondary mt-1 text-xs leading-relaxed sm:text-base">
                  (Embracing pleasure, intimacy, exploration, and the life force that flows through
                  connection and the body.)
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmit(onFinalSubmit)}
              className="btn-styles flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2Icon className="animate-spin" />{' '}
                  <span className="ml-2">Begin Your Journey</span>
                </div>
              ) : (
                'Begin Your Journey'
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
