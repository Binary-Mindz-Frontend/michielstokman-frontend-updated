'use client';

import Image from 'next/image';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GENDER_OPTIONS,
  HEIGHT_UNITS,
  HeightUnit,
  ORIENTATION_OPTIONS,
  SOMETHING_ELSE,
  StepperFormData,
} from './RegistrationStepper.types';

import step1Hero from '@/assets/account-step/step1-hero.png';
import step1HeroMobile from '@/assets/account-step/step1-hero-mobile.png';
import stepBrushBg from '@/assets/shared/step-brush-bg.png';
import buttonArrow from '@/assets/shared/button-arrow.png';

const fieldClassName =
  'text-foreground placeholder:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm transition-colors outline-none focus:border-[#D29B38]';

const selectTriggerClassName =
  'text-foreground data-[placeholder]:text-muted-foreground w-full rounded-md border border-[#EADFCF] bg-[#FAF7F0] px-4 py-3 text-sm shadow-none transition-colors outline-none focus:border-[#D29B38] focus:ring-0 focus-visible:ring-0';

interface StepOneProps {
  register: UseFormRegister<StepperFormData>;
  setValue: UseFormSetValue<StepperFormData>;
  errors: FieldErrors<StepperFormData>;
  genderValue: string;
  orientationValue: string;
  heightUnit: HeightUnit;
  onNext: () => void;
}

export default function StepOne({
  register,
  setValue,
  errors,
  genderValue,
  orientationValue,
  heightUnit,
  onNext,
}: StepOneProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
        <div className="order-1 mt-4 flex w-full justify-center md:order-2 md:mt-0 md:w-1/2">
          <div className="relative block aspect-4/5 w-full max-w-95 md:hidden">
            <Image
              src={step1HeroMobile}
              alt="Mobile Step 1 Hero"
              fill
              className="object-contain"
              priority
            />
          </div>

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

      <div className="mt-10 flex w-full max-w-lg flex-col gap-5 text-left sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            What Should We Call You? <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="Your name or chosen name"
            className={fieldClassName}
          />
          {errors.name && (
            <span className="text-xs font-medium text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            How Old Are You? <span className="text-red-500">*</span>
          </label>
          <input
            {...register('age')}
            type="number"
            inputMode="numeric"
            min={1}
            max={129}
            placeholder="Your age"
            className={fieldClassName}
          />
          {errors.age && (
            <span className="text-xs font-medium text-red-500">{errors.age.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            Where Do You Call Home? <span className="text-red-500">*</span>
          </label>
          <input
            {...register('country')}
            type="text"
            placeholder="The place you call home"
            className={fieldClassName}
          />
          {errors.country && (
            <span className="text-xs font-medium text-red-500">{errors.country.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            Where Are You Now? <span className="text-red-500">*</span>
          </label>
          <input
            {...register('city')}
            type="text"
            placeholder="Where you are now"
            className={fieldClassName}
          />
          {errors.city && (
            <span className="text-xs font-medium text-red-500">{errors.city.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            How Tall Are You? (Optional)
          </label>
          <div className="flex gap-2">
            <input
              {...register('heightValue')}
              type="number"
              inputMode="decimal"
              min={1}
              step="any"
              placeholder="Height"
              className={fieldClassName}
            />
            <Select
              value={heightUnit}
              onValueChange={(val) => {
                setValue('heightUnit', val as HeightUnit, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            >
              <SelectTrigger className={`${selectTriggerClassName} w-24 shrink-0`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[#EADFCF] bg-[#FAF7F0]">
                {HEIGHT_UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.heightValue && (
            <span className="text-xs font-medium text-red-500">{errors.heightValue.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            What Do You Do? (Optional)
          </label>
          <input
            {...register('education')}
            type="text"
            placeholder="Your work, study, craft or calling"
            className={fieldClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            How Do You Identify? <span className="text-red-500">*</span>
          </label>
          <Select
            value={genderValue || undefined}
            onValueChange={(val) => {
              setValue('gender', val, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
              if (val !== SOMETHING_ELSE) {
                setValue('genderCustom', '', {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          >
            <SelectTrigger className={selectTriggerClassName}>
              <SelectValue placeholder="How you identify" />
            </SelectTrigger>
            <SelectContent className="border-[#EADFCF] bg-[#FAF7F0]">
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-xs font-medium text-red-500">{errors.gender.message}</span>
          )}
          {genderValue === SOMETHING_ELSE ? (
            <>
              <input
                {...register('genderCustom')}
                type="text"
                placeholder="Tell us in your own words"
                className={fieldClassName}
              />
              {errors.genderCustom && (
                <span className="text-xs font-medium text-red-500">
                  {errors.genderCustom.message}
                </span>
              )}
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-semibold">
            Who Are You Attracted To? (Optional)
          </label>
          <Select
            value={orientationValue || undefined}
            onValueChange={(val) => {
              setValue('sexualOrientation', val, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
              if (val !== SOMETHING_ELSE) {
                setValue('sexualOrientationCustom', '', {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          >
            <SelectTrigger className={selectTriggerClassName}>
              <SelectValue placeholder="Who you are attracted to" />
            </SelectTrigger>
            <SelectContent className="border-[#EADFCF] bg-[#FAF7F0]">
              {ORIENTATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {orientationValue === SOMETHING_ELSE ? (
            <>
              <input
                {...register('sexualOrientationCustom')}
                type="text"
                placeholder="Tell us in your own words"
                className={fieldClassName}
              />
              {errors.sexualOrientationCustom && (
                <span className="text-xs font-medium text-red-500">
                  {errors.sexualOrientationCustom.message}
                </span>
              )}
            </>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 mx-auto mt-6 flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-md py-3.5 text-sm font-bold tracking-wider text-white uppercase transition-colors sm:rounded-none sm:font-medium sm:not-italic"
        >
          CONTINUE THE JOURNEY{' '}
          <Image
            src={buttonArrow}
            alt="Arrow"
            width={32}
            height={32}
            className="h-7 w-7 object-contain"
          />
        </button>
      </div>
    </div>
  );
}
