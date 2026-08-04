/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { UseFormSetValue } from 'react-hook-form';
import { StepperFormData } from './RegistrationStepper.types';

import step3Hero from '@/assets/account-step/step3-hero-image.png';
import step3HeroMobile from '@/assets/account-step/step3-hero-image-mobile.png';
import stepBrushBg from '@/assets/account-step/step-brush-bg.png';
import buttonArrow from '@/assets/account-step/button-arrow.png';

interface StepThreeProps {
  growthValues: Record<string, number> | undefined;
  setValue: UseFormSetValue<StepperFormData>;
  onSubmit: () => void;
  isLoading: boolean;
}

const GROWTH_KEYS = [
  'Desire & Relationship',
  'Life & Purpose',
  'Sexuality & Life Energy',
  'Show Your True Self',
  'Fear & Freedom',
  'Career & Money',
  'Health & Body',
  'Enlightenment',
];

function SingleSliderItem({
  labelKey,
  initialValue,
  onChange,
}: {
  labelKey: string;
  initialValue: number;
  onChange: (v: number) => void;
}) {
  const [val, setVal] = useState(initialValue);

  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  const handleChange = (v: number) => {
    setVal(v);
    onChange(v);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-sm font-bold sm:text-base">{labelKey}</span>
        <span className="text-sm font-bold text-[#D29B38] sm:text-base">{val.toFixed(1)}</span>
      </div>
      <Slider
        value={[val]}
        min={0}
        max={10}
        step={0.1}
        onValueChange={([v]) => handleChange(v)}
        className="w-full cursor-pointer py-1 **:data-[slot=slider-range]:bg-[#D29B38] **:data-[slot=slider-thumb]:h-5 **:data-[slot=slider-thumb]:w-5 **:data-[slot=slider-thumb]:border-[#D29B38] **:data-[slot=slider-thumb]:bg-white **:data-[slot=slider-track]:bg-[#EADFCF]"
      />
    </div>
  );
}

export default function StepThree({ growthValues, setValue, onSubmit, isLoading }: StepThreeProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* Header Section */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
        {/* Image Column */}
        <div className="order-1 mt-4 flex w-full justify-center md:order-2 md:mt-0 md:w-1/2">
          {/* Mobile Hero Image */}
          <div className="relative block aspect-4/5 w-full max-w-95 md:hidden">
            <Image
              src={step3HeroMobile}
              alt="Mobile Step 3 Hero"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Hero Image */}
          <div className="relative hidden aspect-square w-full max-w-112.5 md:block">
            <Image
              src={step3Hero}
              alt="Desktop Step 3 Hero"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Text Column */}
        <div className="order-2 mt-4 flex w-full max-w-110 flex-col items-center text-center md:order-1 md:w-1/2 md:max-w-full md:items-start md:text-left">
          <div className="font-edo flex w-full flex-col items-start justify-center pl-4 leading-none font-black uppercase md:pl-0">
            <span className="-rotate-3 transform self-start text-[2.75rem] tracking-wider text-[#486221] sm:text-5xl md:text-[3.6rem] lg:text-[4.2rem]">
              WHAT MATTERS
            </span>
            <span className="mt-3.5 -rotate-3 transform self-start text-[2.25rem] tracking-wide text-[#E81A66] sm:mt-4 sm:text-4xl md:text-[3rem] lg:text-[3.5rem]">
              MOST
            </span>
            <span className="-rotate-3 transform self-start text-[2.35rem] tracking-normal text-[#F3A134] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.7rem]">
              RIGHT NOW?
            </span>
          </div>

          {/* Brush Background Section */}
          <div className="relative mt-8 flex min-h-35 w-full max-w-105 -rotate-1 transform items-center justify-center sm:mt-10">
            <div className="absolute inset-0 h-full w-full">
              <Image src={stepBrushBg} alt="Brush background" fill className="object-contain" />
            </div>

            <div className="relative z-10 mt-1 flex flex-col items-center px-6 pt-2 pb-4 text-white sm:px-8">
              <p className="text-center font-sans text-[12px] leading-relaxed font-medium text-white sm:text-[13px]">
                Move Each Slider To Reflect The Importance Of These Areas{' '}
                <span className="font-bold text-[#F3A134]">In Your Life.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders Container Box */}
      <div className="mt-10 flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-[#FEC332] bg-[#FAF7F0] p-6 text-left shadow-sm sm:max-w-xl sm:p-8 md:max-w-2xl lg:max-w-3xl">
        {GROWTH_KEYS.map((key) => {
          const val = Number((growthValues as any)?.[key] ?? 5);
          return (
            <SingleSliderItem
              key={key}
              labelKey={key}
              initialValue={isNaN(val) ? 5 : val}
              onChange={(v) =>
                setValue(`growthFocus.${key}` as any, v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          );
        })}
      </div>

      {/* Submit Button for Step 3 */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90 mx-auto mt-8 flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-md py-3.5 text-sm font-bold tracking-wider text-white uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-none sm:font-medium sm:not-italic"
      >
        {isLoading ? (
          'Please wait...'
        ) : (
          <>
            Begin Your Journey{' '}
            <Image
              src={buttonArrow}
              alt="Arrow"
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
            />
          </>
        )}
      </button>
    </div>
  );
}
