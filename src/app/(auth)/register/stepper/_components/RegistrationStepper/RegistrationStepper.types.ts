/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { Variants } from 'framer-motion';

export const STORAGE_KEY = 'registration_stepper_data';

export const stepperSchema = z.object({
  name: z.string().optional(),
  age: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  height: z.string().optional(),
  education: z.string().optional(),
  income: z.string().optional(),
  gender: z.string().optional(),
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
