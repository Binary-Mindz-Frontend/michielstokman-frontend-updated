/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { Variants } from 'framer-motion';

export const STORAGE_KEY = 'registration_stepper_data';

export const stepperSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.string().min(1, 'Age is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  height: z.string().optional(),
  education: z.string().optional(),
  income: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  isSexualOrientationEnabled: z.boolean(),
  sexualOrientation: z.string().optional(),
  lifePhase: z.string().min(1, 'Life phase is required'),
  growthFocus: z.record(z.string(), z.number()),
});

export type StepperFormData = z.infer<typeof stepperSchema>;

export const stepVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } as any,
};
