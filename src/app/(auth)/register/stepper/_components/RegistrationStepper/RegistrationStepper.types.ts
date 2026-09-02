/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { Variants } from 'framer-motion';

export const STORAGE_KEY = 'registration_stepper_data';

export const GENDER_OPTIONS = [
  'Woman',
  'Man',
  'Non-binary',
  'Something Else',
  'Prefer Not to Say',
] as const;

export const ORIENTATION_OPTIONS = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Queer',
  'Still Exploring',
  'Prefer Not to Say',
  'Something Else',
] as const;

export const HEIGHT_UNITS = ['cm', 'ft', 'in'] as const;

export const SOMETHING_ELSE = 'Something Else';

export type HeightUnit = (typeof HEIGHT_UNITS)[number];

const GENDER_ALIASES: Record<string, (typeof GENDER_OPTIONS)[number]> = {
  male: 'Man',
  man: 'Man',
  female: 'Woman',
  woman: 'Woman',
  'non-binary': 'Non-binary',
  'prefer not to say': 'Prefer Not to Say',
  'something else': 'Something Else',
};

export function hydrateGender(raw?: string | null): {
  gender: string;
  genderCustom: string;
} {
  if (!raw?.trim()) {
    return { gender: '', genderCustom: '' };
  }
  const mapped = GENDER_ALIASES[raw.trim().toLowerCase()];
  if (mapped) {
    return { gender: mapped, genderCustom: '' };
  }
  const exact = GENDER_OPTIONS.find((option) => option.toLowerCase() === raw.trim().toLowerCase());
  if (exact) {
    return { gender: exact, genderCustom: '' };
  }
  return { gender: SOMETHING_ELSE, genderCustom: raw.trim() };
}

export function displayLabeledChoice(option?: string, custom?: string): string {
  if (!option) return '';
  if (option === SOMETHING_ELSE) return custom?.trim() || option;
  return option;
}

export function hydrateOrientation(raw?: string | null): {
  sexualOrientation: string;
  sexualOrientationCustom: string;
} {
  if (!raw?.trim()) {
    return { sexualOrientation: '', sexualOrientationCustom: '' };
  }
  const exact = ORIENTATION_OPTIONS.find(
    (option) => option.toLowerCase() === raw.trim().toLowerCase(),
  );
  if (exact) {
    return { sexualOrientation: exact, sexualOrientationCustom: '' };
  }
  return { sexualOrientation: SOMETHING_ELSE, sexualOrientationCustom: raw.trim() };
}

export function parseHeight(raw?: string | null): { heightValue: string; heightUnit: HeightUnit } {
  if (!raw?.trim()) {
    return { heightValue: '', heightUnit: 'cm' };
  }
  const match = raw.trim().match(/^([\d.]+)\s*(cm|ft|in)?$/i);
  if (match) {
    const unit = (match[2]?.toLowerCase() || 'cm') as HeightUnit;
    return {
      heightValue: match[1],
      heightUnit: HEIGHT_UNITS.includes(unit) ? unit : 'cm',
    };
  }
  const numeric = Number.parseFloat(raw);
  if (Number.isFinite(numeric) && numeric > 0) {
    return { heightValue: String(numeric), heightUnit: 'cm' };
  }
  return { heightValue: '', heightUnit: 'cm' };
}

export function formatHeight(value?: string, unit: HeightUnit = 'cm'): string {
  if (!value?.trim()) return '';
  return `${value.trim()} ${unit}`;
}

export function serializeChoice(option?: string, custom?: string): string {
  if (!option) return '';
  if (option === SOMETHING_ELSE) {
    return custom?.trim() || '';
  }
  return option;
}

export function serializeOrientation(data: {
  sexualOrientation?: string;
  sexualOrientationCustom?: string;
}): string {
  return serializeChoice(data.sexualOrientation, data.sexualOrientationCustom);
}

export function serializeGender(data: { gender?: string; genderCustom?: string }): string {
  return serializeChoice(data.gender, data.genderCustom);
}

export const GROWTH_KEYS = [
  'Desire & Relationship',
  'Life & Purpose',
  'Sexuality & Life Energy',
  'Show Your True Self',
  'Fear & Freedom',
  'Career & Money',
  'Health & Body',
  'Enlightenment',
] as const;

export type GrowthKey = (typeof GROWTH_KEYS)[number];

export const GROWTH_SLIDER_FIELDS: { label: GrowthKey; field: string }[] = [
  { label: 'Desire & Relationship', field: 'slider_desire_relationship' },
  { label: 'Life & Purpose', field: 'slider_life_purpose' },
  { label: 'Sexuality & Life Energy', field: 'slider_sexuality_life_energy' },
  { label: 'Show Your True Self', field: 'slider_true_self' },
  { label: 'Fear & Freedom', field: 'slider_fear_freedom' },
  { label: 'Career & Money', field: 'slider_career_money' },
  { label: 'Health & Body', field: 'slider_health_body' },
  { label: 'Enlightenment', field: 'slider_enlightenment' },
];

export const stepperSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    age: z
      .string()
      .trim()
      .min(1, 'Age is required')
      .refine((value) => {
        const age = Number(value);
        return Number.isInteger(age) && age > 0 && age < 130;
      }, 'Enter a valid age'),
    country: z.string().min(1, 'Home is required'),
    city: z.string().min(1, 'Where you are now is required'),
    heightValue: z.string().optional(),
    heightUnit: z.enum(HEIGHT_UNITS),
    education: z.string().optional(),
    gender: z.string().min(1, 'How you identify is required'),
    genderCustom: z.string().optional(),
    sexualOrientation: z.string().optional(),
    sexualOrientationCustom: z.string().optional(),
    lifePhase: z.string().min(1, 'Life phase is required'),
    growthFocus: z.record(z.string(), z.number()),
  })
  .superRefine((data, ctx) => {
    if (data.heightValue?.trim()) {
      const height = Number(data.heightValue);
      if (!Number.isFinite(height) || height <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid height',
          path: ['heightValue'],
        });
      }
    }
    if (data.gender === SOMETHING_ELSE && !data.genderCustom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tell us in your own words',
        path: ['genderCustom'],
      });
    }
    if (data.sexualOrientation === SOMETHING_ELSE && !data.sexualOrientationCustom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tell us in your own words',
        path: ['sexualOrientationCustom'],
      });
    }
  });

export type StepperFormData = z.infer<typeof stepperSchema>;

export const STEP_ONE_FIELDS: (keyof StepperFormData)[] = [
  'name',
  'age',
  'country',
  'city',
  'gender',
  'genderCustom',
  'heightValue',
  'heightUnit',
  'sexualOrientation',
  'sexualOrientationCustom',
];

export const stepVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } as any,
};
