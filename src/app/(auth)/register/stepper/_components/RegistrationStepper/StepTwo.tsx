'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { UseFormSetValue } from 'react-hook-form';
import { StepperFormData } from './RegistrationStepper.types';

import step2Hero from '@/assets/account-step/step2-hero-image.png';
import step2HeroMobile from '@/assets/account-step/step2-hero-image-mobile.png';
import stepBrushBg from '@/assets/account-step/step-brush-bg.png';
import buttonArrow from '@/assets/account-step/button-arrow.png';

interface StepTwoProps {
  selectedLifePhase: string;
  setValue: UseFormSetValue<StepperFormData>;
  onNext: () => void;
}

const LIFE_PHASE_OPTIONS = [
  { id: 'Discovering', title: 'Discovering', desc: 'Beginning To Question And Explore' },
  { id: 'Building', title: 'Building', desc: 'Creating Foundations And New Patterns' },
  { id: 'Recalibrating', title: 'Recalibrating', desc: 'Adjusting After A Shift Or Change' },
  { id: 'Deepening', title: 'Deepening', desc: 'Going Further Into What Matters' },
  { id: 'Passing On', title: 'Passing On', desc: 'Sharing Wisdom And Mentoring' },
];

export default function StepTwo({ selectedLifePhase, setValue, onNext }: StepTwoProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* Header Section */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
        {/* Image Column */}
        <div className="order-1 mt-4 flex w-full justify-center md:order-2 md:mt-0 md:w-1/2">
          {/* Mobile Hero Image */}
          <div className="relative block aspect-4/5 w-full max-w-95 md:hidden">
            <Image
              src={step2HeroMobile}
              alt="Mobile Step 2 Hero"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Hero Image */}
          <div className="relative hidden aspect-square w-full max-w-112.5 md:block">
            <Image
              src={step2Hero}
              alt="Desktop Step 2 Hero"
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

      {/* Options Container Box */}
      <div className="mt-10 flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-[#FEC332] bg-[#FAF7F0] p-6 text-left shadow-sm sm:max-w-xl sm:p-8 md:max-w-2xl lg:max-w-3xl">
        {LIFE_PHASE_OPTIONS.map((phase) => {
          const isSelected = selectedLifePhase === phase.id;
          return (
            <div
              key={phase.id}
              onClick={() => setValue('lifePhase', phase.id, { shouldValidate: true })}
              className="flex cursor-pointer items-start gap-4 transition-opacity hover:opacity-90"
            >
              {/* Radio Circle Indicator */}
              <div
                className={cn(
                  'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#FEC332] transition-all',
                  isSelected ? 'bg-[#FEC332]' : 'bg-transparent',
                )}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>

              <div className="flex flex-col">
                <h4 className="font-playpen text-foreground text-base font-bold sm:text-lg">
                  {phase.title}
                </h4>
                <p className="text-muted-foreground text-xs font-normal italic sm:text-sm">
                  {phase.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button for Step 2 */}
      <button
        type="button"
        onClick={onNext}
        className="bg-primary hover:bg-primary/90 mx-auto mt-8 flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-md py-3.5 text-sm font-bold tracking-wider text-white uppercase transition-colors sm:rounded-none sm:font-medium sm:not-italic"
      >
        CONTINUE{' '}
        <Image
          src={buttonArrow}
          alt="Arrow"
          width={32}
          height={32}
          className="h-7 w-7 object-contain"
        />
      </button>
    </div>
  );
}
