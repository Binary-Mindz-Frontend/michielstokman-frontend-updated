'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useGuestLoginMutation, useLoginUserMutation } from '@/redux/features/auth/auth.api';
import { setAuth } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { setUserProfile } from '@/services/auth/auth.service';
import { TLoginUser } from '@/types/userRole.types';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/utils/animations.utils';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';
import GoogleSignInButton from './_components/GoogleLogin/GoogleLogin';

// Assets from src/assets/account
import accountHeroImg from '@/assets/shared/account-hero-image.png';
import buttonBrushBg from '@/assets/shared/brush-button-bg.png';
import brushTextBg from '@/assets/shared/brush-text-bg.png';
import guestIcon from '@/assets/shared/guest.png';

// Zod Schema for Login Validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignIn() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [guestLogin, { isLoading: isGuestLoading }] = useGuestLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle Form Submission
  const onSubmit = async (data: LoginFormData) => {
    await catchAsyncMutation(loginUser(data).unwrap(), async (res) => {
      const user: TLoginUser = {
        id: res?.data?.user?.id,
        user_id: res?.data?.user_id,
        email: res?.data?.user?.email,
        is_admin: res?.data?.user?.is_admin || false,
      };
      const defaultRedirect = res?.data?.user?.is_admin ? '/dashboard/overview' : '/';
      const redirectPath = redirectUrl ? decodeURIComponent(redirectUrl) : defaultRedirect;

      dispatch(setAuth({ user }));

      await setUserProfile(user, res?.data?.access_token);
      toast.success(res?.message || 'User Logged in Successfully');
      setTimeout(() => {
        if (!res?.data?.user?.is_profile_setup) {
          const stepperPath = redirectUrl
            ? `/register/stepper?redirect=${encodeURIComponent(redirectUrl)}`
            : '/register/stepper';
          router.push(stepperPath);
        } else {
          router.push(redirectPath);
        }
      }, 1000);
    });
  };

  // Handle Guest Login
  const handleGuestLogin = async () => {
    await catchAsyncMutation(guestLogin({}).unwrap(), async (res) => {
      const guestUser: TLoginUser = {
        id: res?.data?.guest_id,
        user_id: res?.data?.guest_id,
        email: '',
        is_admin: false,
        is_guest: true,
      };

      dispatch(setAuth({ user: guestUser }));
      await setUserProfile(guestUser, res?.data?.access_token);

      const redirectPath = redirectUrl ? decodeURIComponent(redirectUrl) : '/';

      toast.success(res?.message || 'Guest session created');
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
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
        {/* --- IMAGE COLUMN (Desktop Only) --- */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="order-1 hidden w-full justify-center md:order-2 md:mt-0 md:flex md:w-1/2"
        >
          {/* Desktop Hero Image */}
          <div className="relative aspect-square w-full max-w-112.5">
            <Image
              src={accountHeroImg}
              alt="Desktop Reflecting Woman"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* --- TEXT COLUMN --- */}
        <motion.div
          variants={FADE_IN_UP_ITEM}
          className="order-2 mt-4 flex w-full max-w-110 flex-col items-center text-center md:order-1 md:w-1/2 md:items-start md:text-left"
        >
          {/* Title Header (Desktop Only) */}
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

          {/* "Join The Journey" Brush Background Section (Shown on Mobile & Desktop) */}
          <div className="relative flex min-h-35 w-full max-w-105 -rotate-1 transform items-center justify-center sm:mt-10">
            <div className="absolute inset-0 h-full w-full">
              <Image src={brushTextBg} alt="Brush background" fill className="object-contain" />
            </div>

            <div className="relative z-10 mt-1 flex flex-col items-center px-6 pt-2 pb-4 text-white sm:px-8">
              <h3 className="font-edo mb-1 text-lg font-medium tracking-wider sm:text-xl">
                Join The Journey
              </h3>
              <p className="text-center font-sans text-xs leading-relaxed font-medium text-white">
                Create An Account To Save Your Reflections,
                <br />
                Get Personalized Content, And Share Your
                <br />
                Own Stories.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ================= FORM SECTION ================= */}
      <motion.div variants={FADE_IN_UP_ITEM} className="mt-10 flex w-full max-w-lg flex-col gap-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
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

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground flex items-center gap-1 text-sm font-semibold">
              Password <span className="text-primary">*</span>
            </label>
            <div className="border-muted/50 flex items-center gap-3 border-b pb-2">
              <Lock className="text-muted-foreground h-5 w-5" strokeWidth={1.5} />
              <input
                {...register('password')}
                type="password"
                placeholder="Enter Your Password"
                className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
              />
            </div>
            {errors.password && (
              <span className="text-error text-xs">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="bg-primary hover:bg-primary/90 mt-2 w-full rounded-md py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* ================= SOCIAL & FOOTER ================= */}
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3">
          {/* Google Sign In Wrapper */}
          <div className="group relative flex h-13 w-full items-center justify-center transition-opacity hover:opacity-90">
            <div className="absolute inset-0 h-full w-full">
              <Image src={buttonBrushBg} fill className="object-contain" alt="brush button bg" />
            </div>

            <div className="relative z-10 flex w-full justify-center">
              <GoogleSignInButton className="w-full border-none bg-transparent shadow-none hover:bg-transparent" />
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-foreground text-sm font-medium">
            New here?{' '}
            <Link
              href={
                redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'
              }
              className="text-primary font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Guest Button */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isGuestLoading}
          className="hover:bg-muted/15 mx-auto flex w-full max-w-sm items-center justify-center gap-3 rounded-md border border-[#B39B7F] bg-transparent py-3 shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image
            src={guestIcon}
            alt="Guest star icon"
            width={22}
            height={22}
            className="object-contain"
          />
          <span className="text-foreground text-sm font-semibold tracking-wide sm:text-[15px]">
            Continue As <span className="font-bold text-[#6D4CBB]">Guest</span> | Flow Every Other
            Day
          </span>
        </button>
      </motion.div>
    </main>
  );
}
