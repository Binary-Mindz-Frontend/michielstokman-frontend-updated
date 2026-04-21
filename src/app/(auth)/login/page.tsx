/* eslint-disable @next/next/no-img-element */

'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Button } from '@/components/ui/button';
import { useLoginUserMutation } from '@/redux/features/auth/auth.api';
import { setAuth } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { setUserProfile } from '@/services/auth/auth.service';
import { TLoginUser } from '@/types/userRole.types';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Zod Schema for Login
const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
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

  const onSubmit = async (data: LoginFormData) => {
    await catchAsyncMutation(
      loginUser(data).unwrap(),
      // onSuccess
      (res) => {
        const user: TLoginUser = {
          email: res?.data?.user?.email,
          is_admin: res?.data?.user?.is_admin || false,
        };
        const redirectPath = res?.data?.user?.is_admin ? '/dashboard/overview' : '/profile';
        dispatch(setAuth({ user }));
        setUserProfile(user, res?.data?.access_token);
        toast.success(res?.message || 'User Logged in Successfully');
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      },
    );
  };

  return (
    <div className="animate-in fade-in flex min-h-screen flex-col items-center justify-center px-4 py-12 duration-700">
      <h2 className="text-primary mb-16 font-serif text-2xl tracking-wide md:text-3xl">
        Transform to Liberation
      </h2>

      <div className="w-full max-w-120 space-y-8 text-center">
        <div className="space-y-1">
          <h1 className="text-dark-primary font-serif text-4xl font-semibold">Welcome Back</h1>
          <p className="text-secondary">Sign in to continue your path.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          <InputField
            label="Your email"
            name="email"
            register={register}
            placeholder="Enter your email"
            error={errors.email?.message}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            placeholder="Enter your password"
            required
            error={errors.password?.message}
          />

          <Button
            disabled={isLoading}
            type="submit"
            className={`btn-styles disabled:bg-primary/50 w-full ${isLoading ? 'cursor-not-allowed' : 'hover:bg-primary/90'}`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative flex items-center">
          <div className="border-primary/30 grow border-t"></div>
          <span className="text-primary mx-4 shrink text-xs tracking-widest uppercase">
            or continue with
          </span>
          <div className="border-primary/30 grow border-t"></div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            className="btn-styles border-primary/20 flex items-center justify-center gap-3 border bg-transparent hover:bg-[#F5F1EA]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
            <span className="text-dark-primary font-medium">Sign in with Google</span>
          </Button>
          <Button
            type="button"
            className="btn-styles border-primary/20 flex items-center justify-center gap-3 border bg-black hover:bg-gray-900"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="h-5 w-5 invert"
            />
            <span className="font-medium text-white">Sign in with Apple</span>
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-dark-primary text-sm">
            New here?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-dark-primary text-sm">Continue as guest — 1 item every other day</p>
        </div>
      </div>
    </div>
  );
}
