'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useResetPasswordMutation } from '@/redux/features/auth/auth.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';

import accountHeroImg from '@/assets/shared/account-hero-image.png';
import brushTextBg from '@/assets/shared/brush-text-bg.png';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')?.trim() || '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      toast.error('This reset link is missing or invalid. Request a new one.');
      return;
    }

    await catchAsyncMutation(resetPassword({ token, password: data.password }).unwrap(), (res) => {
      toast.success(res?.message || 'Your password has been reset successfully.');
      setTimeout(() => router.push('/login'), 800);
    });
  };

  return (
    <main className="bg-bg-primary text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12 font-sans md:px-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={FADE_IN_UP_CONTAINER}
        className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:gap-16"
      >
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="order-1 hidden w-full justify-center md:order-2 md:flex md:w-1/2"
        >
          <div className="relative aspect-square w-full max-w-112.5">
            <Image src={accountHeroImg} alt="" fill className="object-contain" priority />
          </div>
        </motion.div>

        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="order-2 mt-4 flex w-full max-w-110 flex-col items-center text-center md:order-1 md:w-1/2 md:items-start md:text-left"
        >
          <Link href="/" className="hidden w-full md:block">
            <div className="font-edo flex w-full flex-col items-start justify-center leading-none font-medium uppercase">
              <span className="-rotate-3 transform self-start text-[2.75rem] tracking-wider text-[#486221] sm:text-5xl md:text-[3.6rem] lg:text-[4.2rem]">
                Transform
              </span>
              <span className="mt-3.5 -rotate-3 transform self-start text-[2.25rem] tracking-wide text-[#E81A66] sm:mt-4 sm:text-4xl md:text-[3rem] lg:text-[3.5rem]">
                To
              </span>
              <span className="-rotate-3 transform self-start text-[2.35rem] tracking-normal text-[#F3A134] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.7rem]">
                Liberation
              </span>
            </div>
          </Link>

          <div className="relative flex min-h-35 w-full max-w-105 -rotate-1 transform items-center justify-center sm:mt-10">
            <div className="absolute inset-0 h-full w-full">
              <Image src={brushTextBg} alt="" fill className="object-contain" />
            </div>
            <div className="relative z-10 mt-1 flex flex-col items-center px-6 pt-2 pb-4 text-white sm:px-8">
              <h3 className="font-edo mb-1 text-lg font-medium tracking-wider sm:text-xl">
                Choose A New Password
              </h3>
              <p className="text-center font-sans text-xs leading-relaxed font-medium text-white">
                Pick a new password for your account,
                <br />
                then sign in with it.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={FADE_IN_UP_ITEM} className="mt-10 flex w-full max-w-lg flex-col gap-6">
        {!token ? (
          <div className="space-y-4 text-center">
            <p className="text-foreground text-sm font-medium">
              This reset link is missing or incomplete.
            </p>
            <Link
              href="/forgot-password"
              className="text-primary text-sm font-bold hover:underline"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-semibold">New Password</label>
              <div className="border-muted/50 flex items-center gap-3 border-b pb-2">
                <Lock className="text-muted-foreground h-5 w-5" strokeWidth={1.5} />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Enter a new password"
                  className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
                />
              </div>
              {errors.password && (
                <span className="text-error text-xs">{errors.password.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-semibold">Confirm Password</label>
              <div className="border-muted/50 flex items-center gap-3 border-b pb-2">
                <Lock className="text-muted-foreground h-5 w-5" strokeWidth={1.5} />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Confirm your new password"
                  className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-error text-xs">{errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-primary hover:bg-primary/90 mt-2 w-full rounded-md py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Saving…' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link href="/login" className="text-primary text-sm font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-bg-primary flex min-h-screen items-center justify-center px-4">
          <p className="text-foreground text-sm">Loading…</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
