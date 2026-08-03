'use client';

import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { ArrowRight } from 'lucide-react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { StepperFormData } from './RegistrationStepper.types';

import step1Hero from '@/assets/account-step/step1-hero.png';
import step1HeroMobile from '@/assets/account-step/step1-hero-mobile.png';
import stepBrushBg from '@/assets/account-step/step-brush-bg.png';

interface StepOneProps {
  register: UseFormRegister<StepperFormData>;
  isOrientationEnabled: boolean;
  setValue: UseFormSetValue<StepperFormData>;
  onNext: () => void;
}

export default function StepOne({
  register,
  isOrientationEnabled,
  setValue,
  onNext,
}: StepOneProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* Header Section */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
        {/* Image Column */}
        <div className="order-1 mt-4 flex w-full justify-center md:order-2 md:mt-0 md:w-1/2">
          {/* Mobile Hero Image */}
          <div className="relative block aspect-4/5 w-full max-w-95 md:hidden">
            <Image
              src={step1HeroMobile}
              alt="Mobile Step 1 Hero"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Hero Image */}
          <div className="relative hidden aspect-square w-full max-w-112.5 md:block">
            <Image
              src={step1Hero}
              alt="Desktop Step 1 Hero"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Text Column */}
        <div className="order-2 mt-4 flex w-full max-w-110 flex-col items-center text-center md:order-1 md:w-1/2 md:items-start md:text-left">
          <div className="font-edo flex w-full flex-col items-start justify-center pl-4 leading-none font-black uppercase md:pl-0">
            <span className="-rotate-3 transform self-start text-[2.75rem] tracking-wider text-[#486221] sm:text-5xl md:text-[3.6rem] lg:text-[4.2rem]">
              TELL US
            </span>
            <span className="mt-3.5 -rotate-3 transform self-start text-[2.25rem] tracking-wide text-[#E81A66] sm:mt-4 sm:text-4xl md:text-[3rem] lg:text-[3.5rem]">
              ABOUT
            </span>
            <span className="-rotate-3 transform self-start text-[2.35rem] tracking-normal text-[#F3A134] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.7rem]">
              YOURSELF
            </span>
          </div>

          {/* Brush Background Section */}
          <div className="relative mt-8 flex min-h-35 w-full max-w-105 -rotate-1 transform items-center justify-center sm:mt-10">
            <div className="absolute inset-0 h-full w-full">
              <Image src={stepBrushBg} alt="Brush background" fill className="object-contain" />
            </div>

            <div className="relative z-10 mt-1 flex flex-col items-center px-6 pt-2 pb-4 text-white sm:px-8">
              <p className="text-center font-sans text-[12px] leading-relaxed font-medium text-white sm:text-[13px]">
                You Have Spent Years Becoming Who Others Needed.{' '}
                <span className="font-bold text-[#F3A134]">Let&apos;s Remember</span> Who You Are.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Inputs Section */}
      <div className="mt-10 flex w-full max-w-lg flex-col gap-5 text-left">
        {/* Field 1: Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">What Should We Call You?</label>
          <input
            {...register('name')}
            type="text"
            placeholder="Enter Your Name"
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]"
          />
        </div>

        {/* Field 2: Age */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            How Many Years Have You Been Here?
          </label>
          <input
            {...register('age')}
            type="text"
            placeholder="Enter Your Age"
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]"
          />
        </div>

        {/* Field 3: Country */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">Where Do You Call Home?</label>
          <input
            {...register('country')}
            type="text"
            placeholder="Enter Your Country"
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]"
          />
        </div>

        {/* Field 4: City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">Where Are You Today?</label>
          <input
            {...register('city')}
            type="text"
            placeholder="Enter Your City"
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]"
          />
        </div>

        {/* Field 5: Height */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            How Tall Are You? (Optional)
          </label>
          <input
            {...register('height')}
            type="text"
            placeholder="Enter Your Height"
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]"
          />
        </div>

        {/* Field 6: Education */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">What Shaped Your Mind?</label>
          <input
            {...register('education')}
            type="text"
            placeholder="Your Highest Degree"
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]"
          />
        </div>

        {/* Field 7: Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">How Do You Identify?</label>
          <input
            {...register('gender')}
            type="text"
            placeholder="Select Your Gender"
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]"
          />
        </div>

        {/* Field 8: Sexual Orientation */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-foreground text-sm font-semibold">
              Do You Feel Like Sharing Your Orientation? (Optional)
            </label>
            <Switch
              checked={isOrientationEnabled}
              onCheckedChange={(val) => {
                setValue('isSexualOrientationEnabled', val);
                if (!val) setValue('sexualOrientation', '');
              }}
              className="data-[state=checked]:bg-[#D29B38]"
            />
          </div>
          <span className="text-muted-foreground text-xs font-medium">Enable To Specify</span>
          <input
            {...register('sexualOrientation')}
            type="text"
            placeholder={isOrientationEnabled ? 'Enter Your Orientation' : 'Enable To Specify'}
            readOnly={!isOrientationEnabled}
            className="text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38] disabled:opacity-50"
          />
        </div>

        {/* Submit Button for Step 1 */}
        <button
          type="button"
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 mx-auto mt-6 flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-md py-3.5 text-sm font-bold tracking-wider text-white uppercase transition-colors"
        >
          CONTINUE THE JOURNEY <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
