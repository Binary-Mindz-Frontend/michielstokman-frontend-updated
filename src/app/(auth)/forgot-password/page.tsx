'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useForgotPasswordMutation } from '@/redux/features/auth/auth.api';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';

import accountHeroImg from '@/assets/shared/account-hero-image.png';
import brushTextBg from '@/assets/shared/brush-text-bg.png';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotFormData) => {
    await catchAsyncMutation(forgotPassword(data).unwrap(), (res) => {
      setSent(true);
      toast.success(
        res?.message || 'If an account exists for this email, a reset link has been sent.',
      );
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
                Reset Password
              </h3>
              <p className="text-center font-sans text-xs leading-relaxed font-medium text-white">
                Enter the email for your account and we&apos;ll
                <br />
                send a secure link to choose a new password.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={FADE_IN_UP_ITEM} className="mt-10 flex w-full max-w-lg flex-col gap-6">
        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-foreground text-sm font-medium">
              If an account exists for that email, a reset link is on its way. Check your inbox (and
              spam folder).
            </p>
            <Link href="/login" className="text-primary text-sm font-bold hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-semibold">Your Email</label>
              <div className="border-muted/50 flex items-center gap-3 border-b pb-2">
                <Mail className="text-muted-foreground h-5 w-5" strokeWidth={1.5} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter Your Email"
                  className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
                />
              </div>
              {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-primary hover:bg-primary/90 mt-2 w-full rounded-md py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!sent ? (
          <div className="text-center">
            <Link href="/login" className="text-primary text-sm font-bold hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : null}
      </motion.div>
    </main>
  );
}
